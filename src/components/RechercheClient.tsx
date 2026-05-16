"use client";

import { useSearchParams } from "next/navigation";
import PropertyMap from "@/components/PropertyMap";
import PropertyList from "@/components/PropertyList";
import PropertyListMap from "@/components/PropertyListMap";
import { useState, useEffect, useRef } from "react";
import { LayoutGrid, Map, SlidersHorizontal, Home, BedDouble, Maximize, MapPin, Navigation } from "lucide-react";

// ─── Constantes ────────────────────────────────────────────────────────────────
const TRANSACTION_OPTIONS = [
  { value: "vente",          label: "À vendre"      },
  { value: "location",       label: "À louer"        },
  { value: "professionnels", label: "Professionnels" },
];

const RADIUS_OPTIONS = [
  { value: "1",  label: "1 km"    },
  { value: "5",  label: "5 km"    },
  { value: "10", label: "10 km"   },
  { value: "20", label: "20 km"   },
  { value: "50", label: "20 km +" },
];

const transactionLabel = (val: string) =>
  TRANSACTION_OPTIONS.find((o) => o.value === val)?.label ?? "À vendre";

const radiusLabel = (val: string) =>
  RADIUS_OPTIONS.find((o) => o.value === val)?.label ?? "Rayon";

// ─── Haversine : distance en km entre deux points GPS ─────────────────────────
function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R    = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Géocodage Mapbox côté client (même token que hektorParser) ───────────────
const geoCache: Record<string, { lat: number; lng: number } | null> = {};

