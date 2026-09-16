// DTR Buddy service worker
// Handles the "Na-punch ko na" action button on reminder notifications.

self.addEventListener("install", function (event) {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("notificationclick", function (event) {
  const action = event.action; // e.g. "confirm-timeInAM"
  event.notification.close();

  if (action && action.indexOf("confirm-") === 0) {
    const punchKey = action.replace("confirm-", "");

    event.waitUntil(
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
        // If the app is already open, tell it the punch was confirmed.
        for (const client of clientList) {
          client.postMessage({ type: "punch-confirmed", punchKey: punchKey });
        }
        // If not open, open it so the confirmation still gets recorded.
        if (clientList.length === 0 && self.clients.openWindow) {
          return self.clients.openWindow("./");
        }
      })
    );
  } else {
    // Clicked the notification body itself (not the action button) — just open the app.
    event.waitUntil(
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow("./");
        }
      })
    );
  }
});
