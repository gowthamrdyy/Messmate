// Tenglish lines: short enough for a lock-screen preview.
export const reminderLines=[
 [
  ['Good morning, sleepy legend ☀️','Snooze ki break ivvu. Breakfast start avvadaniki inka 30 minutes!'],
  ['Nidra tho breakup cheyyi…','Breakfast tho patch-up ki inka 30 minutes undi.'],
  ['Nee alarm kanna nene loyal 😉','Breakfast start avvadaniki 30 minutes. Miss avvaku!']
 ],
 [
  ['Nee crush reply ivvakapovachu…','Lunch matram time ki vasthundi. Inka 30 minutes!'],
  ['Assignments wait chesthai, aakali kaadu.','Lunch ki 30 minutes. Gang ni pilichi ready avvu!'],
  ['Nee day lo best date? Lunch date.','Mess lo kaluddam. Inka 30 minutes matrame!']
 ],
 [
  ['Chai ki ra, charcha cheddam ☕','Snack time ki 30 minutes. Group chat ni bayatiki teesuku ra!'],
  ['Relationship status: snacks tho committed.','Inka 30 minutes. Chinna break, pedda mood lift!'],
  ['Reels aapu, real snacks start avuthai.','Inko 30 minutes lo snacks. Gang ni ping cheyyi!']
 ],
 [
  ['Nee day ela unna… dinner undi ga 🥘','Dinner ki 30 minutes. Oka warm plate tho mood set!'],
  ['Seen zone lo pettaku, mess ki ra.','Dinner start avvadaniki inka 30 minutes!'],
  ['Crush ni wait cheyyachu. Dinner ni?','Inka 30 minutes. Food kosam ready avvu!']
 ]
];
export function reminderCopy(meal,day=0){const [title,body]=reminderLines[meal][Math.abs(day)%reminderLines[meal].length];return{title,body};}
