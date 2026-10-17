
import React, { useState } from "react";

const stages = [
  {
    title: "Software Simulator",
    phase: "PHASE 1 • COMPLETED",
    status: "CURRENT PROGRESS",
    summary:
      "Developed a six-node edge-processing simulator, 3D coordinate re-projection, and relevance and suppression logic tested in simulation.",
    deliverables: [
      "Simulator architecture verified",
      "Relevance and suppression logic tested",
      "Mission Control HUD telemetry built",
    ],
  },
  {
    title: "Hardware Assembly",
    phase: "PHASE 2 • PLANNED",
    status: "NEXT MILESTONE",
    summary:
      "Planned integration of Raspberry Pi Zero 2 W, Camera Module 3, VL53L1X ToF sensor, IMU, audio output, and haptic feedback.",
    deliverables: [
      "Hardware enclosure and mounting",
      "Power management and wiring",
      "Camera and sensor interface integration",
    ],
  },
  {
    title: "Prototype Evaluation",
    phase: "PHASE 3 • PROPOSED",
    status: "FUTURE EVALUATION",
    summary:
      "Planned calibration, thermal testing, battery-runtime evaluation, and controlled obstacle-course trials.",
    deliverables: [
      "Thermal performance verification",
      "Battery-runtime measurement",
      "Controlled indoor and outdoor testing",
    ],
  },
  {
    title: "Assistive Refinement",
    phase: "PHASE 4 • FUTURE VISION",
    status: "RESEARCH HORIZON",
    summary:
      "Future usability studies with visually impaired participants, compact hardware refinement, and potential smart-cane integration.",
    deliverables: [
      "Accessibility community collaboration",
      "Compact hardware redesign",
      "Smart-cane sensor integration research",
    ],
  },
];

const limitations = [
  {
    title: "Physical Hardware Validation Pending",
    desc: "The current results come from software simulation. Physical prototype validation and real-world testing remain to be completed.",
  },
  {
    title: "Thermal & Compute Constraints",
    desc: "Continuous on-device inference will require measurement of processor temperature, latency, and power consumption.",
  },
  {
    title: "Sensor Coverage & Lighting",
    desc: "A forward-facing camera may leave blind spots, and recognition performance can vary with lighting and environmental conditions.",
  },
  {
    title: "Structured User Studies",
    desc: "Assistive effectiveness must be evaluated through appropriately designed studies involving blind and low-vision users.",
  },
];

