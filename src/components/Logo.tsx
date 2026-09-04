import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const [imgError, setImgError] = useState(false);

  const dimensions = {
    xs: 'w-7 h-7',
    sm: 'w-10 h-10',
    md: 'w-12 h-12 sm:w-14 sm:h-14',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
  }[size];

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {!imgError ? (
        <img
          src="/ansama_logo.png"
          alt="ANSAMA"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className={`${dimensions} object-contain rounded-lg drop-shadow-sm`}
        />
      ) : (
        /* Precise SVG vector recreation of the uploaded ANSAMA logo */
        <div className={`${dimensions} flex items-center justify-center`}>
          <svg
            viewBox="0 0 400 380"
            className="w-full h-full drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Stylized letter A */}
            <g>
              {/* Left Leg: Dark Charcoal to Black Gradient */}
              <defs>
                <linearGradient id="charcoalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="50%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="30%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
                <linearGradient id="swooshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#b91c1c" />
                </linearGradient>
              </defs>

              {/* Left slanted arm of A */}
              <polygon points="190,40 145,40 45,260 105,260 155,145 190,40" fill="url(#charcoalGrad)" />

              {/* Right slanted arm of A */}
              <polygon points="190,40 235,40 335,260 275,260 225,145 190,40" fill="url(#redGrad)" />

              {/* Center crossbar */}
              <polygon points="120,185 260,185 245,215 135,215" fill="#0f172a" />

              {/* Dynamic curved orbital swoosh in red with white accent border */}
              <path
                d="M 30,265 C 20,260 80,180 180,140 C 270,105 340,60 375,55 C 385,55 350,110 260,170 C 170,225 80,270 30,265 Z"
                fill="url(#swooshGrad)"
              />
              <path
                d="M 40,260 C 100,240 180,190 260,140 C 330,100 370,60 370,60"
                stroke="#ffffff"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.9"
              />
            </g>

            {/* ANSAMA Wordmark */}
            {showText && (
              <text
                x="200"
                y="345"
                textAnchor="middle"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontStyle="italic"
                fontWeight="900"
                fontSize="54"
                letterSpacing="6"
                fill="#dc2626"
                stroke="#0f172a"
                strokeWidth="1.5"
              >
                ANSAMA
              </text>
            )}
          </svg>
        </div>
      )}
    </div>
  );
};
