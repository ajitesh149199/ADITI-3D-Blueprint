import React, { useState } from 'react';

/**
 * Slide 08 — Performance Monitoring
 * 
 * Holographic performance command center:
 * - Animated holographic SVG throughput & frame processing waveform
 * - Processing stages latency waterfall breakdown (< 45 ms real-time budget)
 * - 4 high-level telemetry KPI cards clearly marked as simulated edge profiles
 * - Transparent data integrity notice (simulated benchmarks, not physical hardware measurements)
 */
export function Slide08PerformanceMonitoring() {
  const [activeStage, setActiveStage] = useState(null);

  const waterfallStages = [
    { id: 0, name: 'Camera Frame Acquisition (Zero-Copy Buffer)', ms: 4.8, pct: 12.8, color: '#00f0ff', desc: 'Direct DMA-BUF memory transfer from optical module' },
    { id: 1, name: 'Lightweight Neural Inference (Quantized)', ms: 21.5, pct: 57.3, color: '#ff007f', desc: 'Edge bounding box & class proposal generation' },
    { id: 2, name: 'ToF Depth & IMU Spatial Fusion', ms: 5.2, pct: 13.9, color: '#8b5cf6', desc: '3D coordinate mapping and head-tilt compensation' },
    { id: 3, name: 'Relevance Engine & Trajectory Cone', ms: 3.9, pct: 10.4, color: '#00f0ff', desc: 'Forward vector calculation & Time-to-Collision estimation' },
    { id: 4, name: 'Suppression & Multimodal Dispatch', ms: 2.1, pct: 5.6, color: '#10b981', desc: 'Audio tone synthesis & haptic trigger modulation' }
  ];

  return (
    <div className="s8-command-center">
      {/* Scope Header Banner */}
      <div className="s8-header-strip">
        <div className="s8-header-left">
          <span className="s8-pulse-beacon"></span>
          <span>EDGE PERFORMANCE TELEMETRY: <strong>SOFTWARE SIMULATION PROFILE</strong></span>
        </div>
        <div className="s8-header-right">
          [ ARCHITECTURAL TARGET PROFILE • PROPOSED RASPBERRY PI ZERO 2 W HARDWARE ]
        </div>
      </div>

      {/* 4 KPI Telemetry Cards */}
      <div className="s8-kpi-grid">
        <div className="s8-kpi-card s8-kpi-cyan">
          <div className="s8-kpi-header">
            <span>PIPELINE LATENCY BUDGET</span>
            <span className="s8-kpi-badge">TARGET</span>
          </div>
          <div className="s8-kpi-value text-cyan">
            37.5 <span className="s8-kpi-unit">ms</span>
          </div>
          <div className="s8-kpi-sub">
            Allows ~26.6 FPS real-time processing under 45ms target budget
          </div>
        </div>

        <div className="s8-kpi-card s8-kpi-magenta">
          <div className="s8-kpi-header">
            <span>SIMULATED SUPPRESSION RATIO</span>
            <span className="s8-kpi-badge">FILTER</span>
          </div>
          <div className="s8-kpi-value text-magenta">
            ~78 <span className="s8-kpi-unit">%</span>
          </div>
          <div className="s8-kpi-sub">
            Suppresses parallel walls, distant pedestrians, and benign curbs
          </div>
        </div>

        <div className="s8-kpi-card s8-kpi-violet">
          <div className="s8-kpi-header">
            <span>TARGET COMPUTE LOAD</span>
            <span className="s8-kpi-badge">PROPOSED</span>
          </div>
          <div className="s8-kpi-value text-violet">
            ~65 <span className="s8-kpi-unit">%</span>
          </div>
          <div className="s8-kpi-sub">
            Projected envelope across Quad-Core Cortex-A53 cores
          </div>
        </div>

        <div className="s8-kpi-card s8-kpi-emerald">
          <div className="s8-kpi-header">
            <span>MEMORY WORKING SET</span>
            <span className="s8-kpi-badge">SIMULATED</span>
          </div>
          <div className="s8-kpi-value text-emerald">
            ~190 <span className="s8-kpi-unit">MB</span>
          </div>
          <div className="s8-kpi-sub">
            Engineered to fit comfortably within 512MB RAM ceiling
          </div>
        </div>
      </div>

      {/* Dominant Central Visual: Holographic Pipeline Latency Waterfall & Live Waveform */}
      <div className="s8-center-viz">
        <div className="s8-viz-header">
          <div className="s8-viz-title">
            <span>PROCESSING STAGES LATENCY WATERFALL (SIMULATED TOTAL: 37.5 ms)</span>
          </div>
          <div className="s8-viz-badge">
            HARDWARE REAL-TIME CEILING: &lt; 45 ms
          </div>
        </div>

        {/* Multi-segment Interactive Waterfall Bar */}
        <div className="s8-waterfall-bar">
          {waterfallStages.map((stage) => {
            const isHovered = activeStage === stage.id;
            return (
              <div
                key={stage.id}
                className="s8-bar-segment"
                style={{
                  width: `${stage.pct}%`,
                  background: stage.color,
                  boxShadow: isHovered ? `0 0 16px ${stage.color}` : `0 0 6px ${stage.color}40`,
                  opacity: activeStage !== null && !isHovered ? 0.45 : 1
                }}
                onMouseEnter={() => setActiveStage(stage.id)}
                onMouseLeave={() => setActiveStage(null)}
                title={`${stage.name}: ${stage.ms}ms (${stage.pct}%)`}
              />
            );
          })}
        </div>

        {/* Stage Legend & Metric Cards */}
        <div className="s8-legend-grid">
          {waterfallStages.map((stage) => {
            const isHovered = activeStage === stage.id;
            return (
              <div
                key={stage.id}
                className={`s8-legend-item ${isHovered ? 'active' : ''}`}
                onMouseEnter={() => setActiveStage(stage.id)}
                onMouseLeave={() => setActiveStage(null)}
              >
                <div className="s8-legend-dot" style={{ background: stage.color }} />
                <div className="s8-legend-info">
                  <div className="s8-legend-name">{stage.name}</div>
                  <div className="s8-legend-desc">{stage.desc}</div>
                </div>
                <div className="s8-legend-time" style={{ color: stage.color }}>
                  {stage.ms} ms
                </div>
              </div>
            );
          })}
        </div>

        {/* Animated Real-time Oscilloscope Telemetry Waveform */}
        <div className="s8-waveform-panel">
          <div className="s8-waveform-label">
            <span>SIMULATED CONTINUOUS FRAME CYCLE THROUGHPUT:</span>
            <span className="text-cyan">26.6 FPS NOMINAL</span>
          </div>

          <svg className="s8-waveform-svg" viewBox="0 0 900 60" preserveAspectRatio="none">
            <defs>
              <linearGradient id="s8WaveGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#ff007f" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="0" y1="15" x2="900" y2="15" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="30" x2="900" y2="30" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <line x1="0" y1="45" x2="900" y2="45" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />

            {/* Simulated Frame Pulse Path */}
            <path
              d="M 0,30 Q 75,10 150,30 T 300,30 T 450,12 T 600,30 T 750,48 T 900,30"
              fill="none"
              stroke="url(#s8WaveGrad)"
              strokeWidth="2"
            />

            {/* Sweeping scan beam */}
            <rect x="0" y="0" width="80" height="60" fill="url(#s8WaveGrad)" opacity="0.15">
              <animate
                attributeName="x"
                values="0;820;0"
                dur="4s"
                repeatCount="indefinite"
              />
            </rect>
          </svg>
        </div>
      </div>

      {/* Engineering Credibility Notice Footer */}
      <div className="s8-footer-notice">
        <span>⚠ DATA INTEGRITY NOTICE:</span> All performance figures reflect software simulation benchmarks on simulated edge architectures. Physical measurements on fabricated hardware prototypes will be established during Phase 2 physical bench testing.
      </div>
    </div>
  );
}

export default Slide08PerformanceMonitoring;
