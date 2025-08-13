/**
 * Firebase Cloud Functions for Messmate Push Notifications
 * Handles sending push notifications to users
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

/**
 * Store user FCM token when they subscribe
 */
exports.subscribeToNotifications = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { token, userAgent, timestamp } = req.body;

    if (!token) {
      res.status(400).json({ error: 'FCM token is required' });
      return;
    }

    // Store token in Firestore
    await db.collection('fcm_tokens').doc(token).set({
      token,
      userAgent,
      timestamp,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true
    });

    console.log(`✅ FCM token stored: ${token}`);
    res.status(200).json({ success: true, message: 'Token stored successfully' });
  } catch (error) {
    console.error('❌ Error storing FCM token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Remove user FCM token when they unsubscribe
 */
exports.unsubscribeFromNotifications = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ error: 'FCM token is required' });
      return;
    }

    // Remove token from Firestore
    await db.collection('fcm_tokens').doc(token).delete();

    console.log(`✅ FCM token removed: ${token}`);
    res.status(200).json({ success: true, message: 'Token removed successfully' });
  } catch (error) {
    console.error('❌ Error removing FCM token:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Update user notification preferences
 */
exports.updateNotificationPreferences = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { token, preferences } = req.body;

    if (!token) {
      res.status(400).json({ error: 'FCM token is required' });
      return;
    }

    // Update preferences in Firestore
    await db.collection('fcm_tokens').doc(token).update({
      preferences,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Preferences updated for token: ${token}`);
    res.status(200).json({ success: true, message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('❌ Error updating preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Send meal reminder notification
 */
exports.sendMealReminder = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { mealName, mealTime, menuItems, tokens } = req.body;

    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      res.status(400).json({ error: 'FCM tokens are required' });
      return;
    }

    // Create notification message
    const message = {
      notification: {
        title: `🍽️ ${mealName} Time!`,
        body: `Your ${mealName.toLowerCase()} is ready. Check out today's menu!`,
        icon: '/pwa-192x192.png'
      },
      data: {
        type: 'meal_reminder',
        mealName: mealName,
        mealTime: mealTime,
        menuItems: JSON.stringify(menuItems || []),
        click_action: '/'
      },
      android: {
        notification: {
          icon: '/pwa-192x192.png',
          color: '#4F46E5',
          sound: 'default',
          priority: 'high'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      },
      webpush: {
        notification: {
          icon: '/pwa-192x192.png',
          badge: '/Messmate.png',
          vibrate: [200, 100, 200],
          requireInteraction: false,
          actions: [
            {
              action: 'view',
              title: 'View Menu',
              icon: '/Messmate.png'
            },
            {
              action: 'dismiss',
              title: 'Dismiss',
              icon: '/Messmate.png'
            }
          ]
        }
      }
    };

    // Send to multiple tokens
    const response = await messaging.sendMulticast({
      tokens,
      ...message
    });

    console.log(`✅ Meal reminder sent to ${response.successCount}/${tokens.length} tokens`);
    
    res.status(200).json({
      success: true,
      message: 'Meal reminder sent successfully',
      successCount: response.successCount,
      failureCount: response.failureCount
    });
  } catch (error) {
    console.error('❌ Error sending meal reminder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Send menu update notification
 */
exports.sendMenuUpdate = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { messName, dayName, changes, tokens } = req.body;

    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      res.status(400).json({ error: 'FCM tokens are required' });
      return;
    }

    // Create notification message
    const message = {
      notification: {
        title: `📋 Menu Updated - ${messName}`,
        body: `The ${dayName} menu has been updated. Check out the changes!`,
        icon: '/pwa-192x192.png'
      },
      data: {
        type: 'menu_update',
        messName: messName,
        dayName: dayName,
        changes: JSON.stringify(changes || []),
        click_action: '/'
      },
      android: {
        notification: {
          icon: '/pwa-192x192.png',
          color: '#10B981',
          sound: 'default',
          priority: 'normal'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      },
      webpush: {
        notification: {
          icon: '/pwa-192x192.png',
          badge: '/Messmate.png',
          vibrate: [200, 100, 200],
          requireInteraction: false,
          actions: [
            {
              action: 'view',
              title: 'View Changes',
              icon: '/Messmate.png'
            },
            {
              action: 'dismiss',
              title: 'Dismiss',
              icon: '/Messmate.png'
            }
          ]
        }
      }
    };

    // Send to multiple tokens
    const response = await messaging.sendMulticast({
      tokens,
      ...message
    });

    console.log(`✅ Menu update sent to ${response.successCount}/${tokens.length} tokens`);
    
    res.status(200).json({
      success: true,
      message: 'Menu update sent successfully',
      successCount: response.successCount,
      failureCount: response.failureCount
    });
  } catch (error) {
    console.error('❌ Error sending menu update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Send special meal notification
 */
exports.sendSpecialMeal = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { mealName, specialItems, tokens } = req.body;

    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      res.status(400).json({ error: 'FCM tokens are required' });
      return;
    }

    // Create notification message
    const message = {
      notification: {
        title: `🎉 Special ${mealName}!`,
        body: `Today's ${mealName.toLowerCase()} features special items. Don't miss out!`,
        icon: '/pwa-192x192.png'
      },
      data: {
        type: 'special_meal',
        mealName: mealName,
        specialItems: JSON.stringify(specialItems || []),
        click_action: '/'
      },
      android: {
        notification: {
          icon: '/pwa-192x192.png',
          color: '#F59E0B',
          sound: 'default',
          priority: 'high'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      },
      webpush: {
        notification: {
          icon: '/pwa-192x192.png',
          badge: '/Messmate.png',
          vibrate: [200, 100, 200],
          requireInteraction: false,
          actions: [
            {
              action: 'view',
              title: 'View Special Menu',
              icon: '/Messmate.png'
            },
            {
              action: 'dismiss',
              title: 'Dismiss',
              icon: '/Messmate.png'
            }
          ]
        }
      }
    };

    // Send to multiple tokens
    const response = await messaging.sendMulticast({
      tokens,
      ...message
    });

    console.log(`✅ Special meal notification sent to ${response.successCount}/${tokens.length} tokens`);
    
    res.status(200).json({
      success: true,
      message: 'Special meal notification sent successfully',
      successCount: response.successCount,
      failureCount: response.failureCount
    });
  } catch (error) {
    console.error('❌ Error sending special meal notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get all active FCM tokens
 */
exports.getActiveTokens = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    // Get all active tokens
    const snapshot = await db.collection('fcm_tokens')
      .where('isActive', '==', true)
      .get();

    const tokens = [];
    snapshot.forEach(doc => {
      tokens.push(doc.data().token);
    });

    console.log(`✅ Retrieved ${tokens.length} active FCM tokens`);
    res.status(200).json({ success: true, tokens, count: tokens.length });
  } catch (error) {
    console.error('❌ Error getting active tokens:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Clean up inactive tokens (scheduled function)
 */
exports.cleanupInactiveTokens = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  try {
    const cutoffTime = new Date();
    cutoffTime.setDate(cutoffTime.getDate() - 30); // Remove tokens older than 30 days

    const snapshot = await db.collection('fcm_tokens')
      .where('createdAt', '<', cutoffTime)
      .get();

    const batch = db.batch();
    let deletedCount = 0;

    snapshot.forEach(doc => {
      batch.delete(doc.ref);
      deletedCount++;
    });

    await batch.commit();

    console.log(`✅ Cleaned up ${deletedCount} inactive FCM tokens`);
    return null;
  } catch (error) {
    console.error('❌ Error cleaning up inactive tokens:', error);
    return null;
  }
});
