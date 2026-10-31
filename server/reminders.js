import {indiaNow,dayIndex,schedule,meals,highlights} from '../public/menu.js';
import {reminderCopy} from '../public/reminder-copy.js';
export function dueReminders(instant=new Date()){
 const now=indiaNow(instant),day=dayIndex(now),minute=now.getHours()*60+now.getMinutes();
 const date=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
 return schedule(day).flatMap(([start],meal)=>{const elapsed=minute-(start-30);if(elapsed<0||elapsed>10)return[];const copy=reminderCopy(meal,now.getDate());return[{date,meal,day,minutesUntil:start-minute,title:copy.title,body:copy.body.replace(/30/g,String(start-minute))+` ${highlights[day][meal]}.`,tag:`messmate-${date}-${meal}`,url:'/#today',mealName:meals[meal]}];});
}
