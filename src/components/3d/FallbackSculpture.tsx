'use client';

export function FallbackSculpture() {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none"
      aria-label="Hopepitome Architectural Sculpture (Isometric Graphic Fallback)"
    >
      <div className="relative w-[340px] h-[460px] md:w-[480px] md:h-[620px]">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute inset-0 bg-radial-gradient from-cobalt-blue/10 via-transparent to-transparent pointer-events-none blur-3xl opacity-60" />

        <svg
          viewBox="0 0 500 650"
          className="w-full h-full drop-shadow-2xl overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Structural Grid Coordinates */}
          <line
            x1="50"
            y1="325"
            x2="450"
            y2="325"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeDasharray="4 8"
          />
          <line
            x1="250"
            y1="50"
            x2="250"
            y2="600"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeDasharray="4 8"
          />

          {/* Primary Orbital Metallic Ring */}
          <ellipse
            cx="250"
            cy="320"
            rx="210"
            ry="75"
            transform="rotate(-24 250 320)"
            stroke="url(#silverGradient)"
            strokeWidth="1.8"
            opacity="0.85"
          />

          {/* Secondary Counter Ring */}
          <ellipse
            cx="250"
            cy="320"
            rx="235"
            ry="55"
            transform="rotate(32 250 320)"
            stroke="url(#cobaltGradient)"
            strokeWidth="1.2"
            opacity="0.65"
          />

          {/* Main Smoked Glass Monolith - Rear Face */}
          <polygon
            points="180,120 320,100 320,480 180,500"
            fill="#101318"
            stroke="#262b35"
            strokeWidth="1.5"
            opacity="0.9"
          />

          {/* Front Beveled Smoked Glass Prism */}
          <polygon
            points="210,160 350,140 350,520 210,540"
            fill="url(#glassGradient)"
            stroke="rgba(200, 203, 208, 0.35)"
            strokeWidth="1.5"
          />

          {/* Isometric Depth Connector */}
          <polygon
            points="180,120 210,160 350,140 320,100"
            fill="#1c2029"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1"
          />

          {/* Transverse Cross Rod */}
          <line
            x1="80"
            y1="220"
            x2="420"
            y2="220"
            stroke="url(#silverGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Internal Cobalt Core Octahedron */}
          <polygon
            points="250,290 275,320 250,350 225,320"
            fill="#1f51ff"
            opacity="0.85"
            filter="drop-shadow(0 0 12px rgba(31, 81, 255, 0.8))"
          />

          {/* Precision Metric Hairline Labels */}
          <text
            x="360"
            y="135"
            fill="#8e9299"
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="2"
          >
            SYS_REF // 01.A
          </text>
          <text
            x="90"
            y="210"
            fill="#8e9299"
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="2"
          >
            AXIS_D9
          </text>
          <text
            x="240"
            y="575"
            fill="#8e9299"
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="2"
          >
            [ SCULPT_HOPEPITOME_V2 ]
          </text>

          {/* Datum Nodes */}
          <circle cx="80" cy="220" r="3" fill="#1f51ff" />
          <circle cx="420" cy="220" r="3" fill="#c8cbd0" />
          <circle cx="350" cy="140" r="3" fill="#1f51ff" />

          {/* Linear Gradients */}
          <defs>
            <linearGradient id="silverGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e3e5e8" />
              <stop offset="50%" stopColor="#9ea2a8" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="cobaltGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1f51ff" />
              <stop offset="100%" stopColor="#0a2599" />
            </linearGradient>
            <linearGradient id="glassGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1b2029" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#111419" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0b0e12" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