async function geocodeQuery(
  query: string
): Promise<{ lat: number; lng: number } | null> {
  if (query in geoCache) return geoCache[query];
  try {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const url   = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?access_token=${token}&country=fr&limit=1`;
    const res  = await fetch(url);
    const data = await res.json();
    const c    = data?.features?.[0]?.center;
    if (c) {
      const result = { lat: c[1], lng: c[0] };
      geoCache[query] = result;
      return result;
    }
  } catch {}
  geoCache[query] = null;
  return null;
}

// ─── Tag filtre actif ──────────────────────────────────────────────────────────
function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div
      onClick={onRemove}
      className="px-3 py-1 bg-[#122e53] text-white text-xs rounded-full cursor-pointer hover:bg-[#0f2442] transition-colors flex items-center gap-1"
    >
      {label} <span className="opacity-70">✕</span>
    </div>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────
export default function RechercheClient() {

  const params      = useSearchParams();
  const urlTx       = params.get("transaction");
  const urlLocation = params.get("location");
  const urlPrice    = params.get("price");
  const urlRadius   = params.get("radius");

  const [hoveredId,    setHoveredId]    = useState<string | null>(null);
  const [properties,   setProperties]   = useState<any[]>([]);
  const [view,         setView]         = useState<"list" | "map">("list");
  const [sort,         setSort]         = useState<"price_desc" | "price_asc" | "surface_asc" | "surface_desc">("price_desc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Centre géo résolu par Mapbox (null tant que pas encore géocodé)
  const [geoCenter, setGeoCenter] = useState<{ lat: number; lng: number } | null>(null);
  const geoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [filters, setFilters] = useState({
    amenities:   [] as string[],
    type:        "Tous",
    transaction: urlTx       || "vente",
    priceMax:    urlPrice    || "",
    bedrooms:    "",
    bathrooms:   "",
    surface:     "",
    location:    urlLocation || "",
    radius:      urlRadius   || "5",
  });

  const [loading, setLoading] = useState(true);

  // Chargement des biens
  useEffect(() => {
    fetch("/api/properties")
      .then(res => res.json())
      .then(data => { setProperties(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Sync depuis URL au premier chargement
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      location:    urlLocation || "",
      transaction: urlTx       || "vente",
      priceMax:    urlPrice    || "",
      radius:      urlRadius   || "5",
    }));
  }, [urlLocation, urlTx, urlPrice, urlRadius]);

  // Géocodage différé (600 ms debounce) à chaque changement de ville
  useEffect(() => {
    if (geoTimerRef.current) clearTimeout(geoTimerRef.current);
    if (!filters.location.trim()) { setGeoCenter(null); return; }
    geoTimerRef.current = setTimeout(async () => {
      const coords = await geocodeQuery(filters.location.trim());
      setGeoCenter(coords);
    }, 600);
    return () => { if (geoTimerRef.current) clearTimeout(geoTimerRef.current); };
  }, [filters.location]);

  // ─── Filtrage ───────────────────────────────────────────────────────────────
  const parseMin = (val: string) => parseInt(val.replace("+", ""));

  const filteredProperties = Array.isArray(properties)
    ? properties.filter((p) => {
        // Équipements
        if (
          filters.amenities.length > 0 &&
          !filters.amenities.every(a => p.amenities?.includes(a))
        ) return false;

        // Type
        if (
          filters.type !== "Tous" &&
          !p.type?.toLowerCase().includes(filters.type.toLowerCase())
        ) return false;

        // Transaction
        if (filters.transaction && p.transaction !== filters.transaction) return false;

        // Prix
        if (filters.priceMax && filters.priceMax !== "unlimited" && p.price > Number(filters.priceMax)) return false;

        // Chambres / surface
        if (filters.bedrooms && (p.bedrooms || 0) < parseMin(filters.bedrooms)) return false;
        if (filters.surface && filters.surface !== "" && (p.surface || 0) < Number(filters.surface)) return false;

        // ── Rayon ──────────────────────────────────────────────────────────
        if (filters.location.trim()) {
          if (geoCenter && p.lat && p.lng && filters.radius !== "50") {
            // Filtre distance Haversine (désactivé si "20 km+" = tous les biens)
            const dist  = haversineKm(geoCenter.lat, geoCenter.lng, p.lat, p.lng);
            const maxKm = Number(filters.radius);
            if (dist > maxKm) return false;
          } else {
            // Fallback texte le temps que le géocodage arrive
            const q = filters.location.toLowerCase();
            if (
              !p.city?.toLowerCase().includes(q) &&
              !p.postalCode?.toLowerCase().includes(q) &&
              !p.title?.toLowerCase().includes(q)
            ) return false;
          }
        }

        return true;
      })
    : [];

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sort) {
      case "price_asc":    return (a.price   || 0) - (b.price   || 0);
      case "price_desc":   return (b.price   || 0) - (a.price   || 0);
      case "surface_asc":  return (a.surface || 0) - (b.surface || 0);
      case "surface_desc": return (b.surface || 0) - (a.surface || 0);
      default:             return 0;
    }
  });

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const toggleAmenity   = (v: string) =>
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(v)
        ? prev.amenities.filter(a => a !== v)
        : [...prev.amenities, v],
    }));

  const setTransaction  = (v: string) => { setFilters(p => ({ ...p, transaction: v })); setOpenDropdown(null); };
  const setType         = (v: string) => { setFilters(p => ({ ...p, type:        v })); setOpenDropdown(null); };
  const setRadius       = (v: string) => { setFilters(p => ({ ...p, radius:      v })); setOpenDropdown(null); };
  const toggleDropdown  = (n: string) => setOpenDropdown(openDropdown === n ? null : n);
  const isActive        = (v: string) => filters.amenities.includes(v);

  const resetFilters = () => setFilters({
    amenities: [], type: "Tous", transaction: "vente",
    priceMax: "", bedrooms: "", bathrooms: "",
    surface: "", location: "", radius: "5",
  });

  const activeFiltersCount =
    filters.amenities.length +
    (filters.type !== "Tous"  ? 1 : 0) +
    (filters.transaction      ? 1 : 0) +
    (filters.priceMax         ? 1 : 0) +
    (filters.bedrooms         ? 1 : 0) +
    (filters.bathrooms        ? 1 : 0) +
    (filters.surface          ? 1 : 0) +
    (filters.location         ? 1 : 0) +
    (filters.radius !== "5"   ? 1 : 0);

  const geoResolved = filters.location.trim() !== "" && geoCenter !== null;

  return (
    <>
    <div className="flex flex-col min-h-[calc(100vh-80px)] pt-[90px]">

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b px-6 py-4 sticky top-[90px] z-40">

        {/* Barre desktop */}
        <div className="hidden md:flex flex-row gap-3 mb-4">

          {/* Ville */}
          <div className="relative flex-1">
            <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c79b4b]" />
            <input
              placeholder="Ville, code postal..."
              value={filters.location}
              onChange={e => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-full border border-gray-300 bg-white rounded-full pl-9 pr-8 py-2 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c79b4b]"
            />
            {/* Point vert quand la ville est géocodée */}
            {geoResolved && (
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-400"
                title="Localisation trouvée — filtre rayon actif"
              />
            )}
          </div>

          {/* Transaction */}
          <select
            value={filters.transaction}
            onChange={e => setFilters(prev => ({ ...prev, transaction: e.target.value }))}
            className="w-auto border border-gray-300 bg-white rounded-full px-4 py-2 text-sm text-black"
          >
            {TRANSACTION_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>


          {/* Prix max */}
          <select
            value={filters.priceMax}
            onChange={e => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
            className="w-auto border border-gray-300 bg-white rounded-full px-4 py-2 text-sm text-black"
          >
            <option value="">Prix max</option>
            <option value="100000">100 000 €</option>
            <option value="200000">200 000 €</option>
            <option value="300000">300 000 €</option>
            <option value="500000">500 000 €</option>
            <option value="750000">750 000 €</option>
            <option value="1000000">1 000 000 €</option>
            <option value="unlimited">1 000 000 € +</option>
          </select>

          {/* Rayon */}
          <select
            value={filters.radius}
            onChange={e => setFilters(prev => ({ ...prev, radius: e.target.value }))}
            className="w-auto border border-gray-300 bg-white rounded-full px-4 py-2 text-sm text-black"
          >
            {RADIUS_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <button
            onClick={() => window.scrollTo({ top: 200, behavior: "smooth" })}
            className="w-auto bg-[#122e53] text-white px-6 py-2 rounded-full text-sm"
          >
            Rechercher
          </button>
        </div>

        {/* Filtres rapides + vue */}
        <div className="flex justify-between items-center">
          <div className="hidden md:flex flex-wrap gap-3">

            <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm bg-white text-gray-900 hover:border-black">
              <SlidersHorizontal size={16} />
              Tous les filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>

            {/* Type */}
            <div className="relative">
              <button onClick={() => toggleDropdown("type")} className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm bg-white text-gray-900 hover:border-black">
                <Home size={16} />{filters.type}
              </button>
              {openDropdown === "type" && (
                <div className="absolute top-full mt-2 bg-white text-gray-900 border shadow-xl w-[200px] z-50 rounded-xl overflow-hidden">
                  {["Tous","Maison","Appartement","Terrain"].map(item => (
                    <div key={item} onClick={() => setType(item)} className="px-4 py-3 hover:bg-gray-100 cursor-pointer">{item}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Chambres */}
            <div className="relative">
              <button onClick={() => toggleDropdown("bedrooms")} className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm bg-white text-gray-900">
                <BedDouble size={16} />{filters.bedrooms || "Chambres"}
              </button>
              {openDropdown === "bedrooms" && (
                <div className="absolute top-full mt-2 bg-white text-gray-900 border shadow-xl w-[200px] z-50 rounded-xl overflow-hidden">
                  {["1","2","3","4"].map(item => (
                    <div key={item} onClick={() => { setFilters(p => ({ ...p, bedrooms: item })); setOpenDropdown(null); }} className="px-4 py-3 hover:bg-gray-100 cursor-pointer">{item}+</div>
                  ))}
                </div>
              )}
            </div>

            {/* Surface */}
            <div className="relative">
              <button onClick={() => toggleDropdown("surface")} className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm bg-white text-gray-900">
                <Maximize size={16} />{filters.surface ? `${filters.surface}+ m²` : "Taille"}
              </button>
              {openDropdown === "surface" && (
                <div className="absolute top-full mt-2 bg-white text-gray-900 border shadow-xl w-[200px] z-50 rounded-xl overflow-hidden">
                  {["50","100","150"].map(item => (
                    <div key={item} onClick={() => { setFilters(p => ({ ...p, surface: item })); setOpenDropdown(null); }} className="px-4 py-3 hover:bg-gray-100 cursor-pointer">{item}+ m²</div>
                  ))}
                </div>
              )}
            </div>

            {/* Équipements */}
            <div className="relative">
              <button onClick={() => toggleDropdown("amenities")} className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm bg-white text-gray-900">
                <SlidersHorizontal size={16} />Équipements
              </button>
              {openDropdown === "amenities" && (
                <div className="absolute top-full mt-2 bg-white text-gray-900 border shadow-xl w-[260px] z-50 p-3 flex flex-wrap gap-2 rounded-xl">
                  {["Piscine","Terrasse","Jardin","Parking","Garage"].map(item => (
                    <div key={item} onClick={() => toggleAmenity(item)} className={`px-3 py-2 border rounded-full text-xs cursor-pointer ${isActive(item) ? "bg-[#122e53] text-white border-[#122e53]" : "bg-white hover:bg-gray-100"}`}>{item}</div>
                  ))}
                </div>
              )}
            </div>

            {/* SDB */}
            <div className="relative">
              <button onClick={() => toggleDropdown("bathrooms")} className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm bg-white text-gray-900">
                <BedDouble size={16} />{filters.bathrooms || "SDB"}
              </button>
              {openDropdown === "bathrooms" && (
                <div className="absolute top-full mt-2 bg-white text-gray-900 border shadow-xl w-[200px] z-50 rounded-xl overflow-hidden">
                  {["1","2","3","4"].map(item => (
                    <div key={item} onClick={() => { setFilters(p => ({ ...p, bathrooms: item })); setOpenDropdown(null); }} className="px-4 py-3 hover:bg-gray-100 cursor-pointer">{item}+</div>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="flex items-center gap-4">
            {/* Tri */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value as typeof sort)}
              className="border border-gray-200 bg-white rounded-full px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c79b4b] cursor-pointer"
            >
              <option value="price_desc">Prix décroissant</option>
              <option value="price_asc">Prix croissant</option>
              <option value="surface_asc">Surface croissante</option>
              <option value="surface_desc">Surface décroissante</option>
            </select>

            <button onClick={() => setView("list")} className={`flex items-center gap-2 text-sm ${view === "list" ? "text-black border-b-2 border-black pb-1" : "text-gray-500"}`}>
              <LayoutGrid size={18} />List
            </button>
            <button onClick={() => setView("map")} className={`flex items-center gap-2 text-sm ${view === "map" ? "text-black border-b-2 border-black pb-1" : "text-gray-500"}`}>
              <Map size={18} />Map
            </button>
          </div>
        </div>

        {/* Tags filtres actifs */}
        <div className="flex flex-wrap gap-2 mt-4">
          {filters.type !== "Tous" && <Tag label={filters.type} onRemove={() => setFilters(p => ({ ...p, type: "Tous" }))} />}
          {filters.transaction      && <Tag label={transactionLabel(filters.transaction)} onRemove={() => setFilters(p => ({ ...p, transaction: "" }))} />}
          {filters.radius !== "5"   && <Tag label={radiusLabel(filters.radius)} onRemove={() => setFilters(p => ({ ...p, radius: "5" }))} />}
          {filters.priceMax         && <Tag label={filters.priceMax === "unlimited" ? "1 000 000 € +" : `≤ ${Number(filters.priceMax).toLocaleString("fr-FR")} €`} onRemove={() => setFilters(p => ({ ...p, priceMax: "" }))} />}
          {filters.bedrooms         && <Tag label={filters.bedrooms === "5" ? "5 chambres +" : `${filters.bedrooms} chambre${Number(filters.bedrooms) > 1 ? "s" : ""}`} onRemove={() => setFilters(p => ({ ...p, bedrooms: "" }))} />}
          {filters.bathrooms        && <Tag label={`${filters.bathrooms} SDB`} onRemove={() => setFilters(p => ({ ...p, bathrooms: "" }))} />}
          {filters.surface          && <Tag label={filters.surface === "200" ? "200 m² +" : `≥ ${filters.surface} m²`} onRemove={() => setFilters(p => ({ ...p, surface: "" }))} />}
          {filters.amenities.map(item => (
            <Tag key={item} label={item} onRemove={() => setFilters(p => ({ ...p, amenities: p.amenities.filter(a => a !== item) }))} />
          ))}
        </div>

      </div>

      {/* ── CONTENU ─────────────────────────────────────────────────────────── */}
      <div className="flex min-h-[calc(100vh-140px)] bg-[#f5f5f5] pb-24">

        {view === "list" && (
          <div className="flex justify-center w-full bg-[#f5f5f5] py-6">
            <div className="w-full max-w-[1200px] flex gap-6">
              <div className="flex-1">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-32 gap-6">
                    <img
                      src="/mi_noirok.png"
                      alt="Marchal Immobilier"
                      className="h-16 object-contain opacity-20 animate-pulse"
                    />
                    <div className="w-32 h-[2px] bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#c79b4b] rounded-full animate-loading-bar" />
                    </div>
                    <style>{`
                      @keyframes loading-bar {
                        0%   { width: 0%;  margin-left: 0%; }
                        50%  { width: 60%; margin-left: 20%; }
                        100% { width: 0%;  margin-left: 100%; }
                      }
                      .animate-loading-bar {
                        animation: loading-bar 1.4s ease-in-out infinite;
                      }
                    `}</style>
                  </div>
                ) : (
                  <PropertyList properties={sortedProperties} hoveredId={hoveredId} setHoveredId={setHoveredId} />
                )}
              </div>
              <div className="hidden lg:block w-[300px]">
                <div className="sticky top-[110px]">
                  <img src="/pub.png" className="w-full h-[500px] object-cover" />
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "map" && (
          <div className="flex w-full h-[calc(100vh-140px)] overflow-hidden">
            <div className="w-[320px] min-w-[320px] bg-white border-r overflow-y-auto">
              <div className="px-4 py-4 border-b sticky top-0 bg-white z-20">
                <div className="flex items-center gap-3 mb-3">
                  <button onClick={() => setView("list")} className="flex items-center gap-1 text-sm pb-1 text-gray-400">
                    <LayoutGrid size={15} /> List
                  </button>
                  <button onClick={() => setView("map")} className="flex items-center gap-1 text-sm pb-1 border-b-2 border-black font-medium">
                    <Map size={15} /> Map
                  </button>
                </div>
                <p className="text-[13px] text-gray-400">{filteredProperties.length} biens disponibles</p>
              </div>
              <div className="px-3 pt-3">
                <PropertyListMap properties={sortedProperties} hoveredId={hoveredId} setHoveredId={setHoveredId} />
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0">
                <PropertyMap properties={sortedProperties} hoveredId={hoveredId} />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>

    {/* ── MODAL FILTRES ───────────────────────────────────────────────────────── */}
    {isFilterOpen && (
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40" onClick={() => setIsFilterOpen(false)}>
        <div className="bg-white w-full max-w-[900px] mt-10 shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>

          <div className="bg-[#122e53] text-white px-6 py-4 flex justify-between items-center">
            <span className="font-medium">Filtres</span>
            <button onClick={() => setIsFilterOpen(false)}>✕</button>
          </div>

          <div className="p-6 text-[#122e53] overflow-y-auto flex-1">

            {/* Ville (mobile uniquement) */}
            <div className="md:hidden py-4 border-b">
              <div className="flex items-center gap-3 mb-3"><MapPin size={18} /><span className="font-medium">Ville / Code postal</span></div>
              <input
                placeholder="Ex: Metz, 57000..."
                value={filters.location}
                onChange={e => setFilters(p => ({ ...p, location: e.target.value }))}
                className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c79b4b]"
              />
            </div>

            {/* Transaction */}
            <div className="relative py-4 border-b">
              <div onClick={() => toggleDropdown("transaction")} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3"><Home size={18} /><span className="font-medium">Transaction</span></div>
                <div className="flex items-center gap-2 text-gray-500"><span>{transactionLabel(filters.transaction)}</span><span>▾</span></div>
              </div>
              {openDropdown === "transaction" && (
                <div className="absolute right-0 mt-2 w-[240px] bg-white border shadow-xl z-50 rounded-xl overflow-hidden">
                  {TRANSACTION_OPTIONS.map(o => (
                    <div key={o.value} onClick={() => setTransaction(o.value)} className={`px-4 py-3 hover:bg-gray-100 cursor-pointer ${filters.transaction === o.value ? "font-semibold text-[#122e53]" : ""}`}>{o.label}</div>
                  ))}
                </div>
              )}
            </div>

            {/* ── RAYON ─────────────────────────────────────────────────────── */}
            <div className="py-4 border-b">
              <div className="flex items-center gap-3 mb-1">
                <Navigation size={18} />
                <span className="font-medium">Rayon de recherche</span>
              </div>
              <p className="text-xs mb-3 ml-7">
                {filters.location.trim() === ""
                  ? <span className="text-gray-400">Saisissez une ville pour activer le filtre rayon</span>
                  : geoResolved
                  ? <span className="text-green-500">✓ Localisation trouvée — filtre rayon actif</span>
                  : <span className="text-amber-500">Recherche de la localisation…</span>
                }
              </p>
              <div className="flex flex-wrap gap-2">
                {RADIUS_OPTIONS.map(o => (
                  <button
                    key={o.value}
                    onClick={() => setRadius(o.value)}
                    className={`px-4 py-2 border rounded-full text-sm transition-colors ${
                      filters.radius === o.value
                        ? "bg-[#122e53] text-white border-[#122e53]"
                        : "bg-white text-gray-700 hover:border-[#122e53] hover:text-[#122e53]"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div className="relative py-4 border-b">
              <div onClick={() => toggleDropdown("type")} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3"><Home size={18} /><span className="font-medium">Type de bien</span></div>
                <div className="flex items-center gap-2 text-gray-500"><span>{filters.type}</span><span>▾</span></div>
              </div>
              {openDropdown === "type" && (
                <div className="absolute right-0 mt-2 w-[240px] bg-white border shadow-xl z-50 rounded-xl overflow-hidden">
                  {["Tous","Maison","Appartement","Terrain"].map(item => (
                    <div key={item} onClick={() => setType(item)} className="px-4 py-3 hover:bg-gray-100 cursor-pointer">{item}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Équipements */}
            <div className="py-4 border-b">
              <div className="flex items-center gap-3 mb-3"><SlidersHorizontal size={18} /><span className="font-medium">Équipements</span></div>
              <div className="flex flex-wrap gap-2">
                {["Piscine","Terrasse","Garage","Jardin","Balcon","Parking"].map(item => (
                  <button key={item} onClick={() => toggleAmenity(item)} className={`px-3 py-2 border text-sm transition rounded-full ${isActive(item) ? "bg-[#122e53] text-white border-[#122e53]" : "bg-white hover:bg-gray-100"}`}>{item}</button>
                ))}
              </div>
            </div>

            {/* Prix */}
            <div className="py-4 border-b">
              <div className="flex items-center gap-3 mb-4"><Maximize size={18} /><span className="font-medium">Prix maximum</span></div>
              <input
                type="range"
                min="0"
                max="1100000"
                step="50000"
                value={filters.priceMax === "unlimited" ? 1100000 : (filters.priceMax || 0)}
                onChange={e => {
                  const val = Number(e.target.value);
                  setFilters(p => ({ ...p, priceMax: val >= 1100000 ? "unlimited" : val === 0 ? "" : String(val) }));
                }}
                className="w-full accent-[#122e53]"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>0 €</span>
                <span className="font-medium text-[#122e53]">
                  {filters.priceMax === "unlimited"
                    ? "1 000 000 € +"
                    : filters.priceMax
                    ? `${Number(filters.priceMax).toLocaleString("fr-FR")} €`
                    : "Tous les prix"}
                </span>
                <span>1 000 000 € +</span>
              </div>
            </div>

            {/* Surface */}
            <div className="py-4 border-b">
              <div className="flex items-center gap-3 mb-4"><Maximize size={18} /><span className="font-medium">Surface minimum</span></div>
              <input
                type="range"
                min="0"
                max="210"
                step="10"
                value={filters.surface === "200" ? 210 : (filters.surface || 0)}
                onChange={e => {
                  const val = Number(e.target.value);
                  setFilters(p => ({ ...p, surface: val >= 210 ? "200" : val === 0 ? "" : String(val) }));
                }}
                className="w-full accent-[#122e53]"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>0 m²</span>
                <span className="font-medium text-[#122e53]">
                  {filters.surface === "200"
                    ? "200 m² +"
                    : filters.surface
                    ? `${filters.surface} m²`
                    : "Toutes surfaces"}
                </span>
                <span>200 m² +</span>
              </div>
            </div>

            {/* Chambres */}
            <div className="py-4 border-b">
              <div className="flex items-center gap-3 mb-4"><BedDouble size={18} /><span className="font-medium">Chambres minimum</span></div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={filters.bedrooms || 0}
                onChange={e => {
                  const val = Number(e.target.value);
                  setFilters(p => ({ ...p, bedrooms: val === 0 ? "" : String(val) }));
                }}
                className="w-full accent-[#122e53]"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>0</span>
                <span className="font-medium text-[#122e53]">
                  {filters.bedrooms === "5"
                    ? "5 chambres +"
                    : filters.bedrooms
                    ? `${filters.bedrooms} chambre${Number(filters.bedrooms) > 1 ? "s" : ""}`
                    : "Toutes"}
                </span>
                <span>5 +</span>
              </div>
            </div>

          </div>

          <div className="flex justify-between items-center p-4 border-t">
            <button onClick={resetFilters} className="text-gray-500 hover:text-black text-sm">Réinitialiser</button>
            <button onClick={() => setIsFilterOpen(false)} className="bg-[#122e53] hover:bg-[#0f2442] transition text-white px-6 py-2 rounded-full text-sm">
              Voir les {filteredProperties.length} biens
            </button>
          </div>

        </div>
      </div>
    )}

    {/* Bouton filtres mobile */}
    <button onClick={() => setIsFilterOpen(true)} className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] bg-[#122e53] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2">
      <SlidersHorizontal size={18} />
      Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
    </button>

    </>
  );
}