import { useState, useEffect, useRef, useCallback } from "react";

const HEARTH_PROMPT = (address) => `You are HEARTH, an AI home intelligence system. Given a residential address, provide comprehensive property insights. Be specific, knowledgeable, and actionable.

Address: ${address}

Respond ONLY with a JSON object (no markdown, no backticks, no preamble) with this exact structure:
{
  "property_summary": "A 2-3 sentence overview of this property and neighborhood",
  "climate_zone": "The USDA/Canadian climate zone and what it means",
  "soil_type": "Likely soil composition and implications for foundation/landscaping",
  "flood_risk": "Flood risk assessment based on geography and known flood zones",
  "seasonal_maintenance": [
    {"season": "Spring", "tasks": ["task1", "task2", "task3"]},
    {"season": "Summer", "tasks": ["task1", "task2", "task3"]},
    {"season": "Fall", "tasks": ["task1", "task2", "task3"]},
    {"season": "Winter", "tasks": ["task1", "task2", "task3"]}
  ],
  "energy_insights": "Energy efficiency considerations for this climate and region",
  "local_risks": "Natural disaster or environmental risks specific to this area",
  "home_score": 78,
  "tips": ["tip1", "tip2", "tip3"]
}

Be realistic, region-specific, and helpful. The home_score should be between 60-95 representing overall home health readiness. Make all information as specific to the actual location as possible.`;

function HouseIcon({ size = 24, color = "#4A6741" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L12 3l9 7.5V21a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 21V10.5z" />
      <path d="M9 22.5V12h6v10.5" />
    </svg>
  );
}

function LeafIcon({ size = 24, color = "#4A6741" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c4-4 8-8 8-14 0 0-4.5 0-8 4-3.5-4-8-4-8-4 0 6 4 10 8 14z" />
      <path d="M12 22V8" />
    </svg>
  );
}

function ShieldIcon({ size = 24, color = "#4A6741" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l8 4v6c0 5.25-3.5 10-8 12-4.5-2-8-6.75-8-12V6l8-4z" />
    </svg>
  );
}

function PulseIcon({ size = 24, color = "#4A6741" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9-6-18-3 9H2" />
    </svg>
  );
}

