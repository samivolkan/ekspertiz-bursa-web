"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { packages, siteConfig } from "@/lib/site";

const isGitHubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";

type FormState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "success"; referenceCode: string };

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function AppointmentForm({ defaultPackage = "" }: { defaultPackage?: string }) {
  const [state, setState] = useState<FormState>({ kind: "idle" });
  const packageSelectRef = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("paket");
    const packageName = packages.find((item) => item.slug === slug)?.name;
    if (packageName && packageSelectRef.current) packageSelectRef.current.value = packageName;
  }, []);
  const dateLimits = useMemo(() => {
    const minimum = new Date();
    minimum.setDate(minimum.getDate() + 1);
    const maximum = new Date();
    maximum.setDate(maximum.getDate() + 90);
    return { min: dateKey(minimum), max: dateKey(maximum) };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.kind === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const search = new URLSearchParams(window.location.search);
    setState({ kind: "submitting" });

    const payload = {
      fullName: data.get("fullName"),
      phone: data.get("phone"),
      email: data.get("email"),
      servicePackage: data.get("servicePackage"),
      vehicle: data.get("vehicle"),
      appointmentDate: data.get("appointmentDate"),
      appointmentTime: data.get("appointmentTime"),
      contactPreference: data.get("contactPreference"),
      kvkkAccepted: data.get("kvkkAccepted") === "on",
      marketingConsent: data.get("marketingConsent") === "on",
      website: data.get("website"),
      utmSource: search.get("utm_source"),
      utmMedium: search.get("utm_medium"),
      utmCampaign: search.get("utm_campaign"),
      utmTerm: search.get("utm_term"),
      utmContent: search.get("utm_content"),
    };

    if (isGitHubPages) {
      const message = [
        "Merhaba, Ekspertiz Bursa için randevu talebi oluşturmak istiyorum.",
        `Ad soyad: ${String(payload.fullName || "-")}`,
        `Telefon: ${String(payload.phone || "-")}`,
        `Paket: ${String(payload.servicePackage || "-")}`,
        `Araç: ${String(payload.vehicle || "-")}`,
        `Tarih: ${String(payload.appointmentDate || "-")}`,
        `Saat: ${String(payload.appointmentTime || "-")}`,
        `İletişim tercihi: ${String(payload.contactPreference || "-")}`,
      ].join("\n");
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "generate_lead",
        lead_type: "appointment_whatsapp",
        package: String(payload.servicePackage || ""),
      });
      window.location.href = `https://wa.me/905527415143?text=${encodeURIComponent(message)}`;
      setState({ kind: "idle" });
      return;
    }

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        field?: string;
        appointment?: { referenceCode?: string };
      };

      if (!response.ok || !result.ok || !result.appointment?.referenceCode) {
        if (result.field) {
          const field = form.elements.namedItem(result.field);
          if (field instanceof HTMLElement) field.focus();
        }
        throw new Error(result.error || "Randevu talebi kaydedilemedi.");
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "generate_lead",
        lead_type: "appointment",
        package: String(payload.servicePackage || ""),
      });
      setState({ kind: "success", referenceCode: result.appointment.referenceCode });
      form.reset();
    } catch (error) {
      setState({
        kind: "error",
        message: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
      });
    }
  }

  if (state.kind === "success") {
    return (
      <div className="form-success" role="status" tabIndex={-1}>
        <span aria-hidden="true">✓</span>
        <h2>Talebiniz kaydedildi</h2>
        <p>
          Referans kodunuz: <strong>{state.referenceCode}</strong>
        </p>
        <p>Randevunuz, işletme sizinle iletişime geçip saati teyit ettiğinde kesinleşir.</p>
        <button className="button button-dark" type="button" onClick={() => setState({ kind: "idle" })}>
          Yeni talep oluştur
        </button>
      </div>
    );
  }

  return (
    <form className="appointment-form" onSubmit={submit} noValidate={false}>
      <div className="honeypot" aria-hidden="true">
        <label>
          Web sitesi
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.kind === "error" ? (
        <div className="form-alert" role="alert">
          {state.message}
        </div>
      ) : null}
      <div className="form-grid">
        <label>
          <span>Ad soyad</span>
          <input name="fullName" autoComplete="name" minLength={2} maxLength={100} required placeholder="Adınız ve soyadınız" />
        </label>
        <label>
          <span>Telefon</span>
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="05xx xxx xx xx" />
        </label>
        <label>
          <span>E-posta <em>isteğe bağlı</em></span>
          <input name="email" type="email" autoComplete="email" placeholder="ornek@email.com" />
        </label>
        <label>
          <span>İletişim tercihi</span>
          <select name="contactPreference" defaultValue="phone" required>
            <option value="phone">Telefon</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="sms">SMS</option>
            <option value="email">E-posta</option>
          </select>
        </label>
        <label>
          <span>Ekspertiz paketi</span>
          <select ref={packageSelectRef} name="servicePackage" defaultValue={defaultPackage} required>
            <option value="" disabled>Paket seçin</option>
            {packages.map((item) => (
              <option value={item.name} key={item.slug}>{item.name}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Araç</span>
          <input name="vehicle" maxLength={160} required placeholder="Örn. 2021 Renault Clio 1.0 TCe" />
        </label>
        <label>
          <span>Tercih edilen tarih</span>
          <input name="appointmentDate" type="date" min={dateLimits.min} max={dateLimits.max} required />
        </label>
        <label>
          <span>Tercih edilen saat</span>
          <select name="appointmentTime" defaultValue="" required>
            <option value="" disabled>Saat aralığı seçin</option>
            <option value="08:30-10:30">08:30–10:30</option>
            <option value="10:30-12:30">10:30–12:30</option>
            <option value="12:30-14:30">12:30–14:30</option>
            <option value="14:30-16:30">14:30–16:30</option>
            <option value="16:30-18:30">16:30–18:30</option>
          </select>
        </label>
      </div>
      <label className="consent-row">
        <input name="kvkkAccepted" type="checkbox" required />
        <span>
          <a href="/kvkk" target="_blank" rel="noreferrer">KVKK aydınlatma metnini</a> okudum; randevu talebimin yönetilmesi için verilerimin işlenmesi hakkında bilgilendirildim.
        </span>
      </label>
      <label className="consent-row">
        <input name="marketingConsent" type="checkbox" />
        <span>Kampanya ve hizmet duyuruları için iletişim izni veriyorum. <strong>İsteğe bağlıdır.</strong></span>
      </label>
      <button className="button button-primary button-full" type="submit" disabled={state.kind === "submitting"}>
        {state.kind === "submitting"
          ? "Talep hazırlanıyor…"
          : isGitHubPages
            ? "WhatsApp ile randevu talebi gönder"
            : "Randevu talebi oluştur"}
      </button>
      <p className="form-footnote">
        Bu işlem bir randevu talebi oluşturur. Tarih ve saat, işletmenin teyidiyle kesinleşir. Acil bilgi için <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a> numarasını arayabilirsiniz.
      </p>
    </form>
  );
}
