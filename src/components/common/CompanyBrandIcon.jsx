import React from 'react';

/**
 * CompanyBrandIcon renders custom, high-fidelity vector brand marks
 * for the 4 major Indian quick commerce firms.
 */
export default function CompanyBrandIcon({ id, className = "w-5 h-5", showBg = false }) {
  switch (id) {
    case 'blinkit':
      return (
        <div className={`inline-flex items-center justify-center shrink-0 ${showBg ? 'p-1 rounded-lg bg-[#facc15]/20 border border-[#facc15]/40' : ''}`}>
          <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="10" fill="#facc15" />
            {/* Blinkit grocery cart with lightning */}
            <path
              d="M11 13H14.5L17.5 25H29L32 16H15.5"
              stroke="#111827"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="18.5" cy="29.5" r="2" fill="#111827" />
            <circle cx="28" cy="29.5" r="2" fill="#111827" />
            {/* Mini lightning inside cart */}
            <path
              d="M23 14L20.5 19H24.5L22 24"
              stroke="#16a34a"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'zepto':
      return (
        <div className={`inline-flex items-center justify-center shrink-0 ${showBg ? 'p-1 rounded-lg bg-[#ec4899]/20 border border-[#ec4899]/40' : ''}`}>
          <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="10" fill="#ec4899" />
            {/* Zepto Stylized Z with 10-min speed notch */}
            <path
              d="M12 14H28L17 26H28"
              stroke="#ffffff"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Speed dot */}
            <circle cx="28" cy="14" r="2" fill="#38bdf8" />
          </svg>
        </div>
      );

    case 'swiggy_instamart':
    case 'instamart':
      return (
        <div className={`inline-flex items-center justify-center shrink-0 ${showBg ? 'p-1 rounded-lg bg-[#f97316]/20 border border-[#f97316]/40' : ''}`}>
          <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="10" fill="#f97316" />
            {/* Swiggy Instamart Map Pin & Grocery Bag */}
            <path
              d="M20 10C15.58 10 12 13.58 12 18C12 23.5 20 30 20 30C20 30 28 23.5 28 18C28 13.58 24.42 10 20 10Z"
              fill="#ffffff"
            />
            {/* Swiggy orange stylized S inside pin */}
            <path
              d="M21.5 15.5C21.5 15.5 18 16 18 17.5C18 19 22 19 22 20.5C22 22 18.5 22.5 18.5 22.5"
              stroke="#f97316"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );

    case 'bigbasket_now':
    case 'bb_now':
      return (
        <div className={`inline-flex items-center justify-center shrink-0 ${showBg ? 'p-1 rounded-lg bg-[#10b981]/20 border border-[#10b981]/40' : ''}`}>
          <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="10" fill="#047857" />
            {/* BigBasket iconic 'bb' typography */}
            <text
              x="50%"
              y="62%"
              textAnchor="middle"
              fill="#ffffff"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="20"
              fontWeight="900"
              letterSpacing="-1.5"
            >
              bb
            </text>
            {/* Red Tata leaf accent */}
            <circle cx="28.5" cy="14.5" r="3" fill="#ef4444" />
          </svg>
        </div>
      );

    default:
      return (
        <div className={`w-5 h-5 rounded-md bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white ${className}`}>
          QC
        </div>
      );
  }
}

