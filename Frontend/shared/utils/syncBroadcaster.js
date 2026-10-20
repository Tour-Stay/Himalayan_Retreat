/**
 * ===============================================================
 * THE KASAR HIMALAYAN HEIGHTS — REAL-TIME CROSS-APP SYNC ENGINE
 * ===============================================================
 * Coordinates instantaneous synchronization between the Admin Command
 * Center and all 3 public portals (Landing, Hotel, Travel) via
 * BroadcastChannel, Storage Events, and Focus Revalidation.
 */

const CHANNEL_NAME = 'kasar_dual_engine_sync';

let channel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
  } catch (e) {
    // Graceful fallback if not supported
  }
}

/**
 * Broadcast an update event to all other open tabs/windows
 * @param {'settings' | 'rooms' | 'tours' | 'bookings' | '*'} type 
 * @param {object} payload 
 */
export const broadcastUpdate = (type, payload = {}) => {
  if (typeof window === 'undefined') return;
  const message = { type, payload, timestamp: Date.now() };

  // 1. BroadcastChannel (instant in-memory transmission)
  if (channel) {
    try {
      channel.postMessage(message);
    } catch (e) {
      // Ignore
    }
  }

  // 2. Storage event (cross-tab / storage key transmission)
  try {
    localStorage.setItem('kasar_sync_event', JSON.stringify(message));
  } catch (e) {
    // Ignore
  }
};

/**
 * Subscribe to cross-app update events with optional polling fallback for cross-origin portals
 * @param {string | string[]} typeOrTypes - Event type(s) to listen for
 * @param {function} callback - Callback invoked on event
 * @param {number} [pollIntervalMs=0] - Optional background poll interval in ms (e.g. 60000)
 * @returns {function} Unsubscribe cleanup function
 */
export const subscribeToUpdates = (typeOrTypes, callback, pollIntervalMs = 0) => {
  if (typeof window === 'undefined') return () => {};

  const types = Array.isArray(typeOrTypes) ? typeOrTypes : [typeOrTypes];

  const handleMessage = (msg) => {
    if (!msg) return;
    if (types.includes('*') || types.includes(msg.type)) {
      callback(msg);
    }
  };

  // 1. BroadcastChannel listener (same origin / port tabs)
  const bcHandler = (e) => {
    if (e?.data) handleMessage(e.data);
  };

  if (channel) {
    channel.addEventListener('message', bcHandler);
  }

  // 2. Window storage listener (same origin tabs)
  const storageHandler = (e) => {
    if (e.key === 'kasar_sync_event' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        handleMessage(parsed);
      } catch (err) {
        // Ignore
      }
    }
  };
  window.addEventListener('storage', storageHandler);

  // 3. Cross-origin gentle polling fallback (bridges sandboxed ports/subdomains)
  let pollTimer = null;
  if (pollIntervalMs > 0) {
    pollTimer = setInterval(() => {
      // Only fire when tab is actively visible to conserve client battery & bandwidth
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        callback({ type: 'poll_sync', timestamp: Date.now() });
      }
    }, pollIntervalMs);
  }

  return () => {
    if (channel) {
      channel.removeEventListener('message', bcHandler);
    }
    window.removeEventListener('storage', storageHandler);
    if (pollTimer) {
      clearInterval(pollTimer);
    }
  };
};