export function Slide10LimitationsFutureWork() {
  const [activeStage, setActiveStage] = useState(0);
  const stage = stages[activeStage];

  return (
    <section className="aditi10-root">
      <style>{`
        .aditi10-root {
          width: 100%;
          height: 100%;
          max-height: calc(100dvh - 160px);
          min-height: 0;
          overflow-x: hidden;
          overflow-y: auto;
          box-sizing: border-box;
          padding: 0 18px 110px;
          color: #eafaff;
          scrollbar-width: thin;
          scrollbar-color: #00d9f5 #07101e;
        }

        .aditi10-root * {
          box-sizing: border-box;
        }

        .aditi10-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
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

        .aditi10-banner span:last-child {
          color: #8595b2;
        }

        .aditi10-artwork {
          position: relative;
          width: 100%;
          max-width: 1500px;
          margin: 0 auto 22px;
          border: 1px solid #00d9f577;
          border-radius: 12px;
          overflow: hidden;
          background: #030a18;
          box-shadow: 0 0 35px #00d9f511;
        }

        .aditi10-artwork img {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        .aditi10-art-caption {
          padding: 12px 18px;
          border-top: 1px solid #00d9f544;
          color: #62edff;
          font-size: 12px;
          letter-spacing: .5px;
        }

        .aditi10-section-label {
          margin: 24px 0 12px;
          color: #63edff;
          font-size: 13px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .aditi10-timeline {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .aditi10-stage-button {
          min-width: 0;
          padding: 17px 12px;
          text-align: left;
          cursor: pointer;
          color: #c8d9ec;
          background: #0b1228;
          border: 1px solid #26344e;
          border-radius: 9px;
          transition: border-color .2s, background .2s, transform .2s;
        }

        .aditi10-stage-button:hover {
          border-color: #00d9f5;
          transform: translateY(-2px);
        }

        .aditi10-stage-button[aria-pressed="true"] {
          border-color: #00d9f5;
          background: linear-gradient(135deg, #053b49, #0b1228);
          box-shadow: inset 0 0 22px #00d9f51c;
        }

        .aditi10-stage-number {
          display: block;
          margin-bottom: 8px;
          font-size: 11px;
          color: #59edff;
          letter-spacing: 1px;
        }

        .aditi10-stage-name {
          display: block;
          font-size: 15px;
          font-weight: 700;
        }

        .aditi10-stage-status {
          display: block;
          margin-top: 10px;
          font-size: 10px;
          color: #b7a1ff;
        }

        .aditi10-detail {
          margin-top: 16px;
          padding: 22px;
          border: 1px solid #00d9f555;
          border-radius: 10px;
          background: linear-gradient(120deg, #091b30, #100e28);
        }

        .aditi10-phase {
          color: #49ebff;
          font-size: 12px;
          letter-spacing: 1px;
        }

        .aditi10-detail h3 {
          margin: 10px 0;
          font-size: clamp(19px, 2vw, 27px);
        }

        .aditi10-detail p {
          margin: 0 0 18px;
          color: #c0cde1;
          line-height: 1.7;
        }

        .aditi10-deliverables {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .aditi10-deliverables li {
          padding: 12px 14px;
          border: 1px solid #28405b;
          border-radius: 7px;
          background: #050d1b;
          color: #d5e4f1;
          font-size: 13px;
          line-height: 1.5;
        }

        .aditi10-deliverables li::before {
          content: "› ";
          color: #00eaff;
          font-weight: bold;
        }

        .aditi10-limit-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .aditi10-limit {
          padding: 17px;
          border: 1px solid #ec18825e;
          border-radius: 9px;
          background: #150d20;
        }

        .aditi10-limit h4 {
          margin: 0 0 9px;
          font-size: 14px;
          color: #ff73c5;
        }

        .aditi10-limit p {
          margin: 0;
          color: #bec6d9;
          font-size: 13px;
          line-height: 1.65;
        }

        @media (max-width: 800px) {
          .aditi10-root {
            padding: 0 10px 110px;
          }

          .aditi10-timeline,
          .aditi10-limit-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .aditi10-deliverables {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .aditi10-timeline,
          .aditi10-limit-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .aditi10-stage-button {
            transition: none;
          }
        }
      `}</style>

      <div className="aditi10-banner">
        <span>
          ● ENGINEERING ROADMAP: FROM SOFTWARE SIMULATION TO PHYSICAL SYSTEM
        </span>
        <span>[ 4-STAGE DEVELOPMENT TRAJECTORY ]</span>
      </div>

      <figure className="aditi10-artwork">
        <img
          src="/assets/slide_10.png"
          alt="ADITI development roadmap showing software simulation, hardware assembly, prototype evaluation, and future assistive refinement"
          loading="eager"
        />
        <figcaption className="aditi10-art-caption">
          ◈ ROADMAP ARCHITECTURE — From simulation to future field deployment
        </figcaption>
      </figure>

      <h3 className="aditi10-section-label">
        Interactive Development Roadmap
      </h3>

      <div className="aditi10-timeline">
        {stages.map((item, index) => (
          <button
            key={item.title}
            type="button"
            className="aditi10-stage-button"
            aria-pressed={activeStage === index}
            onClick={() => setActiveStage(index)}
          >
            <span className="aditi10-stage-number">
              STAGE {String(index + 1).padStart(2, "0")}
            </span>
            <span className="aditi10-stage-name">{item.title}</span>
            <span className="aditi10-stage-status">{item.status}</span>
          </button>
        ))}
      </div>

      <div className="aditi10-detail">
        <span className="aditi10-phase">{stage.phase}</span>
        <h3>{stage.title}</h3>
        <p>{stage.summary}</p>

        <ul className="aditi10-deliverables">
          {stage.deliverables.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <h3 className="aditi10-section-label">
        Current Technical Constraints & Challenges
      </h3>

      <div className="aditi10-limit-grid">
        {limitations.map((item) => (
          <article className="aditi10-limit" key={item.title}>
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Slide10LimitationsFutureWork;
