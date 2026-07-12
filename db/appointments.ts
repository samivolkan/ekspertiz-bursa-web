import { env } from "cloudflare:workers";

const MAX_APPOINTMENTS_PER_PHONE_PER_HOUR = 3;

const CREATE_APPOINTMENTS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference_code TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    service_package TEXT NOT NULL,
    vehicle TEXT NOT NULL,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    contact_preference TEXT NOT NULL
      CHECK (contact_preference IN ('phone', 'whatsapp', 'email', 'sms')),
    kvkk_accepted INTEGER NOT NULL CHECK (kvkk_accepted IN (0, 1)),
    marketing_consent INTEGER NOT NULL DEFAULT 0
      CHECK (marketing_consent IN (0, 1)),
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    status TEXT NOT NULL DEFAULT 'pending'
      CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

const CREATE_REFERENCE_INDEX_SQL = `
  CREATE UNIQUE INDEX IF NOT EXISTS appointments_reference_code_unique
  ON appointments (reference_code)
`;

const CREATE_PHONE_RATE_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS appointments_phone_created_at_idx
  ON appointments (phone, created_at)
`;

const CREATE_DATE_STATUS_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS appointments_date_status_idx
  ON appointments (appointment_date, status)
`;

const RATE_LIMIT_SQL = `
  SELECT COUNT(*) AS submission_count
  FROM appointments
  WHERE phone = ?1
    AND created_at >= datetime('now', '-1 hour')
`;

const INSERT_APPOINTMENT_SQL = `
  INSERT INTO appointments (
    reference_code,
    full_name,
    phone,
    email,
    service_package,
    vehicle,
    appointment_date,
    appointment_time,
    contact_preference,
    kvkk_accepted,
    marketing_consent,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    status
  ) VALUES (
    ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9,
    ?10, ?11, ?12, ?13, ?14, ?15, ?16, 'pending'
  )
`;

export type AppointmentInput = {
  fullName: string;
  phone: string;
  email: string | null;
  servicePackage: string;
  vehicle: string;
  appointmentDate: string;
  appointmentTime: string;
  contactPreference: "phone" | "whatsapp" | "email" | "sms";
  kvkkAccepted: true;
  marketingConsent: boolean;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
};

export class AppointmentRateLimitError extends Error {
  constructor() {
    super("Bu telefon numarası için saatlik randevu talebi sınırı aşıldı.");
    this.name = "AppointmentRateLimitError";
  }
}

let schemaInitialization: Promise<void> | undefined;

function getDatabase(): D1Database {
  const database = (env as unknown as { DB?: D1Database }).DB;
  if (!database) {
    throw new Error("Cloudflare D1 binding `DB` is unavailable.");
  }

  return database;
}

async function ensureAppointmentsSchema(database: D1Database) {
  schemaInitialization ??= database
    .batch([
      database.prepare(CREATE_APPOINTMENTS_TABLE_SQL),
      database.prepare(CREATE_REFERENCE_INDEX_SQL),
      database.prepare(CREATE_PHONE_RATE_INDEX_SQL),
      database.prepare(CREATE_DATE_STATUS_INDEX_SQL),
    ])
    .then(() => undefined)
    .catch((error) => {
      schemaInitialization = undefined;
      throw error;
    });

  await schemaInitialization;
}

function createReferenceCode() {
  const day = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const random = crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `EB-${day}-${random}`;
}

function isReferenceCollision(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("appointments.reference_code") ||
    message.includes("appointments_reference_code_unique")
  );
}

export async function createAppointment(input: AppointmentInput) {
  const database = getDatabase();
  await ensureAppointmentsSchema(database);

  const recent = await database
    .prepare(RATE_LIMIT_SQL)
    .bind(input.phone)
    .first<{ submission_count: number }>();

  if (Number(recent?.submission_count ?? 0) >= MAX_APPOINTMENTS_PER_PHONE_PER_HOUR) {
    throw new AppointmentRateLimitError();
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const referenceCode = createReferenceCode();

    try {
      await database
        .prepare(INSERT_APPOINTMENT_SQL)
        .bind(
          referenceCode,
          input.fullName,
          input.phone,
          input.email,
          input.servicePackage,
          input.vehicle,
          input.appointmentDate,
          input.appointmentTime,
          input.contactPreference,
          1,
          input.marketingConsent ? 1 : 0,
          input.utmSource,
          input.utmMedium,
          input.utmCampaign,
          input.utmTerm,
          input.utmContent,
        )
        .run();

      return { referenceCode, status: "pending" as const };
    } catch (error) {
      if (attempt < 2 && isReferenceCollision(error)) continue;
      throw error;
    }
  }

  throw new Error("Randevu referans kodu oluşturulamadı.");
}
