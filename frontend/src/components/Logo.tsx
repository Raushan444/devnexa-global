import React from "react";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function Logo({ className = "", iconOnly = false }: LogoProps) {
  // Gradients and paths matching the uploaded logo sheet
  return (
    <div className={`flex items-center gap-4 select-none ${className}`}>
      {/* Complete Logo Lockup */}
      <svg
        width={iconOnly ? "48" : "240"}
        height="48"
        viewBox={iconOnly ? "0 0 100 100" : "0 0 420 85"}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          {/* Blue-Cyan Gradient for D */}
          <linearGradient id="d-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* Blue-Purple-Pink Gradient for N */}
          <linearGradient id="n-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#D946EF" />
          </linearGradient>

          {/* Text NEXA Gradient */}
          <linearGradient id="text-nexa-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#D946EF" />
          </linearGradient>

          {/* Thin Lines Divider Gradients */}
          <linearGradient id="line-left-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D946EF" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="line-right-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#D946EF" />
          </linearGradient>
        </defs>

        {/* ====================================================== */}
        {/* LOGO ICON ("DN" Monogram) */}
        {/* ====================================================== */}
        <g transform="translate(0, 0)">
          {/* Styled D Loop */}
          <path
            d="M 12 18 
               L 48 18 
               C 62 18, 68 25, 60 36 
               L 45 56 
               C 38 66, 26 72, 12 72
               L 8 72 
               L 26 72 
               C 38 72, 48 66, 54 56 
               L 66 42 
               L 52 42 
               L 45 52 
               C 42 56, 35 56, 35 56 
               L 24 56 
               L 36 40 
               L 46 26 
               C 50 22, 42 22, 42 22
               L 28 22
               L 16 38 
               Z"
            fill="url(#d-gradient)"
          />

          {/* Inner slant line for D */}
          <path
            d="M 32 30 
               L 20 48 
               L 26 48 
               L 38 30 
               Z"
            fill="#00E5FF"
          />

          {/* Styled N Loop */}
          <path
            d="M 46 18 
               L 68 18 
               C 70 18, 74 20, 74 23 
               L 74 72 
               L 66 72 
               L 66 32 
               L 46 62 
               L 38 62 
               Z"
            fill="url(#n-gradient)"
          />

          {/* Ascending Pixel Cubes on the top-right */}
          <rect x="70" y="10" width="6" height="6" fill="#D946EF" />
          <rect x="78" y="10" width="6" height="6" fill="#00E5FF" />
          <rect x="78" y="2" width="6" height="6" fill="#D946EF" />
        </g>

        {/* ====================================================== */}
        {/* BRAND TEXT & TAGLINES (Only shown when not iconOnly) */}
        {/* ====================================================== */}
        {!iconOnly && (
          <g transform="translate(100, 0)">
            {/* DEVNEXA Styled Text */}
            {/* D */}
            <path d="M 12 18 L 22 18 C 28 18 31 21 31 26 L 31 32 C 31 37 28 40 22 40 L 12 40 Z M 17 23 L 17 35 L 22 35 C 24 35 26 34 26 32 L 26 26 C 26 24 24 23 22 23 Z" fill="#FFFFFF" />
            {/* E */}
            <path d="M 38 18 L 51 18 L 51 22 L 43 22 L 43 27 L 50 27 L 50 31 L 43 31 L 43 36 L 51 36 L 51 40 L 38 40 Z" fill="#FFFFFF" />
            {/* V */}
            <path d="M 57 18 L 62 18 L 68 34 L 74 18 L 79 18 L 71 40 L 65 40 Z" fill="#FFFFFF" />

            {/* NEXA (Gradient) */}
            {/* N */}
            <path d="M 87 18 L 92 18 L 102 33 L 102 18 L 107 18 L 107 40 L 102 40 L 92 25 L 92 40 L 87 40 Z" fill="url(#text-nexa-grad)" />
            {/* E */}
            <path d="M 115 18 L 128 18 L 128 22 L 120 22 L 120 27 L 127 27 L 127 31 L 120 31 L 120 36 L 128 36 L 128 40 L 115 40 Z" fill="url(#text-nexa-grad)" />
            {/* X */}
            <path d="M 136 18 L 141 18 L 147 27 L 153 18 L 158 18 L 150 29 L 158 40 L 153 40 L 147 31 L 141 40 L 136 40 L 144 29 Z" fill="url(#text-nexa-grad)" />
            {/* A */}
            <path d="M 169 18 L 175 18 L 183 40 L 178 40 L 176 34 L 168 34 L 166 40 L 161 40 Z M 174 29 L 171 22 L 169 29 Z" fill="url(#text-nexa-grad)" />

            {/* — DEVNEXA GLOBAL — Subtitle with Gradient Borders */}
            <rect x="12" y="52" width="30" height="1.5" fill="url(#line-left-grad)" />
            <text
              x="100"
              y="56"
              fill="#FFFFFF"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="10"
              fontWeight="bold"
              letterSpacing="0.25em"
              textAnchor="middle"
            >
              DEVNEXA GLOBAL
            </text>
            <rect x="158" y="52" width="30" height="1.5" fill="url(#line-right-grad)" />

            {/* BUILDING DIGITAL. ELEVATING BRANDS. Tagline */}
            <text
              x="100"
              y="74"
              fill="#94A3B8"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="8.5"
              fontWeight="600"
              letterSpacing="0.18em"
              textAnchor="middle"
            >
              BUILDING DIGITAL. ELEVATING BRANDS.
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
