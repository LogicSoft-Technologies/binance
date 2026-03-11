"use client";

import { useState } from "react";
import axios from "axios";

// Binance-exact color tokens
const B = {
  bg: "#0b0e11",
  bgSecondary: "#161a1e",
  bgCard: "#1e2329",
  bgInput: "#2b3139",
  border: "#2b3139",
  borderHover: "#474d57",
  yellow: "#FCD535",
  yellowHover: "#F0B90B",
  textPrimary: "#eaecef",
  textSecondary: "#848e9c",
  textMuted: "#474d57",
  green: "#0ecb81",
  red: "#f6465d",
};

const DiamondLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2L19.5 8.5H12.5L16 2Z" fill="#FCD535"/>
    <path d="M16 30L12.5 23.5H19.5L16 30Z" fill="#FCD535"/>
    <path d="M2 16L8.5 12.5V19.5L2 16Z" fill="#FCD535"/>
    <path d="M30 16L23.5 19.5V12.5L30 16Z" fill="#FCD535"/>
    <path d="M16 8.5L23.5 12.5L16 16L8.5 12.5L16 8.5Z" fill="#FCD535"/>
    <path d="M8.5 12.5L16 16V23.5L8.5 19.5V12.5Z" fill="#FCD535" opacity="0.7"/>
    <path d="M23.5 12.5V19.5L16 23.5V16L23.5 12.5Z" fill="#FCD535" opacity="0.85"/>
  </svg>
);

const StatusPill = ({ type, message }) => {
  const styles = {
    success: { bg: "rgba(14,203,129,0.1)", border: "rgba(14,203,129,0.3)", text: "#0ecb81", icon: "✓" },
    error:   { bg: "rgba(246,70,93,0.1)",  border: "rgba(246,70,93,0.3)",  text: "#f6465d", icon: "✕" },
    loading: { bg: "rgba(252,213,53,0.1)", border: "rgba(252,213,53,0.3)", text: "#FCD535", icon: "⟳" },
  };
  const s = styles[type] || styles.loading;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: "12px 16px", borderRadius: "4px",
      background: s.bg, border: `1px solid ${s.border}`,
      marginTop: "16px",
    }}>
      <span style={{ fontSize: "14px", color: s.text, fontWeight: 700 }}>{s.icon}</span>
      <span style={{ fontSize: "13px", color: s.text, fontWeight: 500 }}>{message}</span>
    </div>
  );
};

