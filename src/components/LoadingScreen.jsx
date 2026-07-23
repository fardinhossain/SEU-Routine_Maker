export default function LoadingScreen({ leaving }) {
  return (
    <div
      className={`splash-root${leaving ? " splash-leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading SEU Routine Maker"
    >
      {/* Radial glow backdrop */}
      <div className="splash-glow-bg" />

      {/* Ambient particles */}
      <div className="splash-particles" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`splash-particle splash-particle-${i + 1}`} />
        ))}
      </div>

      {/* Center content */}
      <div className="splash-center">

        {/* Big Logo */}
        <div className="splash-logo-wrap">
          <img
            src="/icon/android-chrome-512x512.png"
            alt="SEU Routine Maker"
            className="splash-logo"
            draggable={false}
          />
          {/* Logo glow ring */}
          <div className="splash-logo-ring" />
        </div>

        {/* Wordmark */}
        <div className="splash-wordmark">
          <h1 className="splash-title">SEU Routine Maker</h1>
          <p className="splash-tagline">Your classes, finally in one clear view.</p>
        </div>

        {/* Progress bar */}
        <div className="splash-bar-track">
          <div className="splash-bar-fill" />
        </div>
      </div>
    </div>
  );
}
