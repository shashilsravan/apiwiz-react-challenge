// All challenge answers are derived from the candidate's email via FNV-1a hash.
// Same email always produces the same codes — but different emails get different codes,
// so sharing answers between candidates doesn't work.

export function deriveAnswers(email) {
  const e = email.toLowerCase().trim();

  // FNV-1a 32-bit
  let h = 0x811c9dc5;
  for (const c of e) {
    h = (Math.imul(h ^ c.charCodeAt(0), 0x01000193)) >>> 0;
  }

  // Produce a XX-XXXX style code per challenge using a unique salt per step
  const code = (salt) => {
    const v = (Math.imul(h ^ salt, 0x9e3779b9)) >>> 0;
    const B = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const p = (s) => B[(v >>> s) % B.length];
    return `${p(0)}${p(5)}-${p(10)}${p(15)}${p(20)}${p(25)}`;
  };

  return {
    net:     code(0xdeadbeef),
    dom:     code(0xcafebabe),
    proto:   code(0xc0ffee42),
    console: code(0xbada5500),
  };
}
