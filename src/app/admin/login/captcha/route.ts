import { NextResponse } from "next/server";
import { randomCaptchaCode, hashCaptcha, renderCaptchaSvg, CAPTCHA_COOKIE } from "@/lib/captcha";

export async function GET() {
  const code = randomCaptchaCode();
  const svg = renderCaptchaSvg(code);

  const response = new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });

  response.cookies.set(CAPTCHA_COOKIE, hashCaptcha(code), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin/login",
    maxAge: 5 * 60,
  });

  return response;
}
