import {
  AppointmentRateLimitError,
  createAppointment,
  type AppointmentInput,
} from "@/db/appointments";

const MAX_BODY_LENGTH = 20_000;
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d(?:\s*-\s*(?:[01]\d|2[0-3]):[0-5]\d)?$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_PREFERENCES = new Set(["phone", "whatsapp", "email", "sms"]);

class RequestValidationError extends Error {
  constructor(
    public readonly field: string,
    message: string,
  ) {
    super(message);
    this.name = "RequestValidationError";
  }
}

function json(body: unknown, status: number, headers?: HeadersInit) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new RequestValidationError("body", "Geçerli bir randevu formu gönderin.");
  }

  return value as Record<string, unknown>;
}

function cleanText(value: unknown, field: string, maxLength: number) {
  if (typeof value !== "string") {
    throw new RequestValidationError(field, `${field} alanı zorunludur.`);
  }

  const cleaned = value.replace(/\s+/g, " ").trim();
  if (cleaned.length < 2 || cleaned.length > maxLength || /[\u0000-\u001f\u007f]/.test(cleaned)) {
    throw new RequestValidationError(field, `${field} alanı geçerli değil.`);
  }

  return cleaned;
}

function cleanOptionalText(value: unknown, maxLength: number) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return null;

  const cleaned = value.replace(/\s+/g, " ").trim();
  if (!cleaned || cleaned.length > maxLength || /[\u0000-\u001f\u007f]/.test(cleaned)) {
    return null;
  }

  return cleaned;
}

function normalizeTurkeyPhone(value: unknown) {
  if (typeof value !== "string") {
    throw new RequestValidationError("phone", "Telefon numarası zorunludur.");
  }

  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("90") && digits.length === 12) digits = digits.slice(2);
  if (digits.startsWith("0") && digits.length === 11) digits = digits.slice(1);

  if (!/^5\d{9}$/.test(digits)) {
    throw new RequestValidationError(
      "phone",
      "Telefon numarasını 05xx xxx xx xx formatında girin.",
    );
  }

  return `+90${digits}`;
}

function cleanEmail(value: unknown) {
  const email = cleanOptionalText(value, 254)?.toLowerCase() ?? null;
  if (email && !EMAIL_PATTERN.test(email)) {
    throw new RequestValidationError("email", "E-posta adresi geçerli değil.");
  }
  return email;
}

function istanbulTodayKey() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: "year" | "month" | "day") =>
    parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function dateKeyToUtc(value: string) {
  if (!DATE_KEY_PATTERN.test(value)) return Number.NaN;
  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(timestamp)) return Number.NaN;
  return new Date(timestamp).toISOString().slice(0, 10) === value
    ? timestamp
    : Number.NaN;
}

function cleanAppointmentDate(value: unknown) {
  if (typeof value !== "string") {
    throw new RequestValidationError("appointmentDate", "Randevu tarihi zorunludur.");
  }

  const appointmentTimestamp = dateKeyToUtc(value);
  const todayTimestamp = dateKeyToUtc(istanbulTodayKey());
  const oneDay = 86_400_000;

  if (!Number.isFinite(appointmentTimestamp)) {
    throw new RequestValidationError("appointmentDate", "Randevu tarihi geçerli değil.");
  }
  if (appointmentTimestamp < todayTimestamp + oneDay) {
    throw new RequestValidationError(
      "appointmentDate",
      "Randevu tarihi en erken yarın olabilir.",
    );
  }
  if (appointmentTimestamp > todayTimestamp + 90 * oneDay) {
    throw new RequestValidationError(
      "appointmentDate",
      "Randevu tarihi en fazla 90 gün sonrası olabilir.",
    );
  }

  return value;
}

function cleanAppointmentTime(value: unknown) {
  if (typeof value !== "string" || !TIME_PATTERN.test(value.trim())) {
    throw new RequestValidationError(
      "appointmentTime",
      "Randevu saati HH:MM formatında olmalıdır.",
    );
  }
  return value.trim().replace(/\s+/g, "");
}

function cleanContactPreference(value: unknown, email: string | null) {
  const preference = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!CONTACT_PREFERENCES.has(preference)) {
    throw new RequestValidationError(
      "contactPreference",
      "İletişim tercihi telefon, WhatsApp, SMS veya e-posta olmalıdır.",
    );
  }
  if (preference === "email" && !email) {
    throw new RequestValidationError(
      "email",
      "E-posta iletişim tercihi için e-posta adresi zorunludur.",
    );
  }
  return preference as AppointmentInput["contactPreference"];
}

function getUtm(payload: Record<string, unknown>, key: string) {
  const nested = asOptionalRecord(payload.utm);
  const flatKey = `utm${key[0].toUpperCase()}${key.slice(1)}`;
  return cleanOptionalText(payload[flatKey] ?? nested?.[key], key === "campaign" ? 200 : 120);
}

function asOptionalRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function validatePayload(payload: Record<string, unknown>): AppointmentInput {
  const email = cleanEmail(payload.email);
  const kvkkAccepted = payload.kvkkAccepted === true || payload.kvkkConsent === true;
  if (!kvkkAccepted) {
    throw new RequestValidationError(
      "kvkkAccepted",
      "KVKK aydınlatma metnini kabul etmeniz gerekir.",
    );
  }

  return {
    fullName: cleanText(payload.fullName ?? payload.name, "fullName", 100),
    phone: normalizeTurkeyPhone(payload.phone),
    email,
    servicePackage: cleanText(
      payload.servicePackage ?? payload.package,
      "servicePackage",
      80,
    ),
    vehicle: cleanText(payload.vehicle, "vehicle", 160),
    appointmentDate: cleanAppointmentDate(payload.appointmentDate ?? payload.date),
    appointmentTime: cleanAppointmentTime(payload.appointmentTime ?? payload.time),
    contactPreference: cleanContactPreference(payload.contactPreference, email),
    kvkkAccepted: true,
    marketingConsent: payload.marketingConsent === true,
    utmSource: getUtm(payload, "source"),
    utmMedium: getUtm(payload, "medium"),
    utmCampaign: getUtm(payload, "campaign"),
    utmTerm: getUtm(payload, "term"),
    utmContent: getUtm(payload, "content"),
  };
}

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
      return json({ ok: false, error: "JSON içerik bekleniyor." }, 415);
    }

    const body = await request.text();
    if (body.length > MAX_BODY_LENGTH) {
      return json({ ok: false, error: "Form verisi çok büyük." }, 413);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(body);
    } catch {
      return json({ ok: false, error: "Geçerli JSON gönderin." }, 400);
    }

    const payload = asRecord(parsed);
    const honeypot = cleanOptionalText(
      payload.website ?? payload.companyWebsite,
      200,
    );
    if (honeypot) {
      return json({ ok: true, received: true }, 202);
    }

    const appointment = await createAppointment(validatePayload(payload));
    return json({ ok: true, appointment }, 201);
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return json(
        { ok: false, field: error.field, error: error.message },
        400,
      );
    }
    if (error instanceof AppointmentRateLimitError) {
      return json(
        { ok: false, error: error.message },
        429,
        { "Retry-After": "3600" },
      );
    }

    console.error("Appointment persistence failed", error);
    return json(
      { ok: false, error: "Randevu kaydedilemedi. Lütfen tekrar deneyin." },
      503,
    );
  }
}
