import {icon,mealIcons} from './icons.js';
import {meals} from './menu.js';
import {reminderCopy} from './reminder-copy.js';
const $=id=>document.getElementById(id);
let selected=[true,true,true,true],preview=0,subscription=null,registration=null;
function status(text){$('push-status').textContent=text;}
function bytes(base64){return Uint8Array.from(atob(base64.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));}
async function api(path,body){const res=await fetch('/api/push/'+path,{method:body===undefined?'GET':'POST',headers:body===undefined?{}:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});let data;try{data=await res.json();}catch{throw Error('The notification service is not available in this preview. Try the published site.');}if(!res.ok)throw Error(data.error||'Could not reach the notification service. Please try again.');return data;}
function choices(){const times=['Weekdays 6:30 · weekends 7:00 AM','Weekdays 11:00 · weekends 11:30 AM','4:00 PM every day','7:00 PM every day'];$('reminder-choices').innerHTML=meals.map((meal,i)=>`<button class="reminder-choice" data-reminder="${i}" aria-pressed="${selected[i]}"><span>${icon(mealIcons[i])}</span><span><strong>${meal}</strong><small>${times[i]}</small></span><span>${selected[i]?'✓':''}</span></button>`).join('');}
function showPreview(){const c=reminderCopy(preview%4,Math.floor(preview/4));$('preview-title').textContent=c.title;$('preview-body').textContent=c.body;}
function controls(){const on=!!subscription;$('enable-push').innerHTML=on?'Save reminder preferences '+icon('bell'):'Enable meal reminders '+icon('bell');$('disable-push').hidden=!on;$('test-push').disabled=!on;}
export async function initPush(){
 try{const pref=JSON.parse(localStorage.getItem('messmate:push-meals')||'null');if(Array.isArray(pref)&&pref.length===4)selected=pref.map(Boolean);}catch{}
 choices();showPreview();controls();
 $('reminder-choices').addEventListener('click',e=>{const b=e.target.closest('[data-reminder]');if(!b)return;selected[+b.dataset.reminder]=!selected[+b.dataset.reminder];choices();if(subscription)status('Preferences changed. Tap Save reminder preferences to apply them.');});
 $('next-line').onclick=()=>{preview++;showPreview();};
 $('enable-push').onclick=async()=>{if(!selected.some(Boolean)){status('Pick at least one meal, or turn off this device’s reminders.');return;}if(!('Notification'in window)||!('serviceWorker'in navigator)||!('PushManager'in window)){status('This browser cannot receive web push. On iPhone, add Messmate to your Home Screen and open it from there.');return;}
 const button=$('enable-push');button.disabled=true;
 try{
 // Request only after this explicit user gesture, never at page load.
 const permission=await Notification.requestPermission();if(permission!=='granted')throw Error(permission==='denied'?'Notifications are blocked. Allow them in browser/site settings, then try again.':'Permission not granted. Nothing was enabled.');
 const config=await api('config');registration=await navigator.serviceWorker.ready;
 subscription=await registration.pushManager.getSubscription();let created=false;
 if(!subscription){subscription=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:bytes(config.publicKey)});created=true;}
 try{await api('subscribe',{subscription:subscription.toJSON(),meals:selected});}catch(error){if(created){await subscription.unsubscribe();subscription=null;}throw error;}
 try{localStorage.setItem('messmate:push-meals',JSON.stringify(selected));}catch{}
 status('You’re on the list! These meals will send a reminder 30 minutes before serving, in India time. You can close the app.');controls();
 }catch(error){status(error.message);}finally{button.disabled=false;}
 };
 $('disable-push').onclick=async()=>{try{if(subscription){await api('unsubscribe',{endpoint:subscription.endpoint});await subscription.unsubscribe();subscription=null;}controls();status('Reminders off. This device’s subscription has been deleted.');}catch(error){status(error.message);}};
 $('test-push').onclick=async()=>{if(!subscription){status('Enable notifications first, then send a test.');return;}$('test-push').disabled=true;try{await api('test',{endpoint:subscription.endpoint});status('Test accepted by the push service. Check this device’s notifications.');}catch(error){status(error.message);}finally{controls();}};
 if('serviceWorker'in navigator&&'PushManager'in window){try{registration=await navigator.serviceWorker.ready;subscription=await registration.pushManager.getSubscription();controls();if(subscription)status('This device has notifications enabled. Save preferences to sync your meal choices.');}catch{}}
}
