import React from 'react';

/**
 * CompanyBrandIcon renders custom, high-fidelity vector brand marks
 * faithful to the actual corporate identities of the 4 major Indian quick commerce firms.
 */
export default function CompanyBrandIcon({ id, className = "w-5 h-5", showBg = false }) {
  const normId = (id || '').toLowerCase();

  switch (normId) {
    case 'blinkit':
      return (
        <div className={`inline-flex items-center justify-center shrink-0 ${showBg ? 'p-1.5 rounded-xl bg-[#F8CB46]/20 border border-[#F8CB46]/40' : ''}`}>
          <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Blinkit Iconic Bright Yellow Rounded Badge */}
            <rect width="48" height="48" rx="12" fill="#F8CB46" />
            
            {/* Official Blinkit Stylized Typography / Monogram */}
            {/* Bold black 'b' with green dot/accent */}
            <path
              d="M14 11V37H22.5C27.5 37 31 34 31 29.5C31 26.2 29 23.5 25.5 22.8C28.2 22 30 19.5 30 16.5C30 12.8 26.8 11 22 11H14Z"
              fill="#18181B"
            />
            {/* Cutouts for 'b' counters */}
            <path
              d="M19 15.5H22C24.5 15.5 25.8 16.5 25.8 18.2C25.8 20 24.5 21 22 21H19V15.5Z"
              fill="#F8CB46"
            />
            <path
              d="M19 25.5H22.5C25.2 25.5 26.8 26.8 26.8 29C26.8 31.2 25.2 32.5 22.5 32.5H19V25.5Z"
              fill="#F8CB46"
            />
            {/* Iconic Blinkit Emerald Lightning Dot */}
            <circle cx="35" cy="14" r="4" fill="#0C831F" />
            <path
              d="M35 12L33.5 14.5H36.5L35 17"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    case 'zepto':
      return (
        <div className={`inline-flex items-center justify-center shrink-0 ${showBg ? 'p-1.5 rounded-xl bg-[#FF3269]/20 border border-[#FF3269]/40' : ''}`}>
          <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Zepto Deep Plum / Night Purple Badge */}
            <rect width="48" height="48" rx="12" fill="#2B0038" />
            
            {/* Zepto Signature Electric Magenta Angled 'Z' */}
            <path
              d="M12 14.5H35L19.5 33.5H36"
              stroke="#FF3269"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Cyan 10-Minute Speed Accent */}
            <circle cx="36" cy="14.5" r="3.2" fill="#00D2FF" />
            <path
              d="M12 33.5H15"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );

    case 'swiggy_instamart':
    case 'instamart':
    case 'swiggy':
      return (
        <div className={`inline-flex items-center justify-center shrink-0 ${showBg ? 'p-1.5 rounded-xl bg-[#FC8019]/20 border border-[#FC8019]/40' : ''}`}>
          <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Swiggy Vibrant Orange Badge */}
            <rect width="48" height="48" rx="12" fill="#FC8019" />
            
            {/* Swiggy Official Location Pin Silhouette */}
            <path
              d="M24 8C17.37 8 12 13.37 12 20C12 28.5 24 39 24 39C24 39 36 28.5 36 20C36 13.37 30.63 8 24 8Z"
              fill="#FFFFFF"
            />
            {/* Swiggy Orange 'S' inside Pin */}
            <path
              d="M26.2 15C26.2 15 21.5 15.6 21.5 17.8C21.5 20.2 26.8 20.6 26.8 23.2C26.8 25.8 22 26.5 22 26.5"
              stroke="#FC8019"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Instamart Sub-Badge Accent */}
            <rect x="15" y="32" width="18" height="6" rx="3" fill="#2B1055" />
            <text x="24" y="36.5" textAnchor="middle" fill="#FFFFFF" fontSize="4.5" fontFamily="sans-serif" fontWeight="900" letterSpacing="0.4">
              INSTA
            </text>
          </svg>
        </div>
      );

    case 'bigbasket_now':
    case 'bb_now':
    case 'bigbasket':
      return (
        <div className={`inline-flex items-center justify-center shrink-0 ${showBg ? 'p-1.5 rounded-xl bg-[#047857]/20 border border-[#047857]/40' : ''}`}>
          <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* BigBasket Deep Forest Green Badge */}
            <rect width="48" height="48" rx="12" fill="#044E3B" />
            
            {/* Iconic Red 'bb' Tata Accent Circle */}
            <circle cx="24" cy="24" r="16" fill="#D32F2F" />
            
            {/* Iconic lowercase 'bb' typography */}
            <text
              x="23.5"
              y="29.5"
              textAnchor="middle"
              fill="#FFFFFF"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="18"
              fontWeight="900"
              letterSpacing="-1.2"
            >
              bb
            </text>
            {/* Tata Green Sprout / Leaf on the right */}
            <circle cx="34" cy="13" r="3.5" fill="#84CC16" />
          </svg>
        </div>
      );

    default:
      return (
        <div className={`inline-flex items-center justify-center shrink-0 ${showBg ? 'p-1.5 rounded-xl bg-slate-800 border border-slate-700' : ''}`}>
          <svg className={className} viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="#1E293B" />
            <circle cx="24" cy="24" r="8" fill="#94A3B8" />
          </svg>
        </div>
      );
  }
}