function SunIcon({ size = 20, color = "#4A6741" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function DropletIcon({ size = 20, color = "#4A6741" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z" />
    </svg>
  );
}

function ZapIcon({ size = 20, color = "#4A6741" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function AlertIcon({ size = 20, color = "#4A6741" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function CheckIcon({ size = 16, color = "#4A6741" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowIcon({ size = 18, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function MapPinIcon({ size = 16, color = "#8A8576" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function SearchIcon({ size = 16, color = "#8A8576" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

const SEASON_ICONS = { Spring: "🌱", Summer: "☀️", Fall: "🍂", Winter: "❄️" };

function ScoreRing({ score }) {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#4A6741" : score >= 65 ? "#B8860B" : "#C0392B";
  return (
    <div style={{ position: "relative", width: 140, height: 140 }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#E8E4DC" strokeWidth="8" />
        <circle cx="70" cy="70" r={radius} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 70 70)" style={{ transition: "stroke-dashoffset 1.5s ease-out" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 36, fontWeight: 700, color, fontFamily: "'Instrument Serif', Georgia, serif" }}>{score}</span>
        <span style={{ fontSize: 11, color: "#8A8576", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>Home Score</span>
      </div>
    </div>
  );
}

function AddressInput({ address, setAddress, onSubmit, loading }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const timerRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const lookup = useCallback((q) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (q.length < 3) { setSuggestions([]); setShowDropdown(false); return; }
    timerRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(q)}`,
          { headers: { "Accept-Language": "en" } }
        );
        const data = await r.json();
        const items = data.filter((d) => d.display_name).map((d) => ({
          full: d.display_name,
          short: [d.address?.house_number, d.address?.road, d.address?.city || d.address?.town || d.address?.village, d.address?.state || d.address?.province, d.address?.country].filter(Boolean).join(", "),
        }));
        setSuggestions(items);
        setShowDropdown(items.length > 0);
      } catch { setSuggestions([]); }
      finally { setSearching(false); }
    }, 350);
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative", maxWidth: 580, margin: "0 auto" }}>
      <div style={{
        display: "flex",
        borderRadius: 14, overflow: "hidden",
        boxShadow: showDropdown ? "0 2px 20px rgba(0,0,0,0.08), 0 0 0 2px #4A6741" : "0 2px 20px rgba(0,0,0,0.06), 0 0 0 1px #E0DCD4",
        background: "#fff", transition: "box-shadow 0.2s",
      }}>
        <div style={{ display: "flex", alignItems: "center", paddingLeft: 20 }}>
          <SearchIcon size={18} />
        </div>
        <input type="text" value={address}
          onChange={(e) => { setAddress(e.target.value); lookup(e.target.value); }}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          onKeyDown={(e) => { if (e.key === "Enter") { setShowDropdown(false); onSubmit(); } }}
          placeholder="Start typing your address..."
          style={{ flex: 1, padding: "18px 16px", border: "none", outline: "none", fontSize: 16, fontFamily: "'DM Sans', sans-serif", color: "#2C2B26", background: "transparent" }}
        />
        <button onClick={() => { setShowDropdown(false); onSubmit(); }} disabled={loading || !address.trim()}
          style={{
            padding: "18px 28px", background: loading ? "#8A9882" : "#4A6741", color: "#fff", border: "none",
            fontSize: 15, fontWeight: 500, cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 8,
            fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s", whiteSpace: "nowrap",
          }}>
          {loading ? (<><span className="hearth-spin" style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block" }} />Analyzing...</>) : (<>Analyze <ArrowIcon size={16} /></>)}
        </button>
      </div>

      {showDropdown && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          background: "#fff", borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px #E8E4DC",
          zIndex: 200, overflow: "hidden", maxHeight: 300, overflowY: "auto",
        }}>
          {searching && (
            <div style={{ padding: "14px 20px", fontSize: 14, color: "#8A8576", display: "flex", alignItems: "center", gap: 8 }}>
              <span className="hearth-spin" style={{ width: 14, height: 14, border: "2px solid #E0DCD4", borderTopColor: "#4A6741", borderRadius: "50%", display: "inline-block" }} />
              Searching addresses...
            </div>
          )}
          {!searching && suggestions.map((s, i) => (
            <button key={i}
              onClick={() => { setAddress(s.short || s.full); setSuggestions([]); setShowDropdown(false); }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FAF8F4")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12, width: "100%", padding: "14px 20px",
                border: "none", borderBottom: i < suggestions.length - 1 ? "1px solid #F0EDE5" : "none",
                background: "transparent", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif",
                transition: "background 0.15s",
              }}>
              <div style={{ marginTop: 2, flexShrink: 0 }}><MapPinIcon size={18} color="#4A6741" /></div>
              <div>
                <div style={{ fontSize: 14, color: "#2C2B26", fontWeight: 500, lineHeight: 1.4 }}>{s.short}</div>
                <div style={{ fontSize: 12, color: "#A9A49A", lineHeight: 1.4, marginTop: 2, maxWidth: 440, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.full}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HearthHome() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState(null);
  const [vis, setVis] = useState({});
  const resultsRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (insights && resultsRef.current) {
      setTimeout(() => resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
      ["summary", "climate", "soil", "flood", "energy", "risks", "seasonal", "tips"].forEach((s, i) => {
        setTimeout(() => setVis((p) => ({ ...p, [s]: true })), 300 + i * 150);
      });
    }
  }, [insights]);

  async function handleSubmit() {
    if (!address.trim()) return;
    setLoading(true);
    setError(null);
    setInsights(null);
    setVis({});
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{ role: "user", content: HEARTH_PROMPT(address) }],
        }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
      if (!text) throw new Error("Empty response");
      const parsed = JSON.parse(text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim());
      setInsights(parsed);
    } catch (err) {
      console.error(err);
      setError("Something went wrong analyzing that address. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const fadeIn = (key) => ({
    opacity: vis[key] ? 1 : 0,
    transform: vis[key] ? "translateY(0)" : "translateY(24px)",
    transition: "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
  });

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: "#2C2B26", background: "#FAF8F4", minHeight: "100vh", overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", borderBottom: "1px solid #E8E4DC", background: "rgba(250,248,244,0.95)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#4A6741", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <HouseIcon size={18} color="#FAF8F4" />
          </div>
          <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 24, fontWeight: 400, letterSpacing: 2 }}>HEARTH</span>
        </div>
        <span style={{ fontSize: 13, color: "#8A8576", letterSpacing: 1, textTransform: "uppercase", fontWeight: 500 }}>Launching Summer 2026</span>
      </nav>

      {/* HERO */}
      <section style={{ padding: "100px 40px 80px", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: "#EBE7DD", fontSize: 13, color: "#6B6858", fontWeight: 500, letterSpacing: 0.5, marginBottom: 28 }}>
          AI-powered home intelligence
        </div>
        <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(40px, 6vw, 68px)", fontWeight: 400, lineHeight: 1.1, margin: "0 0 24px" }}>
          Your home, finally<br />understood
        </h1>
        <p style={{ fontSize: 18, color: "#6B6858", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 48px", fontWeight: 300 }}>
          Enter your address and get instant insights about your property — climate, soil, flood risk, seasonal maintenance, and more.
        </p>
        <AddressInput address={address} setAddress={setAddress} onSubmit={handleSubmit} loading={loading} />
        {error && <p style={{ color: "#C0392B", marginTop: 16, fontSize: 14 }}>{error}</p>}
        <p style={{ fontSize: 13, color: "#A9A49A", marginTop: 16 }}>2,847+ homeowners have already checked their home</p>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "80px 40px", maxWidth: 1000, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 36, fontWeight: 400, marginBottom: 12, textAlign: "center" }}>What makes Hearth different</h2>
        <div style={{ width: 60, height: 1, background: "#4A6741", margin: "0 auto 48px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32 }}>
          {[
            { icon: <HouseIcon size={26} />, title: "Personalized in seconds", desc: "Enter your address and Hearth pulls together your property details, climate zone, soil type, flood risk, and insights most homeowners never think to look up." },
            { icon: <ShieldIcon size={26} />, title: "Built on real expertise", desc: "The knowledge of contractors, inspectors, designers, and decades of home management experience — built right into every recommendation." },
            { icon: <PulseIcon size={26} />, title: "Season by season, always on", desc: "Stop worrying about what you're forgetting. Hearth tracks what needs attention and stays ahead of small issues before they get expensive." },
          ].map((f, i) => (
            <div key={i}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
              style={{ padding: 36, borderRadius: 16, background: "#fff", border: "1px solid #E8E4DC", transition: "box-shadow 0.3s, transform 0.3s" }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: "#F0EDE5", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 22, fontWeight: 400, margin: "0 0 12px" }}>{f.title}</h3>
              <p style={{ fontSize: 15, color: "#6B6858", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "80px 40px", background: "#F0EDE5" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 36, fontWeight: 400, marginBottom: 48, textAlign: "center" }}>What homeowners are saying</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {[
              { headline: "It's like having an advisor.", quote: "It's like having a property expert in my pocket. Told me things about my home I had no idea about.", who: "Homeowner — Austin, TX" },
              { headline: "It knows your home.", quote: "I put in my address and it told me my soil type, flood zone, and seasonal maintenance — in seconds. Incredible.", who: "Homeowner — Montréal, QC" },
              { headline: "It's on your side.", quote: "Finally something that helps me stay on top of home maintenance without the guesswork. Exactly what I needed.", who: "Homeowner — Denver, CO" },
            ].map((t, i) => (
              <div key={i} style={{ padding: 32, borderRadius: 16, background: "#FAF8F4", border: "1px solid #E0DCD4" }}>
                <h4 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 20, fontWeight: 400, margin: "0 0 16px" }}>{t.headline}</h4>
                <div style={{ fontSize: 32, color: "#D0CCBF", fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: 8 }}>"</div>
                <p style={{ fontSize: 15, color: "#6B6858", lineHeight: 1.7, fontStyle: "italic", margin: "0 0 16px", fontWeight: 300 }}>{t.quote}</p>
                <span style={{ fontSize: 13, color: "#A9A49A", fontWeight: 500 }}>— {t.who}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      {insights && (
        <section ref={resultsRef} style={{ padding: "80px 40px", maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: "#4A6741", color: "#fff", fontSize: 13, fontWeight: 500, letterSpacing: 0.5, marginBottom: 20 }}>Your Home Report</div>
            <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 36, fontWeight: 400, margin: "0 0 8px" }}>Insights for your home</h2>
            <p style={{ fontSize: 15, color: "#8A8576" }}>{address}</p>
          </div>

          <div style={{ ...fadeIn("summary"), display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 48 }}>
            <ScoreRing score={insights.home_score} />
            <p style={{ fontSize: 16, color: "#6B6858", lineHeight: 1.7, textAlign: "center", maxWidth: 600, marginTop: 24, fontWeight: 300 }}>{insights.property_summary}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 32 }}>
            {[
              { key: "climate", icon: <SunIcon />, label: "Climate Zone", value: insights.climate_zone },
              { key: "soil", icon: <LeafIcon size={20} />, label: "Soil Type", value: insights.soil_type },
              { key: "flood", icon: <DropletIcon />, label: "Flood Risk", value: insights.flood_risk },
              { key: "energy", icon: <ZapIcon />, label: "Energy Insights", value: insights.energy_insights },
              { key: "risks", icon: <AlertIcon />, label: "Local Risks", value: insights.local_risks },
            ].map((c) => (
              <div key={c.key} style={{ ...fadeIn(c.key), padding: 28, borderRadius: 14, background: "#fff", border: "1px solid #E8E4DC" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F0EDE5", display: "flex", alignItems: "center", justifyContent: "center" }}>{c.icon}</div>
                  <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: "#8A8576" }}>{c.label}</span>
                </div>
                <p style={{ fontSize: 14, color: "#4A4840", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{c.value}</p>
              </div>
            ))}
          </div>

          <div style={fadeIn("seasonal")}>
            <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 28, fontWeight: 400, margin: "40px 0 24px", textAlign: "center" }}>Seasonal Maintenance Plan</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              {insights.seasonal_maintenance?.map((s) => (
                <div key={s.season} style={{ padding: 24, borderRadius: 14, background: "#fff", border: "1px solid #E8E4DC" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{SEASON_ICONS[s.season] || "📋"}</div>
                  <h4 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 20, fontWeight: 400, margin: "0 0 14px" }}>{s.season}</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {s.tasks?.map((t, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <div style={{ marginTop: 2, flexShrink: 0 }}><CheckIcon size={14} /></div>
                        <span style={{ fontSize: 13, color: "#6B6858", lineHeight: 1.5, fontWeight: 300 }}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={fadeIn("tips")}>
            <div style={{ marginTop: 32, padding: 32, borderRadius: 14, background: "#4A6741", color: "#fff" }}>
              <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 24, fontWeight: 400, margin: "0 0 20px" }}>Quick tips for your home</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {insights.tips?.map((tip, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, fontSize: 12, fontWeight: 700 }}>{i + 1}</div>
                    <span style={{ fontSize: 15, lineHeight: 1.6, fontWeight: 300, opacity: 0.92 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER CTA */}
      <section style={{ padding: "80px 40px", textAlign: "center", background: "#2C2B26", color: "#FAF8F4" }}>
        <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 400, lineHeight: 1.2, margin: "0 0 16px" }}>
          Homeownership without<br />the guesswork
        </h2>
        <p style={{ fontSize: 16, color: "#A9A49A", marginBottom: 36, fontWeight: 300 }}>Try it now — enter your address above.</p>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#3D5636")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#4A6741")}
          style={{ padding: "16px 40px", background: "#4A6741", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s" }}>
          Analyze Your Home
        </button>
        <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: 13, color: "#6B6858" }}>
          <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 16, letterSpacing: 2, marginBottom: 8, display: "block", color: "#8A8576" }}>HEARTH</span>
          The future of home intelligence — Summer 2026
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .hearth-spin { animation: spin 0.8s linear infinite; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #B5B0A5; }
      `}</style>
    </div>
  );
}
