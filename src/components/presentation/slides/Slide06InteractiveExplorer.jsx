import React, { useState } from 'react';

/**
 * Slide 06 — Interactive Component Inspection Explorer
 * 
 * Cinematic subsystem inspection interface featuring:
 * - Approved original ADITI glasses inspection artwork (/assets/slide_06.png)
 * - Dynamic glowing inspection reticles and callout pins
 * - Interactive subsystem tabs (Camera, ToF, Chassis, Audio, IMU)
 * - Clear distinction of proposed/target specifications vs unverified claims
 * - Functional "Launch Live Explorer" button using configurable callback
 */
export function Slide06InteractiveExplorer({ onLaunchExplorer }) {
  const [activeTab, setActiveTab] = useState('camera');

  const componentsData = {
    camera: {
      name: 'Sony IMX708 Optical Module',
      node: 'camera',
      role: 'Primary front-facing optical capture with autofocus and high dynamic range',
      targetSpecs: {
        sensor: '12MP Sony IMX708 Color Sensor',
        framerate: 'Target: 30 FPS at 640x480 edge pipeline resolution',
        fov: '120° Wide Field-of-View Lens',
        interface: '2-Lane MIPI CSI-2 directly to SoC',
        role_type: 'Object, pedestrian, and street signage detection'
      },
      status: 'PROPOSED OPTICAL SPECIFICATION',
      pin: { top: '48%', left: '32%' }
    },
    tof: {
      name: 'VL53L1X Direct Laser Ranging Core',
      node: 'tof',
      role: 'Direct time-of-flight photon measurement for ground obstacles and overhangs',
      targetSpecs: {
        range: '0.04m – 4.00m (Target & Surface Dependent)',
        wavelength: '940 nm VCSEL (Class 1 Eye-Safe Laser)',
        frequency: 'Target: 50 Hz Ranging Cycle',
        interface: 'I2C Interface (Address 0x29)',
        role_type: 'Direct metric distance ground truth verification'
      },
      status: 'PROPOSED DEPTH SENSOR',
      pin: { top: '56%', left: '26%' }
    },
    chassis: {
      name: 'Tactical Enclosure & Ergonomic Frame',
      node: 'chassis',
      role: 'Rugged prototype housing with opaque lenses, side electronics, and rear headband',
      targetSpecs: {
        material: 'Impact-Resistant Polymer & Carbon-Composite',
        lenses: 'Black Opaque Polycarbonate (Assistive Wearable Form)',
        headband: 'Wraparound Stabilizing Rear Band for Balance',
        thermal: 'Passive Aluminum/Copper Conduction Plate',
        protection: 'Engineered for Splash & Dust Protection (IP54 Target)'
      },
      status: 'PROPOSED MECHANICAL HOUSING',
      pin: { top: '42%', left: '55%' }
    },
    audio: {
      name: 'Binaural Bone Conduction Transducers',
      node: 'audio',
      role: 'Non-occluding directional spatial acoustic delivery preserving environmental hearing',
      targetSpecs: {
        transducers: 'Dual Temporal Bone Conduction Drivers',
        ear_status: '100% Open Ear Canals (Ambient Traffic Safety)',
        dac: 'MAX98357A I2S Class D Digital Audio Amplifier',
        panning: '3D Spatial Directional Cues (HRTF Azimuth Mapping)',
        frequency: '300 Hz – 15,000 Hz Speech & Alert Range'
      },
      status: 'PROPOSED ACOUSTIC ARCHITECTURE',
      pin: { top: '62%', left: '74%' }
    },
    imu: {
      name: '6-DOF Inertial Motion Vector Sensor',
      node: 'imu',
      role: 'Compensates for walking bounce and head tilts to stabilize coordinate tracking',
      targetSpecs: {
        axes: '3-Axis Gyroscope + 3-Axis Accelerometer',
        sampling: 'Target: 100 Hz Continuous Polling',
        interface: 'I2C High-Speed Bus (Address 0x68)',
        fusion_role: 'Real-time pitch/roll head attitude compensation',
        power_mode: 'Ultra-low power continuous kinematic buffer'
      },
      status: 'PROPOSED INERTIAL SENSOR',
      pin: { top: '35%', left: '68%' }
    }
  };

  const selected = componentsData[activeTab] || componentsData.camera;

  const handleLaunchClick = () => {
    if (onLaunchExplorer) {
      onLaunchExplorer({
        component: selected.name,
        tab: activeTab
      });
    }
  };

  return (
    <div className="s6-explorer-grid">
      {/* Left Viewport: Original ADITI Glasses with Inspection HUD */}
      <div className="s6-viewport">
        {/* Top HUD Header */}
        <div className="s6-viewport-header">
          <span className="s6-hud-badge">
            <span className="s6-hud-dot"></span>
            SUBSYSTEM INSPECTION: <strong className="text-cyan">{selected.node.toUpperCase()}</strong>
          </span>
          <span className="s6-hud-preview-tag">[ 2D CONCEPTUAL CAD PREVIEW ]</span>
        </div>

        {/* Central Approved Glasses Artwork */}
        <div className="s6-image-stage">
          <img
            src="/assets/slide_06.png"
            alt="ADITI Smart Glasses Component Inspection Explorer"
            className="s6-explorer-image"
          />

          {/* Animated Ambient Holographic HUD Overlays */}
          <div className="s6-scanline-sweep" aria-hidden="true"></div>
          <div className="s6-corner-bracket s6-bracket-tl" aria-hidden="true"></div>
          <div className="s6-corner-bracket s6-bracket-tr" aria-hidden="true"></div>
          <div className="s6-corner-bracket s6-bracket-bl" aria-hidden="true"></div>
          <div className="s6-corner-bracket s6-bracket-br" aria-hidden="true"></div>

          {/* Glowing Reticle Target on Active Subsystem */}
          <div
            className="s6-active-reticle"
            style={{ top: selected.pin.top, left: selected.pin.left }}
          >
            <div className="s6-reticle-ring"></div>
            <div className="s6-reticle-pulse"></div>
            <div className="s6-reticle-cross"></div>
          </div>
        </div>

        {/* Bottom Viewport Status Readout */}
        <div className="s6-viewport-footer">
          <span>FRAME: ADITI TACTICAL SMART-GLASSES DESIGN</span>
          <span className="s6-footer-status text-cyan">● {selected.status}</span>
        </div>
      </div>

      {/* Right Column: Subsystem Tabs & Detailed Telemetry Matrix */}
      <div className="s6-sidebar">
        <div>
          <div className="s6-selector-label">SELECT SUBSYSTEM TO INSPECT:</div>
          <div className="s6-tabs">
            {Object.keys(componentsData).map((tabKey) => {
              const isSelected = activeTab === tabKey;
              return (
                <button
                  key={tabKey}
                  type="button"
                  className={`s6-tab-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveTab(tabKey)}
                >
                  <span className="s6-tab-bullet">◈</span>
                  <span>{tabKey.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Component Inspection Card */}
        <div className="s6-detail-card">
          <div className="s6-card-title">{selected.name}</div>
          <div className="s6-card-role">{selected.role}</div>

          {/* Target Technical Specifications Matrix */}
          <div className="s6-specs-matrix">
            {Object.entries(selected.targetSpecs).map(([key, val]) => (
              <div key={key} className="s6-spec-row">
                <span className="s6-spec-key">{key.replace('_', ' ')}</span>
                <span className="s6-spec-val">{val}</span>
              </div>
            ))}
          </div>

          {/* Functional Launch Explorer Action Button */}
          <button
            type="button"
            className="hud-btn hud-btn-cyan s6-launch-btn"
            onClick={handleLaunchClick}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>LAUNCH LIVE EXPLORER</span>
          </button>

          <div className="s6-launch-note">
            Note: Dispatches explorer session to the integrated ADITI 3D Blueprint CAD dashboard.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Slide06InteractiveExplorer;
