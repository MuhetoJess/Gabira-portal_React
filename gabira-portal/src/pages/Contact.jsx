import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <main>
      <div className="contact-wrap">
        <address>
          <h2>Get in Touch</h2>
          <p>
            <strong>Address:</strong><br />
            Gabira Giving Portal<br />
            KG 15 Ave, Kacyiru<br />
            Kigali, Rwanda
          </p>
          <p>
            <strong>Telephone:</strong><br />
            +250 788 123 456
          </p>
          <p>
            <strong>Email:</strong><br />
            hello@gabiragiving.rw
          </p>
        </address>

        <form className="app-form" onSubmit={handleSubmit}>
          <h2>Send Us a Message</h2>
          <p className="form-sub">We usually reply within one business day.</p>

          <div className="form-row">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              required
              minLength={2}
              maxLength={60}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-row">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              required
              minLength={3}
              maxLength={80}
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>

          <div className="form-row">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows={5}
              required
              minLength={10}
              maxLength={800}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
            <span className="hint">{formData.message.length} / 800 characters</span>
          </div>

          <button type="submit" className="submit-btn">Send Message</button>
          {submitted && (
            <div className="form-msg show success">
              Thanks! Your message has been sent &mdash; we'll be in touch soon.
            </div>
          )}
        </form>
      </div>
    </main>
  );
}