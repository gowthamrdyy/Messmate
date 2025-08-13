# Push Notifications for Messmate

## Overview

Messmate now supports push notifications to keep users informed about meal times, menu updates, and special meals even when the app is not actively open. This feature enhances user engagement and ensures users never miss important meal information.

## Features

### 🔔 **Notification Types**

1. **Meal Time Reminders**
   - Notifications 30 minutes before each meal
   - Includes meal name and time
   - Works even when app is closed

2. **Menu Updates**
   - Notifications when menu changes
   - Highlights new or modified items
   - Includes mess name and day

3. **Special Meals**
   - Notifications for special meal items
   - Highlights special dishes or events
   - Includes item details

4. **Test Notifications**
   - Send test notifications to verify setup
   - Useful for debugging and user testing

### ⚙️ **User Preferences**

Users can customize their notification preferences:
- **Meal Reminders**: Enable/disable meal time notifications
- **Menu Updates**: Enable/disable menu change notifications
- **Special Meals**: Enable/disable special meal notifications
- **Test Notifications**: Send test notifications

## Technical Implementation

### 🏗️ **Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Web App       │    │  Service Worker  │    │  Push Service   │
│                 │    │                  │    │                 │
│ • Subscribe     │───▶│ • Handle Push    │◀───│ • Send          │
│ • Unsubscribe   │    │ • Show Notif     │    │ • Manage        │
│ • Preferences   │    │ • Handle Click   │    │ • Store         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 📱 **Service Worker Integration**

The service worker (`public/sw.js`) handles:
- Push event reception
- Notification display
- Click event handling
- Background sync

### 🔐 **Security**

- **VAPID Keys**: Secure push notification authentication
- **HTTPS Required**: Push notifications only work over HTTPS
- **Permission-based**: User must explicitly grant permission

## Setup Instructions

### 🚀 **For Users**

1. **Enable Notifications**
   - Go to Settings → Push Notifications
   - Click "Enable Notifications"
   - Grant permission when prompted

2. **Customize Preferences**
   - Toggle notification types on/off
   - Test notifications to verify setup
   - Manage subscription status

3. **Receive Notifications**
   - Notifications appear even when app is closed
   - Click notifications to open the app
   - Use notification actions (View Menu, Dismiss)

### 🛠️ **For Developers**

#### **Local Development**

1. **Mock API**: Uses mock API for local testing
2. **Service Worker**: Automatically registered
3. **HTTPS**: Use `localhost` for development

#### **Production Deployment**

1. **VAPID Keys**: Generate and configure VAPID keys
2. **Server Endpoints**: Implement push notification API
3. **HTTPS**: Ensure HTTPS is enabled
4. **Service Worker**: Deploy with app

## API Endpoints

### **Subscribe to Notifications**
```javascript
POST /api/push/subscribe
{
  "subscription": {
    "endpoint": "...",
    "keys": { ... }
  },
  "userAgent": "...",
  "timestamp": "..."
}
```

### **Unsubscribe from Notifications**
```javascript
POST /api/push/unsubscribe
{
  "subscription": {
    "endpoint": "...",
    "keys": { ... }
  }
}
```

### **Update Preferences**
```javascript
POST /api/push/preferences
{
  "subscription": { ... },
  "preferences": {
    "mealReminders": true,
    "menuUpdates": true,
    "specialMeals": true
  }
}
```

## Usage Examples

### **Subscribe to Notifications**
```javascript
import usePushNotifications from '../hooks/usePushNotifications';

const { subscribe, isSupported } = usePushNotifications();

const handleSubscribe = async () => {
  if (isSupported) {
    await subscribe();
  }
};
```

### **Send Test Notification**
```javascript
const { sendTestNotification } = usePushNotifications();

const handleTest = async () => {
  await sendTestNotification();
};
```

### **Schedule Meal Notification**
```javascript
const { scheduleMealNotification } = usePushNotifications();

const handleMealReminder = async () => {
  await scheduleMealNotification(
    'Lunch',
    new Date('2024-01-15T12:00:00Z'),
    ['Rice', 'Dal', 'Vegetables']
  );
};
```

## Browser Support

### ✅ **Supported Browsers**
- Chrome 42+
- Firefox 44+
- Safari 16+
- Edge 17+

### ❌ **Unsupported Browsers**
- Internet Explorer
- Older mobile browsers

## Troubleshooting

### **Common Issues**

1. **Notifications Not Working**
   - Check browser permissions
   - Verify HTTPS connection
   - Ensure service worker is registered

2. **Permission Denied**
   - User must manually enable in browser settings
   - Clear site data and retry
   - Check browser notification settings

3. **Service Worker Issues**
   - Clear browser cache
   - Unregister and re-register service worker
   - Check console for errors

### **Debug Commands**

```javascript
// Check notification permission
console.log(Notification.permission);

// Check service worker registration
navigator.serviceWorker.getRegistrations().then(console.log);

// Check push manager subscription
navigator.serviceWorker.ready.then(registration => {
  registration.pushManager.getSubscription().then(console.log);
});
```

## Performance Considerations

### **Optimization Tips**

1. **Batch Notifications**: Group similar notifications
2. **Rate Limiting**: Avoid spam notifications
3. **Relevant Content**: Only send important updates
4. **User Preferences**: Respect user settings

### **Monitoring**

- Track notification delivery rates
- Monitor user engagement
- Analyze notification effectiveness
- Monitor service worker performance

## Future Enhancements

### **Planned Features**

1. **Rich Notifications**
   - Images and media
   - Interactive buttons
   - Custom layouts

2. **Smart Scheduling**
   - AI-powered timing
   - User behavior analysis
   - Personalized reminders

3. **Advanced Preferences**
   - Time-based preferences
   - Location-based notifications
   - Dietary restrictions

4. **Analytics Dashboard**
   - Notification statistics
   - User engagement metrics
   - Performance monitoring

## Security Best Practices

### **Data Protection**

1. **Encryption**: All push data is encrypted
2. **Authentication**: VAPID key verification
3. **Privacy**: No personal data in notifications
4. **Consent**: Explicit user permission required

### **Compliance**

- **GDPR**: User consent and data rights
- **CCPA**: Privacy and data control
- **PECR**: Electronic communications regulations

## Support

For technical support or questions about push notifications:

1. **Documentation**: Check this file and code comments
2. **Console Logs**: Check browser console for errors
3. **Network Tab**: Monitor API requests
4. **Service Worker**: Check service worker status

---

**Note**: Push notifications require HTTPS in production. For local development, `localhost` is considered secure and will work for testing.
