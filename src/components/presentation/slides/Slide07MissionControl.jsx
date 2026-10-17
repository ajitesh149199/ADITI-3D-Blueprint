import React, { useState } from 'react';

/**
 * Slide 07 — Simulation & Mission Control
 * 
 * Cinematic first-person hazard-prioritization demonstration:
 * - Urban scene viewfinder using approved asset (/assets/slide_7.png)
 * - 4-stage interactive simulation states:
 *   1. Raw Detections (unfiltered computer vision)
 *   2. Relevance Filtering (trajectory & collision cone calculation)
 *   3. Priority Hazard (isolating imminent collision obstacle)
 *   4. Output Dispatch (selective 3D binaural audio & haptic burst)
 * - Clear simulation-mode labeling (no claims of live physical feed)
 * - Preserves functional "LAUNCH MISSION CONTROL" callback
 */
export function Slide07MissionControl({ onLaunchMissionControl }) {
  const [activeStep, setActiveStep] = useState(2); // Default to Priority Hazard

  const steps = [
    {
      id: 0,
      key: 'raw',
      title: '1. Raw Detections',
      sub: 'Conventional Computer Vision',
      badge: 'UNFILTERED INGESTION',
      accent: 'cyan',
      description: 'Identifies all visible objects in the field of view without evaluating whether they obstruct the user’s path.',
      counts: { total: '9 Detected', suppressed: '0 Suppressed', emitted: '9 Pending' },
      dispatch: 'In a conventional system, all 9 objects would trigger audio announcements, generating severe auditory fatigue.'
    },
    {
      id: 1,
      key: 'filter',
      title: '2. Relevance Filtering',
      sub: 'Spatial-Temporal Cone Check',
      badge: 'DYNAMIC MASKING',
      accent: 'violet',
      description: 'Projects the user’s walking trajectory against obstacle vectors. Stationary curbs, parallel buildings, and distant pedestrians are flagged as non-urgent.',
      counts: { total: '9 Detected', suppressed: '8 Muted (Benign)', emitted: '1 Evaluating' },
      dispatch: 'Relevance Engine determines whether closing velocity intersects the forward safety envelope.'
    },
    {
      id: 2,
      key: 'hazard',
      title: '3. Priority Hazard',
      sub: 'Collision Horizon Isolated',
      badge: 'CRITICAL OVERHANG HAZARD',
      accent: 'magenta',
      description: 'Isolates an immediate head-level obstacle (e.g., hanging construction bar / low awning at 1.7m) directly in the forward walking corridor.',
      counts: { total: '9 Detected', suppressed: '8 Suppressed', emitted: '1 Critical Hazard' },
      dispatch: 'Immediate collision danger identified within lookahead horizon. Alert override triggered.'
    },
    {
      id: 3,
      key: 'dispatch',
      title: '4. Output Dispatch',
      sub: 'Multimodal Spatial Cues',
      badge: 'SELECTIVE DISPATCH',
      accent: 'magenta',
      description: 'Dispatches targeted spatial cues: a high-urgency binaural acoustic chirp panned to center-high, paired with an immediate dual-temple haptic burst.',
      counts: { total: '9 Detected', suppressed: '8 Suppressed', emitted: 'Dispatched to User' },
      dispatch: 'Audio: 880 Hz binaural cue panned to obstacle azimuth. Haptics: High-frequency dual-temple pulse.'
    }
  ];

  const current = steps[activeStep];

  const handleLaunchClick = () => {
    if (onLaunchMissionControl) {
      onLaunchMissionControl({
        session: 'SIMULATION_MISSION_CONTROL',
        scenario: 'URBAN_SIDEWALK_HAZARD',
        step: current.key,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="s7-mission-grid">
      {/* Left Column: First-Person Urban Scene Viewfinder */}
      <div className="s7-hud-viewfinder">
        {/* Top Telemetry Overlay */}
        <div className="s7-telemetry-header">
          <span className="s7-telemetry-badge">
            <span className="s7-live-beacon"></span>
            MODE: <strong>SIMULATED SCENARIO EVALUATION</strong>
          </span>
          <span className="s7-sensor-feed">
            OPTICAL: IMX708_SIM • TOF: 1.6m • IMU: HEAD LEVEL
          </span>
        </div>

        {/* Viewfinder Main Image Stage */}
        <div className="s7-viewfinder-stage">
          <img
            src="/assets/slide_7.png"
            alt="ADITI Mission Control Simulation Viewfinder showing urban street detection"
            className="s7-viewfinder-img"
          />

          {/* Animated Ambient Holographic Scanline & HUD Brackets */}
          <div className="s7-scanline-sweep" aria-hidden="true"></div>
          <div className="s7-corner-bracket s7-bracket-tl" aria-hidden="true"></div>
          <div className="s7-corner-bracket s7-bracket-tr" aria-hidden="true"></div>
          <div className="s7-corner-bracket s7-bracket-bl" aria-hidden="true"></div>
          <div className="s7-corner-bracket s7-bracket-br" aria-hidden="true"></div>

          {/* Central Targeting Reticle */}
          <div className="s7-central-reticle">
            <div className="s7-reticle-circle"></div>
            <div className="s7-reticle-crosshair"></div>
          </div>

          {/* Dynamic Interactive Overlays according to Step */}
          {activeStep === 0 && (
            <div className="s7-overlay-boxes s7-raw-boxes">
              <div className="s7-box s7-box-cyan" style={{ top: '65%', left: '15%', width: '18%', height: '22%' }}>
                <span className="s7-box-tag">CURB [3.8m]</span>
              </div>
              <div className="s7-box s7-box-cyan" style={{ top: '45%', left: '72%', width: '14%', height: '35%' }}>
                <span className="s7-box-tag">PEDESTRIAN [7.2m]</span>
              </div>
              <div className="s7-box s7-box-cyan" style={{ top: '48%', left: '55%', width: '12%', height: '30%' }}>
                <span className="s7-box-tag">PEDESTRIAN [5.4m]</span>
              </div>
              <div className="s7-box s7-box-cyan" style={{ top: '22%', left: '35%', width: '32%', height: '24%' }}>
                <span className="s7-box-tag">OVERHEAD AWNING [1.6m]</span>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div className="s7-overlay-boxes s7-filtered-boxes">
              <div className="s7-box s7-box-dim" style={{ top: '65%', left: '15%', width: '18%', height: '22%' }}>
                <span className="s7-box-tag muted">CURB • MUTED</span>
              </div>
              <div className="s7-box s7-box-dim" style={{ top: '45%', left: '72%', width: '14%', height: '35%' }}>
                <span className="s7-box-tag muted">PASSING • MUTED</span>
              </div>
              <div className="s7-box s7-box-dim" style={{ top: '48%', left: '55%', width: '12%', height: '30%' }}>
                <span className="s7-box-tag muted">PARALLEL • MUTED</span>
              </div>
              <div className="s7-box s7-box-eval" style={{ top: '22%', left: '35%', width: '32%', height: '24%' }}>
                <span className="s7-box-tag violet">EVALUATING HAZARD CONE</span>
              </div>
            </div>
          )}

          {(activeStep === 2 || activeStep === 3) && (
            <div className="s7-overlay-boxes s7-hazard-boxes">
              <div className="s7-box s7-box-dim" style={{ top: '65%', left: '15%', width: '18%', height: '22%' }}>
                <span className="s7-box-tag muted">SUPPRESSED</span>
              </div>
              <div className="s7-box s7-box-dim" style={{ top: '45%', left: '72%', width: '14%', height: '35%' }}>
                <span className="s7-box-tag muted">SUPPRESSED</span>
              </div>
              {/* Critical Magenta Obstacle Box */}
              <div className="s7-box s7-box-magenta s7-hazard-pulse" style={{ top: '20%', left: '32%', width: '36%', height: '28%' }}>
                <div className="s7-hazard-banner">
                  <span>⚠ CRITICAL HEAD-LEVEL HAZARD</span>
                </div>
                <div className="s7-hazard-telemetry">
                  <div>OBSTACLE: LOW OVERHANG</div>
                  <div>DISTANCE: ~1.6 METERS</div>
                  <div className="text-magenta">TRAJECTORY: DIRECT INTERCEPT</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Viewfinder Bottom Status Bar */}
        <div className="s7-viewfinder-bottom">
          <div className="s7-status-item">
            <span>RAW OBJECTS:</span> <strong>{current.counts.total}</strong>
          </div>
          <div className="s7-status-item">
            <span>BENIGN MASKED:</span> <strong className="text-violet">{current.counts.suppressed}</strong>
          </div>
          <div className="s7-status-item">
            <span>ACTIONABLE CUE:</span> <strong className="text-magenta">{current.counts.emitted}</strong>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Step Controller & Decision Matrix */}
      <div className="s7-sidebar">
        {/* Step Selector Buttons */}
        <div>
          <div className="s7-sidebar-heading">SIMULATION STAGES (CLICK TO DEMO):</div>
          <div className="s7-step-buttons">
            {steps.map((st, idx) => {
              const isSelected = activeStep === idx;
              return (
                <button
                  key={st.id}
                  type="button"
                  className={`s7-step-btn ${isSelected ? `active active-${st.accent}` : ''}`}
                  onClick={() => setActiveStep(idx)}
                >
                  <span className="s7-btn-dot">◈</span>
                  <span>{st.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Step Explanation Card */}
        <div className="s7-decision-card">
          <div className="s7-card-top">
            <span className={`s7-step-tag tag-${current.accent}`}>{current.badge}</span>
            <span className="s7-step-sub">{current.sub}</span>
          </div>

          <p className="s7-step-desc">{current.description}</p>

          <div className="s7-dispatch-box">
            <div className="s7-dispatch-label">DISPATCH DECISION:</div>
            <div className="s7-dispatch-text">{current.dispatch}</div>
          </div>

          {/* Launch Mission Control Button */}
          <button
            type="button"
            className="hud-btn hud-btn-magenta s7-launch-btn"
            onClick={handleLaunchClick}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>LAUNCH MISSION CONTROL</span>
          </button>

          <div className="s7-sim-disclaimer">
            Note: Dispatches simulated session to the interactive ADITI Mission Control simulator room.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Slide07MissionControl;
