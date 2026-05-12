"use client";
import Link from "next/link";
import { Heart } from "lucide-react";

// ─── Badge statut (identique à PropertyList) ──────────────────────────────────
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

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <div
      className={`
        absolute top-2 left-2 z-10
        flex items-center gap-1.5
        ${config.bg} backdrop-blur-sm
        text-white text-[10px] font-semibold tracking-wide uppercase
        px-2.5 py-1 rounded-full shadow-md
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      {config.label}
    </div>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────
export default function PropertyListMap({ properties, hoveredId, setHoveredId }: any) {
  return (
    <div className="flex flex-col gap-0 divide-y divide-gray-100">
      {properties?.map((property: any) => (
        <Link key={property.id} href={`/bien/${property.id}`}>
          <div
            onMouseEnter={() => setHoveredId?.(property.id)}
            onMouseLeave={() => setHoveredId?.(null)}
            className={`
              bg-white cursor-pointer transition pb-4
              ${hoveredId === property.id ? "opacity-90" : ""}
              ${property.status === "VENDU" ? "opacity-60" : ""}
            `}
          >
            {/* IMAGE */}
            <div className="relative w-full h-[190px] overflow-hidden">
              <img
                src={property.image}
                className={`w-full h-full object-cover ${
                  property.status === "VENDU" ? "grayscale" : ""
                }`}
                alt={property.title}
              />

              {/* BADGE STATUT */}
              {property.status && <StatusBadge status={property.status} />}

              {/* PRIX + ACTIONS overlay bas */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-3 pb-3">
                <div className="bg-black/60 backdrop-blur-sm text-white text-[15px] font-bold px-3 py-1 rounded">
                  € {(property.price || 0).toLocaleString("fr-FR")}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-rose-400 hover:bg-white"
                  >
                    <Heart size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* INFOS SOUS IMAGE */}
            <div className="pt-3 px-1">
              <h3 className="font-semibold text-[13px] text-gray-900 leading-snug line-clamp-2">
                {property.title}
              </h3>

              <div className="flex items-center gap-3 text-[12px] text-gray-500 mt-2">
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                  </svg>
                  {property.surface || 0} m²
                </span>
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  </svg>
                  {property.rooms || 0} pièces
                </span>
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 4v16M2 8h18a2 2 0 0 1 0 4H2M2 20h20"/>
                  </svg>
                  {property.bedrooms || 0} ch.
                </span>
              </div>

              {/* VILLE / AGENT */}
              <p className="text-[14px] text-gray-400 mt-2">
              <span className="text-[#122e53] font-medium">
  {property.agent ? `Présenté par ${property.agent}` : property.city}
</span>
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
