// Service Worker for Messmate PWA

const CACHE_NAME = 'messmate-v3';
const STATIC_CACHE = 'messmate-static-v3';
const DYNAMIC_CACHE = 'messmate-dynamic-v3';

const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/Messmate.png',
  '/Messmate.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests differently
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached API response if available
          return caches.match(request);
        })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Fetch from network
        return fetch(request)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the response
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Push event for push notifications
self.addEventListener('push', (event) => {
  let notificationData = {
    title: 'Messmate',
    body: 'New notification from Messmate!',
    icon: '/pwa-192x192.png',
    badge: '/Messmate.png',
    vibrate: [200, 100, 200],
    tag: 'messmate-notification',
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
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
  };

  // Parse push data if available
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        tag: data.tag || notificationData.tag,
        data: {
          ...notificationData.data,
          ...data.data
        }
      };
    } catch (error) {
      // If JSON parsing fails, use text
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync for offline notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'meal-notification') {
    event.waitUntil(
      // Handle background meal notifications
      handleBackgroundMealNotification()
    );
  }
});

async function handleBackgroundMealNotification() {
  // This would typically fetch the latest meal data and show notifications
  // For now, we'll just show a generic notification
  const options = {
    body: 'Check out the latest meal updates!',
    icon: '/pwa-192x192.png',
    badge: '/Messmate.png',
    tag: 'meal-update'
  };

  await self.registration.showNotification('Messmate', options);
}