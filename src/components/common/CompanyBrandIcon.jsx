import React, { useState } from 'react';

/**
 * CompanyBrandIcon — Displays the real, official corporate brand icon or logo.
 * All brand assets are stored locally in /public/logos/ to ensure 100% reliability,
 * instant offline loading, and zero dependence on external CDNs or made-up drawings.
 *
 * All brand marks and logos are the property of their respective trademark holders:
 * - Blinkit: © Zomato Limited
 * - Zepto: © KiranaKart Technologies Pvt Ltd
 * - Swiggy Instamart: © Swiggy Limited
 * - BigBasket / BB Now: © Supermarket Grocery Supplies Pvt Ltd / Tata Digital
 * Displayed under nominative fair use for non-commercial academic educational simulation.
 */

const BASE = import.meta.env.BASE_URL || '/';
const cleanBase = BASE.endsWith('/') ? BASE : `${BASE}/`;

// Real official brand asset paths (PNG 512px app icon & vector SVG)
const BRAND_ASSETS = {
  blinkit: {
    name: 'Blinkit',
    icon: `${cleanBase}logos/blinkit_icon.png`,
    svg: `${cleanBase}logos/blinkit.svg`,
    bg: 'bg-[#F8CB46]/20 border-[#F8CB46]/50 shadow-[#F8CB46]/20',
    color: '#facc15',
  },
  zepto: {
    name: 'Zepto',
    icon: `${cleanBase}logos/zepto_icon.png`,
    svg: `${cleanBase}logos/zepto.svg`,
    bg: 'bg-[#3b0764]/40 border-[#db2777]/50 shadow-[#db2777]/20',
    color: '#ec4899',
  },
  swiggy_instamart: {
    name: 'Swiggy Instamart',
    icon: `${cleanBase}logos/swiggy_icon.png`,
    svg: `${cleanBase}logos/swiggy.svg`,
    bg: 'bg-[#FC8019]/20 border-[#FC8019]/50 shadow-[#FC8019]/20',
    color: '#f97316',
  },
  swiggy: {
    name: 'Swiggy',
    icon: `${cleanBase}logos/swiggy_icon.png`,
    svg: `${cleanBase}logos/swiggy.svg`,
    bg: 'bg-[#FC8019]/20 border-[#FC8019]/50 shadow-[#FC8019]/20',
    color: '#f97316',
  },
  instamart: {
    name: 'Swiggy Instamart',
    icon: `${cleanBase}logos/swiggy_icon.png`,
    svg: `${cleanBase}logos/swiggy.svg`,
    bg: 'bg-[#FC8019]/20 border-[#FC8019]/50 shadow-[#FC8019]/20',
    color: '#f97316',
  },
  bigbasket_now: {
    name: 'BB Now',
    icon: `${cleanBase}logos/bigbasket_icon.png`,
    svg: `${cleanBase}logos/bigbasket.svg`,
    bg: 'bg-[#044E3B]/40 border-[#10b981]/50 shadow-[#10b981]/20',
    color: '#10b981',
  },
  bb_now: {
    name: 'BB Now',
    icon: `${cleanBase}logos/bigbasket_icon.png`,
    svg: `${cleanBase}logos/bigbasket.svg`,
    bg: 'bg-[#044E3B]/40 border-[#10b981]/50 shadow-[#10b981]/20',
    color: '#10b981',
  },
  bigbasket: {
    name: 'BigBasket',
    icon: `${cleanBase}logos/bigbasket_icon.png`,
    svg: `${cleanBase}logos/bigbasket.svg`,
    bg: 'bg-[#044E3B]/40 border-[#10b981]/50 shadow-[#10b981]/20',
    color: '#10b981',
  },
};

export default function CompanyBrandIcon({
  id,
  className = 'w-6 h-6',
  variant = 'icon', // 'icon' (512px app icon) | 'logo' (vector SVG)
  showBg = false,
  alt = '',
}) {
  const normId = (id || '').toLowerCase();
  const brand = BRAND_ASSETS[normId];
  const [imgFailed, setImgFailed] = useState(false);

  const bgClass = brand?.bg || 'bg-slate-800/60 border-slate-700/60 shadow-slate-900/40';
  const wrapClass = `inline-flex items-center justify-center shrink-0 transition-all ${
    showBg ? `p-1 rounded-xl border backdrop-blur-md shadow-md ${bgClass}` : ''
  }`;

  const imageSrc = variant === 'logo' ? (brand?.svg || brand?.icon) : (brand?.icon || brand?.svg);
  const altText = alt || brand?.name || id || 'Brand Logo';

  if (imageSrc && !imgFailed) {
    return (
      <div className={wrapClass}>
        <img
          src={imageSrc}
          alt={altText}
          className={`${className} object-contain rounded-lg shrink-0`}
          onError={() => setImgFailed(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // Graceful initial fallback if file missing
  return (
    <div className={wrapClass}>
      <div
        className={`${className} rounded-lg flex items-center justify-center font-bold text-white font-sans shrink-0 text-xs shadow-inner`}
        style={{ backgroundColor: brand?.color || '#475569' }}
      >
        {(brand?.name || id || 'C').charAt(0)}
      </div>
    </div>
  );
}
