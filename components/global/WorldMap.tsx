'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Country {
  name: string;
  coords: [number, number]; // [lat, lng]
  contacts: Array<{ name: string; email: string; phone: string }>;
  flag: string;
}

const countries: Country[] = [
  {
    name: 'United Arab Emirates',
    coords: [24.45, 54.38],
    contacts: [
      { name: 'Mr. Abdul Kabeer', email: 'gm@horecahost.com', phone: '+971 50 307 9863' },
      { name: 'Mr. Irshad Ahmed', email: 'irshad@horecahost.com', phone: '+971 50 7758742' },
      { name: 'Mr. Mohammed', email: 'mohammed@horecahost.com', phone: '+971 50 462 4324' },
    ],
    flag: '🇦🇪',
  },
  {
    name: 'United States',
    coords: [30.27, -97.74],
    contacts: [{ name: 'Mr. Shaik', email: 'shaik@horecahost.com', phone: '+1 512 294 3836' }],
    flag: '🇺🇸',
  },
  {
    name: 'Malaysia',
    coords: [4.21, 101.69],
    contacts: [{ name: 'Mr. Meera', email: 'hhm@horecahost.com', phone: '+60 178 702 132' }],
    flag: '🇲🇾',
  },
  {
    name: 'Italy',
    coords: [43.55, 12.57],
    contacts: [{ name: 'Mr. Fedreico', email: 'hhit@horecahost.com', phone: '+39 342 993 5695' }],
    flag: '🇮🇹',
  },
  {
    name: 'Mauritius',
    coords: [-20.35, 57.55],
    contacts: [{ name: 'Mr. Sahabooleea', email: 'sn@horecahost.com', phone: '+230 57 348 666' }],
    flag: '🇲🇺',
  },
  {
    name: 'Bahrain',
    coords: [26.07, 50.56],
    contacts: [
      { name: 'Mr. Gani', email: 'gani@horecahost.com', phone: '+973 3332 2762' },
      { name: 'Mr. Hansul', email: 'hansul@horecahost.com', phone: '+973 3338 1762' },
    ],
    flag: '🇧🇭',
  },
  {
    name: 'Qatar',
    coords: [25.29, 51.53],
    contacts: [{ name: 'Mr. Hakkim', email: 'hhqt@horecahost.com', phone: '+974 3083 9587' }],
    flag: '🇶🇦',
  },
  {
    name: 'India',
    coords: [20.59, 78.96],
    contacts: [{ name: 'Mr. Mahadeer', email: 'hhin@horecahost.com', phone: '+91 9629 505 892' }],
    flag: '🇮🇳',
  },
  {
    name: 'Kenya',
    coords: [-1.29, 36.82],
    contacts: [{ name: 'Mr. Arvind', email: 'arvind@horecahost.com', phone: '+254 717 445 591' }],
    flag: '🇰🇪',
  },
];

// Convert lat/lng to SVG coordinates (simple mercator-like projection)
const latLngToSvg = (lat: number, lng: number, width: number, height: number) => {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
};

export default function WorldMap() {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const svgWidth = 1200;
  const svgHeight = 600;

  const points = countries.map((country) => ({
    ...country,
    svg: latLngToSvg(country.coords[0], country.coords[1], svgWidth, svgHeight),
  }));

  return (
    <div className="w-full bg-linear-to-b from-gray-50 to-white py-12 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Global Network</h2>
          <p className="text-gray-600">Connected across 9 countries, serving hospitality businesses worldwide</p>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 p-4">
          <svg
            width="100%"
            height="600"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
            style={{ backgroundColor: '#f5f5f5', minHeight: '400px' }}
          >
            {/* World map background grid */}
            <defs>
              <linearGradient id="mapGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e5e7eb" />
                <stop offset="100%" stopColor="#f3f4f6" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="pulse" r="50%">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Map background */}
            <rect width={svgWidth} height={svgHeight} fill="url(#mapGradient)" />

            {/* Grid lines */}
            {Array.from({ length: 13 }).map((_, i) => (
              <line
                key={`lng-${i}`}
                x1={(svgWidth / 12) * i}
                y1="0"
                x2={(svgWidth / 12) * i}
                y2={svgHeight}
                stroke="#d1d5db"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <line
                key={`lat-${i}`}
                x1="0"
                y1={(svgHeight / 6) * i}
                x2={svgWidth}
                y2={(svgHeight / 6) * i}
                stroke="#d1d5db"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}

            {/* Connection lines */}
            {points.map((point1, i) =>
              points.slice(i + 1).map((point2, j) => (
                <motion.line
                  key={`line-${i}-${i + j + 1}`}
                  x1={point1.svg.x}
                  y1={point1.svg.y}
                  x2={point2.svg.x}
                  y2={point2.svg.y}
                  stroke="#fca5a5"
                  strokeWidth="1"
                  opacity="0.3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: i * 0.1 }}
                />
              ))
            )}

            {/* Country nodes */}
            {points.map((point, index) => (
              <motion.g
                key={`country-${index}`}
                onMouseEnter={() => setHoveredCountry(point.name)}
                onMouseLeave={() => setHoveredCountry(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Pulsing background circle */}
                {hoveredCountry === point.name && (
                  <motion.circle
                    cx={point.svg.x}
                    cy={point.svg.y}
                    r="25"
                    fill="url(#pulse)"
                    animate={{ r: [25, 35, 25] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Main node circle */}
                <motion.circle
                  cx={point.svg.x}
                  cy={point.svg.y}
                  r="8"
                  fill={hoveredCountry === point.name ? '#dc2626' : '#991b1b'}
                  stroke="#fca5a5"
                  strokeWidth="2"
                  filter="url(#glow)"
                  animate={
                    hoveredCountry === point.name
                      ? { r: 12, fill: '#dc2626' }
                      : { r: 8, fill: '#991b1b' }
                  }
                  transition={{ duration: 0.3 }}
                />

                {/* Animated ring on hover */}
                {hoveredCountry === point.name && (
                  <motion.circle
                    cx={point.svg.x}
                    cy={point.svg.y}
                    r="12"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2"
                    initial={{ r: 12, opacity: 1 }}
                    animate={{ r: 25, opacity: 0 }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </motion.g>
            ))}
          </svg>
        </div>

        {/* Country cards below map */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {countries.map((country) => (
            <motion.div
              key={country.name}
              className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-red-300 hover:shadow-md transition-all"
              whileHover={{ y: -4 }}
              onMouseEnter={() => setHoveredCountry(country.name)}
              onMouseLeave={() => setHoveredCountry(null)}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{country.flag}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm">{country.name}</h3>
                  <div className="mt-2 space-y-1">
                    {country.contacts.map((contact, i) => (
                      <div key={i} className="text-xs">
                        <p className="text-gray-900 font-semibold">{contact.name}</p>
                        <a
                          href={`tel:${contact.phone.replace(/\s/g, '')}`}
                          className="text-red-600 hover:text-red-700 text-xs"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
