'use strict';
// Installation only: every game and online request continues straight to the network.
// No persistent cache, no interception of Supabase or stale game/catalog versions.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
