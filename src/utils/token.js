export function generateToken(candidate) {
  const { name = '', email = '' } = candidate;
  const ts   = Date.now().toString(36).toUpperCase();
  const rand = String(Math.floor(10000 + Math.random() * 89999));
  const salt = Math.random().toString(36).slice(2, 7).toUpperCase();

  // Payload embedded in the token — base64 of JSON so you can decode it on your end
  const payload = btoa(JSON.stringify({ name, email, ts }));

  return `APWZ-${ts}-${rand}-${salt}.${payload}`;
}

// Decode a token back to candidate data
export function decodeToken(token) {
  try {
    const [, payload] = token.split('.');
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}
