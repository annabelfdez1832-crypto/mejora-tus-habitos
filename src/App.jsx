import { useState, useEffect, useRef } from "react";

const HABITS = [
  { id: 1, icon: "🧠", name: "Enfoque", desc: "Mejora tu concentración diaria", color: "#FF4F22" },
  { id: 2, icon: "💪", name: "Ejercicio", desc: "Mueve tu cuerpo cada día", color: "#22A082" },
  { id: 3, icon: "😴", name: "Sueño", desc: "Duerme mejor y más profundo", color: "#7B2FFF" },
  { id: 4, icon: "🥗", name: "Nutrición", desc: "Alimenta tu mente y cuerpo", color: "#FF4F22" },
  { id: 5, icon: "🧘", name: "Meditación", desc: "Calma y claridad mental", color: "#22A082" },
  { id: 6, icon: "📚", name: "Lectura", desc: "Aprende algo nuevo cada día", color: "#7B2FFF" },
  { id: 7, icon: "💧", name: "Hidratación", desc: "Mantén tu cuerpo hidratado", color: "#FF4F22" },
  { id: 8, icon: "🌿", name: "Naturaleza", desc: "Conecta con el exterior", color: "#22A082" },
  { id: 9, icon: "✍️", name: "Diario", desc: "Reflexiona sobre tu día", color: "#7B2FFF" },
];

const TESTIMONIALS = [
  { name: "María G.", role: "Emprendedora", text: "Desde que uso Rutinas, mi productividad se disparó. En 30 días noté cambios reales en mi enfoque y energía.", avatar: "MG" },
  { name: "Carlos R.", role: "Atleta amateur", text: "La app me ayudó a mantener mis hábitos de entrenamiento y sueño. Increíble lo que puede hacer una rutina consistente.", avatar: "CR" },
  { name: "Laura P.", role: "Diseñadora UX", text: "Simple, efectiva y motivadora. Por fin encontré una app que realmente me ayuda a mantener mis hábitos sin agobiarme.", avatar: "LP" },
];

const STATS = [
  { value: 50000, label: "Usuarios activos", suffix: "+" },
  { value: 2000000, label: "Hábitos completados", suffix: "M+" },
  { value: 87, label: "Mejoran en 30 días", suffix: "%" },
  { value: 4.8, label: "Valoración media", suffix: "★" },
];

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCard({ value, label, suffix, animate }) {
  const displayValue = useCountUp(value, 1800, animate);
  const formatted =
    value >= 1000000
      ? (displayValue / 1000000).toFixed(1)
      : displayValue;

  return (
    <div style={{
      textAlign: "center",
      padding: "24px 16px",
      background: "rgba(255,255,255,0.05)",
      borderRadius: "16px",
      border: "1px solid rgba(255,255,255,0.1)",
      flex: "1 1 140px",
      minWidth: "140px",
    }}>
      <div style={{ fontSize: "2.4rem", fontWeight: "800", color: "#FF4F22", lineHeight: 1 }}>
        {formatted}{suffix}
      </div>
      <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", marginTop: "8px", lineHeight: 1.3 }}>
        {label}
      </div>
    </div>
  );
}

function HabitCard({ habit, selected, onToggle }) {
  return (
    <button
      onClick={() => onToggle(habit.id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px 20px",
        background: selected ? `${habit.color}22` : "rgba(255,255,255,0.05)",
        border: `2px solid ${selected ? habit.color : "rgba(255,255,255,0.1)"}`,
        borderRadius: "14px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        width: "100%",
        textAlign: "left",
        transform: selected ? "scale(1.02)" : "scale(1)",
      }}
    >
      <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>{habit.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ color: "#fff", fontWeight: "700", fontSize: "0.95rem" }}>{habit.name}</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", marginTop: "2px" }}>{habit.desc}</div>
      </div>
      <div style={{
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        border: `2px solid ${selected ? habit.color : "rgba(255,255,255,0.3)"}`,
        background: selected ? habit.color : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all 0.2s ease",
      }}>
        {selected && <span style={{ color: "#fff", fontSize: "0.75rem", fontWeight: "800" }}>✓</span>}
      </div>
    </button>
  );
}

