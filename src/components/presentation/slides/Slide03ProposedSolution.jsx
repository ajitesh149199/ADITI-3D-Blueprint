
import React, { useState } from "react";

const capabilities = {
  obstacle: {
    title: "Obstacle Detection & Prioritization",
    tag: "PRIMARY HAZARD MITIGATION",
    accent: "cyan",
    description:
      "Forward-scene obstacle detection and contextual prioritization, designed to highlight hazards relevant to the user's movement.",
    simStatus:
      "Software simulation includes obstacle scenarios, relevance assessment, risk classification, and selective alert suppression.",
    hwStatus:
      "Proposed hardware: Raspberry Pi Camera Module 3 and VL53L1X Time-of-Flight distance sensor.",
  },
  text: {
    title: "Text Reading & Optical OCR",
    tag: "ENVIRONMENTAL LITERACY",
    accent: "violet",
    description:
      "Designed to identify and communicate useful written information from signs, documents, notices, and other visible text.",
    simStatus:
      "Software simulation includes a text-reading objective and contextual output selection. Physical camera-based OCR requires separate validation.",
    hwStatus:
      "Proposed hardware: Raspberry Pi Camera Module 3 for capturing text images.",
  },
  location: {
    title: "Location & Waypoint Assistance",
    tag: "SPATIAL NAVIGATION",
    accent: "cyan",
    description:
      "Uses available location and orientation information to support context-aware navigation assistance.",
    simStatus:
      "Software simulation processes GPS and orientation inputs for contextual decision-making.",
    hwStatus:
      "Proposed hardware: GNSS/GPS receiver with antenna, supported by an IMU.",
  },
  context: {
    title: "General Contextual Assistance",
    tag: "DYNAMIC SCENE ADAPTATION",
    accent: "violet",
    description:
      "Combines sensor information with the user's current objective to determine which environmental information is relevant.",
    simStatus:
      "Software simulation includes sensor fusion, context management, relevance scoring, and general-assistance scenarios.",
    hwStatus:
      "Proposed hardware: Camera, 6-DOF IMU, GNSS receiver, and other supported sensors.",
  },
  feedback: {
    title: "Selective Audio & Haptic Feedback",
    tag: "NON-INTRUSIVE DISPATCH",
    accent: "magenta",
    description:
      "Selects appropriate feedback channels and reduces unnecessary notifications based on context and risk.",
    simStatus:
      "Software simulation includes suppression decisions and audio, haptic, and visual output selection.",
    hwStatus:
      "Proposed hardware: Bone-conduction audio subsystem, haptic motor, and haptic driver.",
  },
};

const capabilityKeys = Object.keys(capabilities);

