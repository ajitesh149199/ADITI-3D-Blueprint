
import React from "react";

const benefits = [
  {
    number: "01",
    title: "Relevant Hazard Awareness",
    description:
      "Prioritizes relevant obstacles, including overhead hazards that may not be detected by a conventional white cane.",
    accent: "cyan",
  },
  {
    number: "02",
    title: "Reduced Unnecessary Feedback",
    description:
      "Filters irrelevant detections to reduce repeated alerts and unnecessary information.",
    accent: "magenta",
  },
  {
    number: "03",
    title: "Multimodal Spatial Assistance",
    description:
      "Combines planned audio and haptic feedback with camera and sensor information for contextual assistance.",
    accent: "violet",
  },
  {
    number: "04",
    title: "Modular Edge-AI Architecture",
    description:
      "Designed for modular on-device processing, reduced dependence on cloud services, and privacy-aware operation.",
    accent: "cyan",
  },
];

export function Slide11ThankYouVision({ onFinish }) {
  return (
    <section className="aditi11-root">
      <style>{`
        .aditi11-root {
          width: 100%;
          height: 100%;
          max-height: calc(100dvh - 160px);
          min-height: 0;
          overflow-x: hidden;
          overflow-y: auto;
          padding: 0 18px 120px;
          box-sizing: border-box;
          color: #edfaff;
          scrollbar-width: thin;
          scrollbar-color: #00d9f5 #07101e;
        }

        .aditi11-root * {
          box-sizing: border-box;
        }

        .aditi11-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          padding: 12px 18px;
          margin-bottom: 20px;
          border: 1px solid #00e5ff77;
          border-radius: 8px;
          background: #021320dc;
          color: #51eeff;
          font-size: 12px;
          letter-spacing: 1px;
        }

        .aditi11-banner span:last-child {
          color: #8596b0;
        }

        .aditi11-hero {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
          position: relative;
          border: 1px solid #00e5ff88;
          border-radius: 12px;
          overflow: hidden;
          background: #030916;
          box-shadow: 0 0 42px #00d9f519;
        }

        .aditi11-hero img {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        .aditi11-image-label {
          padding: 12px 18px;
          border-top: 1px solid #00e5ff44;
          background: #04111e;
          text-align: center;
          color: #54eaff;
          font-size: 11px;
          letter-spacing: 2px;
        }

        .aditi11-section-heading {
          margin: 26px 0 14px;
          text-align: center;
          color: #5feeff;
          font-size: 14px;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .aditi11-benefits {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .aditi11-card {
          min-width: 0;
          padding: 19px 17px;
          border: 1px solid #00e5ff55;
          border-top: 2px solid #00e5ff;
          border-radius: 10px;
          background: linear-gradient(160deg, #0b172d, #0a1020);
        }

        .aditi11-card.magenta {
          border-color: #f02e9455;
          border-top-color: #ff2da0;
        }

        .aditi11-card.violet {
          border-color: #9c69ff55;
          border-top-color: #a277ff;
        }

        .aditi11-card-number {
          display: block;
          margin-bottom: 11px;
          font-size: 11px;
          letter-spacing: 1px;
          color: #55eaff;
        }

        .aditi11-card.magenta .aditi11-card-number {
          color: #ff61b6;
        }

        .aditi11-card.violet .aditi11-card-number {
          color: #b495ff;
        }

        .aditi11-card h3 {
          margin: 0 0 12px;
          font-size: 15px;
          line-height: 1.4;
          color: #fff;
        }

        .aditi11-card p {
          margin: 0;
          color: #bfcce0;
          font-size: 13px;
          line-height: 1.65;
        }

        .aditi11-quote {
          max-width: 1150px;
          margin: 30px auto 0;
          padding: 24px 28px;
          border: 1px solid #00d9f555;
          border-radius: 14px;
          background: linear-gradient(100deg, #053344, #160c2b, #380c32);
          box-shadow: 0 0 30px #00d9f50c;
          text-align: center;
          font-size: clamp(18px, 2.2vw, 29px);
          font-weight: 700;
          line-height: 1.55;
          color: #f3fbff;
        }

        .aditi11-thanks {
          margin-top: 24px;
          text-align: center;
          font-size: clamp(22px, 3vw, 38px);
          font-weight: 800;
          letter-spacing: 5px;
          color: #65efff;
          text-shadow: 0 0 22px #00e5ff66;
        }

        .aditi11-subtitle {
          margin: 10px 0 24px;
          text-align: center;
          color: #a6b4cd;
          font-size: 12px;
          letter-spacing: 2px;
        }

        .aditi11-actions {
          display: flex;
          justify-content: center;
          padding-bottom: 10px;
        }

        .aditi11-finish {
          padding: 14px 26px;
          border: 1px solid #ff2da0;
          border-radius: 8px;
          background: #330c2b;
          color: #ff82c5;
          font: inherit;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
          transition: background .2s, box-shadow .2s;
        }

        .aditi11-finish:hover {
          background: #51113e;
          box-shadow: 0 0 24px #ff2da044;
        }

        @media (max-width: 1000px) {
          .aditi11-benefits {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 550px) {
          .aditi11-root {
            padding: 0 10px 110px;
          }

          .aditi11-benefits {
            grid-template-columns: 1fr;
          }

          .aditi11-quote {
            padding: 18px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .aditi11-finish {
            transition: none;
          }
        }
      `}</style>

      <div className="aditi11-banner">
        <span>
          ● PROJECT ADITI • ENGINEERING CAPSTONE PRESENTATION
        </span>
        <span>
          [ ARTIFICIALLY DRIVEN DATA, INFORMATION & TECH INTEGRATION ]
        </span>
      </div>

      <figure className="aditi11-hero">
        <img
          src="/assets/slide_11.png"
          alt="Concept visualization of the ADITI assistive smart-glasses design and future vision"
          loading="eager"
        />
        <figcaption className="aditi11-image-label">
          ◈ ADITI TACTICAL SMART-GLASSES CONCEPT DESIGN
        </figcaption>
      </figure>

      <h2 className="aditi11-section-heading">
        Four Core Project Objectives
      </h2>

      <div className="aditi11-benefits">
        {benefits.map((benefit) => (
          <article
            className={`aditi11-card ${benefit.accent}`}
            key={benefit.number}
          >
            <span className="aditi11-card-number">
              OBJECTIVE {benefit.number}
            </span>
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </article>
        ))}
      </div>

      <blockquote className="aditi11-quote">
        “A world where technology not only sees, but understands what truly matters.”
      </blockquote>

      <div className="aditi11-thanks">
        THANK YOU
      </div>

      <p className="aditi11-subtitle">
        PROJECT ADITI • FINAL ENGINEERING PRESENTATION
      </p>

      {typeof onFinish === "function" && (
        <div className="aditi11-actions">
          <button
            type="button"
            className="aditi11-finish"
            onClick={onFinish}
          >
            ✓ COMPLETE PRESENTATION
          </button>
        </div>
      )}
    </section>
  );
}

export default Slide11ThankYouVision;
