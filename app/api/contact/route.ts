import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message?: string;
  locale?: string;
};

const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

function clean(value: unknown, max = 2000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests" },
      { status: 429 },
    );
  }

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const payload = {
    name: clean(body.name, 120),
    email: clean(body.email, 180),
    phone: clean(body.phone, 40),
    company: clean(body.company, 160),
    service: clean(body.service, 120),
    budget: clean(body.budget, 120),
    message: clean(body.message, 4000),
    locale: body.locale === "en" ? "en" : "ar",
  };

  if (payload.name.length < 2) {
    return NextResponse.json({ ok: false, error: "Invalid name" }, { status: 422 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 422 });
  }
  if (payload.message.length < 10) {
    return NextResponse.json({ ok: false, error: "Message too short" }, { status: 422 });
  }

  /**
   * لا يوجد مزوّد بريد مربوط افتراضيًا.
   * لتفعيل الإرسال الحقيقي: أضف CONTACT_WEBHOOK_URL في .env.local
   * (يدعم Slack / Make / Zapier / أي Webhook يستقبل JSON).
   */
  const webhook = process.env.CONTACT_WEBHOOK_URL;

  try {
    if (webhook) {
      const forwarded = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "rawaj-website",
          receivedAt: new Date().toISOString(),
          ...payload,
        }),
      });
      if (!forwarded.ok) throw new Error(`Webhook responded ${forwarded.status}`);
    } else {
      console.info("[contact] New request (no webhook configured):", {
        ...payload,
        message: payload.message.slice(0, 300),
      });
    }
  } catch (error) {
    console.error("[contact] Delivery failed:", error);
    return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}
