
import React, { useState } from "react";

const scenarios = [
  {
    id: 0,
    title: "Scenario A: Low Overhead Awning / Branch",
    type: "Head-Level Hazard Test",
    accent: "magenta",
    badge: "CRITICAL OVERHANG",
    input:
      "Simulated 1.7 m obstacle hanging directly in the user's walking path, above the typical detection range of a white cane.",
    baseline:
      "Conventional white canes may not detect overhead hazards. A generic vision system without prioritization could generate repeated warnings.",
    aditi:
      "The simulated decision pipeline classifies the obstacle as a high-priority hazard and selects relevant warning feedback.",
    verdict: "Overhead Hazard Prioritization",
    rawCount: 6,
    filteredCount: 5,
    alertCount: 1,
  },
  {
    id: 1,
    title: "Scenario B: High-Density Sidewalk Pedestrians",
    type: "Alert Fatigue Mitigation Test",
    accent: "violet",
    badge: "DENSITY MITIGATION",
    input:
      "A synthetic sidewalk scene containing pedestrians moving in parallel and opposing directions.",
    baseline:
      "A system that warns about every detected person could produce excessive and distracting feedback.",
    aditi:
      "The example filters pedestrians assessed as irrelevant to the user's path and retains an actionable warning for a potential crossing hazard.",
    verdict: "Selective Alert Suppression",
    rawCount: 12,
    filteredCount: 11,
    alertCount: 1,
  },
  {
    id: 2,
    title: "Scenario C: Stationary Ground Curbs & Bollards",
    type: "Ground Clearance Test",
    accent: "cyan",
    badge: "PATH CLEARANCE",
    input:
      "A simulated sidewalk containing bollards, curbs, and objects positioned at different lateral distances.",
    baseline:
      "Basic proximity-based alerts may warn about nearby objects even when they are outside the walking path.",
    aditi:
      "The example applies direction and relevance filtering to suppress objects outside the selected path while retaining a relevant obstacle alert.",
    verdict: "Contextual Spatial Filtering",
    rawCount: 8,
    filteredCount: 7,
    alertCount: 1,
  },
  {
    id: 3,
    title: "Scenario D: Dynamic Cross-Traffic / Scooter",
    type: "Dynamic Hazard Assessment Test",
    accent: "magenta",
    badge: "CROSS-TRAFFIC HAZARD",
    input:
      "A synthetic scenario representing a fast-moving object crossing the user's projected walking path.",
    baseline:
      "Distance-only warning logic may not adequately account for object movement and changing collision risk.",
    aditi:
      "The example prioritizes the crossing object based on the simulated motion and risk inputs, selecting an actionable warning.",
    verdict: "Dynamic Risk Prioritization",
    rawCount: 7,
    filteredCount: 6,
    alertCount: 1,
  },
];

