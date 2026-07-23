const KEYFRAMES = `
  @keyframes _spl_fade_in  { from{opacity:0} to{opacity:1} }
  @keyframes _spl_logo_in  { 0%{opacity:0;transform:scale(.6) translateY(28px)} 55%{transform:scale(1.06) translateY(-4px)} 78%{transform:scale(.97) translateY(1px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes _spl_ring     { 0%{opacity:0;transform:scale(.4)} 55%{opacity:.65;transform:scale(1.14)} 100%{opacity:0;transform:scale(1.6)} }
  @keyframes _spl_title_in { 0%{opacity:0;transform:translateY(24px)} 100%{opacity:1;transform:translateY(0)} }
  @keyframes _spl_tag_in   { 0%{opacity:0;transform:translateY(16px)} 100%{opacity:1;transform:translateY(0)} }
  @keyframes _spl_bar      { 0%{transform:scaleX(0)} 100%{transform:scaleX(1)} }
  @keyframes _spl_glow     { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:.9;transform:scale(1.18)} }
  @keyframes _spl_particle { 0%{opacity:0;transform:translate(0,0) scale(1)} 20%{opacity:.7} 80%{opacity:.35} 100%{opacity:0;transform:translate(var(--ptx),var(--pty)) scale(.3)} }
`;

const PARTICLES = [
  { size: 5, top: "34%", left: "37%", tx: "-55px", ty: "-95px", dur: "3.8s", delay: "0.3s" },
  { size: 3, top: "54%", left: "61%", tx:  "70px", ty: "-80px", dur: "4.3s", delay: "0.8s" },
  { size: 6, top: "63%", left: "43%", tx: "-42px", ty: "-115px",dur: "3.5s", delay: "1.4s" },
  { size: 4, top: "39%", left: "64%", tx:  "58px", ty: "-98px", dur: "4.7s", delay: "0.6s" },
  { size: 3, top: "71%", left: "35%", tx: "-30px", ty: "-125px",dur: "5.0s", delay: "1.2s" },
  { size: 5, top: "47%", left: "67%", tx:  "44px", ty: "-72px", dur: "3.9s", delay: "1.7s" },
];

export default function LoadingScreen({ leaving }) {
  return (
    <>
      <style>{KEYFRAMES}</style>

      {/* Full-screen fixed overlay */}
      <div
        role="status"
        aria-live="polite"
        aria-label="Loading SEU Routine Maker"
        style={{
          position:       "fixed",
          inset:          0,
          zIndex:         9999,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          background:     "#000000",
          overflow:       "hidden",
          transition:     "opacity 0.65s cubic-bezier(0.4,0,0.2,1)",
          opacity:        leaving ? 0 : 1,
          pointerEvents:  leaving ? "none" : "auto",
        }}
      >
        {/* Ambient radial glow */}
        <div style={{
          position:   "absolute",
          inset:      0,
          background: "radial-gradient(ellipse 65% 52% at 50% 44%, rgba(225,220,201,.15) 0%, rgba(31,21,12,.65) 55%, transparent 100%)",
          animation:  "_spl_glow 3.6s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        {/* Floating particles */}
        {PARTICLES.map((p, i) => (
          <div key={i} style={{
            position:          "absolute",
            width:             p.size,
            height:            p.size,
            top:               p.top,
            left:              p.left,
            borderRadius:      "50%",
            background:        "rgba(225,220,201,.6)",
            "--ptx":           p.tx,
            "--pty":           p.ty,
            animation:         `_spl_particle ${p.dur} ${p.delay} linear infinite`,
            pointerEvents:     "none",
          }} />
        ))}

        {/* ── Center stack ── */}
        <div style={{
          position:      "relative",
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          textAlign:     "center",
          padding:       "0 1.5rem",
          gap:           0,
        }}>

          {/* Logo */}
          <div style={{
            position:    "relative",
            width:       "clamp(120px, 28vw, 180px)",
            height:      "clamp(120px, 28vw, 180px)",
            marginBottom:"clamp(1.4rem, 4vw, 2.2rem)",
            animation:   "_spl_logo_in 0.95s cubic-bezier(.22,1,.36,1) both",
          }}>
            <img
              src="/icon/android-chrome-512x512.png"
              alt="SEU Routine Maker"
              draggable={false}
              fetchPriority="high"
              loading="eager"
              decoding="sync"
              style={{
                width:        "100%",
                height:       "100%",
                borderRadius: "clamp(20px, 5vw, 34px)",
                objectFit:    "cover",
                display:      "block",
                boxShadow:    "0 0 0 1.5px rgba(225,220,201,.25), 0 16px 64px rgba(0,0,0,.75), 0 0 90px rgba(225,220,201,.14)",
              }}
            />
            {/* Ring burst */}
            <div style={{
              position:     "absolute",
              inset:        "-20px",
              borderRadius: "clamp(28px, 6vw, 46px)",
              border:       "1.5px solid rgba(225,220,201,.4)",
              animation:    "_spl_ring 1.15s 0.12s cubic-bezier(.2,.8,.2,1) both",
              pointerEvents:"none",
            }} />
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily:    "'Libre Baskerville', Georgia, serif",
            fontSize:      "clamp(1.6rem, 5.5vw, 3rem)",
            fontWeight:    700,
            color:         "#ffffff",
            letterSpacing: "-0.025em",
            lineHeight:    1.1,
            margin:        0,
            animation:     "_spl_title_in 0.85s 0.3s cubic-bezier(.22,1,.36,1) both",
          }}>
            SEU Routine Maker
          </h1>

          {/* Tagline */}
          <p style={{
            fontSize:   "clamp(.8rem, 2.1vw, 1rem)",
            color:      "rgba(199,191,208,.72)",
            margin:     "0.6rem 0 0",
            animation:  "_spl_tag_in 0.8s 0.55s cubic-bezier(.22,1,.36,1) both",
          }}>
            Your classes, finally in one clear view.
          </p>

          {/* Progress bar */}
          <div style={{
            marginTop:    "clamp(2rem, 5vw, 2.8rem)",
            width:        "clamp(200px, 55vw, 280px)",
            height:       "3px",
            borderRadius: "9px",
            background:   "rgba(225,220,201,.1)",
            overflow:     "hidden",
          }}>
            <div style={{
              height:          "100%",
              borderRadius:    "9px",
              transformOrigin: "left",
              background:      "linear-gradient(90deg, rgba(225,220,201,.35), #E1DCC9)",
              boxShadow:       "0 0 10px rgba(225,220,201,.45)",
              animation:       "_spl_bar 2.4s 0.15s cubic-bezier(.4,0,.2,1) both",
            }} />
          </div>
        </div>
      </div>
    </>
  );
}
