# 🚀 Messmate Deployment Guide with Background Notifications

## ✅ Your VAPID Keys (Ready to Use)

**Public Key:**
```
BGCwOJJHZWSx2lwHT44ncQUiZk7skhRU7wo-8WYL3W2OEKQC2i8FQ0-iU2nWM8GiZm3siDwb5o6UfxpbF0e_3eQ
```

**Private Key:**
```
dBUVN7nVZHPs5ryUZvRa1vn3rSdeGSWDhyD8OH2UeqE
```

## 📋 Step-by-Step Deployment

### Step 1: Deploy Backend Server

**Option A: Railway (Recommended)**
1. Go to [Railway.app](https://railway.app)
2. Create new project
3. Upload `server.js` and `server-package.json`
4. Set environment variables:
   ```
   VAPID_PUBLIC_KEY=BGCwOJJHZWSx2lwHT44ncQUiZk7skhRU7wo-8WYL3W2OEKQC2i8FQ0-iU2nWM8GiZm3siDwb5o6UfxpbF0e_3eQ
   VAPID_PRIVATE_KEY=dBUVN7nVZHPs5ryUZvRa1vn3rSdeGSWDhyD8OH2UeqE
   VAPID_SUBJECT=mailto:your-email@example.com
   ```

**Option B: Render**
1. Go to [Render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo with server files
4. Set environment variables as above

### Step 2: Update Frontend Configuration

Create `.env` file in your frontend project root:

```env
# VAPID Keys (Your actual keys)
VITE_VAPID_PUBLIC_KEY=BGCwOJJHZWSx2lwHT44ncQUiZk7skhRU7wo-8WYL3W2OEKQC2i8FQ0-iU2nWM8GiZm3siDwb5o6UfxpbF0e_3eQ
VITE_VAPID_PRIVATE_KEY=dBUVN7nVZHPs5ryUZvRa1vn3rSdeGSWDhyD8OH2UeqE

# VAPID Subject (your email)
VITE_VAPID_SUBJECT=mailto:your-email@example.com

# VAPID Audience (your Vercel domain)
VITE_VAPID_AUDIENCE=https://your-app-name.vercel.app

# API Base URL (your backend server URL)
VITE_API_BASE_URL=https://your-backend-server.railway.app

# Production Settings
VITE_USE_MOCK_API=false
VITE_SKIP_VAPID=false

# Notification Settings
VITE_DEFAULT_MEAL_REMINDERS=true
VITE_DEFAULT_MENU_UPDATES=true
VITE_DEFAULT_SPECIAL_MEALS=true
VITE_DEFAULT_TEST_NOTIFICATIONS=false
```

### Step 3: Deploy Frontend to Vercel

1. Push your code to GitHub
2. Connect to Vercel
3. Deploy with environment variables
4. Your app will be available at: `https://your-app-name.vercel.app`

### Step 4: Test Background Notifications

1. **Install PWA on your phone:**
   - Open your Vercel URL on phone
   - Click "Add to Home Screen"
   - App will install like a native app

2. **Subscribe to notifications:**
   - Open the app
   - Go to Settings → Push Notifications
   - Click "Subscribe"
   - Grant permission when prompted

3. **Test background notifications:**
   - Lock your phone screen
   - Wait for meal times (7:30 AM, 12:30 PM, 7:30 PM)
   - You should receive notifications even with screen off!

## 🔧 Backend Server Features

Your backend server includes:

**✅ Scheduled Notifications:**
- Breakfast: 7:30 AM daily
- Lunch: 12:30 PM daily  
- Dinner: 7:30 PM daily

**✅ API Endpoints:**
- `POST /api/notifications/subscribe` - Subscribe to notifications
- `POST /api/notifications/unsubscribe` - Unsubscribe
- `POST /api/notifications/test` - Send test notification
- `POST /api/notifications/meal` - Send manual meal notification
- `GET /api/notifications/subscriptions` - Get subscription count

**✅ Automatic Features:**
- Cron jobs for scheduled notifications
- Error handling and logging
- Subscription management
- VAPID key configuration

## 📱 What Will Work After Deployment

**✅ Background Notifications:**
- Notifications when phone is locked
- Notifications when app is closed
- Scheduled meal reminders
- Real-time push notifications

**✅ PWA Features:**
- Install on home screen
- Offline functionality
- Native app experience
- Background sync

**✅ User Experience:**
- Permission management
- Notification preferences
- Test notifications
- Error handling

## 🧪 Testing Commands

**Test Backend Server:**
```bash
# Start server locally
cd server-directory
npm install
npm start

# Test endpoints
curl -X POST http://localhost:3001/api/notifications/test
curl -X GET http://localhost:3001/api/notifications/subscriptions
```

**Test Frontend:**
```bash
# Start development server
npm run dev

# Build for production
npm run build
```

## 🚨 Troubleshooting

**If notifications don't work:**

1. **Check VAPID keys:**
   - Ensure keys are correctly set in both frontend and backend
   - Verify key format (public key starts with "B")

2. **Check HTTPS:**
   - Vercel provides HTTPS automatically
   - Ensure backend also uses HTTPS

3. **Check permissions:**
   - User must grant notification permission
   - Check browser notification settings

4. **Check service worker:**
   - Open DevTools → Application → Service Workers
   - Should see "messmate-v3" active

5. **Check backend logs:**
   - Monitor Railway/Render logs for errors
   - Check subscription count endpoint

## 🎉 Expected Results

After deployment, you should have:

- ✅ **Background notifications** working on locked phone
- ✅ **Scheduled meal reminders** at 7:30 AM, 12:30 PM, 7:30 PM
- ✅ **PWA installation** on mobile devices
- ✅ **Real-time push notifications** from server
- ✅ **Offline functionality** with cached content

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Check backend server logs
3. Verify environment variables
4. Test with different browsers/devices

Your VAPID keys are ready to use! Just follow the deployment steps above. 🚀
