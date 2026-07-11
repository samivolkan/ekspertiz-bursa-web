import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const appointments = sqliteTable(
  "appointments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    referenceCode: text("reference_code").notNull(),
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    servicePackage: text("service_package").notNull(),
    vehicle: text("vehicle").notNull(),
    appointmentDate: text("appointment_date").notNull(),
    appointmentTime: text("appointment_time").notNull(),
    contactPreference: text("contact_preference").notNull(),
    kvkkAccepted: integer("kvkk_accepted", { mode: "boolean" }).notNull(),
    marketingConsent: integer("marketing_consent", { mode: "boolean" })
      .notNull()
      .default(false),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmTerm: text("utm_term"),
    utmContent: text("utm_content"),
    status: text("status").notNull().default("pending"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("appointments_reference_code_unique").on(table.referenceCode),
    index("appointments_phone_created_at_idx").on(table.phone, table.createdAt),
    index("appointments_date_status_idx").on(
      table.appointmentDate,
      table.status,
    ),
    check(
      "appointments_kvkk_accepted_check",
      sql`${table.kvkkAccepted} IN (0, 1)`,
    ),
    check(
      "appointments_marketing_consent_check",
      sql`${table.marketingConsent} IN (0, 1)`,
    ),
    check(
      "appointments_contact_preference_check",
      sql`${table.contactPreference} IN ('phone', 'whatsapp', 'email', 'sms')`,
    ),
    check(
      "appointments_status_check",
      sql`${table.status} IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')`,
    ),
  ],
);
