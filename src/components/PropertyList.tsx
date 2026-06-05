"use client";
import Link from "next/link";
import { Mail, Heart } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";

 // ─── Badge statut ──────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; bg: string; dot: string }> = {
  "VENDU": {
    label: "Vendu",
    bg: "bg-gray-900/90",
    dot: "bg-gray-400",
  },
  "SOUS COMPROMIS": {
    label: "Sous compromis",
    bg: "bg-red-600/90",
    dot: "bg-red-300",
  },
  "SOUS OFFRE": {
    label: "Sous offre",
    bg: "bg-amber-500/90",
    dot: "bg-amber-200",
  },
};

function StatusBadge({ status, small = false }: { status: string; small?: boolean }) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <div 
      className={`
        absolute top-3 left-3 z-10
        flex items-center gap-1.5
        ${config.bg} backdrop-blur-sm
        text-white font-semibold tracking-wide uppercase
        ${small ? "text-[10px] px-2.5 py-1" : "text-xs px-3 py-1.5"} rounded-full shadow-lg
      `}
    >
      <span className={`rounded-full ${config.dot} animate-pulse ${small ? "w-1 h-1" : "w-1.5 h-1.5"}`} />
      {config.label}
    </div>
  );
}

// ─── Carte MOBILE (style LuxuryEstate) ────────────────────────────────────────
function PropertyCardMobile({ property }: { property: any }) {
  return (
    <Link href={`/bien/${property.id}`}>
      <div className={`bg-white ${property.status === "VENDU" ? "opacity-70" : ""}`}>

        {/* IMAGE pleine largeur */}
        <div className="relative w-full h-[240px] overflow-hidden">
          <img
            src={property.image}
            className={`w-full h-full object-cover ${property.status === "VENDU" ? "grayscale" : ""}`}
            alt={property.title}
          />

          {/* Dégradé bas pour lisibilité du prix */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badge statut */}
          {property.status && <StatusBadge status={property.status} small />}

          {/* Prix overlay bas gauche */}
          <div className="absolute bottom-3 left-4">
            <span className="text-white text-[22px] font-bold drop-shadow-lg">
              € {(property.price || 0).toLocaleString("fr-FR")}
            </span>
          </div>

          {/* Favoris bas droite */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="absolute bottom-3 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-rose-400"
          >
            <Heart size={15} />
          </button>
        </div>

        {/* INFOS SOUS IMAGE */}
<div className="px-4 pt-3 pb-2">
  <h3 className="font-bold text-[15px] text-gray-900 leading-snug">
    {property.title}
  </h3>

  <div className="flex items-center gap-4 text-[13px] text-gray-500 mt-2">
    <span className="flex items-center gap-1">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
      </svg>
      {property.surface || 0} m²
    </span>
    <span className="flex items-center gap-1">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      </svg>
      {property.rooms || 0} pièces
    </span>
    <span className="flex items-center gap-1">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 4v16M2 8h18a2 2 0 0 1 0 4H2M2 20h20"/>
      </svg>
      {property.bedrooms || 0} ch.
    </span>
  </div>

  {/* LIGNE : Présenté par + WhatsApp en face */}
  <div className="flex items-center justify-between mt-2 pb-3">
    <p className="text-[13px] text-gray-400">
    Présenté par <span className="text-[#122e53] font-medium">
  {property.agent || "Marchal Immobilier"}
</span> · {property.city}

    </p>
    <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
      <WhatsAppButton
        propertyTitle={property.title}
        propertyId={property.id}
      />
    </div>
  </div>
</div>

      

        <div className="border-b border-gray-100" />
      </div>
    </Link>
  );
}

// ─── Carte DESKTOP (layout horizontal) ────────────────────────────────────────
function PropertyCardDesktop({ property, hoveredId, setHoveredId }: any) {
  return (
    <Link
  href={`/bien/${property.id}`}
  onClick={() => {
    sessionStorage.setItem("recherche_scroll", String(window.scrollY));
  }}
>
      <div
        onMouseEnter={() => setHoveredId?.(property.id)}
        onMouseLeave={() => setHoveredId?.(null)}
        className={`
          flex bg-white transition cursor-pointer
          ${hoveredId === property.id ? "shadow-md" : "hover:shadow-sm"}
          ${property.status === "VENDU" ? "opacity-70" : ""}
        `}
      >
        {/* IMAGE GAUCHE */}
        <div className="relative w-[390px] min-w-[390px] h-[260px] overflow-hidden">
          <img
            src={property.image}
            className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
              property.status === "VENDU" ? "grayscale" : ""
            }`}
            alt={property.title}
          />

          {property.status && <StatusBadge status={property.status} />}

          <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            {property.imageCount || 4}
          </div>
        </div>

        {/* INFOS DROITE */}
        <div className="flex flex-col justify-between p-6 flex-1 border-l border-gray-100">
          <div>
            <h3 className="font-semibold text-[17px] text-gray-900">{property.title}</h3>
            <p className="text-[26px] font-bold text-gray-900 mt-1">
              € {(property.price || 0).toLocaleString("fr-FR")}
            </p>

            <div className="flex items-center gap-4 text-[14px] text-gray-600 mt-3">
              <span className="flex items-center gap-1">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                </svg>
                {property.surface || 0} m²
              </span>
              <span className="flex items-center gap-1">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                </svg>
                {property.rooms || 0} pièces
              </span>
              <span className="flex items-center gap-1">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 4v16M2 8h18a2 2 0 0 1 0 4H2M2 20h20"/>
                </svg>
                {property.bedrooms || 0} ch.
              </span>
            </div>

            <p className="text-[13px] text-gray-500 mt-3 line-clamp-3 leading-relaxed max-w-[520px]">
              {property.description || `Bien situé à ${property.city}`}
            </p>
          </div>

          <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-[13px] text-gray-500">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              {property.city}
            </div>
            <div className="flex items-center gap-2">
            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
  <WhatsAppButton
    propertyTitle={property.title}
    propertyId={property.id}
  />
</div>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-rose-400 hover:border-rose-300 transition"
              >
                <Heart size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Export principal — switch mobile / desktop ────────────────────────────────
export default function PropertyList({ properties, hoveredId, setHoveredId }: any) {
  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {properties?.map((property: any) => (
        <div key={property.id}>
          <div className="block md:hidden">
            <PropertyCardMobile property={property} />
          </div>
          <div className="hidden md:block">
            <PropertyCardDesktop
              property={property}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
            />
          </div>
        </div>
      ))}
    </div>
  );
}