export function Slide03ProposedSolution() {
  const [activeCapability, setActiveCapability] = useState("obstacle");

  const current = capabilities[activeCapability];

  return (
    <section className="aditi03-root">
      <style>{`
        .aditi03-root {
          width: 100%;
          height: 100%;
          max-height: calc(100dvh - 160px);
          min-height: 0;
          overflow-x: hidden;
          overflow-y: auto;
          padding: 0 18px 120px;
          box-sizing: border-box;
          color: #eafaff;
          scrollbar-width: thin;
          scrollbar-color: #00d9f5 #07101e;
        }

        .aditi03-root * {
          box-sizing: border-box;
        }

        .aditi03-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding: 12px 18px;
          margin-bottom: 18px;
          border: 1px solid #00d9f577;
          border-radius: 8px;
          background: #021422d9;
          color: #50edff;
          font-size: 12px;
          letter-spacing: 1px;
        }

        .aditi03-banner span:last-child {
          color: #8798b4;
        }

        /* Full-width image with original proportions */
        .aditi03-artwork {
          position: relative;
          width: 100%;
          max-width: 1500px;
          margin: 0 auto 22px;
          border: 1px solid #00d9f577;
          border-radius: 12px;
          overflow: hidden;
          background: #030a18;
          box-shadow: 0 0 35px #00d9f519;
        }

        .aditi03-artwork img {
          display: block;
          width: 100%;
          height: auto;
          max-width: 100%;
          object-fit: contain;
        }

        .aditi03-art-caption {
          padding: 12px 18px;
          border-top: 1px solid #00d9f544;
          background: #04111e;
          color: #62edff;
          font-size: 11px;
          letter-spacing: 1px;
          text-align: center;
        }

        .aditi03-section-heading {
          margin: 26px 0 14px;
          color: #5feeff;
          font-size: 13px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* Interactive capability tabs */
        .aditi03-tabs {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 10px;
        }

        .aditi03-tab {
          min-width: 0;
          min-height: 76px;
          padding: 13px 11px;
          border: 1px solid #293952;
          border-radius: 9px;
          background: #0b1228;
          color: #c9d9e9;
          font: inherit;
          text-align: left;
          cursor: pointer;
          transition:
            border-color .2s,
            background .2s,
            transform .2s;
        }

        .aditi03-tab:hover {
          border-color: #00d9f5;
          transform: translateY(-2px);
        }

        .aditi03-tab[aria-selected="true"] {
          border-color: #00d9f5;
          background: linear-gradient(
            135deg,
            #063b49,
            #0b1228
          );
          box-shadow: inset 0 0 22px #00d9f51c;
        }

        .aditi03-tab.violet[aria-selected="true"] {
          border-color: #a277ff;
          background: linear-gradient(
            135deg,
            #241545,
            #0b1228
          );
        }

        .aditi03-tab.magenta[aria-selected="true"] {
          border-color: #ff2da0;
          background: linear-gradient(
            135deg,
            #40112f,
            #0b1228
          );
        }

        .aditi03-tab-number {
          display: block;
          margin-bottom: 8px;
          color: #59edff;
          font-size: 11px;
          letter-spacing: 1px;
        }

        .aditi03-tab.violet .aditi03-tab-number {
          color: #b49aff;
        }

        .aditi03-tab.magenta .aditi03-tab-number {
          color: #ff7bc4;
        }

        .aditi03-tab-title {
          display: block;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.4;
        }

        /* Selected capability details */
        .aditi03-detail {
          margin-top: 16px;
          padding: 23px;
          border: 1px solid #00d9f555;
          border-radius: 10px;
          background: linear-gradient(
            120deg,
            #091b30,
            #100e28
          );
        }

        .aditi03-detail.violet {
          border-color: #a277ff77;
        }

        .aditi03-detail.magenta {
          border-color: #ff2da077;
        }

        .aditi03-tag {
          display: block;
          color: #55edff;
          font-size: 11px;
          letter-spacing: 1.5px;
        }

        .aditi03-detail.violet .aditi03-tag {
          color: #b69cff;
        }

        .aditi03-detail.magenta .aditi03-tag {
          color: #ff7bc4;
        }

        .aditi03-detail h3 {
          margin: 10px 0;
          color: #fff;
          font-size: clamp(19px, 2vw, 27px);
        }

        .aditi03-description {
          margin: 0 0 20px;
          color: #c2cee0;
          line-height: 1.7;
          font-size: 14px;
        }

        /* Software and hardware maturity cards */
        .aditi03-maturity-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .aditi03-maturity-card {
          padding: 18px;
          border: 1px solid #2c405c;
          border-radius: 9px;
          background: #050d1b;
        }

        .aditi03-maturity-card.software {
          border-color: #23c6a666;
        }

        .aditi03-maturity-card.hardware {
          border-color: #e7ac5066;
        }

        .aditi03-maturity-label {
          display: block;
          margin-bottom: 11px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .aditi03-maturity-card.software
        .aditi03-maturity-label {
          color: #59e9bf;
        }

        .aditi03-maturity-card.hardware
        .aditi03-maturity-label {
          color: #f6c576;
        }

        .aditi03-maturity-card p {
          margin: 0;
          color: #c2cee0;
          font-size: 13px;
          line-height: 1.7;
        }

        @media (max-width: 1100px) {
          .aditi03-tabs {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .aditi03-root {
            padding: 0 10px 110px;
          }

          .aditi03-tabs {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .aditi03-maturity-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 440px) {
          .aditi03-tabs {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .aditi03-tab {
            transition: none;
          }
        }
      `}</style>

      {/* Presentation scope banner */}
      <div className="aditi03-banner">
        <span>
          ● ADITI SMART GLASSES • PROPOSED SOLUTION
        </span>

        <span>
          [ MULTIMODAL ASSISTIVE INTELLIGENCE ]
        </span>
      </div>

      {/* Main cinematic image */}
      <figure className="aditi03-artwork">
        <img
          src="/assets/slide03-solution.png"
          alt="Conceptual ADITI smart glasses architecture showing the tactical frame, hardware components, and processing pipeline"
          loading="eager"
        />

        <figcaption className="aditi03-art-caption">
          ◈ CONCEPTUAL HARDWARE VISUALIZATION
          — PROPOSED PHYSICAL ARCHITECTURE
        </figcaption>
      </figure>

      {/* Interactive capability section */}
      <h2 className="aditi03-section-heading">
        Interactive ADITI Capabilities
      </h2>

      <div
        className="aditi03-tabs"
        role="tablist"
        aria-label="ADITI proposed capabilities"
      >
        {capabilityKeys.map((key, index) => {
          const capability = capabilities[key];
          const selected = activeCapability === key;

          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="aditi03-capability-panel"
              id={`aditi03-tab-${key}`}
              className={`aditi03-tab ${capability.accent}`}
              onClick={() => setActiveCapability(key)}
            >
              <span className="aditi03-tab-number">
                CAPABILITY {String(index + 1).padStart(2, "0")}
              </span>

              <span className="aditi03-tab-title">
                {capability.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic selected capability panel */}
      <div
        id="aditi03-capability-panel"
        role="tabpanel"
        aria-labelledby={`aditi03-tab-${activeCapability}`}
        className={`aditi03-detail ${current.accent}`}
      >
        <span className="aditi03-tag">
          {current.tag}
        </span>

        <h3>{current.title}</h3>

        <p className="aditi03-description">
          {current.description}
        </p>

        <div className="aditi03-maturity-grid">
          <article className="aditi03-maturity-card software">
            <span className="aditi03-maturity-label">
              ● SOFTWARE SIMULATION
            </span>

            <p>{current.simStatus}</p>
          </article>

          <article className="aditi03-maturity-card hardware">
            <span className="aditi03-maturity-label">
              ● PROPOSED PHYSICAL HARDWARE
            </span>

            <p>{current.hwStatus}</p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Slide03ProposedSolution;
