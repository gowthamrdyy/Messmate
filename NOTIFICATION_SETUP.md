# 🔔 Push Notification Setup Guide

This guide will help you set up VAPID keys and API endpoints to enable full push notification functionality for Messmate.

## 📋 Prerequisites

- Node.js installed on your system
- A web server or hosting platform (Vercel, Netlify, etc.)
- A backend API server (optional, for advanced features)

## 🔑 Step 1: Generate VAPID Keys

### Option A: Using Web Push Codelab (Recommended)
1. Visit: https://web-push-codelab.glitch.me/
2. Click "Generate Keys"
3. Copy the **Public Key** and **Private Key**

### Option B: Using Command Line
```bash
# Install web-push globally
npm install -g web-push

# Generate VAPID keys
web-push generate-vapid-keys
```

### Option C: Using Node.js Script
```bash
# Create a script to generate keys
node -e "
const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys();
console.log('Public Key:', vapidKeys.publicKey);
console.log('Private Key:', vapidKeys.privateKey);
"
```

## ⚙️ Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Edit `.env` and fill in your values:

```env
# VAPID Keys (Replace with your actual keys)
VITE_VAPID_PUBLIC_KEY=BLx7C...your_public_key_here
VITE_VAPID_PRIVATE_KEY=your_private_key_here

# VAPID Subject (Your email)
VITE_VAPID_SUBJECT=mailto:your-email@example.com

# VAPID Audience (Your website URL)
VITE_VAPID_AUDIENCE=https://your-domain.com

# API Base URL (Your backend server)
VITE_API_BASE_URL=https://your-api-domain.com

# API Token (If required)
VITE_API_TOKEN=your_api_token_here

# Development Settings
VITE_USE_MOCK_API=false
VITE_SKIP_VAPID=false
```

## 🚀 Step 3: Backend API Setup (Optional)

If you want full push notification functionality, you'll need a backend server. Here's a basic Express.js example:

### Install Dependencies
```bash
npm install express web-push cors dotenv
```

### Create Server (server.js)
```javascript
const express = require('express');
const webpush = require('web-push');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configure VAPID
webpush.setVapidDetails(
  process.env.VITE_VAPID_SUBJECT,
  process.env.VITE_VAPID_PUBLIC_KEY,
  process.env.VITE_VAPID_PRIVATE_KEY
);

// Store subscriptions (in production, use a database)
const subscriptions = new Map();

// Subscribe endpoint
app.post('/api/notifications/subscribe', (req, res) => {
  const { subscription, userAgent, timestamp } = req.body;
  
  const subscriptionId = Date.now().toString();
  subscriptions.set(subscriptionId, {
    id: subscriptionId,
    subscription,
    userAgent,
    timestamp,
    preferences: {
      mealReminders: true,
      menuUpdates: true,
      specialMeals: true
    }
  });

  console.log('New subscription:', subscriptionId);
  res.json({ success: true, subscriptionId });
});

// Unsubscribe endpoint
app.post('/api/notifications/unsubscribe', (req, res) => {
  const { subscription } = req.body;
  
  for (const [id, sub] of subscriptions.entries()) {
    if (sub.subscription.endpoint === subscription.endpoint) {
      subscriptions.delete(id);
      console.log('Subscription removed:', id);
      break;
    }
  }

  res.json({ success: true });
});

// Send notification endpoint
app.post('/api/notifications/send', async (req, res) => {
  const { subscriptionId, notification } = req.body;
  
  const subscription = subscriptions.get(subscriptionId);
  if (!subscription) {
    return res.status(404).json({ error: 'Subscription not found' });
  }

  try {
    await webpush.sendNotification(
      subscription.subscription,
      JSON.stringify(notification)
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Push error:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Update preferences endpoint
app.post('/api/notifications/preferences', (req, res) => {
  const { subscriptionId, preferences } = req.body;
  
  const subscription = subscriptions.get(subscriptionId);
  if (!subscription) {
    return res.status(404).json({ error: 'Subscription not found' });
  }

  subscription.preferences = { ...subscription.preferences, ...preferences };
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 🧪 Step 4: Testing

### Development Testing
1. Set `VITE_USE_MOCK_API=true` and `VITE_SKIP_VAPID=true` in `.env`
2. Run the development server:
```bash
npm run dev
```
3. Navigate to Settings → Push Notifications
4. Click "Subscribe" and grant permission
5. Click "Send Test Notification"

### Production Testing
1. Set `VITE_USE_MOCK_API=false` and `VITE_SKIP_VAPID=false` in `.env`
2. Deploy your frontend and backend
3. Test the full notification flow

## 🔧 Step 5: Deployment

### Frontend Deployment
1. Build the project:
```bash
npm run build
```
2. Deploy to your hosting platform (Vercel, Netlify, etc.)
3. Ensure HTTPS is enabled (required for push notifications)

### Backend Deployment
1. Deploy your API server (Railway, Render, Heroku, etc.)
2. Update `VITE_API_BASE_URL` in your frontend environment
3. Set environment variables on your backend server

## 📱 Step 6: Advanced Features

### Scheduled Notifications
To enable scheduled meal reminders, implement a cron job on your backend:

```javascript
const cron = require('node-cron');

