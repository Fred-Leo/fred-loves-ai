"use client";

export default function ContactForm() {
  return <form className="contact-form" aria-label="Contact Leo Helzberg" onSubmit={event => event.preventDefault()}>
    <div className="form-pair"><label htmlFor="contact-name">Your name<input id="contact-name" name="name" autoComplete="name" required maxLength={120} placeholder="Full name" /></label><label htmlFor="contact-email">Your email<input id="contact-email" type="email" name="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label></div>
    <label htmlFor="contact-organization">Company or organization <span>(optional)</span><input id="contact-organization" name="organization" autoComplete="organization" maxLength={160} placeholder="Where you work or study" /></label>
    <label htmlFor="contact-message">Your message<textarea id="contact-message" name="message" required minLength={10} maxLength={5000} rows={6} placeholder="What would you like to talk about?" aria-describedby="contact-status" /></label>
    <button className="form-submit" type="submit" disabled aria-describedby="contact-status">Send message <span aria-hidden="true">↗</span></button>
    <p className="form-status" id="contact-status" role="status">Message delivery is being set up. This form is not accepting messages yet.</p>
  </form>;
}
