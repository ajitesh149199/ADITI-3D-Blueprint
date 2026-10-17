import React from 'react';

/**
 * Slide 02 — The Problem: The Urban Overload Challenge
 * 
 * Demonstrates the critical challenge in assistive mobility:
 * Conventional computer vision identifies numerous environmental objects simultaneously.
 * Announcing every detection indiscriminately creates severe information overload,
 * causing cognitive fatigue and masking true hazards.
 * 
 * Features the real first-person street visualization (/assets/slide02-problem.png)
 * occupying 65-70% of the slide area with holographic HUD overlays, subtle scanlines,
 * and a restrained magenta warning pulse.
 */
export function Slide02TheProblem() {
  return (
    <div className="s2-grid">
      {/* Dominant First-Person Street Visualization (65-70% Width) */}
      <div className="s2-hud-scene" aria-label="First-person urban street view with object detection overlays">
        {/* Real 16:9 Cinematic Photographic Street Image */}
        <img
          src="/assets/slide02-problem.png"
          alt="First-person street view showing pedestrians, vehicles, cyan detection boxes, and a magenta planter hazard"
          className="s2-street-image"
          loading="eager"
        />

        {/* Animated Scanline Overlay */}
        <div className="s2-scanline-sweep" aria-hidden="true"></div>

        {/* Subtle Restrained Magenta Warning Glow Overlay around the hazard */}
        <div className="s2-magenta-hazard-glow" aria-hidden="true"></div>

        {/* Top HUD Telemetry Banner */}
        <div className="s2-hud-overlay-top">
          <div className="s2-hud-pill s2-hud-pill-cyan">
            <span className="s2-live-beacon"></span>
            <span>SIMULATED OPTICAL INPUT: 1080p @ 30 FPS</span>
          </div>
          <div className="s2-hud-pill s2-hud-pill-magenta">
            <span>HAZARD ALERT: IMMINENT PLANTER [1.8m]</span>
          </div>
        </div>

        {/* Corner Holographic Brackets */}
        <div className="s2-corner-bracket s2-bracket-tl" aria-hidden="true"></div>
        <div className="s2-corner-bracket s2-bracket-tr" aria-hidden="true"></div>
        <div className="s2-corner-bracket s2-bracket-bl" aria-hidden="true"></div>
        <div className="s2-corner-bracket s2-bracket-br" aria-hidden="true"></div>

        {/* Bottom HUD Telemetry Status */}
        <div className="s2-hud-overlay-bottom">
          <div className="s2-status-chip">
            <span style={{ color: 'var(--accent-cyan)' }}>◈ MULTI-OBJECT INGESTION:</span>
            <span> 14 ENTITIES BOUNDED IN SCENE</span>
          </div>
          <div className="s2-status-chip">
            <span style={{ color: 'var(--accent-magenta)' }}>⚠ PRIMARY COLLISION VECTOR:</span>
            <span> DIRECT PATHWAY OBSTRUCTION</span>
          </div>
        </div>
      </div>

      {/* Compact Engineering Explanation (30-35% Width) */}
      <div className="s2-problem-info">
        {/* Card 1: Multi-Object Detection Ingestion */}
        <div className="s2-card s2-card-cyan">
          <div className="s2-card-header">
            <span className="text-cyan">◈</span>
            <h4>Simultaneous Object Ingestion</h4>
          </div>
          <p className="s2-card-body">
            Conventional computer vision models may identify dozens of entities across a busy street
            simultaneously (pedestrians, parked bikes, cars, and utility poles).
          </p>
        </div>

        {/* Card 2: The Information Overload Dilemma */}
        <div className="s2-card s2-card-magenta">
          <div className="s2-card-header">
            <span className="text-magenta">⚠</span>
            <h4>The Information Overload Challenge</h4>
          </div>
          <p className="s2-card-body">
            Announcing every detected object indiscriminately creates overwhelming auditory clutter.
            Continuous alerts cause cognitive fatigue and can obscure immediate, genuine collision risks.
          </p>
        </div>

        {/* Card 3: ADITI Intelligent Prioritization & Suppression */}
        <div className="s2-card s2-card-violet">
          <div className="s2-card-header">
            <span className="text-violet">◈</span>
            <h4>Relevance &amp; Output Suppression</h4>
          </div>
          <p className="s2-card-body">
            ADITI evaluates user trajectory, closing velocity, and forward gaze to prioritize critical hazards
            (such as the highlighted planter box) while suppressing benign parallel ambient traffic.
          </p>
        </div>

        {/* Illustrative Telemetry Disclaimer Badge */}
        <div className="s2-disclaimer-box">
          <div className="s2-disclaimer-tag">
            [ SIMULATED DEMONSTRATION SCENARIO ]
          </div>
          <div className="s2-disclaimer-text">
            Context and collision risk govern feedback selection. High-priority warnings are reserved
            for true obstacles intersecting the user's immediate walking path.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Slide02TheProblem;