export default function EmailForm() {
  const [form, setForm] = useState({ to: "", subject: "", message: "" });
  const [status, setStatus] = useState(null); // { type, message }
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "message") setCharCount(e.target.value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "loading", message: "Sending message…" });

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/email/send`,
        form
      );
      setStatus({ type: "success", message: res.data.message || "Email sent successfully." });
      setForm({ to: "", subject: "", message: "" });
      setCharCount(0);
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: err.response?.data?.error || "Failed to send email. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    width: "100%",
    padding: "12px 16px",
    background: focused === name ? "#2b3139" : "#1e2329",
    border: `1px solid ${focused === name ? B.yellow : B.border}`,
    borderRadius: "4px",
    color: B.textPrimary,
    fontSize: "14px",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    outline: "none",
    transition: "border-color 0.15s ease, background 0.15s ease",
    boxSizing: "border-box",
    boxShadow: focused === name ? `0 0 0 1px rgba(252,213,53,0.15)` : "none",
  });

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: B.textSecondary,
    marginBottom: "8px",
    letterSpacing: "0.3px",
    textTransform: "uppercase",
  };

  return (
    <div className="email-root" style={{
      minHeight: "100vh",
      background: B.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 16px",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      boxSizing: "border-box",
    }}>
      <div style={{ width: "100%", maxWidth: "520px" }}>

        {/* Header */}
        <div className="email-header" style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <DiamondLogo />
          </div>
          <h1 style={{
            margin: "0 0 6px 0",
            fontSize: "22px",
            fontWeight: 700,
            color: B.textPrimary,
            letterSpacing: "-0.3px",
          }}>
            Send Customer Email
          </h1>
          <p style={{ margin: 0, fontSize: "13px", color: B.textSecondary }}>
            Compose and send a support message
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: B.bgCard,
          border: `1px solid ${B.border}`,
          borderRadius: "8px",
          overflow: "hidden",
        }}>

          {/* Card top accent */}
          <div style={{ height: "2px", background: B.yellow }} />

          <div className="email-card-body" style={{ padding: "32px" }}>

            {/* Security badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 14px", borderRadius: "4px",
              background: "rgba(252,213,53,0.06)",
              border: "1px solid rgba(252,213,53,0.15)",
              marginBottom: "28px",
            }}>
              <span style={{ fontSize: "14px" }}>🔒</span>
              <span style={{ fontSize: "12px", color: "#b8962a", fontWeight: 500 }}>
                Emails are sent securely via your registered support address
              </span>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Recipient */}
              <div>
                <label style={labelStyle}>Recipient Email</label>
                <input
                  type="email"
                  name="to"
                  value={form.to}
                  onChange={handleChange}
                  onFocus={() => setFocused("to")}
                  onBlur={() => setFocused(null)}
                  placeholder="client@example.com"
                  required
                  style={inputStyle("to")}
                />
              </div>

              {/* Subject */}
              <div>
                <label style={labelStyle}>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  onFocus={() => setFocused("subject")}
                  onBlur={() => setFocused(null)}
                  placeholder="e.g. Your tracking code is ready"
                  required
                  style={inputStyle("subject")}
                />
              </div>

              {/* Message */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Message</label>
                  <span style={{ fontSize: "11px", color: charCount > 1800 ? B.red : B.textMuted }}>
                    {charCount}/2000
                  </span>
                </div>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  rows={7}
                  maxLength={2000}
                  placeholder="Write your message to the customer here…"
                  required
                  style={{ ...inputStyle("message"), resize: "vertical", minHeight: "140px", lineHeight: "1.6" }}
                />
                <p style={{ margin: "6px 0 0 0", fontSize: "11.5px", color: B.textMuted }}>
                  The customer will receive a professionally formatted email.
                </p>
              </div>

              {/* Status */}
              {status && <StatusPill type={status.type} message={status.message} />}

              {/* Divider */}
              <div style={{ height: "1px", background: B.border, margin: "4px 0" }} />

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: loading ? "rgba(252,213,53,0.5)" : B.yellow,
                  color: "#1e2329",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  letterSpacing: "0.3px",
                  transition: "background 0.15s ease, transform 0.1s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => { if (!loading) e.target.style.background = B.yellowHover; }}
                onMouseLeave={(e) => { if (!loading) e.target.style.background = B.yellow; }}
                onMouseDown={(e) => { if (!loading) e.target.style.transform = "scale(0.99)"; }}
                onMouseUp={(e) => { e.target.style.transform = "scale(1)"; }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: "14px", height: "14px",
                      border: "2px solid rgba(30,35,41,0.3)",
                      borderTopColor: "#1e2329",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      display: "inline-block",
                    }} />
                    Sending…
                  </>
                ) : (
                  "Send Email"
                )}
              </button>

            </form>
          </div>
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: "center", marginTop: "20px",
          fontSize: "12px", color: B.textMuted, lineHeight: "18px",
        }}>
          Emails are delivered instantly · Replies go to your support inbox
        </p>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        ::placeholder { color: #474d57 !important; }
        input:-webkit-autofill,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #2b3139 inset !important;
          -webkit-text-fill-color: #eaecef !important;
        }

        @media (max-width: 480px) {
          .email-root { padding: 20px 12px !important; align-items: flex-start !important; }
          .email-card-body { padding: 20px 16px !important; }
          .email-header { margin-bottom: 20px !important; }
        }
      `}</style>
    </div>
    
  );
}