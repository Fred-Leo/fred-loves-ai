"use client";

import { useRef, useState, type FormEvent } from "react";

type Status = { kind: "idle" | "pending" | "success" | "error"; message: string };

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });
  const busy = useRef(false);
  const attempt = useRef({ body: "", key: "" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    busy.current = true;
    setStatus({ kind: "pending", message: "Sending your message…" });
    const body = JSON.stringify(Object.fromEntries(new FormData(form)));
    // Reuse the key after an uncertain response; edited messages get a new key.
    if (attempt.current.body !== body) attempt.current = { body, key: crypto.randomUUID() };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": attempt.current.key },
        body, signal: controller.signal,
      });
      const raw: unknown = await response.json().catch(() => null);
      const result = raw && typeof raw === "object" ? raw as { ok?: unknown; message?: unknown } : null;
      if (!response.ok || result?.ok !== true) {
        throw new Error(typeof result?.message === "string" ? result.message : "Your message was not accepted. Please try again later.");
      }
      setStatus({ kind: "success", message: typeof result.message === "string" ? result.message : "Your message was accepted for delivery." });
      form.reset();
      attempt.current = { body: "", key: "" };
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof Error && error.name !== "AbortError" && error.name !== "TypeError"
        ? error.message : "Delivery could not be confirmed. Your message is still here. Please retry or contact Leo on LinkedIn." });
    } finally { clearTimeout(timer); busy.current = false; }
  }

  return <form className="contact-form" aria-label="Contact Leo Helzberg" onSubmit={submit} aria-busy={status.kind === "pending"}>
    <fieldset disabled={status.kind === "pending"} className="contact-fields">
      <div className="form-pair"><label htmlFor="contact-name">Your name<input id="contact-name" name="name" autoComplete="name" required maxLength={120} placeholder="Full name" /></label><label htmlFor="contact-email">Your email<input id="contact-email" type="email" name="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label></div>
      <label htmlFor="contact-organization">Company or organization <span>(optional)</span><input id="contact-organization" name="organization" autoComplete="organization" maxLength={160} placeholder="Where you work or study" /></label>
      <div className="contact-trap" aria-hidden="true"><label htmlFor="contact-website">Leave this empty<input id="contact-website" name="website" tabIndex={-1} autoComplete="off" maxLength={200} /></label></div>
      <label htmlFor="contact-message">Your message<textarea id="contact-message" name="message" required minLength={10} maxLength={5000} rows={6} placeholder="What would you like to talk about?" aria-describedby="contact-status" /></label>
      <button className="form-submit" type="submit">{status.kind === "pending" ? "Sending…" : "Send message"} <span aria-hidden="true">↗</span></button>
    </fieldset>
    <p className={`form-status form-status-${status.kind}`} id="contact-status" role={status.kind === "error" ? "alert" : "status"}>{status.message}</p>
    {status.kind === "error" && <a className="text-link" href="https://www.linkedin.com/in/leo-helzberg">Contact Leo on LinkedIn ↗</a>}
  </form>;
}