function ProgressRing({ percent }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <svg width="130" height="130" viewBox="0 0 130 130">
      <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
      <circle
        cx="65" cy="65" r={radius} fill="none"
        stroke="#FF4F22" strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 65 65)"
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
      <text x="65" y="70" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="800">
        {Math.round(percent)}%
      </text>
    </svg>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedHabits, setSelectedHabits] = useState([]);
  const [activeSection, setActiveSection] = useState("inicio");
  const [statsVisible, setStatsVisible] = useState(false);
  const [step, setStep] = useState(1); // onboarding step
  const [userName, setUserName] = useState("");
  const [goal, setGoal] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const statsRef = useRef(null);

  const toggleHabit = (id) => {
    setSelectedHabits((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleStart = () => {
    if (selectedHabits.length > 0) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const navItems = [
    { id: "inicio", label: "Inicio" },
    { id: "habitos", label: "Hábitos" },
    { id: "programa", label: "Programa" },
    { id: "testimonios", label: "Testimonios" },
  ];

  const scrollTo = (id) => {
    setActiveSection(id);
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // ─── styles ───────────────────────────────────────────────────────────────

  const s = {
    root: {
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      background: "#0D0D1A",
      color: "#fff",
      minHeight: "100vh",
      overflowX: "hidden",
    },
    // NAV
    nav: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: "rgba(13,13,26,0.92)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      padding: "0 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "64px",
    },
    logo: {
      fontSize: "1.5rem",
      fontWeight: "900",
      background: "linear-gradient(135deg, #FF4F22, #FF8C66)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: "-0.5px",
      cursor: "pointer",
    },
    burgerBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "8px",
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    },
    burgerLine: {
      width: "26px",
      height: "3px",
      background: "#FF4F22",
      borderRadius: "2px",
      display: "block",
    },
    mobileMenu: {
      position: "fixed",
      top: "64px",
      left: 0,
      right: 0,
      background: "rgba(13,13,26,0.98)",
      zIndex: 999,
      padding: "20px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      transform: menuOpen ? "translateY(0)" : "translateY(-120%)",
      transition: "transform 0.3s ease",
    },
    mobileNavItem: {
      display: "block",
      padding: "14px 0",
      color: "#fff",
      fontSize: "1.1rem",
      fontWeight: "600",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
      cursor: "pointer",
      background: "none",
      border: "none",
      width: "100%",
      textAlign: "left",
    },
    desktopNav: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
    },
    desktopNavItem: {
      padding: "8px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "rgba(255,255,255,0.8)",
      background: "none",
      border: "none",
      transition: "all 0.2s ease",
    },
    ctaNavBtn: {
      padding: "10px 20px",
      background: "linear-gradient(135deg, #FF4F22, #FF6B3D)",
      border: "none",
      borderRadius: "10px",
      color: "#fff",
      fontWeight: "700",
      fontSize: "0.9rem",
      cursor: "pointer",
      marginLeft: "8px",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    // HERO
    hero: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "100px 24px 60px",
      background: "radial-gradient(ellipse at top, #1a0a2e 0%, #0D0D1A 60%)",
      position: "relative",
      overflow: "hidden",
    },
    heroGlow: {
      position: "absolute",
      top: "20%",
      left: "50%",
      transform: "translateX(-50%)",
      width: "600px",
      height: "400px",
      background: "radial-gradient(ellipse, rgba(255,79,34,0.15) 0%, transparent 70%)",
      pointerEvents: "none",
    },
    heroBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 18px",
      background: "rgba(255,79,34,0.15)",
      border: "1px solid rgba(255,79,34,0.4)",
      borderRadius: "100px",
      color: "#FF8C66",
      fontSize: "0.85rem",
      fontWeight: "600",
      marginBottom: "24px",
    },
    heroTitle: {
      fontSize: "clamp(2.2rem, 7vw, 4rem)",
      fontWeight: "900",
      lineHeight: 1.1,
      marginBottom: "20px",
      maxWidth: "700px",
    },
    heroAccent: {
      background: "linear-gradient(135deg, #FF4F22, #FF8C66)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    heroSub: {
      fontSize: "clamp(1rem, 3vw, 1.2rem)",
      color: "rgba(255,255,255,0.7)",
      maxWidth: "560px",
      lineHeight: 1.7,
      marginBottom: "36px",
    },
    heroBtn: {
      padding: "18px 40px",
      background: "linear-gradient(135deg, #FF4F22, #FF6B3D)",
      border: "none",
      borderRadius: "14px",
      color: "#fff",
      fontWeight: "800",
      fontSize: "1.1rem",
      cursor: "pointer",
      boxShadow: "0 8px 30px rgba(255,79,34,0.4)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      marginBottom: "16px",
    },
    heroSubtext: {
      fontSize: "0.8rem",
      color: "rgba(255,255,255,0.4)",
    },
    // IMPROVE CHIPS
    improveSection: {
      padding: "60px 24px 40px",
      textAlign: "center",
    },
    improveTitle: {
      fontSize: "1.1rem",
      color: "rgba(255,255,255,0.5)",
      fontWeight: "600",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      marginBottom: "20px",
    },
    chipsWrapper: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      justifyContent: "center",
      maxWidth: "600px",
      margin: "0 auto",
    },
    chip: {
      padding: "10px 20px",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "100px",
      color: "rgba(255,255,255,0.85)",
      fontSize: "0.9rem",
      fontWeight: "600",
    },
    // SECTION
    section: {
      padding: "80px 24px",
      maxWidth: "1100px",
      margin: "0 auto",
    },
    sectionTag: {
      display: "inline-block",
      padding: "6px 16px",
      background: "rgba(34,160,130,0.15)",
      border: "1px solid rgba(34,160,130,0.4)",
      borderRadius: "100px",
      color: "#22A082",
      fontSize: "0.8rem",
      fontWeight: "700",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      marginBottom: "16px",
    },
    sectionTitle: {
      fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
      fontWeight: "900",
      lineHeight: 1.15,
      marginBottom: "16px",
    },
    sectionSub: {
      color: "rgba(255,255,255,0.65)",
      fontSize: "1.05rem",
      lineHeight: 1.7,
      maxWidth: "560px",
      marginBottom: "40px",
    },
    // STATS
    statsSection: {
      padding: "60px 24px",
      background: "linear-gradient(135deg, rgba(255,79,34,0.08), rgba(34,160,130,0.08))",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    },
    statsGrid: {
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      justifyContent: "center",
      maxWidth: "900px",
      margin: "0 auto",
    },
    // HABITS GRID
    habitsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "12px",
      marginBottom: "32px",
    },
    // ONBOARDING
    onboardingCard: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "20px",
      padding: "32px 24px",
      maxWidth: "480px",
      margin: "0 auto",
    },
    stepLabel: {
      fontSize: "0.8rem",
      color: "rgba(255,255,255,0.4)",
      fontWeight: "600",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      marginBottom: "12px",
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "10px",
      color: "#fff",
      fontSize: "1rem",
      outline: "none",
      marginBottom: "12px",
      boxSizing: "border-box",
    },
    stepDots: {
      display: "flex",
      gap: "8px",
      justifyContent: "center",
      marginBottom: "24px",
    },
    dot: (active) => ({
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: active ? "#FF4F22" : "rgba(255,255,255,0.2)",
      transition: "background 0.2s ease",
    }),
    primaryBtn: {
      width: "100%",
      padding: "16px",
      background: "linear-gradient(135deg, #FF4F22, #FF6B3D)",
      border: "none",
      borderRadius: "12px",
      color: "#fff",
      fontWeight: "800",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      boxShadow: "0 6px 24px rgba(255,79,34,0.35)",
    },
    secondaryBtn: {
      width: "100%",
      padding: "14px",
      background: "transparent",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: "12px",
      color: "rgba(255,255,255,0.7)",
      fontWeight: "600",
      fontSize: "0.95rem",
      cursor: "pointer",
      marginTop: "10px",
    },
    // TESTIMONIALS
    testimonialCard: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "20px",
      padding: "28px 24px",
      flex: "1 1 280px",
      maxWidth: "360px",
    },
    avatar: (initials) => ({
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #FF4F22, #22A082)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "800",
      fontSize: "0.9rem",
      flexShrink: 0,
    }),
    stars: {
      color: "#FFB800",
      fontSize: "1rem",
      marginBottom: "12px",
    },
    // HOW IT WORKS
    stepCard: {
      display: "flex",
      gap: "20px",
      alignItems: "flex-start",
      padding: "28px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "16px",
      flex: "1 1 260px",
      maxWidth: "320px",
    },
    stepNum: {
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #FF4F22, #FF6B3D)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "900",
      fontSize: "1.3rem",
      flexShrink: 0,
    },
    // PROGRESS DEMO
    progressDemo: {
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "20px",
      padding: "32px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
    },
    // FOOTER
    footer: {
      padding: "40px 24px",
      borderTop: "1px solid rgba(255,255,255,0.07)",
      textAlign: "center",
    },
    // SUCCESS TOAST
    toast: {
      position: "fixed",
      bottom: "32px",
      left: "50%",
      transform: showSuccess ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(120px)",
      background: "#22A082",
      color: "#fff",
      padding: "16px 28px",
      borderRadius: "14px",
      fontWeight: "700",
      fontSize: "0.95rem",
      zIndex: 9999,
      transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      boxShadow: "0 8px 32px rgba(34,160,130,0.5)",
      whiteSpace: "nowrap",
    },
  };

  const IMPROVE_ITEMS = ["Enfoque", "Claridad", "Confianza", "Energía", "Sueño", "Productividad", "Ánimo", "Creatividad", "Memoria", "Motivación"];
  const progress = selectedHabits.length > 0 ? Math.min((selectedHabits.length / 5) * 100, 100) : 0;

  return (
    <div style={s.root}>
      {/* ── NAVBAR ── */}
      <nav style={s.nav}>
        <div style={s.logo} onClick={() => scrollTo("inicio")}>Rutinas</div>

        {/* Desktop nav — hidden on small screens via inline media trick */}
        <div className="desktop-nav" style={s.desktopNav}>
          {navItems.map((item) => (
            <button
              key={item.id}
              style={{
                ...s.desktopNavItem,
                color: activeSection === item.id ? "#fff" : "rgba(255,255,255,0.7)",
                background: activeSection === item.id ? "rgba(255,255,255,0.08)" : "none",
              }}
              onClick={() => scrollTo(item.id)}
            >
              {item.label}
            </button>
          ))}
          {/* TODO: Replace href with real App Store / Play Store link */}
          <button
            style={s.ctaNavBtn}
            onClick={() => scrollTo("habitos")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(255,79,34,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Comenzar gratis
          </button>
        </div>

        {/* Burger */}
        <button style={s.burgerBtn} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
          <span style={s.burgerLine} />
          <span style={s.burgerLine} />
          <span style={s.burgerLine} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div style={s.mobileMenu}>
        {navItems.map((item) => (
          <button key={item.id} style={s.mobileNavItem} onClick={() => scrollTo(item.id)}>
            {item.label}
          </button>
        ))}
        <button
          style={{ ...s.primaryBtn, marginTop: "12px" }}
          onClick={() => scrollTo("habitos")}
        >
          Comenzar gratis
        </button>
      </div>

      {/* ── HERO ── */}
      <section id="inicio" style={s.hero}>
        <div style={s.heroGlow} />
        <div style={s.heroBadge}>
          <span>🚀</span>
          <span>La app definitiva de biohacking</span>
        </div>
        <h1 style={s.heroTitle}>
          Construye la{" "}
          <span style={s.heroAccent}>mejor versión</span>
          {" "}de ti mismo
        </h1>
        <p style={s.heroSub}>
          Responde unas preguntas, elige los hábitos que quieres mejorar y construye una rutina diaria que realmente funcione.
        </p>
        <button
          style={s.heroBtn}
          onClick={() => scrollTo("habitos")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.04)";
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(255,79,34,0.55)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 30px rgba(255,79,34,0.4)";
          }}
        >
          Mejora tus hábitos →
        </button>
        <p style={s.heroSubtext}>Gratis para empezar · Sin tarjeta requerida</p>

        {/* Phone mockup */}
        <div style={{
          marginTop: "56px",
          width: "220px",
          height: "400px",
          background: "linear-gradient(160deg, #1a1a2e, #16213e)",
          borderRadius: "36px",
          border: "2px solid rgba(255,255,255,0.12)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}>
          <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontWeight: "800", fontSize: "1rem", color: "#fff" }}>Buenos días 👋</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>Tu rutina de hoy</div>
          </div>
          {[
            { icon: "🧠", name: "Meditación", done: true },
            { icon: "💧", name: "Hidratación", done: true },
            { icon: "💪", name: "Ejercicio", done: false },
            { icon: "📚", name: "Lectura", done: false },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              opacity: item.done ? 1 : 0.65,
            }}>
              <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
              <span style={{ flex: 1, fontSize: "0.8rem", fontWeight: "600", color: "#fff", textDecoration: item.done ? "line-through" : "none" }}>
                {item.name}
              </span>
              {item.done && (
                <span style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: "#22A082",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.65rem", fontWeight: "800", color: "#fff",
                }}>✓</span>
              )}
            </div>
          ))}
          <div style={{
            margin: "16px auto 0",
            padding: "10px 24px",
            background: "linear-gradient(135deg, #FF4F22, #FF6B3D)",
            borderRadius: "10px",
            fontSize: "0.75rem",
            fontWeight: "800",
            color: "#fff",
          }}>
            Ver progreso
          </div>
        </div>
      </section>

      {/* ── IMPROVE ── */}
      <section style={s.improveSection}>
        <p style={s.improveTitle}>Mejora</p>
        <div style={s.chipsWrapper}>
          {IMPROVE_ITEMS.map((item) => (
            <div key={item} style={s.chip}>{item}</div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <div ref={statsRef} style={s.statsSection}>
        <div style={s.statsGrid}>
          {STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} animate={statsVisible} />
          ))}
        </div>
      </div>

      {/* ── CÓMO FUNCIONA ── */}
      <section id="programa" style={{ ...s.section, scrollMarginTop: "70px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={s.sectionTag}>Cómo funciona</div>
          <h2 style={s.sectionTitle}>
            Tu camino hacia una <span style={{ color: "#FF4F22" }}>mejor versión</span>
          </h2>
          <p style={{ ...s.sectionSub, margin: "0 auto 0" }}>
            Basado en ciencia de vanguardia para que veas resultados reales en menos de 30 días.
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
          {[
            { num: "1", title: "Responde preguntas", desc: "Cuéntanos sobre tus objetivos y estilo de vida para personalizar tu experiencia." },
            { num: "2", title: "Elige tus hábitos", desc: "Selecciona de más de 50 hábitos respaldados por la ciencia para tu rutina diaria." },
            { num: "3", title: "Sigue tu progreso", desc: "Visualiza tu evolución con métricas detalladas y celebra cada logro." },
          ].map((item) => (
            <div key={item.num} style={s.stepCard}>
              <div style={s.stepNum}>{item.num}</div>
              <div>
                <div style={{ fontWeight: "800", fontSize: "1.05rem", marginBottom: "8px" }}>{item.title}</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HÁBITOS ── */}
      <section id="habitos" style={{ background: "rgba(255,255,255,0.015)", scrollMarginTop: "70px" }}>
        <div style={s.section}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "48px", alignItems: "flex-start" }}>
            {/* Left: habit selector */}
            <div style={{ flex: "2 1 320px" }}>
              <div style={s.sectionTag}>Mejora tus hábitos</div>
              <h2 style={{ ...s.sectionTitle, marginBottom: "8px" }}>
                Elige los hábitos que quieres mejorar
              </h2>
              <p style={{ ...s.sectionSub, marginBottom: "28px" }}>
                Selecciona al menos 3 hábitos para comenzar tu rutina personalizada.
              </p>
              <div style={s.habitsGrid}>
                {HABITS.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    selected={selectedHabits.includes(habit.id)}
                    onToggle={toggleHabit}
                  />
                ))}
              </div>
              <button
                style={{
                  ...s.primaryBtn,
                  opacity: selectedHabits.length === 0 ? 0.5 : 1,
                  cursor: selectedHabits.length === 0 ? "not-allowed" : "pointer",
                }}
                onClick={handleStart}
                disabled={selectedHabits.length === 0}
              >
                {selectedHabits.length === 0
                  ? "Selecciona al menos un hábito"
                  : `Comenzar con ${selectedHabits.length} hábito${selectedHabits.length !== 1 ? "s" : ""} →`}
              </button>
            </div>

            {/* Right: progress visual */}
            <div style={{ flex: "1 1 260px", position: "sticky", top: "90px" }}>
              <div style={s.progressDemo}>
                <p style={{ fontWeight: "700", fontSize: "1rem", color: "rgba(255,255,255,0.8)", textAlign: "center" }}>
                  Tu rutina en progreso
                </p>
                <ProgressRing percent={progress} />
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", textAlign: "center" }}>
                  {selectedHabits.length === 0
                    ? "Selecciona hábitos para ver tu progreso"
                    : `${selectedHabits.length} de 5 hábitos recomendados`}
                </p>
                <div style={{ width: "100%" }}>
                  {selectedHabits.map((id) => {
                    const h = HABITS.find((x) => x.id === id);
                    return (
                      <div key={id} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 12px",
                        marginBottom: "8px",
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "10px",
                      }}>
                        <span style={{ fontSize: "1.2rem" }}>{h.icon}</span>
                        <span style={{ flex: 1, fontSize: "0.85rem", fontWeight: "600", color: "#fff" }}>{h.name}</span>
                        <span style={{ fontSize: "0.75rem", color: "#22A082", fontWeight: "700" }}>Activo</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ONBOARDING ── */}
      <section style={{ ...s.section, scrollMarginTop: "70px", textAlign: "center" }}>
        <div style={s.sectionTag}>Empieza hoy</div>
        <h2 style={{ ...s.sectionTitle, marginBottom: "8px" }}>
          Tu rutina personalizada en <span style={{ color: "#22A082" }}>3 minutos</span>
        </h2>
        <p style={{ ...s.sectionSub, margin: "0 auto 40px" }}>
          Responde unas preguntas rápidas y te ayudaremos a construir la rutina perfecta para ti.
        </p>

        <div style={s.onboardingCard}>
          {/* Step dots */}
          <div style={s.stepDots}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={s.dot(step >= n)} />
            ))}
          </div>

          {step === 1 && (
            <>
              <p style={s.stepLabel}>Paso 1 de 3</p>
              <h3 style={{ fontWeight: "800", fontSize: "1.2rem", marginBottom: "20px" }}>¿Cómo te llamas?</h3>
              <input
                style={s.input}
                placeholder="Tu nombre"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <button
                style={{ ...s.primaryBtn, opacity: userName.trim() ? 1 : 0.5 }}
                disabled={!userName.trim()}
                onClick={() => userName.trim() && setStep(2)}
              >
                Continuar →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p style={s.stepLabel}>Paso 2 de 3</p>
              <h3 style={{ fontWeight: "800", fontSize: "1.2rem", marginBottom: "20px" }}>
                Hola, {userName}. ¿Cuál es tu objetivo principal?
              </h3>
              {["Mejorar mi energía y productividad", "Reducir el estrés y ansiedad", "Mejorar mi salud física", "Aumentar mi claridad mental"].map((g) => (
                <button
                  key={g}
                  onClick={() => { setGoal(g); setStep(3); }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "14px 16px",
                    marginBottom: "10px",
                    background: goal === g ? "rgba(255,79,34,0.2)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${goal === g ? "#FF4F22" : "rgba(255,255,255,0.12)"}`,
                    borderRadius: "10px",
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  {g}
                </button>
              ))}
              <button style={s.secondaryBtn} onClick={() => setStep(1)}>← Volver</button>
            </>
          )}

          {step === 3 && (
            <>
              <p style={s.stepLabel}>Paso 3 de 3</p>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎉</div>
              <h3 style={{ fontWeight: "800", fontSize: "1.2rem", marginBottom: "12px" }}>
                ¡Tu rutina está lista, {userName}!
              </h3>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "24px", lineHeight: 1.6 }}>
                Basado en tu objetivo de <strong style={{ color: "#FF4F22" }}>{goal}</strong>, hemos preparado una rutina de hábitos personalizada para ti.
              </p>
              {/* TODO: Replace with real App Store / Play Store download links */}
              <button
                style={s.primaryBtn}
                onClick={() => { scrollTo("habitos"); setStep(1); setUserName(""); setGoal(""); }}
              >
                Ver mis hábitos →
              </button>
              <button style={s.secondaryBtn} onClick={() => setStep(1)}>Empezar de nuevo</button>
            </>
          )}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonios" style={{ background: "rgba(34,160,130,0.05)", scrollMarginTop: "70px" }}>
        <div style={s.section}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={s.sectionTag}>Testimonios</div>
            <h2 style={s.sectionTitle}>Lo que dicen nuestros usuarios</h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={s.testimonialCard}>
                <div style={s.stars}>★★★★★</div>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "20px" }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={s.avatar(t.avatar)}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "0.9rem" }}>{t.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{
        padding: "100px 24px",
        textAlign: "center",
        background: "radial-gradient(ellipse at bottom, rgba(255,79,34,0.12) 0%, transparent 70%)",
      }}>
        <h2 style={{ ...s.sectionTitle, marginBottom: "16px" }}>
          Empieza a <span style={{ color: "#FF4F22" }}>Mejorar tus hábitos</span> hoy
        </h2>
        <p style={{ ...s.sectionSub, margin: "0 auto 36px" }}>
          Únete a más de 50,000 personas que ya están construyendo mejores versiones de sí mismas con Rutinas.
        </p>
        {/* TODO: Add real store download badges/links here */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            style={{ ...s.heroBtn, margin: 0 }}
            onClick={() => scrollTo("habitos")}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            Comenzar gratis →
          </button>
          <button
            style={{
              padding: "18px 40px",
              background: "transparent",
              border: "2px solid rgba(255,255,255,0.2)",
              borderRadius: "14px",
              color: "#fff",
              fontWeight: "700",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onClick={() => scrollTo("programa")}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
          >
            Cómo funciona
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={s.footer}>
        <div style={{ fontSize: "1.4rem", fontWeight: "900", color: "#FF4F22", marginBottom: "16px" }}>Rutinas</div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", marginBottom: "20px" }}>
          Mejora tus hábitos · Construye la mejor versión de ti mismo
        </p>
        <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap", marginBottom: "24px" }}>
          {["Inicio", "Hábitos", "Programa", "Testimonios"].map((item) => (
            <span
              key={item}
              style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", cursor: "pointer" }}
              onClick={() => scrollTo(item.toLowerCase())}
            >
              {item}
            </span>
          ))}
        </div>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>
          © {new Date().getFullYear()} Rutinas. Todos los derechos reservados.
        </p>
      </footer>

      {/* ── TOAST ── */}
      <div style={s.toast}>
        ✓ ¡Hábitos guardados! Descarga la app para comenzar.
      </div>

      {/* ── INLINE MEDIA QUERIES via style tag ── */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
        @media (min-width: 769px) {
          .burger-btn { display: none !important; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0D0D1A; }
        ::-webkit-scrollbar-thumb { background: #FF4F22; border-radius: 3px; }
        input::placeholder { color: rgba(255,255,255,0.3); }
        input:focus { border-color: rgba(255,79,34,0.5) !important; box-shadow: 0 0 0 3px rgba(255,79,34,0.15); }
      `}</style>
    </div>
  );
}