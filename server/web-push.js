// RFC 8291 aes128gcm + RFC 8292 VAPID, using standard Web Crypto.
const encoder=new TextEncoder();
export const encode=value=>encoder.encode(value);
export const decode64=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
export function base64url(value){return btoa(String.fromCharCode(...new Uint8Array(value))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
const join=(...parts)=>{const out=new Uint8Array(parts.reduce((n,p)=>n+p.byteLength,0));let i=0;for(const p of parts){out.set(new Uint8Array(p),i);i+=p.byteLength;}return out;};
async function hkdf(ikm,salt,info,length){const key=await crypto.subtle.importKey('raw',ikm,'HKDF',false,['deriveBits']);return new Uint8Array(await crypto.subtle.deriveBits({name:'HKDF',hash:'SHA-256',salt,info},key,length*8));}
export function validateEndpoint(endpoint){try{const u=new URL(endpoint);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&['fcm.googleapis.com','updates.push.services.mozilla.com','web.push.apple.com'].some(h=>u.hostname===h);}catch{return false;}}
export async function encryptPayload(subscription,payload,options={}){
 const clientPublic=decode64(subscription.p256dh),auth=decode64(subscription.auth);if(clientPublic.length!==65||auth.length!==16)throw Error('Invalid subscription keys');
 const pair=options.pair||await crypto.subtle.generateKey({name:'ECDH',namedCurve:'P-256'},true,['deriveBits']);
 const serverPublic=new Uint8Array(await crypto.subtle.exportKey('raw',pair.publicKey));
 const clientKey=await crypto.subtle.importKey('raw',clientPublic,{name:'ECDH',namedCurve:'P-256'},false,[]);
 const shared=await crypto.subtle.deriveBits({name:'ECDH',public:clientKey},pair.privateKey,256);
 const ikm=await hkdf(shared,auth,join(encode('WebPush: info\0'),clientPublic,serverPublic),32);
 const salt=options.salt||crypto.getRandomValues(new Uint8Array(16));
 const cek=await hkdf(ikm,salt,encode('Content-Encoding: aes128gcm\0'),16);
 const nonce=await hkdf(ikm,salt,encode('Content-Encoding: nonce\0'),12);
 const content=encode(typeof payload==='string'?payload:JSON.stringify(payload));if(content.byteLength>3993)throw Error('Push payload too large');
 const key=await crypto.subtle.importKey('raw',cek,'AES-GCM',false,['encrypt']);
 const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv:nonce,tagLength:128},key,join(content,new Uint8Array([2])));
 const header=new Uint8Array(5);new DataView(header.buffer).setUint32(0,4096);header[4]=65;
 return join(salt,header,serverPublic,ciphertext);
}
export async function vapidAuthorization(endpoint,privateJwk,publicKey,subject,now=Date.now()){
 const header=base64url(encode(JSON.stringify({typ:'JWT',alg:'ES256'})));
 const body=base64url(encode(JSON.stringify({aud:new URL(endpoint).origin,exp:Math.floor(now/1000)+3600,sub:subject})));
 const input=header+'.'+body,key=await crypto.subtle.importKey('jwk',privateJwk,{name:'ECDSA',namedCurve:'P-256'},false,['sign']);
 const signature=await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},key,encode(input));
 return `vapid t=${input}.${base64url(signature)}, k=${publicKey}`;
}
export async function sendPush(subscription,payload,env){
 if(!validateEndpoint(subscription.endpoint))throw Error('Unsupported push provider');
 const body=await encryptPayload(subscription,payload);
 const authorization=await vapidAuthorization(subscription.endpoint,JSON.parse(env.VAPID_PRIVATE_JWK),env.VAPID_PUBLIC_KEY,env.SITE_ORIGIN);
 const response=await fetch(subscription.endpoint,{method:'POST',headers:{Authorization:authorization,'Content-Encoding':'aes128gcm','Content-Type':'application/octet-stream',TTL:'900',Urgency:'normal'},body,redirect:'error',signal:AbortSignal.timeout(10000)});
 return {ok:response.ok,status:response.status,expired:[404,410].includes(response.status)};
}