// Send breakfast reminder at 7:30 AM
cron.schedule('30 7 * * *', async () => {
  for (const [id, subscription] of subscriptions.entries()) {
    if (subscription.preferences.mealReminders) {
      await webpush.sendNotification(
        subscription.subscription,
        JSON.stringify({
          title: 'Breakfast Time! 🍳',
          body: 'Your breakfast is ready and waiting!',
          icon: '/pwa-192x192.png',
          badge: '/Messmate.png',
          tag: 'meal-reminder',
          data: { meal: 'breakfast' }
        })
      );
    }
  }
});
```

### Menu Update Notifications
Send notifications when menu updates are available:

```javascript
app.post('/api/menu/update', async (req, res) => {
  const { mess, day, meal, items } = req.body;
  
  // Send to all subscribers
  for (const [id, subscription] of subscriptions.entries()) {
    if (subscription.preferences.menuUpdates) {
      await webpush.sendNotification(
        subscription.subscription,
        JSON.stringify({
          title: 'New Menu Items! 🎉',
          body: `Fresh ${meal} options available at ${mess}`,
          icon: '/pwa-192x192.png',
          badge: '/Messmate.png',
          tag: 'menu-update',
          data: { mess, day, meal, items }
        })
      );
    }
  }
  
  res.json({ success: true });
});
```

## 🚨 Troubleshooting

### Common Issues

1. **"Push notifications are not supported"**
   - Ensure you're using HTTPS
   - Check if Service Worker is registered
   - Verify browser compatibility

2. **"VAPID key not configured"**
   - Check your `.env` file
   - Ensure VAPID keys are properly set
   - Verify key format (public key starts with "B")

3. **"Failed to send subscription to server"**
   - Check API server is running
   - Verify API endpoints are correct
   - Check CORS configuration

4. **"Notification permission denied"**
   - User must manually grant permission
   - Check browser notification settings
   - Ensure site is trusted

### Debug Mode
Enable debug logging by setting:
```env
VITE_DEBUG_NOTIFICATIONS=true
```

## 📚 Additional Resources

- [Web Push Protocol](https://tools.ietf.org/html/rfc8030)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [VAPID Specification](https://tools.ietf.org/html/rfc8292)

## ✅ Checklist

- [ ] VAPID keys generated
- [ ] Environment variables configured
- [ ] Backend API deployed (optional)
- [ ] Frontend deployed with HTTPS
- [ ] Service worker registered
- [ ] Test notifications working
- [ ] Production notifications working

---

**Need help?** Check the console logs for detailed error messages and ensure all configuration is correct!
