// Flirty notification templates for different languages and food items

const TEMPLATES = {
    english: {
        default: [
            "Hey handsome, {food} is waiting for you. Don't break its heart! 💔",
            "Missing you... and so is the {food}. Come fast! 🏃‍♂️",
            "Your soulmate might not be here, but {food} definitely is! 😉",
            "Warning: {food} is looking extra hot today. Just like you! 🔥",
            "Relationship status: Committed to {food}. Join us? 💍",
            "Stop scrolling, start eating! {food} is calling your name. 📞",
            "If you love me, you'll come eat {food} right now. 🥺",
            "Forget your problems, {food} is the solution to everything. ✨",
            "You + {food} = A better love story than Twilight. 🧛‍♂️",
            "Don't play hard to get, {food} knows you want it. 😏"
        ],
        chicken: [
            "Winner Winner Chicken Dinner! 🍗 Your bird is waiting.",
            "Leg piece or breast piece? Just come fast either way! 😉",
            "The chicken is dying to meet you... literally. 🐔",
            "It's cluckin' good! Don't miss out on this Chicken. 🤤",
            "Protein incoming! Your muscles need this Chicken. 💪"
        ],
        biryani: [
            "Bae-ryani time! It's spicy, hot, and waiting for you. 🌶️",
            "Forget your ex, Biryani is the only true love. ❤️",
            "Life is short, eat the Biryani first! 🍛",
            "Keep calm and eat Biryani. It's waiting for you! 👑",
            "Paradise found! It's in this plate of Biryani. 🏝️"
        ],
        dosa: [
            "You + Dosa = Match made in heaven. 🥞",
            "Crispy, hot, and ready to mingle. The Dosa, I mean. 😉",
            "Don't let this Dosa get cold... or lonely. 🥺",
            "Roast it like a Dosa! Come get yours now. 🔥"
        ],
        poori: [
            "Feeling deflated? This Poori will puff you up! 🎈",
            "Hot Poori looking for a hot date. Is that you? 😏",
            "Don't burst my bubble, come eat this Poori! 🛁"
        ],
        paneer: [
            "Soft, creamy, and irresistible. Just like... this Paneer! 🧀",
            "Paneer samajh ke kha ja! It's waiting. 😋",
            "No Paneer, no gain. Come get your protein! 💪"
        ],
        chapathi: [
            "Rolling into your heart... it's Chapathi time! 🌯",
            "Soft Chapathis seeking hungry human. Apply within! 📄"
        ],
        egg: [
            "Egg-cited? You should be! Eggs are ready. 🥚",
            "Don't yolk around, come eat your eggs! 🍳",
            "Have an egg-cellent meal! It's waiting. ✨"
        ]
    },
    hinglish: {
        default: [
            "Oye hoye! {food} bula raha hai, ab toh aa jao! 😉",
            "Tumhara intezaar toh sirf {food} hi kar raha hai. ❤️",
            "Pyaar vyaar sab dhoka hai, {food} kha lo mauka hai! 🏃‍♂️",
            "Arre suno! {food} thanda ho raha hai, dil mat todo uska. 💔",
            "Aaj {food} mein kuch khaas baat hai, bilkul tumhari tarah! ✨",
            "Bhai, bandi baad mein, pehle {food}!  priority set karo. 🛑",
            "Dil garden garden ho jayega, bas {food} kha lo! 🌸",
            "Zindagi na milegi dobara, par {food} milega! Aaja! 🎬",
            "Sharam mat kar, {food} tera hi intezaar kar raha hai. 😉",
            "Khaane mein sharam kaisi? {food} ready hai boss! 🍽️"
        ],
        chicken: [
            "Murga ready hai boss! Bas aapki kami hai. 🍗",
            "Chicken calling! Pick up the phone... I mean spoon! 🥄",
            "Aaj toh Chicken party hai! Jaldi aao hero. 🦸‍♂️",
            "Leg piece pe tera haq hai! Aaja jaldi. 🍗",
            "Chicken shicken khaao, body banao! 💪"
        ],
        biryani: [
            "Biryani ke bina kya jeena? Jaldi aao! 🍛",
            "Tum, Main aur Biryani... perfect date? 😉",
            "Khushboo toh aa rahi hogi? Biryani bula rahi hai! 👃",
            "Asli pyaar = Biryani. Baaki sab moh maya hai. 🧘‍♂️",
            "Biryani is emotion, samjha kar pagle! ❤️"
        ],
        dosa: [
            "Dosa itna crispy, jitna tumhara attitude! 😎",
            "Sambhar ke bina Dosa adhoora, aur tumhare bina yeh meal. 🥺",
            "Garam garam Dosa, thanda mat hone dena! 🔥"
        ],
        poori: [
            "Poori phool gayi hai khushi mein, tumhare aane ki khabar sunke! 🎈",
            "Aloo-Poori ka match, bilkul Rab Ne Bana Di Jodi! 💑"
        ],
        paneer: [
            "Paneer toh bahana hai, asli maqsad tumhe bulana hai! 😉",
            "Soft Paneer, solid taste. Miss mat karna! 🧀"
        ],
        chapathi: [
            "Gol gol Chapathi, gol gol duniya. Aaja mere yaar! 🌍",
            "Ghar ki yaad aa rahi hai? Chapathi kha lo! 🏠"
        ],
        egg: [
            "Ande ka funda! Aao khao, mast raho. 🥚",
            "Sunday ho ya Monday, roz khao Ande! 📅"
        ]
    },
    tenglish: {
        default: [
            "Arey hero, {food} ready ga undi! Nuvvu raakapothe adi feel avthundi. 🥺",
            "Nee kosam {food} waiting ikkada. Vachey mama! 🏃‍♂️",
            "Life lo love lekapoyina parledu, plate lo {food} unte chalu! ❤️",
            "Warning: Ee {food} chala hot guru, neelaage! 🔥",
            "Miss avvaku, {food} feel avthundi. Fast ga vachey! ⚡",
            "Asalu kick eh veru abba, {food} thinte! 🔥",
            "Nee crush kante {food} eh better, trust me! 😉",
            "Pahilwaan, {food} ready! Vachi kummey! 💪",
            "Life lo settlement kavali ante {food} thinali! 🍛",
            "Thinnama, padukunnama... anthe life! Vachey {food} thinu. 😴"
        ],
        chicken: [
            "Kodi kura ready! Nuvvu raagane kummeddam. 🍗",
            "Chicken leg piece waiting for you mama! 😉",
            "Sunday aina Monday aina, Chicken unte pandage! 🎉",
            "Kodi koora chitti gaare... kaadu, just Chicken! Vachey! 😋",
            "Non-veg lenide mudda digadhu ga? Chicken ready! 🍖"
        ],
        biryani: [
            "Biryani is emotion ra chari! Vachey twaraga. 🍛",
            "Nee love failure aiyundochu, kani Biryani eppudu fail avvadhu. ❤️",
            "Gama gama Biryani vasana... Aagalekapothunnam! 🤤",
            "Biryani thini, happy ga undu. Anthe claps! 👏",
            "Pulao kaadu ra, idi Biryani! Respect ivvali. 🫡"
        ],
        dosa: [
            "Dosa ready, Chutney ready... Nuvvu okkadive balance! 🥞",
            "Masala Dosa kanna spicy evaru? Nuvve! 😉",
            "Roast ga Dosa vesanu, challaripothundi chudu! 🔥"
        ],
        poori: [
            "Poori lu pongayi, nee potta nindali! Vachey! 🎈",
            "Kurma lo Poori munchi thinte... swargame! ☁️"
        ],
        paneer: [
            "Paneer butter masala... peru vinte ne noru ooruthundi kada? 🤤",
            "Soft ga Paneer, smooth ga life! Vachey! 🧀"
        ],
        chapathi: [
            "Chapathi thinu, healthy ga undu. Gym ki vellali ga? 💪",
            "Amma chesina Chapathi laane untundi (almost). Try chey! 🏠"
        ],
        egg: [
            "Guddu... adiripoddi! Vachey mama. 🥚",
            "Boiled egg ah, Omelette ah? Edaina ready! 🍳"
        ]
    },
    tanglish: {
        default: [
            "Machan, {food} waiting! Nee varala na athu kavalai padum. 🥺",
            "Love pannurom illayo, {food} nalla saapdurom! ❤️",
            "Un aalu unna vittu pogalam, aana {food} pogathu. Vaa da! 🏃‍♂️",
            "Thalaiva, {food} ready! Mass kaatrom. 😎",
            "Vera level taste, miss pannidatha! {food} calling. 📞",
            "Vera level feeling venuma? {food} saapdu! ✨",
            "Un crush unna paaka maatan, aana {food} paakum. 😉",
            "Sothu mukkiyam bigil-u! {food} waiting. 🥘",
            "Thalaivaa, mass ah oru {food} virundhu waiting! 😎",
            "Vayiru nirambinal, manasu nirambum. Vaa saapda! 😌"
        ],
        chicken: [
            "Chicken irukku, nee irukka... vera enna venum? 🍗",
            "Koli kari kuzhambu waiting thalaiva! 🥘",
            "Innaiku oru pudi, Chicken varuval! 🔥",
            "Chicken 65 ah? Illa 65 Chicken ah? Edhuva irundhalum vaa! 🐔",
            "Semma taste, vera level chicken! Miss pannidatha. 🤤"
        ],
        biryani: [
            "Biryani love > True love. Unmai dhane? 😉",
            "Semma vasanai... Biryani waiting machi! 🍛",
            "Oru plate Biryani, oru full happiness. ❤️",
            "Biryani kedaikum bodhu, vera enna yosanai? Vaa! 🏃‍♂️",
            "Thalapakatti ah? Ambur ah? Edhuva irundhalum Biryani dhaan mass! 👑"
        ],
        dosa: [
            "Dosa kal la iruku, nee enga irukka? 🥞",
            "Gethu kaatatha, Dosa saapdu! 😎",
            "Murugal Dosa, unakkaga waiting! 🔥"
        ],
        poori: [
            "Poori-um Kilangu-um... Semma combination! Vaa machi. 🥔",
            "Ubbuna Poori, unakkaga dhaan! 🎈"
        ],
        paneer: [
            "Paneer soft ah irukku, nee yen hard ah irukka? Vaa saapda! 🧀",
            "Veg la non-veg feeling? Adhu Paneer dhaan! 😉"
        ],
        chapathi: [
            "Chapathi saapdu, health ah paathuko! 💪",
            "Soft Chapathi, spicy kurma... Vera level! 🌶️"
        ],
        egg: [
            "Mutta... Semma gethu! Vaa saapda. 🥚",
            "Omelette podalama? Illa Kalakki ah? Nee vaa modhalla! 🍳"
        ]
    },
    malnglish: {
        default: [
            "Aliya, {food} waiting aanu! Vegam vaa! 🏃‍♂️",
            "Nee illathe {food} oru rasam illa. 😉",
            "Mone, {food} poliyaanu! Miss aakkalle. 🔥",
            "Love venda, {food} mathi! ❤️",
            "Adipoli {food} aanu innathe special! ✨",
            "Scene contra aakkalle, vegam vannu {food} kazhikku! 🛑",
            "Poliyalle? {food} aanu mone main! 🔥",
            "Nee vaa, namukku {food} adichu polikkam! 🎉",
            "Chunk bro, {food} miss aakkalle! ❤️",
            "Vayaru niraye {food}, manassu niraye santhosham! 😌"
        ],
        chicken: [
            "Chicken curry ready! Nammal polikkum. 🍗",
            "Kozhi waiting aanu aliya! 🐔",
            "Chicken porichathu... uff! Vaa vegam. 🤤",
            "Nalla naadan Chicken curry! Miss aakkalle. 🥘"
        ],
        biryani: [
            "Biryani ishtam! Vegam vaayo. 🍛",
            "Dum Biryani aanu mone! Miss aakkalle. 🤤",
            "Biryani kandittu kothiyavunno? Vaa kazhikku! 😋",
            "Malabar Biryani aano? Alla, pakshe taste adipoli! 😉"
        ],
        dosa: [
            "Dosa chuttathu ready! Chammanthi kooti kazhikku. 🥞",
            "Nalla crispy Dosa! Vaa mone. 😎"
        ],
        poori: [
            "Poori-um Bhaji-um... Adipoli combo! 🥔",
            "Poori waiting aanu, nee evideya? 🎈"
        ],
        paneer: [
            "Paneer aanu tharam! Vaa kazhikku. 🧀",
            "Soft Paneer... vayilittaal aliyum! 🤤"
        ],
        chapathi: [
            "Chapathi-um Curry-um... Simple but powerful! 💪",
            "Nalla soft Chapathi! Vaa aliya. 🏠"
        ],
        egg: [
            "Mutta curry ready! Vaa kazhikku. 🥚",
            "Bullseye aano? Omelette aano? Parayoo! 🍳"
        ]
    }
};

