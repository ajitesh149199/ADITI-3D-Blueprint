import React from 'react';

/**
 * Slide 01 — ADITI Introduction
 * 
 * Refined cinematic introduction featuring:
 * - A significantly larger, highly detailed holographic AI eye (2.5x - 3x visual presence)
 * - Cyan and magenta illuminated multi-layer iris with radial technical markings
 * - Concentric rotating precision gyro and azimuth telemetry rings
 * - Smooth, clearly visible biometric blinking and pupil dilation animations
 * - Dynamic scanning laser beam and subtle floating ambient particles
 * - Improved visual hierarchy with tight, balanced widescreen composition
 * - Fully editable React text and full reduced-motion accessibility support
 */
export function Slide01Introduction() {
  return (
    <div className="s1-container">
      {/* Primary Central Holographic AI Eye Interface */}
      <div className="s1-eye-stage" aria-label="Large holographic AI eye interface">
        <svg
          viewBox="0 0 640 360"
          className="s1-eye-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Holographic Neon Glow Filters */}
            <filter id="eyeCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur1" />
              <feGaussianBlur stdDeviation="9" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="eyeMagentaGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur1" />
              <feGaussianBlur stdDeviation="10" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="particleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Cyan to Magenta Holographic Gradient */}
            <linearGradient id="irisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ff007f" />
            </linearGradient>

            {/* Radial Core Glow */}
            <radialGradient id="pupilCoreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#8b5cf6" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#ff007f" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#040716" stopOpacity="0.95" />
            </radialGradient>

            {/* Iris Outer Ring Gradient */}
            <radialGradient id="irisRingGrad" cx="50%" cy="50%" r="50%">
              <stop offset="50%" stopColor="#050a1c" stopOpacity="0.2" />
              <stop offset="80%" stopColor="#ff007f" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.8" />
            </radialGradient>

            {/* Scanning Laser Beam Gradient */}
            <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
              <stop offset="25%" stopColor="#00f0ff" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="75%" stopColor="#ff007f" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ff007f" stopOpacity="0" />
            </linearGradient>

            {/* Laser Fan Gradient */}
            <linearGradient id="laserFanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </linearGradient>

            {/* Sclera Eyeball Contour Clip Path */}
            <clipPath id="eyeContourClip">
              <path d="M 80 180 C 160 55, 480 55, 560 180 C 480 305, 160 305, 80 180 Z" />
            </clipPath>
          </defs>

          {/* =================================================================
              LAYER 1: OUTER CONCENTRIC ROTATING HOLOGRAPHIC GYRO & AZIMUTH RINGS
              ================================================================= */}

          {/* Outermost Precision Azimuth Calibration Ring (40s Clockwise) */}
          <g className="s1-ring-rot-cw-slow" style={{ transformOrigin: '320px 180px' }}>
            <circle
              cx="320"
              cy="180"
              r="165"
              stroke="rgba(0, 240, 255, 0.22)"
              strokeWidth="1.2"
              strokeDasharray="4 6"
            />
            {/* Major Cardinal Coordinate Tick Marks */}
            <line x1="320" y1="10" x2="320" y2="22" stroke="#00f0ff" strokeWidth="2" filter="url(#eyeCyanGlow)" />
            <line x1="320" y1="338" x2="320" y2="350" stroke="#00f0ff" strokeWidth="2" filter="url(#eyeCyanGlow)" />
            <line x1="150" y1="180" x2="162" y2="180" stroke="#00f0ff" strokeWidth="2" filter="url(#eyeCyanGlow)" />
            <line x1="478" y1="180" x2="490" y2="180" stroke="#00f0ff" strokeWidth="2" filter="url(#eyeCyanGlow)" />

            {/* Minor Angle Radial Ticks at 30° intervals */}
            {[30, 60, 120, 150, 210, 240, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="320"
                y1="19"
                x2="320"
                y2="25"
                stroke="rgba(0, 240, 255, 0.45)"
                strokeWidth="1.2"
                transform={`rotate(${deg} 320 180)`}
              />
            ))}

            {/* Optical Bearing Telemetry Text */}
            <text x="320" y="8" fill="rgba(0, 240, 255, 0.6)" fontSize="8" fontFamily="monospace" textAnchor="middle">000°</text>
            <text x="498" y="183" fill="rgba(0, 240, 255, 0.6)" fontSize="8" fontFamily="monospace">090°</text>
            <text x="320" y="358" fill="rgba(0, 240, 255, 0.6)" fontSize="8" fontFamily="monospace" textAnchor="middle">180°</text>
            <text x="142" y="183" fill="rgba(0, 240, 255, 0.6)" fontSize="8" fontFamily="monospace" textAnchor="end">270°</text>
          </g>

          {/* Segmented Cyan Cyber Arc Ring (26s Counter-Clockwise) */}
          <g className="s1-ring-rot-ccw" style={{ transformOrigin: '320px 180px' }}>
            <circle
              cx="320"
              cy="180"
              r="148"
              stroke="#00f0ff"
              strokeWidth="2.2"
              strokeDasharray="45 15 25 20 85 30 15 20"
              opacity="0.65"
              filter="url(#eyeCyanGlow)"
            />
            {/* Outer Cyan Tracking Pips */}
            <circle cx="320" cy="32" r="3" fill="#00f0ff" filter="url(#eyeCyanGlow)" />
            <circle cx="320" cy="328" r="3" fill="#00f0ff" filter="url(#eyeCyanGlow)" />
          </g>

          {/* Electric Magenta Stepper Aperture Ring (18s Clockwise) */}
          <g className="s1-ring-rot-cw-fast" style={{ transformOrigin: '320px 180px' }}>
            <circle
              cx="320"
              cy="180"
              r="132"
              stroke="#ff007f"
              strokeWidth="1.8"
              strokeDasharray="6 8"
              opacity="0.75"
              filter="url(#eyeMagentaGlow)"
            />
            {/* Holographic Target Brackets [ ] at 45° angles */}
            <path d="M 226 86 L 220 86 L 220 92" stroke="#ff007f" strokeWidth="2" fill="none" />
            <path d="M 414 86 L 420 86 L 420 92" stroke="#ff007f" strokeWidth="2" fill="none" />
            <path d="M 226 274 L 220 274 L 220 268" stroke="#ff007f" strokeWidth="2" fill="none" />
            <path d="M 414 274 L 420 274 L 420 268" stroke="#ff007f" strokeWidth="2" fill="none" />
          </g>

          {/* Inner Violet Gyro Ring (13s Counter-Clockwise) */}
          <g className="s1-ring-rot-ccw-fast" style={{ transformOrigin: '320px 180px' }}>
            <circle
              cx="320"
              cy="180"
              r="116"
              stroke="#8b5cf6"
              strokeWidth="1.5"
              strokeDasharray="18 10 35 12"
              opacity="0.7"
            />
          </g>

          {/* =================================================================
              LAYER 2: HOLOGRAPHIC EYE STRUCTURE & APERTURE (SMOOTH BLINKING)
              ================================================================= */}
          <g className="s1-blinking-aperture" style={{ transformOrigin: '320px 180px' }}>
            {/* Background Sclera Fill with cyber mesh */}
            <path
              d="M 80 180 C 160 55, 480 55, 560 180 C 480 305, 160 305, 80 180 Z"
              fill="rgba(4, 9, 28, 0.85)"
              stroke="rgba(0, 240, 255, 0.25)"
              strokeWidth="1.5"
            />

            {/* Clipped Internal Structures (Iris, Pupil, Scanline, Grid) */}
            <g clipPath="url(#eyeContourClip)">
              {/* Internal Cyan Matrix Grid Overlay */}
              <g opacity="0.18">
                <line x1="80" y1="140" x2="560" y2="140" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="80" y1="180" x2="560" y2="180" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="80" y1="220" x2="560" y2="220" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="260" y1="50" x2="260" y2="310" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="320" y1="50" x2="320" y2="310" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="380" y1="50" x2="380" y2="310" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="3 3" />
              </g>

              {/* Lateral Optic Data Bus Circuits */}
              <g opacity="0.6">
                <path d="M 80 180 L 170 180 L 195 155 L 230 155" stroke="#00f0ff" strokeWidth="1.2" fill="none" />
                <circle cx="230" cy="155" r="2.5" fill="#00f0ff" />
                <path d="M 560 180 L 470 180 L 445 155 L 410 155" stroke="#ff007f" strokeWidth="1.2" fill="none" />
                <circle cx="410" cy="155" r="2.5" fill="#ff007f" />
                <path d="M 120 180 L 180 205 L 225 205" stroke="#8b5cf6" strokeWidth="1" fill="none" strokeDasharray="2 2" />
                <path d="M 520 180 L 460 205 L 415 205" stroke="#8b5cf6" strokeWidth="1" fill="none" strokeDasharray="2 2" />
              </g>

              {/* =============================================================
                  ILLUMINATED CYAN-MAGENTA IRIS (PRIMARY FOCAL POINT)
                  ============================================================= */}
              <g id="holo-iris">
                {/* Iris Outer Base Glow */}
                <circle
                  cx="320"
                  cy="180"
                  r="92"
                  fill="url(#irisRingGrad)"
                  stroke="rgba(0, 240, 255, 0.4)"
                  strokeWidth="1.5"
                />

                {/* Fine Radial Iris Rays (24 Technical Blades) */}
                <g className="s1-ring-rot-cw-slow" style={{ transformOrigin: '320px 180px' }} opacity="0.75">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const angle = i * 15;
                    const isMagenta = i % 2 === 1;
                    return (
                      <line
                        key={i}
                        x1="320"
                        y1="102"
                        x2="320"
                        y2="128"
                        stroke={isMagenta ? '#ff007f' : '#00f0ff'}
                        strokeWidth={i % 3 === 0 ? '2' : '1'}
                        transform={`rotate(${angle} 320 180)`}
                      />
                    );
                  })}
                </g>

                {/* Iris Middle Cyan / Magenta Radiant Ring */}
                <circle
                  cx="320"
                  cy="180"
                  r="68"
                  stroke="url(#irisGrad)"
                  strokeWidth="3.5"
                  fill="none"
                  filter="url(#eyeCyanGlow)"
                  strokeDasharray="16 6 8 6 32 8"
                />

                {/* Counter-rotating Inner Aperture Teeth */}
                <g className="s1-ring-rot-ccw-fast" style={{ transformOrigin: '320px 180px' }} opacity="0.8">
                  <circle
                    cx="320"
                    cy="180"
                    r="52"
                    stroke="#ff007f"
                    strokeWidth="1.8"
                    strokeDasharray="4 5"
                    filter="url(#eyeMagentaGlow)"
                  />
                  {/* Concentric Precision Reticle Crosshairs */}
                  <line x1="320" y1="134" x2="320" y2="148" stroke="#00f0ff" strokeWidth="1.5" />
                  <line x1="320" y1="212" x2="320" y2="226" stroke="#00f0ff" strokeWidth="1.5" />
                  <line x1="274" y1="180" x2="288" y2="180" stroke="#00f0ff" strokeWidth="1.5" />
                  <line x1="352" y1="180" x2="366" y2="180" stroke="#00f0ff" strokeWidth="1.5" />
                </g>

                {/* =============================================================
                    PUPIL WITH DYNAMIC DILATION & CORE SENSOR RETICLE
                    ============================================================= */}
                <g className="s1-pupil-dilation" style={{ transformOrigin: '320px 180px' }}>
                  {/* Deep Gradient Pupil Void */}
                  <circle
                    cx="320"
                    cy="180"
                    r="34"
                    fill="url(#pupilCoreGlow)"
                    stroke="#00f0ff"
                    strokeWidth="2"
                    filter="url(#eyeCyanGlow)"
                  />

                  {/* Inner Optical Core */}
                  <circle cx="320" cy="180" r="18" fill="#030613" stroke="#8b5cf6" strokeWidth="1.5" />
                  <circle cx="320" cy="180" r="8" fill="#00f0ff" filter="url(#eyeCyanGlow)" />
                  <circle cx="320" cy="180" r="3" fill="#ffffff" />

                  {/* High-Tech Pupil Crosshairs */}
                  <line x1="320" y1="166" x2="320" y2="194" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="306" y1="180" x2="334" y2="180" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1" strokeDasharray="2 2" />
                </g>
              </g>

              {/* =============================================================
                  SWEEPING LASER SCANLINE EFFECT
                  ============================================================= */}
              <g className="s1-scanning-beam">
                {/* Vertical Laser Beam Line */}
                <line x1="0" y1="50" x2="0" y2="310" stroke="url(#laserBeamGrad)" strokeWidth="2.5" filter="url(#eyeCyanGlow)" />
                {/* Trailing Laser Fan Glow */}
                <polygon points="-45,50 0,50 0,310 -45,310" fill="url(#laserFanGrad)" opacity="0.35" />
              </g>
            </g>

            {/* =============================================================
                ILLUMINATED HIGH-TECH EYELID EDGES (UPPER & LOWER ARCHES)
                ============================================================= */}
            {/* Upper Cyber Eyelid Arc */}
            <path
              d="M 80 180 C 160 55, 480 55, 560 180"
              stroke="#00f0ff"
              strokeWidth="3.2"
              fill="none"
              filter="url(#eyeCyanGlow)"
            />
            {/* Secondary Upper Precision Ridge */}
            <path
              d="M 110 170 C 180 75, 460 75, 530 170"
              stroke="rgba(0, 240, 255, 0.45)"
              strokeWidth="1.5"
              strokeDasharray="14 6"
              fill="none"
            />

            {/* Lower Cyber Eyelid Arc */}
            <path
              d="M 80 180 C 160 305, 480 305, 560 180"
              stroke="#ff007f"
              strokeWidth="3.2"
              fill="none"
              filter="url(#eyeMagentaGlow)"
            />
            {/* Secondary Lower Precision Ridge */}
            <path
              d="M 110 190 C 180 285, 460 285, 530 190"
              stroke="rgba(255, 0, 127, 0.45)"
              strokeWidth="1.5"
              strokeDasharray="14 6"
              fill="none"
            />

            {/* Lateral Corner Anchor Nodes with Active Status Beacons */}
            <circle cx="80" cy="180" r="5" fill="#00f0ff" filter="url(#eyeCyanGlow)" />
            <circle cx="80" cy="180" r="2" fill="#ffffff" />
            <circle cx="560" cy="180" r="5" fill="#ff007f" filter="url(#eyeMagentaGlow)" />
            <circle cx="560" cy="180" r="2" fill="#ffffff" />
          </g>

          {/* =================================================================
              LAYER 3: SUBTLE FLOATING HOLOGRAPHIC AMBIENT PARTICLES
              ================================================================= */}
          <g filter="url(#particleGlow)">
            <circle cx="160" cy="110" r="2" fill="#00f0ff" className="s1-particle s1-p1" />
            <circle cx="480" cy="115" r="2.2" fill="#ff007f" className="s1-particle s1-p2" />
            <circle cx="140" cy="245" r="1.8" fill="#8b5cf6" className="s1-particle s1-p3" />
            <circle cx="500" cy="240" r="2" fill="#00f0ff" className="s1-particle s1-p4" />
            <circle cx="210" cy="65" r="1.6" fill="#00f0ff" className="s1-particle s1-p5" />
            <circle cx="430" cy="295" r="1.8" fill="#ff007f" className="s1-particle s1-p6" />
          </g>
        </svg>
      </div>

      {/* Primary Bold Title */}
      <h1 className="s1-hero-title">ADITI</h1>

      {/* Expanded Project Name Acronym */}
      <div className="s1-hero-acronym">
        Artificially Driven Data, Information &amp; Tech Integration
      </div>

      {/* Short Technical Description */}
      <p className="s1-hero-desc">
        Next-generation assistive smart-glasses engineered for visually impaired navigation.
        Synthesizing high-speed edge computer vision, direct time-of-flight depth ranging, and real-time
        trajectory filtering to deliver intuitive, non-fatiguing spatial awareness.
      </p>

      {/* Supporting System Telemetry Strip */}
      <div className="s1-telemetry-strip">
        <div className="s1-telemetry-badge">
          <span style={{ color: 'var(--accent-cyan)' }}>●</span>
          <span>SYSTEM ARCHITECTURE: MULTIMODAL EDGE</span>
        </div>
        <div className="s1-telemetry-badge">
          <span style={{ color: 'var(--accent-violet)' }}>●</span>
          <span>PERCEPTION ENGINE: REAL-TIME INFERENCE</span>
        </div>
        <div className="s1-telemetry-badge">
          <span style={{ color: 'var(--accent-magenta)' }}>●</span>
          <span>OUTPUT DISPATCH: SPATIAL AUDIO &amp; HAPTICS</span>
        </div>
      </div>
    </div>
  );
}

export default Slide01Introduction;
