# Messmate 🍽️

> **Smart, visual campus hostel dining.** Know what's cooking right now, plan your week, save your cravings, and never miss a good meal.

[![CI Checks](https://img.shields.io/badge/checks-13%20passed-brightgreen.svg)](#testing--verification)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-PWA%20%7C%20Web%20%7C%20Edge-orange.svg)](#tech-stack)

Messmate is a mobile-first Progressive Web App (PWA) designed for SRMIST hostel dining. It brings campus dining schedules to life with rich dish photography, dietary filtering, offline-ready caching, and opt-in background push notifications.

---

## ✨ Highlights & Features

- **⚡ Instant Glance (Zero-Scroll Experience)**
  - Open the app to immediately see the current or upcoming meal, serving hours in IST, featured dishes, and matching illustrative food photography without needing to scroll.
- **🖼️ Comprehensive Visual Food Mapping**
  - All 112+ unique dishes and components mapped to relevant food photography with smart single-word and compound matching.
- **🥗 Dietary & Craving Filters**
  - One-tap Veg-only toggle cleanly isolating vegetarian options.
  - Mood filtering: *Comfort Food*, *A Little Spice*, and *Sweet Tooth*.
  - Persistent local cravings (Favorites) to bookmark beloved dishes.
- **🔍 Full-Week Search & Calendar**
  - Search any dish, ingredient, or day of the week with instant highlighting.
  - Automatic calculation for special campus events (e.g., 2nd & 4th Wednesday Biryani schedule).
- **🔔 Privacy-First Meal Reminders**
  - Real browser background push notifications dispatched ~30 minutes before meal windows.
  - Witty campus-tailored Tenglish notification copy.
  - No phone numbers, no tracking cookies, no marketing spam.
- **📱 PWA & Offline Support**
  - Installable to Home Screen on iOS and Android.
  - Offline app shell with full client-side fallback.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vanilla ES Modules, Modern Semantic HTML5, CSS3 Custom Properties (Ultra-responsive 320px–4k) |
| **Backend & Edge** | Cloudflare Workers, Edge API Routes (`vinext`), Web Standards (`Request` / `Response`) |
| **Storage & Data** | Cloudflare D1 (Serverless SQLite), Drizzle ORM |
| **Push Notifications** | RFC 8291 / RFC 8292 Web Push, VAPID (ES256 ECDSA), Web Crypto API |
| **Tooling & Tests** | Vite, Native Node.js Test Runner (`node:test`, `node:assert`) |

---

## 📁 Project Structure

```
messmate/
├── app/                  # Edge API routes and server handlers
│   └── api/push/         # Push subscription & dispatch endpoints
├── db/                   # Database schemas and D1 client
├── drizzle/              # SQL migrations for subscription persistence
├── public/               # Static assets & client application
│   ├── assets/           # Icons, manifest, official reference PDF
│   │   └── food/         # High-resolution food photography assets
│   ├── app.js            # Main application UI & state logic
│   ├── food.js           # Smart food-to-photo matching engine
│   ├── icons.js          # SVG icon system
│   ├── index.html        # Clean semantic PWA shell
│   ├── menu.js           # 7-day schedule & campus calendar logic
│   ├── push-client.js    # Browser PushManager subscription handler
│   ├── reminder-copy.js  # Campus reminder copy catalog
│   ├── style.css         # Dark premium responsive theme
│   └── sw.js             # Service Worker for offline caching & push
├── server/               # Pure edge utilities
│   ├── reminders.js      # Timing & schedule evaluation
│   └── web-push.js       # RFC 8291 encryption & VAPID signing
└── tests/                # Automated verification suites
    ├── menu.test.js      # Schedule, timezone & dietary filtering tests
    ├── photos.test.js    # Asset mapping & keyword matching tests
    └── push.test.js      # Crypto, RFC compliance & reminder logic tests
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.x or newer
- **npm**: v10.x or newer

### Installation

```bash
# Clone the repository
git clone https://github.com/gowthamrdyy/Messmate.git
cd Messmate

# Install dependencies
npm install
```

### Local Development

Start the local development server:

```bash
npm run dev
```

Visit `http://localhost:5173` (or the URL printed in the terminal) in your browser.

---

## 🧪 Testing & Verification

The project includes unit tests for menu accuracy, scheduling, dietary filtering, asset mapping, and RFC 8291 push encryption:

```bash
# Run syntax validation and all test suites
npm run check

# Create production build
npm run build
```

---

## 🔐 Configuration & Environment Variables

For local development, push notification tests run in dry-run mode without external credentials. For live production deployment, configure the following secrets in your environment or Cloudflare Worker:

| Variable | Description |
|---|---|
| `VAPID_PUBLIC_KEY` | Public VAPID key (Base64URL uncompressed P-256 point) |
| `VAPID_PRIVATE_JWK` | Private VAPID JWK (JSON Web Key) |
| `SITE_ORIGIN` | Public origin of the deployed site (e.g. `https://messmate.yourdomain.com`) |

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve the meal schedules, enhance UI responsiveness, or add campus dining features:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
