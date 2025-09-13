import express from 'express';
import webpush from 'web-push';
import cors from 'cors';
import cron from 'node-cron';

const app = express();
app.use(cors());
app.use(express.json());

// VAPID Keys (Your actual keys)
const VAPID_PUBLIC_KEY = 'BGCwOJJHZWSx2lwHT44ncQUiZk7skhRU7wo-8WYL3W2OEKQC2i8FQ0-iU2nWM8GiZm3siDwb5o6UfxpbF0e_3eQ';
const VAPID_PRIVATE_KEY = 'dBUVN7nVZHPs5ryUZvRa1vn3rSdeGSWDhyD8OH2UeqE';

// Configure VAPID
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
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

  console.log('✅ New subscription:', subscriptionId);
  res.json({ success: true, subscriptionId });
});

// Unsubscribe endpoint
app.post('/api/notifications/unsubscribe', (req, res) => {
  const { subscription } = req.body;
  
  for (const [id, sub] of subscriptions.entries()) {
    if (sub.subscription.endpoint === subscription.endpoint) {
      subscriptions.delete(id);
      console.log('❌ Subscription removed:', id);
      break;
    }
  }

  res.json({ success: true });
});

// Send test notification endpoint
app.post('/api/notifications/test', async (req, res) => {
  try {
    const results = [];
    
    for (const [id, subscription] of subscriptions.entries()) {
      try {
        await webpush.sendNotification(
          subscription.subscription,
          JSON.stringify({
            title: 'Test Notification! 🧪',
            body: 'This is a test push notification from your server!',
            icon: '/pwa-192x192.png',
            badge: '/Messmate.png',
            tag: 'test-notification',
            data: { type: 'test', timestamp: Date.now() }
          })
        );
        results.push({ id, success: true });
      } catch (error) {
        console.error(`❌ Failed to send to ${id}:`, error.message);
        results.push({ id, success: false, error: error.message });
      }
    }
    
    res.json({ success: true, results });
  } catch (error) {
    console.error('❌ Test notification failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Scheduled meal notifications (cron jobs)
// Breakfast at 7:30 AM
cron.schedule('30 7 * * *', async () => {
  console.log('🍳 Sending breakfast notifications...');
  
  for (const [id, subscription] of subscriptions.entries()) {
    if (subscription.preferences.mealReminders) {
      try {
        await webpush.sendNotification(
          subscription.subscription,
          JSON.stringify({
            title: 'Breakfast Time! 🍳',
            body: 'Your breakfast is ready and waiting! Come get it!',
            icon: '/pwa-192x192.png',
            badge: '/Messmate.png',
            tag: 'meal-reminder',
            data: { meal: 'breakfast', time: '7:30 AM' }
          })
        );
        console.log(`✅ Breakfast notification sent to ${id}`);
      } catch (error) {
        console.error(`❌ Failed to send breakfast to ${id}:`, error.message);
      }
    }
  }
});

// Lunch at 12:30 PM
cron.schedule('30 12 * * *', async () => {
  console.log('🍽️ Sending lunch notifications...');
  
  for (const [id, subscription] of subscriptions.entries()) {
    if (subscription.preferences.mealReminders) {
      try {
        await webpush.sendNotification(
          subscription.subscription,
          JSON.stringify({
            title: 'Lunch Time! 🍽️',
            body: 'Hungry? Your lunch is ready! Time to eat!',
            icon: '/pwa-192x192.png',
            badge: '/Messmate.png',
            tag: 'meal-reminder',
            data: { meal: 'lunch', time: '12:30 PM' }
          })
        );
        console.log(`✅ Lunch notification sent to ${id}`);
      } catch (error) {
        console.error(`❌ Failed to send lunch to ${id}:`, error.message);
      }
    }
  }
});

// Dinner at 7:30 PM
cron.schedule('30 19 * * *', async () => {
  console.log('🍴 Sending dinner notifications...');
  
  for (const [id, subscription] of subscriptions.entries()) {
    if (subscription.preferences.mealReminders) {
      try {
        await webpush.sendNotification(
          subscription.subscription,
          JSON.stringify({
            title: 'Dinner Time! 🍴',
            body: 'Your dinner is ready! Time to enjoy!',
            icon: '/pwa-192x192.png',
            badge: '/Messmate.png',
            tag: 'meal-reminder',
            data: { meal: 'dinner', time: '7:30 PM' }
          })
        );
        console.log(`✅ Dinner notification sent to ${id}`);
      } catch (error) {
        console.error(`❌ Failed to send dinner to ${id}:`, error.message);
      }
    }
  }
});

// Manual meal notification endpoint
app.post('/api/notifications/meal', async (req, res) => {
  const { meal, time } = req.body;
  
  try {
    const results = [];
    
    for (const [id, subscription] of subscriptions.entries()) {
      if (subscription.preferences.mealReminders) {
        try {
          await webpush.sendNotification(
            subscription.subscription,
            JSON.stringify({
              title: `${meal} Time! 🍽️`,
              body: `Your ${meal.toLowerCase()} is ready at ${time}!`,
              icon: '/pwa-192x192.png',
              badge: '/Messmate.png',
              tag: 'meal-reminder',
              data: { meal, time }
            })
          );
          results.push({ id, success: true });
        } catch (error) {
          results.push({ id, success: false, error: error.message });
        }
      }
    }
    
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get subscription count
app.get('/api/notifications/subscriptions', (req, res) => {
  res.json({ 
    count: subscriptions.size,
    subscriptions: Array.from(subscriptions.keys())
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Push notification server running on port ${PORT}`);
  console.log(`📱 Subscriptions: ${subscriptions.size}`);
  console.log(`⏰ Scheduled notifications: Breakfast (7:30 AM), Lunch (12:30 PM), Dinner (7:30 PM)`);
});

export default app;
