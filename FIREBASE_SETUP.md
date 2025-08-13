# Firebase Push Notifications Setup Guide for Messmate

This guide will help you set up Firebase Cloud Messaging (FCM) for push notifications in your Messmate app.

## Prerequisites

1. A Firebase project
2. Node.js and npm installed
3. Firebase CLI installed (`npm install -g firebase-tools`)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Follow the setup wizard
4. Enable Google Analytics (optional but recommended)

## Step 2: Enable Firebase Services

### Enable Cloud Messaging
1. In Firebase Console, go to "Project Settings"
2. Click on "Cloud Messaging" tab
3. Generate a new Web Push certificate (VAPID key pair)
4. Copy the generated keys

### Enable Firestore Database
1. Go to "Firestore Database" in the sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location close to your users

### Enable Cloud Functions
1. Go to "Functions" in the sidebar
2. Click "Get started"
3. Choose "Blaze" plan (required for external HTTP requests)
4. Select a location

## Step 3: Configure Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Firebase VAPID Key (from Cloud Messaging settings)
VITE_FIREBASE_VAPID_KEY=your-vapid-public-key

# Enable Firebase (set to 'true' to use Firebase instead of traditional web push)
VITE_USE_FIREBASE=true

# Firebase Functions URL (will be generated after deployment)
VITE_FIREBASE_FUNCTIONS_URL=https://your-region-your-project.cloudfunctions.net
```

## Step 4: Update Firebase Configuration Files

### Update `src/config/firebase.js`
Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
```

### Update `public/firebase-messaging-sw.js`
Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

## Step 5: Deploy Firebase Functions

1. Initialize Firebase in your project:
   ```bash
   firebase login
   firebase init
   ```

2. Select the following services:
   - Functions
   - Firestore
   - Hosting (optional)

3. Install dependencies:
   ```bash
   cd firebase-functions
   npm install
   ```

4. Deploy the functions:
   ```bash
   firebase deploy --only functions
   ```

5. Copy the generated function URLs and update your environment variables.

## Step 6: Update Service Worker Registration

The app will automatically use the Firebase messaging service worker when `VITE_USE_FIREBASE=true`. The service worker is located at `public/firebase-messaging-sw.js`.

## Step 7: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the app in a supported browser
3. Grant notification permissions
4. Check the browser console for Firebase initialization messages
5. Test sending a notification using the Firebase Console

## Step 8: Send Test Notifications

### Using Firebase Console
1. Go to Firebase Console > Cloud Messaging
2. Click "Send your first message"
3. Fill in the notification details
4. Target your app
5. Send the message

### Using Firebase Functions
You can also send notifications programmatically using the deployed functions:

```javascript
// Send meal reminder
fetch('https://your-region-your-project.cloudfunctions.net/sendMealReminder', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mealName: 'Breakfast',
    mealTime: '08:00',
    menuItems: ['Idli', 'Sambar', 'Chutney'],
    tokens: ['fcm-token-1', 'fcm-token-2']
  })
});
```

## Troubleshooting

### Common Issues

1. **Service Worker Not Registering**
   - Ensure `firebase-messaging-sw.js` is in the `public` folder
   - Check that the Firebase config in the service worker matches your project

2. **Permission Denied**
   - Make sure you're testing on HTTPS or localhost
   - Check browser notification settings

3. **FCM Token Not Generated**
   - Verify VAPID key is correct
   - Check Firebase configuration
   - Ensure service worker is properly registered

4. **Functions Not Deploying**
   - Make sure you're on the Blaze plan
   - Check your Firebase CLI is logged in
   - Verify function code syntax

### Debug Mode

Enable debug logging by adding this to your browser console:

```javascript
localStorage.setItem('debug', 'firebase:*');
```

## Security Considerations

1. **VAPID Keys**: Keep your private VAPID key secure and only use it server-side
2. **Firestore Rules**: The provided rules only allow access from Firebase Functions
3. **CORS**: Functions are configured to allow requests from your domain
4. **Token Storage**: FCM tokens are stored securely in Firestore

## Production Deployment

1. Update environment variables for production
2. Deploy Firebase Functions to production
3. Update the Firebase configuration in both client and service worker
4. Test thoroughly in production environment

## Monitoring and Analytics

1. **Firebase Console**: Monitor function execution and errors
2. **Firestore**: Track token subscriptions and preferences
3. **Cloud Messaging**: View delivery reports and analytics

## Support

For issues related to:
- Firebase setup: Check [Firebase Documentation](https://firebase.google.com/docs)
- Cloud Functions: Check [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- Web Push: Check [Web Push Protocol](https://tools.ietf.org/html/rfc8030)

## Migration from Traditional Web Push

If you're migrating from the existing web push implementation:

1. Set `VITE_USE_FIREBASE=true` in your environment
2. Deploy Firebase Functions
3. Update your server-side notification sending code to use Firebase Functions
4. Test thoroughly before switching over

The app will automatically use Firebase when enabled, falling back to traditional web push if Firebase is not configured.
