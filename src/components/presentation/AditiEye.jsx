
import './AditiEye.css'

export default function AditiEye() {
  return (
    <div
      className="aditi-eye-stage"
      role="img"
      aria-label="Animated holographic ADITI artificial intelligence eye"
    >
      <div className="aditi-eye-ambient" />

      <div className="aditi-eye-system">
        {/* Rotating holographic rings */}
        <div className="aditi-eye-orbit aditi-eye-orbit-one" />
        <div className="aditi-eye-orbit aditi-eye-orbit-two" />
        <div className="aditi-eye-orbit aditi-eye-orbit-three" />

        {/* HUD crosshairs */}
        <div className="aditi-eye-crosshair aditi-eye-crosshair-h" />
        <div className="aditi-eye-crosshair aditi-eye-crosshair-v" />

        {/* Blink wrapper: animates the eye, not the HUD rings */}
        <div className="aditi-eye-blink-wrapper">
          <svg
            className="aditi-eye-svg"
            viewBox="0 0 400 250"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="aditi-eye-iris-gradient">
                <stop offset="0%" stopColor="#bfffff" />
                <stop offset="45%" stopColor="#00e7ee" />
                <stop offset="100%" stopColor="#03466b" />
              </radialGradient>

              <radialGradient id="aditi-eye-background-gradient">
                <stop offset="0%" stopColor="#0a4056" />
                <stop offset="100%" stopColor="#071222" />
              </radialGradient>

              <filter id="aditi-eye-soft-glow">
                <feGaussianBlur
                  stdDeviation="3"
                  result="blur"
                />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <clipPath id="aditi-eye-clip">
                <path d="M50 125 Q200 5 350 125 Q200 245 50 125Z" />
              </clipPath>
            </defs>

            <g className="aditi-eye-blink">
              {/* Eye outline */}
              <path
                d="M50 125 Q200 5 350 125 Q200 245 50 125Z"
                fill="url(#aditi-eye-background-gradient)"
                stroke="#00e7ee"
                strokeWidth="3"
                filter="url(#aditi-eye-soft-glow)"
              />

              {/* Iris and pupil */}
              <g clipPath="url(#aditi-eye-clip)">
                <g className="aditi-eye-gaze">
                  <circle
                    cx="200"
                    cy="125"
                    r="72"
                    fill="#00e7ee"
                    opacity="0.08"
                  />

                  <circle
                    cx="200"
                    cy="125"
                    r="62"
                    fill="url(#aditi-eye-iris-gradient)"
                    stroke="#aaffff"
                    strokeWidth="2"
                  />

                  <circle
                    cx="200"
                    cy="125"
                    r="49"
                    fill="none"
                    stroke="#caffff"
                    strokeWidth="1"
                    strokeDasharray="3 6"
                  />

                  <circle
                    cx="200"
                    cy="125"
                    r="37"
                    fill="none"
                    stroke="#08394c"
                    strokeWidth="6"
                    opacity="0.7"
                  />

                  <circle
                    cx="200"
                    cy="125"
                    r="28"
                    fill="#020916"
                  />

                  {/* Light reflections */}
                  <circle
                    cx="188"
                    cy="110"
                    r="10"
                    fill="#dfffff"
                    opacity="0.9"
                  />

                  <circle
                    cx="216"
                    cy="141"
                    r="4"
                    fill="#dfffff"
                    opacity="0.45"
                  />
                </g>

                {/* Scanning beam */}
                <path
                  className="aditi-eye-scan"
                  d="M40 125 H360"
                  stroke="#aaffff"
                  strokeWidth="2"
                  opacity="0.55"
                />
              </g>

              {/* Upper and lower eye contours */}
              <path
                d="M50 125 Q200 5 350 125"
                fill="none"
                stroke="#baffff"
                strokeWidth="1.5"
                opacity="0.8"
              />

              <path
                d="M50 125 Q200 245 350 125"
                fill="none"
                stroke="#ff007a"
                strokeWidth="1.5"
                opacity="0.65"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}