export function Slide09TestingEvaluation() {
  const [selectedScenario, setSelectedScenario] = useState(0);

  const current = scenarios[selectedScenario];

  const suppressionPercent =
    (current.filteredCount / current.rawCount) * 100;

  const alertPercent =
    (current.alertCount / current.rawCount) * 100;

  return (
    <section className="aditi09-root">
      <style>{`
        .aditi09-root {
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

        .aditi09-root * {
          box-sizing: border-box;
        }

        /* Top engineering scope banner */
        .aditi09-banner {
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

        .aditi09-banner span:last-child {
          color: #8798b4;
        }

        /* Full-size, uncropped illustration */
        .aditi09-artwork {
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

        .aditi09-artwork img {
          display: block;
          width: 100%;
          max-width: 100%;
          height: auto;
          object-fit: contain;
        }

        .aditi09-art-caption {
          padding: 12px 18px;
          border-top: 1px solid #00d9f544;
          background: #04111e;
          color: #62edff;
          font-size: 11px;
          letter-spacing: 1px;
          text-align: center;
        }

        .aditi09-section-heading {
          margin: 26px 0 14px;
          color: #5feeff;
          font-size: 13px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* Interactive scenario selector */
        .aditi09-scenarios {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .aditi09-scenario-button {
          min-width: 0;
          padding: 17px 13px;
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

        .aditi09-scenario-button:hover {
          border-color: #00d9f5;
          transform: translateY(-2px);
        }

        .aditi09-scenario-button[aria-pressed="true"] {
          border-color: #00d9f5;
          background: linear-gradient(
            135deg,
            #053b49,
            #0b1228
          );
          box-shadow: inset 0 0 22px #00d9f51c;
        }

        .aditi09-scenario-button.magenta[aria-pressed="true"] {
          border-color: #ff2da0;
          background: linear-gradient(
            135deg,
            #40112f,
            #0b1228
          );
        }

        .aditi09-scenario-button.violet[aria-pressed="true"] {
          border-color: #a277ff;
          background: linear-gradient(
            135deg,
            #241545,
            #0b1228
          );
        }

        .aditi09-scenario-number {
          display: block;
          margin-bottom: 8px;
          color: #59edff;
          font-size: 11px;
          letter-spacing: 1px;
        }

        .aditi09-scenario-button.magenta
        .aditi09-scenario-number {
          color: #ff7bc4;
        }

        .aditi09-scenario-button.violet
        .aditi09-scenario-number {
          color: #b49aff;
        }

        .aditi09-scenario-name {
          display: block;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.45;
        }

        .aditi09-scenario-type {
          display: block;
          margin-top: 10px;
          color: #a6b5cb;
          font-size: 11px;
          line-height: 1.5;
        }

        /* Selected scenario evaluation */
        .aditi09-detail {
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

        .aditi09-detail.magenta {
          border-color: #ff2da077;
        }

        .aditi09-detail.violet {
          border-color: #a277ff77;
        }

        .aditi09-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 15px;
        }

        .aditi09-badge {
          color: #5feeff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .aditi09-detail.magenta .aditi09-badge {
          color: #ff7bc4;
        }

        .aditi09-detail.violet .aditi09-badge {
          color: #b49aff;
        }

        .aditi09-verdict {
          color: #a9bad0;
          font-size: 12px;
        }

        .aditi09-detail h3 {
          margin: 0 0 19px;
          color: #fff;
          font-size: clamp(19px, 2vw, 27px);
        }

        .aditi09-fields {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 13px;
        }

        .aditi09-field {
          min-width: 0;
          padding: 18px;
          border: 1px solid #2c405c;
          border-radius: 9px;
          background: #050d1b;
        }

        .aditi09-field.input {
          border-color: #4e6b8c77;
        }

        .aditi09-field.baseline {
          border-color: #ff2da077;
        }

        .aditi09-field.filtered {
          border-color: #00d9f577;
        }

        .aditi09-field-label {
          display: block;
          margin-bottom: 11px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .aditi09-field.input .aditi09-field-label {
          color: #b6c4d7;
        }

        .aditi09-field.baseline .aditi09-field-label {
          color: #ff7bc4;
        }

        .aditi09-field.filtered .aditi09-field-label {
          color: #5feeff;
        }

        .aditi09-field p {
          margin: 0;
          color: #c2cee0;
          font-size: 13px;
          line-height: 1.7;
        }

        /* Comparison bar panel */
        .aditi09-comparison {
          margin-top: 16px;
          padding: 23px;
          border: 1px solid #00d9f555;
          border-radius: 10px;
          background: #071426;
        }

        .aditi09-comparison-heading {
          margin: 0 0 22px;
          color: #5feeff;
          font-size: 13px;
          letter-spacing: 1.5px;
        }

        .aditi09-bars {
          display: grid;
          gap: 19px;
        }

        .aditi09-bar-heading {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 8px;
          color: #d2dfed;
          font-size: 13px;
        }

        .aditi09-bar-track {
          width: 100%;
          height: 12px;
          overflow: hidden;
          border-radius: 20px;
          background: #182840;
        }

        .aditi09-bar-fill {
          height: 100%;
          border-radius: inherit;
          transition: width .35s ease;
        }

        .aditi09-bar-fill.raw {
          background: linear-gradient(
            90deg,
            #a52b52,
            #ff4777
          );
        }

        .aditi09-bar-fill.suppressed {
          background: linear-gradient(
            90deg,
            #5935a9,
            #a277ff
          );
        }

        .aditi09-bar-fill.alert {
          background: linear-gradient(
            90deg,
            #ab196c,
            #ff2da0
          );
        }

        .aditi09-count.raw {
          color: #ff7795;
        }

        .aditi09-count.suppressed {
          color: #b49aff;
        }

        .aditi09-count.alert {
          color: #ff7bc4;
        }

        .aditi09-metric-note {
          margin: 16px 0 0;
          color: #91a6bf;
          font-size: 12px;
          line-height: 1.6;
        }

        /* Engineering transparency notice */
        .aditi09-notice {
          margin-top: 20px;
          padding: 22px;
          border: 1px solid #e7ac5077;
          border-radius: 10px;
          background: linear-gradient(
            120deg,
            #21180d,
            #160e1d
          );
        }

        .aditi09-notice-title {
          margin: 0 0 12px;
          color: #ffd084;
          font-size: 13px;
          letter-spacing: 1px;
        }

        .aditi09-notice p {
          margin: 0 0 10px;
          color: #d0c9c0;
          font-size: 13px;
          line-height: 1.7;
        }

        .aditi09-notice p:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 1100px) {
          .aditi09-scenarios {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .aditi09-fields {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .aditi09-root {
            padding: 0 10px 110px;
          }

          .aditi09-scenarios {
            grid-template-columns: 1fr;
          }

          .aditi09-detail,
          .aditi09-comparison {
            padding: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .aditi09-scenario-button,
          .aditi09-bar-fill {
            transition: none;
          }
        }
      `}</style>

      {/* Top banner */}
      <div className="aditi09-banner">
        <span>
          ● SIMULATION EVALUATION SUITE:
          SYNTHETIC URBAN SCENARIOS
        </span>

        <span>
          [ 4 SOFTWARE EVALUATION SCENARIOS ]
        </span>
      </div>

      {/* Full-width evaluation artwork */}
      <figure className="aditi09-artwork">
        <img
          src="/assets/slide_09.png"
          alt="ADITI testing and engineering evaluation dashboard illustration"
          loading="eager"
        />

        <figcaption className="aditi09-art-caption">
          ◈ TESTING & ENGINEERING EVALUATION
          — SOFTWARE SIMULATION VISUALIZATION
        </figcaption>
      </figure>

      {/* Scenario selection */}
      <h2 className="aditi09-section-heading">
        Interactive Evaluation Scenarios
      </h2>

      <div
        className="aditi09-scenarios"
        aria-label="Select an evaluation scenario"
      >
        {scenarios.map((scenario, index) => {
          const selected = selectedScenario === index;

          return (
            <button
              key={scenario.id}
              type="button"
              className={`aditi09-scenario-button ${scenario.accent}`}
              aria-pressed={selected}
              onClick={() => setSelectedScenario(index)}
            >
              <span className="aditi09-scenario-number">
                SCENARIO {String.fromCharCode(65 + index)}
              </span>

              <span className="aditi09-scenario-name">
                {scenario.title.split(": ")[1]}
              </span>

              <span className="aditi09-scenario-type">
                {scenario.type}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected scenario */}
      <div className={`aditi09-detail ${current.accent}`}>
        <div className="aditi09-detail-header">
          <span className="aditi09-badge">
            {current.badge}
          </span>

          <span className="aditi09-verdict">
            {current.verdict}
          </span>
        </div>

        <h3>{current.title}</h3>

        <div className="aditi09-fields">
          <article className="aditi09-field input">
            <span className="aditi09-field-label">
              01 — INPUT CONDITION
            </span>
            <p>{current.input}</p>
          </article>

          <article className="aditi09-field baseline">
            <span className="aditi09-field-label">
              02 — UNFILTERED BASELINE
            </span>
            <p>{current.baseline}</p>
          </article>

          <article className="aditi09-field filtered">
            <span className="aditi09-field-label">
              03 — ADITI FILTERED OUTCOME
            </span>
            <p>{current.aditi}</p>
          </article>
        </div>
      </div>

      {/* Three-stage comparison */}
      <div className="aditi09-comparison">
        <h3 className="aditi09-comparison-heading">
          SCENARIO FILTERING:
          RAW DETECTIONS → SUPPRESSED → ALERTS
        </h3>

        <div className="aditi09-bars">
          <div>
            <div className="aditi09-bar-heading">
              <span>01 — Raw Detections</span>
              <span className="aditi09-count raw">
                {current.rawCount} objects
              </span>
            </div>

            <div className="aditi09-bar-track">
              <div
                className="aditi09-bar-fill raw"
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div>
            <div className="aditi09-bar-heading">
              <span>02 — Suppressed Detections</span>
              <span className="aditi09-count suppressed">
                {current.filteredCount} suppressed
              </span>
            </div>

            <div className="aditi09-bar-track">
              <div
                className="aditi09-bar-fill suppressed"
                style={{ width: `${suppressionPercent}%` }}
              />
            </div>
          </div>

          <div>
            <div className="aditi09-bar-heading">
              <span>03 — Actionable Alerts</span>
              <span className="aditi09-count alert">
                {current.alertCount} emitted
              </span>
            </div>

            <div className="aditi09-bar-track">
              <div
                className="aditi09-bar-fill alert"
                style={{ width: `${alertPercent}%` }}
              />
            </div>
          </div>
        </div>

        <p className="aditi09-metric-note">
          Counts illustrate the selected synthetic scenario.
          They should not be interpreted as measured
          real-world accuracy or safety performance.
        </p>
      </div>

      {/* Engineering transparency */}
      <aside className="aditi09-notice">
        <h3 className="aditi09-notice-title">
          ⚠ TRANSPARENT ENGINEERING EVALUATION NOTICE
        </h3>

        <p>
          The scenarios and counts shown here represent
          software-simulation examples using synthetic
          environmental inputs. They do not establish
          real-world detection accuracy or clinical
          effectiveness.
        </p>

        <p>
          <strong>
            Physical human-user trials have not yet
            been conducted.
          </strong>{" "}
          Hardware assembly, sensor calibration,
          controlled validation, and appropriate
          user-centered evaluation are future stages
          of the ADITI project.
        </p>
      </aside>
    </section>
  );
}

export default Slide09TestingEvaluation;
