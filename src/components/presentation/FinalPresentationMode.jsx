
import { useState } from "react";

import HolographicStartup from "./HolographicStartup";
import PresentationDeck from "./PresentationDeck";
import BackgroundEffects from "./BackgroundEffects";

export default function FinalPresentationMode({
  onClose,
  onLaunchDashboard,
}) {
  const [startupComplete, setStartupComplete] = useState(false);

  async function exitFullscreenIfNeeded() {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (error) {
        console.warn("Unable to exit fullscreen:", error);
      }
    }
  }

  async function closePresentation() {
    await exitFullscreenIfNeeded();
    onClose?.();
  }

  async function launchDashboard(destination) {
    await exitFullscreenIfNeeded();
    onLaunchDashboard?.(destination);
  }

  if (!startupComplete) {
    return (
      <HolographicStartup
        onComplete={() => setStartupComplete(true)}
      />
    );
  }

  return (
    <div
      className="aditi-integrated-presentation"
      role="dialog"
      aria-modal="true"
      aria-label="ADITI Final Project Presentation"
    >
      <style>{`
        /* ========================================
           ADITI PRESENTATION — ISOLATED THEME
           ======================================== */

        .aditi-integrated-presentation {
          --bg-dark-base: #030611;
          --bg-dark-surface: #070d22;
          --bg-dark-card: rgba(10, 16, 38, 0.78);
          --bg-dark-card-hover: rgba(18, 28, 64, 0.88);
          --bg-glass-overlay: rgba(5, 9, 24, 0.65);

          --accent-cyan: #00f0ff;
          --accent-cyan-rgb: 0, 240, 255;

          --accent-magenta: #ff007f;
          --accent-magenta-rgb: 255, 0, 127;

          --accent-violet: #8b5cf6;
          --accent-violet-rgb: 139, 92, 246;

          --accent-amber: #f59e0b;
          --accent-emerald: #10b981;

          --text-primary: #f8fafc;
          --text-secondary: #94a3b8;
          --text-muted: #64748b;
          --text-dim: #475569;

          --border-subtle: rgba(255, 255, 255, 0.08);
          --border-cyan: rgba(0, 240, 255, 0.35);
          --border-magenta: rgba(255, 0, 127, 0.35);
          --border-violet: rgba(139, 92, 246, 0.35);

          --font-heading: 'Orbitron', sans-serif;
          --font-body: 'Plus Jakarta Sans', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;

          --shadow-neon-cyan:
            0 0 20px rgba(0, 240, 255, 0.3);

          --shadow-neon-magenta:
            0 0 20px rgba(255, 0, 127, 0.3);

          --shadow-neon-violet:
            0 0 20px rgba(139, 92, 246, 0.3);

          /* Fullscreen overlay */

          position: fixed;
          inset: 0;
          z-index: 9999;

          width: 100vw;
          height: 100vh;
          height: 100dvh;

          display: flex;
          flex-direction: column;

          min-width: 0;
          min-height: 0;

          overflow: hidden;
          background: var(--bg-dark-base);
          color: var(--text-primary);

          font-family: var(--font-body);

          isolation: isolate;
        }

        /* ========================================
           PRESENTATION ROOT
           ======================================== */

        .aditi-integrated-presentation
        > .presentation-root {
          position: relative;
          z-index: 1;

          width: 100%;
          height: 100%;

          min-width: 0;
          min-height: 0;

          flex: 1 1 auto;
          display: flex;
          flex-direction: column;

          overflow: hidden;
        }

        /* ========================================
           PRESENTATION VIEWPORT
           ======================================== */

        .aditi-integrated-presentation
        .slide-viewport {
          flex: 1 1 auto;

          width: 100%;
          min-width: 0;
          min-height: 0;

          overflow-x: hidden;
          overflow-y: auto;

          overscroll-behavior: contain;
        }

        /* ========================================
           SLIDE CONTENT CONTAINERS
           ======================================== */

        .aditi-integrated-presentation
        .slide-content-wrapper {
          width: 100%;
          max-width: 1400px;

          min-width: 0;
          min-height: 100%;

          position: relative;
        }

        .aditi-integrated-presentation
        .slide-component-host {
          width: 100%;

          min-width: 0;
          max-width: 100%;
          min-height: 0;

          position: relative;
        }

        /* ========================================
           PRESENTATION TYPOGRAPHY
           ======================================== */

        .aditi-integrated-presentation
        .slide-title-wrap h2 {
          font-family: var(--font-heading);

          background:
            linear-gradient(
              135deg,
              #ffffff 40%,
              var(--accent-cyan) 85%
            );

          -webkit-background-clip: text;
          background-clip: text;

          -webkit-text-fill-color: transparent;

          color: var(--text-primary);
        }

        /* Preserve original heading styles
           while preventing dashboard font
           inheritance from changing the deck. */

        .aditi-integrated-presentation
        .presentation-root {
          font-family: var(--font-body);
          color: var(--text-primary);
        }

        /* ========================================
           BACKGROUND LAYER
           ======================================== */

        .aditi-integrated-presentation
        .futuristic-background {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;

          background:
            radial-gradient(
              circle at 10% 15%,
              rgba(0, 240, 255, 0.12),
              transparent 45%
            ),
            radial-gradient(
              circle at 90% 20%,
              rgba(139, 92, 246, 0.13),
              transparent 50%
            ),
            radial-gradient(
              circle at 50% 85%,
              rgba(255, 0, 127, 0.10),
              transparent 55%
            ),
            linear-gradient(
              180deg,
              #030611 0%,
              #070c22 50%,
              #02040b 100%
            );
        }

        /* ========================================
           RESPONSIVE SAFETY
           ======================================== */

        @media (max-width: 800px) {
          .aditi-integrated-presentation
          .slide-viewport {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }

          .aditi-integrated-presentation
          .slide-content-wrapper {
            max-width: 100%;
          }
        }
      `}</style>

      <BackgroundEffects />

      <PresentationDeck
        isEmbedded={true}
        onClose={closePresentation}
        onFinish={closePresentation}
        onLaunchExplorer={() =>
          launchDashboard("explorer")
        }
        onLaunchMissionControl={() =>
          launchDashboard("mission")
        }
      />
    </div>
  );
}
