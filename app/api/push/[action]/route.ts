import { env } from 'cloudflare:workers';
import { sendPush,validateEndpoint,decode64 } from '../../../../server/web-push.js';
import { dueReminders } from '../../../../server/reminders.js';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const db=()=>{if(!env.DB)throw Error('Notification database unavailable');return env.DB;};
const hash=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),x=>x.toString(16).padStart(2,'0')).join('');
function configured(){const e=env as any;return !!(e.VAPID_PRIVATE_JWK&&e.VAPID_PUBLIC_KEY&&e.SITE_ORIGIN);}
export async function GET(request:Request,{params}:{params:Promise<{action:string}>}){const{action}=await params;if(action==='config')return configured()?json({publicKey:(env as any).VAPID_PUBLIC_KEY}):json({error:'Notifications are being set up. Please try again shortly.'},503);if(action==='health')return json({configured:configured(),database:!!env.DB});return json({error:'Not found'},404);}
export async function POST(request:Request,{params}:{params:Promise<{action:string}>}){
 const{action}=await params;
 try{
 if(!configured())return json({error:'Notifications are not configured yet.'},503);
 // Dispatch is service-only behind the owner-private Sites gateway. Browser visitors
 // cannot invoke it; the cloud task uses the gateway's service-access bearer.
 if(action==='dispatch'){
 if(request.headers.get('oai-authenticated-user-id')||request.headers.get('origin'))return json({error:'Service access only'},403);
 let input:any={};try{input=await request.json();}catch{}
 const due=dueReminders();const subscriptions=await db().prepare('SELECT * FROM push_subscriptions ORDER BY id LIMIT 1000').all<any>();
 if(input.dryRun===true)return json({ok:true,dryRun:true,subscriptions:subscriptions.results.length,due:due.map(x=>({meal:x.mealName,minutesUntil:x.minutesUntil,date:x.date})),databaseChecked:true});
 let accepted=0,failed=0,expired=0,skipped=0;
 for(const reminder of due){for(const sub of subscriptions.results){if(!JSON.parse(sub.meals)[reminder.meal])continue;const id=sub.id+':'+reminder.date+':'+reminder.meal,t=Date.now();
 const claim=await db().prepare("INSERT INTO push_deliveries (id,subscription_id,status,created_at,updated_at) VALUES (?,?,'sending',?,?) ON CONFLICT(id) DO UPDATE SET status='sending',updated_at=excluded.updated_at WHERE push_deliveries.status='failed' OR (push_deliveries.status='sending' AND push_deliveries.updated_at < ?)").bind(id,sub.id,t,t,t-120000).run();
 if(!claim.meta.changes){skipped++;continue;}
 try{const result=await sendPush(sub,reminder,env);if(result.expired){await db().prepare('DELETE FROM push_subscriptions WHERE id=?').bind(sub.id).run();expired++;}else if(result.ok)accepted++;else failed++;
 await db().prepare('UPDATE push_deliveries SET status=?,updated_at=? WHERE id=?').bind(result.ok?'accepted':result.expired?'expired':'failed',Date.now(),id).run();
 }catch{failed++;await db().prepare("UPDATE push_deliveries SET status='failed',updated_at=? WHERE id=?").bind(Date.now(),id).run();}
 }}
 await db().prepare('DELETE FROM push_deliveries WHERE created_at < ?').bind(Date.now()-30*86400000).run();
 return json({ok:failed===0,accepted,failed,expired,skipped,due:due.map(x=>x.mealName)});
 }
 const owner=request.headers.get('oai-authenticated-user-id');if(!owner)return json({error:'Sign in to enable this device’s notifications.'},401);
 const origin=request.headers.get('origin');if(origin!==new URL(request.url).origin)return json({error:'Invalid request origin'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'JSON required'},415);
 const raw=await request.text();if(raw.length>8192)return json({error:'Request too large'},413);let body:any;try{body=JSON.parse(raw);}catch{return json({error:'Invalid request'},400);}
 if(action==='subscribe'){
 const sub=body.subscription,selected=body.meals;if(!sub||!validateEndpoint(sub.endpoint)||!sub.keys||!Array.isArray(selected)||selected.length!==4||selected.some((v:any)=>typeof v!=='boolean')||!selected.some(Boolean))return json({error:'Invalid subscription or meal preferences'},400);
 try{if(decode64(sub.keys.p256dh).length!==65||decode64(sub.keys.auth).length!==16)throw Error();}catch{return json({error:'Invalid subscription keys'},400);}
 const id=await hash(sub.endpoint),existing=await db().prepare('SELECT user_id FROM push_subscriptions WHERE id=?').bind(id).first<any>();if(existing&&existing.user_id!==owner)return json({error:'This device belongs to another signed-in account. Disable notifications there first.'},409);
 const count=await db().prepare('SELECT COUNT(*) AS count FROM push_subscriptions WHERE user_id=?').bind(owner).first<any>();if(!existing&&count.count>=10)return json({error:'Device limit reached. Remove an old device first.'},429);
 await db().prepare('INSERT INTO push_subscriptions (id,user_id,endpoint,p256dh,auth,meals,updated_at,test_at) VALUES (?,?,?,?,?,?,?,0) ON CONFLICT(id) DO UPDATE SET p256dh=excluded.p256dh,auth=excluded.auth,meals=excluded.meals,updated_at=excluded.updated_at').bind(id,owner,sub.endpoint,sub.keys.p256dh,sub.keys.auth,JSON.stringify(selected),Date.now()).run();return json({ok:true});
 }
 if(typeof body.endpoint!=='string')return json({error:'Missing device subscription'},400);const id=await hash(body.endpoint);
 if(action==='unsubscribe'){await db().prepare('DELETE FROM push_subscriptions WHERE id=? AND user_id=?').bind(id,owner).run();await db().prepare('DELETE FROM push_deliveries WHERE subscription_id=? AND NOT EXISTS (SELECT 1 FROM push_subscriptions WHERE id=?)').bind(id,id).run();return json({ok:true});}
 if(action==='test'){
 const sub=await db().prepare('SELECT * FROM push_subscriptions WHERE id=? AND user_id=?').bind(id,owner).first<any>();if(!sub)return json({error:'Enable reminders on this device first.'},404);
 const now=Date.now(),claim=await db().prepare('UPDATE push_subscriptions SET test_at=? WHERE id=? AND test_at < ?').bind(now,id,now-30000).run();if(!claim.meta.changes)return json({error:'Wait 30 seconds before sending another test.'},429);
 const result=await sendPush(sub,{title:'It’s a match. You + good food.',body:'Test reminder from Messmate. Your next plate has a wingman.',tag:'messmate-test',url:'/#reminders'},env);
 if(result.expired){await db().prepare('DELETE FROM push_subscriptions WHERE id=?').bind(id).run();return json({error:'This subscription expired. Turn reminders off, then enable again.'},410);}return result.ok?json({ok:true,accepted:true}):json({error:'Push service did not accept the test. Please try again.'},502);
 }
 return json({error:'Not found'},404);
 }catch(error){console.error('Push request failed',error instanceof Error?error.name:'Unknown');return json({error:'Notification service could not complete this request. Please try again.'},500);}
}
