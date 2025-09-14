// src/broadcast.js
const CHANNEL = 'realtime-poll-channel';
const bc = ('BroadcastChannel' in window) ? new BroadcastChannel(CHANNEL) : null;

export function emit(event, payload) {
  try {
    bc?.postMessage({ event, payload, ts: Date.now() });
  } catch (e) { /* ignore */ }
}

export function subscribe(handler) {
  if (!bc) return () => {};
  const onmsg = (e) => handler(e.data);
  bc.addEventListener('message', onmsg);
  return () => bc.removeEventListener('message', onmsg);
}
