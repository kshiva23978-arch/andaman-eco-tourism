import { randomInt, createHash } from "crypto";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const CAPTCHA_LENGTH = 6;
export const CAPTCHA_COOKIE = "admin_captcha";

export function randomCaptchaCode() {
  let out = "";
  for (let i = 0; i < CAPTCHA_LENGTH; i++) out += CHARS[randomInt(CHARS.length)];
  return out;
}

export function hashCaptcha(code: string) {
  return createHash("sha256").update(code.toUpperCase()).digest("hex");
}

export function renderCaptchaSvg(code: string) {
  const width = 180;
  const height = 56;
  const charWidth = width / code.length;

  let lines = "";
  for (let i = 0; i < 7; i++) {
    const x1 = Math.random() * width;
    const y1 = Math.random() * height;
    const x2 = Math.random() * width;
    const y2 = Math.random() * height;
    lines += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="rgba(15,43,30,${(0.12 + Math.random() * 0.18).toFixed(2)})" stroke-width="${(1 + Math.random()).toFixed(1)}" />`;
  }

  let dots = "";
  for (let i = 0; i < 50; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    dots += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(0.8 + Math.random() * 1.4).toFixed(1)}" fill="rgba(44,105,78,${(0.15 + Math.random() * 0.3).toFixed(2)})" />`;
  }

  let glyphs = "";
  code.split("").forEach((ch, i) => {
    const x = charWidth * i + charWidth / 2;
    const y = height / 2 + (Math.random() * 10 - 5);
    const rotate = (Math.random() * 34 - 17).toFixed(1);
    glyphs += `<text x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, serif" font-weight="bold" font-size="${Math.floor(height * 0.55)}" fill="#0f2b1e" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rotate})">${ch}</text>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="#f3ecd9" />${lines}${dots}${glyphs}</svg>`;
}
