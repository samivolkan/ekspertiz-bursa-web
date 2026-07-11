CREATE TABLE `appointments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference_code` text NOT NULL,
	`full_name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`service_package` text NOT NULL,
	`vehicle` text NOT NULL,
	`appointment_date` text NOT NULL,
	`appointment_time` text NOT NULL,
	`contact_preference` text NOT NULL,
	`kvkk_accepted` integer NOT NULL,
	`marketing_consent` integer DEFAULT false NOT NULL,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`utm_term` text,
	`utm_content` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "appointments_kvkk_accepted_check" CHECK("appointments"."kvkk_accepted" IN (0, 1)),
	CONSTRAINT "appointments_marketing_consent_check" CHECK("appointments"."marketing_consent" IN (0, 1)),
	CONSTRAINT "appointments_contact_preference_check" CHECK("appointments"."contact_preference" IN ('phone', 'whatsapp', 'email', 'sms')),
	CONSTRAINT "appointments_status_check" CHECK("appointments"."status" IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `appointments_reference_code_unique` ON `appointments` (`reference_code`);--> statement-breakpoint
CREATE INDEX `appointments_phone_created_at_idx` ON `appointments` (`phone`,`created_at`);--> statement-breakpoint
CREATE INDEX `appointments_date_status_idx` ON `appointments` (`appointment_date`,`status`);