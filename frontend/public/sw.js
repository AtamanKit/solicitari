// let user;

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    push = event.data.json();
    
    // console.log('USER_EMAILllllllll', user);
    // console.log('sender', push.sender);

    const title = 'Solicitari consumatori';
    const options = {
        body: push.message,
        icon: 'logo192.png',
        badge: 'logo192.png',
    };

    //if (user !== push.sender) {
    	event.waitUntil(self.registration.showNotification(title, options));
    //}
});

// self.addEventListener('message', function(event) {
//     user = event.data.user;
// });

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://solicitari.rednord.org')
    );
});
