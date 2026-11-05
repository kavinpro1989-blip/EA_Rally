/** Small byte helpers shared by snapshotting code (work in Node and browsers). */

export function bytesToBase64(u8) {
  if (typeof Buffer !== 'undefined') return Buffer.from(u8.buffer, u8.byteOffset, u8.byteLength).toString('base64');
  let s = '';
  const chunk = 0x8000;
  for (let i = 0; i < u8.length; i += chunk) s += String.fromCharCode.apply(null, u8.subarray(i, i + chunk));
  return btoa(s);
}

export function base64ToBytes(b64) {
  if (typeof Buffer !== 'undefined') {
    const b = Buffer.from(b64, 'base64');
    const out = new Uint8Array(b.length);
    out.set(b);
    return out;
  }
  const s = atob(b64);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

/** FNV-1a over bytes, hex string. */
export function hashBytes(u8) {
  let h1 = 0x811c9dc5, h2 = 0x9747b28c;
  for (let i = 0; i < u8.length; i++) {
    h1 = Math.imul(h1 ^ u8[i], 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ u8[i], 0x85ebca6b) >>> 0;
  }
  return h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
}