export const getFlirtyMessage = (language, mealName, foodItems = []) => {
    const lang = language?.toLowerCase() || 'english';
    const templates = TEMPLATES[lang] || TEMPLATES.english;

    // Convert food items to string for searching
    const foodString = foodItems.join(' ').toLowerCase();

    // Find specific food templates
    let selectedTemplates = templates.default;
    let foodName = mealName; // Default to meal name (Breakfast/Lunch/Dinner)

    if (foodString.includes('chicken')) {
        selectedTemplates = templates.chicken || templates.default;
        foodName = 'Chicken';
    } else if (foodString.includes('biryani') || foodString.includes('pulao')) {
        selectedTemplates = templates.biryani || templates.default;
        foodName = 'Biryani';
    } else if (foodString.includes('dosa')) {
        selectedTemplates = templates.dosa || templates.default;
        foodName = 'Dosa';
    } else if (foodString.includes('poori')) {
        selectedTemplates = templates.poori || templates.default;
        foodName = 'Poori';
    } else {
        // Try to pick a main item from the menu
        const mainItem = foodItems.find(item =>
            !item.toLowerCase().includes('rice') &&
            !item.toLowerCase().includes('pickle') &&
            !item.toLowerCase().includes('fryums') &&
            !item.toLowerCase().includes('tea')
        );
        if (mainItem) {
            foodName = mainItem.replace(/\*\*/g, '');
        }
    }

    // Pick a random template
    const template = selectedTemplates[Math.floor(Math.random() * selectedTemplates.length)];

    return template.replace('{food}', foodName);
};

export const NOTIFICATION_LANGUAGES = [
    { value: 'english', label: 'English' },
    { value: 'hinglish', label: 'Hinglish (Hindi + English)' },
    { value: 'tenglish', label: 'Tenglish (Telugu + English)' },
    { value: 'tanglish', label: 'Tanglish (Tamil + English)' },
    { value: 'malnglish', label: 'Malnglish (Malayalam + English)' }
];
