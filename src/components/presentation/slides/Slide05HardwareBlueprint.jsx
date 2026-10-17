import React, { useState } from 'react';

/**
 * Slide 05 — Hardware Blueprint (Conceptual)
 * 
 * Cinematic conceptual exploded-view hardware showcase featuring:
 * - 60–65% visual area with the approved conceptual exploded artwork (/assets/slide_05.png)
 * - Interactive pinpoint callout markers over the glasses assembly
 * - Compact 8-module selector & technical specification inspector
 * - Explicit conceptual visualization disclaimer banner
 * - Clearly distinguished planned/proposed hardware specifications
 */
export function Slide05HardwareBlueprint() {
  const [selectedModule, setSelectedModule] = useState(0);

  const modules = [
    {
      id: 0,
      name: 'Raspberry Pi Zero 2 W',
      sub: 'Proposed Central Edge Compute',
      category: 'EDGE COMPUTE ARCHITECTURE',
      role: 'Executes quantized lightweight neural inference, multi-sensor spatial fusion, and alert dispatch gatekeeping.',
      specs: '1.0 GHz Quad-Core 64-bit ARM Cortex-A53 • 512MB LPDDR2 SDRAM • 2.4GHz Wi-Fi / BLE 4.2',
      bus: 'System-on-Chip (Direct CSI-2, I2C, SPI, UART, I2S)',
      status: 'Proposed Physical Core',
      // Overlay coordinates on the central visual (percentages)
      pin: { top: '38%', left: '52%' }
    },
    {
      id: 1,
      name: 'Raspberry Pi Camera Module 3',
      sub: 'Proposed Primary Optical Sensor',
      category: 'PRIMARY OPTICAL SENSING',
      role: 'Captures forward visual field for pedestrian detection, sign recognition, and path hazard localization.',
      specs: 'Sony IMX708 12MP Sensor • 120° Wide Field-of-View • Fast Phase-Detect Autofocus (PDAF)',
      bus: '2-Lane MIPI CSI-2 Hardware Bus',
      status: 'Proposed Hardware Component',
      pin: { top: '48%', left: '30%' }
    },
    {
      id: 2,
      name: '6-DOF Inertial Measurement Unit',
      sub: 'Proposed Head Kinematics & Tilt',
      category: 'HEAD KINEMATICS & MOTION',
      role: 'Monitors 3-axis head tilt, roll, and walking cadence to stabilize coordinate projections in the fusion engine.',
      specs: '3-Axis Gyroscope (±2000°/s) + 3-Axis Accelerometer (±4g) • 100 Hz Continuous Sampling',
      bus: 'I2C High-Speed Serial Bus (Address 0x68)',
      status: 'Proposed Hardware Component',
      pin: { top: '34%', left: '68%' }
    },
    {
      id: 3,
      name: 'GNSS / GPS Satellite Receiver',
      sub: 'Proposed Macro Geolocation',
      category: 'GEOLOCATION & NAVIGATION',
      role: 'Provides macro outdoor waypoint tracking, transit stops, and cross-street intersection identification.',
      specs: 'Multi-Constellation GNSS Engine (GPS/GLONASS/Galileo) • Ceramic Patch Antenna • 10 Hz Fix Rate',
      bus: 'UART Dedicated Serial Port (9600 Baud)',
      status: 'Proposed Hardware Component',
      pin: { top: '24%', left: '76%' }
    },
    {
      id: 4,
      name: 'VL53L1X Time-of-Flight LiDAR',
      sub: 'Proposed Direct Metric Depth',
      category: 'METRIC DISTANCE SENSING',
      role: 'Emits invisible infrared laser pulses to verify obstacle distance directly, unhampered by lighting or glare.',
      specs: '940nm VCSEL Eye-Safe Laser • Up to 4.0m Metric Ranging • 50 Hz Ranging Rate',
      bus: 'I2C Serial Interface (Address 0x29)',
      status: 'Proposed Hardware Component',
      pin: { top: '56%', left: '26%' }
    },
    {
      id: 5,
      name: 'Bone Conduction Audio Subsystem',
      sub: 'Proposed Non-Intrusive Spatial Sound',
      category: 'ACOUSTIC GUIDANCE DISPATCH',
      role: 'Transmits directional 3D audio alerts through facial bones, keeping ear canals open to vital environmental sounds.',
      specs: 'Dual Temporal Bone Transducers • 300 Hz – 15 kHz Response • Left/Right Binaural Panning',
      bus: 'I2S Digital Audio Bus with MAX98357A DAC',
      status: 'Proposed Hardware Component',
      pin: { top: '64%', left: '72%' }
    },
    {
      id: 6,
      name: 'Haptic Actuator & Driver (DRV2605L)',
      sub: 'Proposed Tactile Warning Guidance',
      category: 'TACTILE COLLISION FEEDBACK',
      role: 'Produces silent, distinct vibration bursts on the left or right temple for urgent directional collision avoidance.',
      specs: 'Linear Resonant Actuators (LRA) • Fast Sub-15ms Response • Distinct Urgency Waveforms',
      bus: 'I2C Controlled Motor Driver',
      status: 'Proposed Hardware Component',
      pin: { top: '58%', left: '84%' }
    },
    {
      id: 7,
      name: 'Power & Battery Management',
      sub: 'Proposed Power Architecture',
      category: 'POWER & THERMAL REGULATION',
      role: 'Regulates system power rails (5V / 3.3V / 2.8V), monitors battery fuel level, and manages heat dissipation.',
      specs: 'Target 1200mAh Li-Po Cell • High-Efficiency Step-Up PMIC • Passive Aluminum/Copper Heat Spreader',
      bus: 'I2C Battery Fuel Gauge & Power Rail Monitoring',
      status: 'Proposed Hardware Architecture',
      pin: { top: '74%', left: '50%' }
    }
  ];

  const active = modules[selectedModule];

  return (
    <div className="s5-blueprint-container">
      {/* Conceptual Blueprint Disclaimer Banner */}
      <div className="s5-disclaimer-strip">
        <div className="s5-disclaimer-left">
          <span className="s5-disclaimer-icon">⚠</span>
          <span className="s5-disclaimer-text">
            <strong>CONCEPTUAL HARDWARE BLUEPRINT</strong> — ARCHITECTURAL EXPLODED PROJECTION
          </span>
        </div>
        <div className="s5-disclaimer-note">
          [ 2D CONCEPTUAL PREVIEW • PROPOSED PHYSICAL SUBSYSTEM SPECIFICATIONS ]
        </div>
      </div>

      {/* Main 65/35 Split Layout */}
      <div className="s5-main-grid">
        {/* Left 65%: Cinematic Central Glasses Exploded View */}
        <div className="s5-viewport-box">
          <img
            src="/assets/slide_05.png"
            alt="ADITI Smart Glasses Conceptual Exploded Hardware Blueprint"
            className="s5-blueprint-image"
          />

          {/* Animated Ambient Holographic HUD Overlays */}
          <div className="s5-scanline-sweep" aria-hidden="true"></div>
          <div className="s5-corner-bracket s5-bracket-tl" aria-hidden="true"></div>
          <div className="s5-corner-bracket s5-bracket-tr" aria-hidden="true"></div>
          <div className="s5-corner-bracket s5-bracket-bl" aria-hidden="true"></div>
          <div className="s5-corner-bracket s5-bracket-br" aria-hidden="true"></div>

          {/* Interactive Pinpoint Callouts over the exploded diagram */}
          {modules.map((m, idx) => {
            const isSelected = selectedModule === idx;
            return (
              <button
                key={m.id}
                type="button"
                className={`s5-pin-marker ${isSelected ? 'active' : ''}`}
                style={{ top: m.pin.top, left: m.pin.left }}
                onClick={() => setSelectedModule(idx)}
                title={m.name}
                aria-label={`Select ${m.name}`}
              >
                <span className="s5-pin-pulse"></span>
                <span className="s5-pin-number">0{idx + 1}</span>
                {isSelected && (
                  <span className="s5-pin-label">{m.name.split(' ')[0]}</span>
                )}
              </button>
            );
          })}

          {/* Bottom HUD readout */}
          <div className="s5-viewport-footer">
            <span className="s5-footer-chip">
              <span className="s5-chip-dot"></span>
              ACTIVE SUBSYSTEM: <strong className="text-cyan">{active.name}</strong>
            </span>
            <span className="s5-footer-status">{active.status}</span>
          </div>
        </div>

        {/* Right 35%: Module Selector & Deep-Dive Specification Card */}
        <div className="s5-inspector-column">
          {/* Module Selector Chips Grid */}
          <div className="s5-selector-wrap">
            <div className="s5-selector-heading">SELECT SUBSYSTEM TO INSPECT:</div>
            <div className="s5-module-chips">
              {modules.map((m, idx) => {
                const isSelected = selectedModule === idx;
                return (
                  <button
                    key={m.id}
                    type="button"
                    className={`s5-module-chip ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedModule(idx)}
                  >
                    <span className="s5-chip-num">0{idx + 1}</span>
                    <span className="s5-chip-name">{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Module Detail HUD Card */}
          <div className="s5-detail-card">
            <div className="s5-card-header">
              <span className="s5-card-tag">{active.category}</span>
              <span className="s5-card-id">MODULE 0{selectedModule + 1}</span>
            </div>

            <h3 className="s5-card-title">{active.name}</h3>
            <div className="s5-card-sub">{active.sub}</div>

            <div className="s5-card-field">
              <div className="s5-field-label">PRIMARY FUNCTIONAL ROLE</div>
              <div className="s5-field-val">{active.role}</div>
            </div>

            <div className="s5-card-field">
              <div className="s5-field-label">PROPOSED TECHNICAL SPECIFICATIONS</div>
              <div className="s5-field-val s5-spec-text">{active.specs}</div>
            </div>

            <div className="s5-card-footer">
              <div className="s5-bus-wrap">
                <span className="s5-bus-label">BUS / INTERFACE:</span>
                <span className="s5-bus-val">{active.bus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Slide05HardwareBlueprint;
