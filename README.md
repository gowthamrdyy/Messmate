# Messmate — Your campus table

A complete, mobile-first redesign of gowthamrdyy/Messmate. Warm ivory, forest green and lime; a custom generated thali photograph; 28 meals from the supplied SRMIST hostel menu. No database, account, analytics or backend required.

## Run

`npm run dev` serves http://localhost:4173 (requires Python 3). `npm run check` runs JavaScript syntax checks and menu/time tests (Node 20+). No dependency installation or build is required. Deploy `dist/` as a static website on Vercel, Netlify, Cloudflare Pages or Sites. Root-domain hosting is assumed.

## Features

- Today / weekly menu / favourites navigation, including a mobile bottom bar
- All seven days and four meals, searchable by dish, meal or day
- Vegetarian filter excluding listed meat and egg dishes
- Favourites and veg preference in browser-local storage
- Asia/Kolkata schedule status; weekday and weekend timings
- Second/fourth Wednesday biryani notice without inventing a meal slot
- Offline app shell after a successful first visit
- Reduced-motion support, labelled buttons, keyboard focus, native accessible dialog
- Original menu PDF available in the app

## Sources and updates

Menu: supplied `SM 01.07.2026.pdf`, whose printed heading reads **19.07.2026**. Its second page is blank. Alternatives are retained; spelling is lightly normalized for readability. Wednesday dinner lists paneer as the vegetarian alternative to chicken. Seasonal/limited-item notes remain visible. Edit `dist/menu.js` when menus change; bump the cache name in `dist/sw.js` after updates.

Timings: original repository `src/utils/mealSchedule.js`; these are scheduled hours, not a live confirmation from mess management. Confirm changed serving hours with the mess. Veg markers describe listed ingredients, not allergy certification (bakery items may contain egg).

This source is a dependency-free replacement frontend, not a patch to the previous React/Firebase application. The original GitHub repository and existing Vercel production site have not been modified.

## Image provenance

`dist/assets/thali.webp` uses the built-in image generation tool. Prompt: “Use case: photorealistic-natural. Asset: premium Indian campus dining app hero photograph. Create a beautiful editorial overhead photograph of a round brushed stainless steel Indian vegetarian thali, fluffy white rice at center, small steel bowls with yellow dal, orange paneer curry, vegetable poriyal, curd, two folded chapatis, crisp papad, tiny pickle, fresh green herbs. Entire round plate visible with generous margin, on a solid deep dark forest green tabletop (#153e32), subtle natural shadows and warm directional daylight, tactile appetizing realistic food, sophisticated restaurant magazine quality. Square composition, no text, no lettering, no logos, no hands. This is illustrative food imagery, not an exact meal.”

## Verification

Automated checks cover all 28 meals, India date rollover, weekend timings, meat/egg filtering and biryani dates. Browser checks cover meal switching, vegetarian filtering, saved favourites after reload, weekly search, and 390px/320px mobile layouts. Offline shell is implemented; real-device offline and installation behavior has not been tested.
