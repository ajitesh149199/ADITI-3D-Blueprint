import React, { useState } from 'react';

/**
 * Slide 04 — Software Processing Pipeline
 * 
 * Interactive holographic data-processing pipeline featuring:
 * - 6 interactive architectural nodes:
 *   1. Sensor Inputs
 *   2. Fusion Engine
 *   3. Context Manager
 *   4. Relevance Engine
 *   5. Suppression Engine
 *   6. Output Manager
 * - Animated SVG data-flow paths with traveling particles
 * - Detailed input/processing/output drill-down panel
 * - Seamless toggle between Interactive Pipeline Flow and Architecture Blueprint (/assets/slide_04.png)
 * - Grounded, credible engineering specifications (simulated benchmarks)
 */
export function Slide04SoftwareArchitecture() {
  const [activeStage, setActiveStage] = useState(3); // Default to Relevance Engine
  const [viewMode, setViewMode] = useState('pipeline'); // 'pipeline' | 'diagram'

  const stages = [
    {
      id: 0,
      name: 'Sensor Inputs',
      sub: 'Multi-Modal Ingestion',
      accent: 'cyan',
      tag: 'STAGE 01',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M3 12h3m12 0h3M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1" />
        </svg>
      ),
      summary: 'Asynchronous multi-rate sensor ingestion receiving optical camera frames, 1D metric LiDAR distance rays, and 6-DOF IMU head-tilt vectors.',
      input: 'RGB camera frame buffers, VL53L1X range pulses (I2C), IMU angular rates & linear acceleration.',
      processing: 'Frame buffer timestamping, noise thresholding, and packaging into synchronized raw sensor packets.',
      output: 'Synchronized multi-sensor telemetry frame ready for spatial-temporal fusion.',
      role: 'Hardware Abstraction & Multi-Rate Ingestion',
      spec: 'Simulated throughput: 30 FPS visual stream + 50 Hz ToF distance ray + 100 Hz IMU telemetry'
    },
    {
      id: 1,
      name: 'Fusion Engine',
      sub: 'Spatial-Temporal Alignment',
      accent: 'violet',
      tag: 'STAGE 02',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      ),
      summary: 'Projects 2D optical bounding detections into a metric 3D coordinate frame and compensates for wearer walking bounce and head tilts.',
      input: '2D optical bounding centroids + 1D ToF metric distance reading + IMU quaternion orientation.',
      processing: 'Timestamp synchronization, coordinate reprojection into wearer-centric Cartesian space (X, Y, Z).',
      output: 'Unified 3D metric spatial model with estimated target distances and heights.',
      role: 'Cross-Sensor Spatial Coordinate Mapping',
      spec: 'Target fusion pipeline latency: < 8.0 ms in software simulation'
    },
    {
      id: 2,
      name: 'Context Manager',
      sub: 'Dynamic Scene Model',
      accent: 'cyan',
      tag: 'STAGE 03',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      ),
      summary: 'Maintains an environmental state machine to adjust sensitivity thresholds based on whether the user is in a quiet corridor, sidewalk, or crossing.',
      input: 'Wearer movement velocity, macro GPS location, and ambient scene density indicators.',
      processing: 'Classifies current operational mode (e.g., Indoor Corridor, Open Sidewalk, Crosswalk, Staircase).',
      output: 'Dynamic safety envelope radius and adaptive alert sensitivity threshold parameters.',
      role: 'Environmental Mode & Operational Envelope Selection',
      spec: 'Adaptive safety buffer: 1.5m (crowded) to 4.0m (open brisk walking)'
    },
    {
      id: 3,
      name: 'Relevance Engine',
      sub: 'Trajectory & Collision Cone',
      accent: 'magenta',
      tag: 'STAGE 04',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" />
          <path d="M8 3h8" />
        </svg>
      ),
      summary: 'Projects the user’s forward trajectory against detected obstacle positions to isolate immediate collision hazards from benign background items.',
      input: 'Unified 3D obstacle list + user walking speed and heading vector.',
      processing: 'Computes estimated Time-To-Collision (TTC) and checks if obstacle intersects the forward hazard cone (±25° azimuth, head/chest plane).',
      output: 'Prioritized hazard queue ranked by collision severity and urgency.',
      role: 'Hazard Prioritization & Collision Horizon Modeling',
      spec: 'Simulated TTC trigger window: 1.0s to 2.5s lookahead horizon'
    },
    {
      id: 4,
      name: 'Suppression Engine',
      sub: 'Cognitive Load Gatekeeper',
      accent: 'violet',
      tag: 'STAGE 05',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
      summary: 'Filters out benign non-trajectory objects (distant passersby, parallel fences, ground curbs) to eliminate cognitive overwhelm and alert fatigue.',
      input: 'Prioritized hazard queue and recent alert history log.',
      processing: 'Applies hysteresis hold-off, cooldown timers, and suppression masks for stationary lateral objects.',
      output: 'Filtered alert stream containing only urgent, actionable warnings.',
      role: 'Alert Fatigue Mitigation & Benign Suppression',
      spec: 'Simulated suppression target: Filters 75–85% of benign non-path objects'
    },
    {
      id: 5,
      name: 'Output Manager',
      sub: 'Selective Multimodal Dispatch',
      accent: 'cyan',
      tag: 'STAGE 06',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      ),
      summary: 'Translates validated urgent alerts into directional 3D binaural audio chimes and bilateral temple haptic vibration cues.',
      input: 'Filtered critical hazard with azimuth, elevation, and collision urgency index.',
      processing: 'Calculates binaural HRTF audio panning azimuth and maps urgency to haptic vibration pulses.',
      output: 'Synchronized stereo bone-conduction audio waveform and DRV2605L haptic actuator trigger signals.',
      role: 'Non-Intrusive Spatial Audio & Tactile Cue Synthesis',
      spec: 'Dispatch response budget: < 4.0 ms from filter decision to peripheral trigger'
    }
  ];

  const current = stages[activeStage];

  return (
    <div className="s4-pipeline-container">
      {/* Top Controls: Mode Switcher & Pipeline Status */}
      <div className="s4-top-bar">
        <div className="s4-telemetry-badge">
          <span className="s4-pulse-dot"></span>
          <span>PIPELINE ARCHITECTURE: 6-NODE INTELLIGENT EDGE FLOW</span>
        </div>

        <div className="s4-view-switcher">
          <button
            type="button"
            className={`s4-mode-btn ${viewMode === 'pipeline' ? 'active' : ''}`}
            onClick={() => setViewMode('pipeline')}
          >
            <span>◈ Interactive Pipeline Flow</span>
          </button>
          <button
            type="button"
            className={`s4-mode-btn ${viewMode === 'diagram' ? 'active' : ''}`}
            onClick={() => setViewMode('diagram')}
          >
            <span>▤ Architecture Blueprint</span>
          </button>
        </div>
      </div>

      {viewMode === 'pipeline' ? (
        <>
          {/* 6-Node Holographic Interactive Pipeline */}
          <div className="s4-flow-stage">
            {/* Animated SVG Data Connection Lines & Particles */}
            <svg className="s4-flow-svg" viewBox="0 0 1100 80" preserveAspectRatio="none">
              <defs>
                <linearGradient id="s4PathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#ff007f" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Base Backbone Path */}
              <line x1="80" y1="40" x2="1020" y2="40" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="80" y1="40" x2="1020" y2="40" stroke="url(#s4PathGrad)" strokeWidth="2" />

              {/* Traveling Holographic Data Particles */}
              <circle r="4" fill="#00f0ff" filter="drop-shadow(0 0 6px #00f0ff)">
                <animateMotion
                  path="M 80,40 L 1020,40"
                  dur="3.2s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="3" fill="#ff007f" filter="drop-shadow(0 0 6px #ff007f)">
                <animateMotion
                  path="M 80,40 L 1020,40"
                  dur="3.2s"
                  begin="-1.1s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="3.5" fill="#8b5cf6" filter="drop-shadow(0 0 6px #8b5cf6)">
                <animateMotion
                  path="M 80,40 L 1020,40"
                  dur="3.2s"
                  begin="-2.2s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>

            {/* 6 Interactive Stage Nodes */}
            <div className="s4-pipeline-nodes">
              {stages.map((stage, idx) => {
                const isSelected = activeStage === idx;
                const isMagenta = stage.accent === 'magenta';
                const isViolet = stage.accent === 'violet';
                return (
                  <div
                    key={stage.id}
                    className={`s4-node-card ${isSelected ? (isMagenta ? 'active-magenta' : (isViolet ? 'active-violet' : 'active-cyan')) : ''}`}
                    onClick={() => setActiveStage(idx)}
                  >
                    <div className="s4-node-icon" style={{
                      color: isSelected
                        ? (isMagenta ? 'var(--accent-magenta)' : (isViolet ? 'var(--accent-violet)' : 'var(--accent-cyan)'))
                        : 'var(--text-muted)'
                    }}>
                      {stage.icon}
                    </div>

                    <div className="s4-node-tag" style={{
                      color: isMagenta ? 'var(--accent-magenta)' : (isViolet ? 'var(--accent-violet)' : 'var(--accent-cyan)')
                    }}>
                      {stage.tag}
                    </div>

                    <div className="s4-node-name">{stage.name}</div>
                    <div className="s4-node-sub">{stage.sub}</div>

                    <div className="s4-node-pinpoint">
                      <span className="s4-pinpoint-dot"></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deep-Dive Inspection Panel for Selected Stage */}
          <div className="s4-detail-panel">
            <div className="s4-detail-left">
              <div className="s4-detail-badge" style={{
                color: current.accent === 'magenta' ? 'var(--accent-magenta)' : (current.accent === 'violet' ? 'var(--accent-violet)' : 'var(--accent-cyan)'),
                borderColor: current.accent === 'magenta' ? 'rgba(255,0,127,0.3)' : (current.accent === 'violet' ? 'rgba(139,92,246,0.3)' : 'rgba(0,240,255,0.3)')
              }}>
                {current.tag} • ARCHITECTURAL SUBSYSTEM
              </div>

              <h3 className="s4-detail-title">{current.name}</h3>
              <div className="s4-detail-role">{current.role}</div>

              <p className="s4-detail-summary">{current.summary}</p>

              <div className="s4-detail-spec">
                <span className="s4-spec-bullet">★</span>
                <span>{current.spec}</span>
              </div>
            </div>

            <div className="s4-detail-right">
              <div className="s4-io-card">
                <div className="s4-io-label" style={{ color: 'var(--accent-cyan)' }}>
                  ▶ INPUT STREAM
                </div>
                <div className="s4-io-text">{current.input}</div>
              </div>

              <div className="s4-io-card">
                <div className="s4-io-label" style={{ color: 'var(--accent-violet)' }}>
                  ⚙ PROCESSING RESPONSIBILITY
                </div>
                <div className="s4-io-text">{current.processing}</div>
              </div>

              <div className="s4-io-card">
                <div className="s4-io-label" style={{ color: current.accent === 'magenta' ? 'var(--accent-magenta)' : 'var(--accent-cyan)' }}>
                  ◀ OUTPUT TO NEXT ENGINE
                </div>
                <div className="s4-io-text">{current.output}</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Architecture Blueprint Image View */
        <div className="s4-diagram-viewport">
          <img
            src="/assets/slide_04.png"
            alt="ADITI Software Processing Pipeline Blueprint Diagram"
            className="s4-diagram-image"
          />
          <div className="s4-diagram-overlay">
            <div className="s4-diagram-badge">
              <span>● SYSTEM ARCHITECTURE INFOGRAPHIC — 6-STAGE EDGE FUSION</span>
            </div>
            <div className="s4-diagram-caption">
              Displays end-to-end data transformation from raw sensors to selective spatial cues.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Slide04SoftwareArchitecture;
