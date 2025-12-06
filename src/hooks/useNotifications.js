import { useState, useEffect, useCallback } from 'react';

const useNotifications = () => {
    const [permission, setPermission] = useState(Notification.permission);

    useEffect(() => {
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission().then((perm) => {
                setPermission(perm);
            });
        }
    }, []);

    const requestPermission = useCallback(async () => {
        const perm = await Notification.requestPermission();
        setPermission(perm);
        return perm;
    }, []);

    const sendNotification = useCallback((title, options = {}) => {
        if (permission === 'granted') {
            // Check if service worker is ready for more reliable notifications on mobile
            if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification(title, {
                        icon: '/pwa-192x192.png',
                        badge: '/pwa-192x192.png',
                        vibrate: [200, 100, 200],
                        ...options
                    });
                });
            } else {
                // Fallback to standard Notification API
                new Notification(title, {
                    icon: '/pwa-192x192.png',
                    ...options
                });
            }
        }
    }, [permission]);

    return {
        permission,
        requestPermission,
        sendNotification
    };
};

export default useNotifications;
