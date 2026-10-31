export const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
export const meals = ['Breakfast','Lunch','Snacks','Dinner'];
// Transcribed from the supplied SRMIST Hostel Mess menu, printed date 19.07.2026.
// Slashes and 'or' retain the management's alternatives, not simultaneous promises.
const raw = [
[
'Bread|Butter|Jam|Ghee Pongal|Sambar|Coconut Chutney|Vadai|Tea / Coffee / Milk|Boiled Egg (1 piece)|Chappathi|Aloo Rajma Masala',
'Payasam|Poori|Potato Masala|Variety Rice|Steamed Rice|Sambar|Dal Lasooni|Tomato Rasam|Kadai Vegetable|Raw Banana Chops|Special Fryums|Buttermilk|Pickle',
'Pav Bajji|Tea / Coffee',
'Malabar Paratha / Veech Paratha|Mix Veg Kuruma|Millet Dosa|Idly Podi|Oil|Special Chutney|Steamed Rice|Chilli Sambar|Jeera Dal|Rasam|Aloo Capsicum|Pickle|Fryums|Veg Salad|Banana|Mutton Gravy'
],[
'Bread|Butter|Jam|Idly|Veg Kosthu|Special Chutney|Poha|Mint Chutney|Tea / Coffee / Milk|Masala Omelette (1 piece)',
'Millet Sweet|Ghee Chappathi|Aloo Mutter Paneer Masala|Bahara Pulao|Steamed Rice|Masala Sambar|Bagara Dal|Cabbage Toran|Pepper Rasam|Lauki Subji|Pickle|Buttermilk|Fryums',
'Boiled Peanut / Black Channa Sundal|Tea / Coffee',
'Chappathi|Navaratna Khurma|Fried Rice / Noodles / Pasta|Manchurian Gravy / Crispy Vegetable|Steamed Rice|Rasam|Dal Fry|Pickle|Fryums|Veg Salad|Milk|Special Fruits|Chicken Gravy'
],[
'Bread|Butter|Jam|Rava Pongal|Coconut Chutney|Poori|Mutter Masala|Tea / Coffee / Milk',
'Chappathi|Soya Kasa|Jeera Pulav|Steamed Rice|Mysore Dal Fry|Kadi Pakoda|Garlic Rasam|Aloo Palak or Aloo Paruval|Yam Double Beans Roast|Pickle|Fryums|Buttermilk',
'Veg Puff / Sweet Bun|Tea / Coffee',
'Chappathi|Steamed Rice|Dal Tadka|Chicken Masala / Chilli Chicken|Paneer Butter Masala|Rasam|Pickle|Fryums|Veg Salad|Milk|Banana|Chicken Gravy'
],[
'Bread|Butter|Jam|Chappathi|Dal Masala|Idiyappam Sevai (Lemon & Masala)|Coconut Chutney|Boiled Egg (1 piece)|Banana|Tea / Coffee / Milk',
'Luchi|Kashmiri Dum Aloo|Onion Pulao|Punjabi Dal Tadka|Bhindi Dopiaza|Steamed Rice|Kathamba Sambar|Garlic Rasam|Beetroot Poriyal|Pickle|Fryums|Buttermilk',
'Pani Poori or Mixture|Tea / Coffee',
'Ghee Pulao / Kaji Pulao (Basmati Rice)|Chappathi|Rajma Makhanwala|Steamed Rice|Chole Dal Fry|Rasam|Aloo Peanut Masala|Fryums|Pickle|Veg Salad|Milk|Ice Cream|Chicken Gravy'
],[
'Bread|Butter|Jam|Onion Uthappam|Idly Podi|Oil|Chilli Sambar|Kara Chutney|Ghee Chappathi|Aloo Choliya|Tea / Coffee / Milk|Boiled Egg (1 piece)',
'Special Dry Jamun / Bread Halwa|Veg Biryani|Mix Raita|Bisi Bele Bath|Curd Rice|Steamed Rice|Tomato Rasam|Aloo Gobi Adaraki|Moong Dal Tadka|Pickle|Potato Chips',
'Bonda / Keera Vada|Chutney|Tea / Coffee',
'Chole Bhatura|Steamed Rice|Tomato Dal|Samba Rava Upma|Coconut Chutney|Rasam|Mix Veg Poriyal|Pickle|Fryums|Banana|Veg Salad|Milk|Mutton Gravy'
],[
'Bread|Butter|Jam|Chappathi|Aloo Meal Maker Kasa|Semiya Kichadi|Coconut Chutney|Tea / Coffee / Milk|Boiled Egg (1 piece)',
'Poori|White Peas Masala|Veg Pulao|Steamed Rice|Dal Makhni|Aloo Tindili|Vatha Kuzhambu|Kootu|Jeera Rasam|Pickle|Special Fryums|Buttermilk',
'Cake / Brownie / Muffin|Tea / Coffee',
'Sweet|Punjabi Paratha|Gobi Capsicum|French Fry|Steamed Rice|Mysore Dal Fry|Veg Idly|Idly Podi|Oil|Chutney|Tiffin Sambar|Rasam|Pickle|Fryums|Veg Salad|Milk|Special Fruit|Fish Gravy'
],[
'Bread|Butter|Jam|Chole Poori|Veg Upma|Coconut Chutney|Tea / Coffee / Milk|Herbal Kanji',
'Chappathi|Chicken (Pepper / Kadai)|Paneer Butter Masala or Kadai Paneer|Dal Tadka|Ghee Pulao|Steamed Rice|Garlic Rasam|Poriyal|Pickle|Fryums|Buttermilk|Chicken Gravy',
'Corn / Bajji with Chutney or Juice|Tea / Coffee',
'Variety Stuffing Paratha|Curd|Steamed Rice|Hara Moong Dal Tadka|Drumstick Brinjal Sambar|Poriyal|Rasam|Pickle|Fryums|Veg Salad|Milk|Ice Cream|Chicken Gravy'
]];
export const menu = raw.map(day => day.map(meal => meal.split('|')));
export const highlights = [
 ['Ghee Pongal','Poori & Potato Masala','Pav Bajji','Malabar Paratha'],
 ['Idly & Poha','Bahara Pulao','Peanut Sundal','Fried Rice & Noodles'],
 ['Rava Pongal & Poori','Jeera Pulav','Veg Puff & Sweet Bun','Paneer Butter Masala'],
 ['Idiyappam Sevai','Kashmiri Dum Aloo','Pani Poori','Ghee Pulao'],
 ['Onion Uthappam','Veg Biryani','Bonda & Keera Vada','Chole Bhatura'],
 ['Semiya Kichadi','Poori & Veg Pulao','A little sweet break','Punjabi Paratha'],
 ['Chole Poori','Ghee Pulao & Paneer','Corn & Bajji','Stuffed Paratha']
];
export function indiaNow(date = new Date()) {
 const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',hourCycle:'h23'}).formatToParts(date).map(p=>[p.type,p.value]));
 return new Date(+parts.year,+parts.month-1,+parts.day,+parts.hour,+parts.minute);
}
export const dayIndex = date => (date.getDay()+6)%7;
export function schedule(day) { return day >=5 ? [[450,570],[720,840],[990,1050],[1170,1260]] : [[420,570],[690,810],[990,1050],[1170,1260]]; }
export const isNonVeg = item => /chicken|mutton|fish|egg|omelette/i.test(item);
export function nextBiryani(date) { const d=new Date(date); d.setHours(0,0,0,0); for(let i=0;i<40;i++){if(d.getDay()===3 && [2,4].includes(Math.ceil(d.getDate()/7)))return d;d.setDate(d.getDate()+1);} }
