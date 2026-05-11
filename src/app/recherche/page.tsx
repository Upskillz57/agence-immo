//src/app/recherche/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import PropertyMap from "@/components/PropertyMap";
import PropertyList from "@/components/PropertyList";
import { useState } from "react";
import { LayoutGrid, Map } from "lucide-react";
import { SlidersHorizontal, Home, BedDouble, Maximize } from "lucide-react";
import { useEffect } from "react";


import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <RecherchePage />
    </Suspense>
  );
}

function RecherchePage(){

const params = useSearchParams();

const transaction = params.get("transaction");
const location = params.get("location");
const price = params.get("price");


const [hoveredId,setHoveredId] = useState<string | null>(null);

const [properties, setProperties] = useState<any[]>([]);

const parseMin = (val: string) => parseInt(val.replace("+", ""));

useEffect(() => {
  fetch("/api/properties")
    .then(res => res.json())
    .then(data => {
      console.log("DATA FRONT:", data); // 👈 AJOUT
      setProperties(data);
    });
}, []);

const [filters, setFilters] = useState({
    amenities: [] as string[],
    type: "Tous",
    transaction: "vente",
    priceMax: "",
    bedrooms: "",
    bathrooms: "",
    surface: "",
    location: "",
  });

  const setTransaction = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      transaction: value,
    }));
    setOpenDropdown(null);
  };

  const filteredProperties = Array.isArray(properties)
  ? properties.filter((property) => {

      // amenities (STRICT)
      if (filters.amenities.length > 0) {
        const hasAmenity = filters.amenities.every((a) =>
          property.amenities?.includes(a)
        );
        if (!hasAmenity) return false;
      }

      // type (robuste)
      if (
        filters.type !== "Tous" &&
        !property.type?.toLowerCase().includes(filters.type.toLowerCase())
      ) {
        return false;
      }

      // transaction
      if (filters.transaction && property.transaction !== filters.transaction) {
        return false;
      }

      // price
      if (filters.priceMax && property.price > Number(filters.priceMax)) {
        return false;
      }

      // bedrooms
      if (filters.bedrooms) {
        const min = parseMin(filters.bedrooms);
        if ((property.bedrooms || 0) < min) return false;
      }

      // surface
      if (filters.surface) {
        const min = parseMin(filters.surface);
        if ((property.surface || 0) < min) return false;
      }

      // location
      if (filters.location) {
        const search = filters.location.toLowerCase();

        const match =
  property.city?.toLowerCase().includes(search) ||

  property.postalCode?.toLowerCase().includes(search) ||

  property.title?.toLowerCase().includes(search);

        if (!match) return false;
      }

      return true;
    })
  : [];
  
const [view, setView] = useState<"list" | "map">("list");
const [isFilterOpen, setIsFilterOpen] = useState(false);

const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleAmenity = (value: string) => {
    setFilters((prev) => {
      if (prev.amenities.includes(value)) {
        return {
          ...prev,
          amenities: prev.amenities.filter((v) => v !== value),
        };
      }
      return {
        ...prev,
        amenities: [...prev.amenities, value],
      };
    });
  };

  const setType = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      type: value,
    }));
    setOpenDropdown(null);
  };

 
  
  const isActive = (value: string) => {
    return filters.amenities.includes(value);
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const activeFiltersCount =
  filters.amenities.length +
  (filters.type !== "Tous" ? 1 : 0) +
  (filters.transaction ? 1 : 0) +
  (filters.priceMax ? 1 : 0) +
  (filters.bedrooms ? 1 : 0) +
  (filters.bathrooms ? 1 : 0) +
  (filters.surface ? 1 : 0) +
  (filters.location ? 1 : 0);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      location: location || "",
      transaction: transaction || "vente",
      priceMax: price || "",
    }));
  }, [location, transaction, price]);

  

return (
    <>
    <div className="flex flex-col min-h-[calc(100vh-80px)] pt-[90px]">

{/* HEADER SEARCH + FILTERS */}
<div className="bg-white border-b px-6 py-4 sticky top-[90px] z-40">

{/* BARRE RECHERCHE */}
<div className="flex flex-col md:flex-row gap-3 mb-4">

<input
placeholder="Ville, code postal..."
value={filters.location}
onChange={(e) =>
  setFilters(prev => ({ ...prev, location: e.target.value }))
}
className="flex-1 border border-gray-300 bg-white rounded-full px-4 py-2 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c79b4b]"
/>

<select
  value={filters.transaction}
  onChange={(e) =>
    setFilters(prev => ({ ...prev, transaction: e.target.value }))
  }
  className="w-full md:w-auto border border-gray-300 bg-white rounded-full px-4 py-2 text-sm text-black"
>
  <option value="vente">Acheter</option>
  <option value="location">Louer</option>
</select>

<select
  value={filters.priceMax}
  onChange={(e) =>
    setFilters(prev => ({ ...prev, priceMax: e.target.value }))
  }
  className="border rounded-full px-4 py-2 text-sm text-black"
>
  <option value="">Prix max</option>
  <option value="200000">200 000 €</option>
  <option value="500000">500 000 €</option>
  <option value="1000000">1 000 000 €</option>
</select>

<button
  onClick={() => window.scrollTo({ top: 200, behavior: "smooth" })}
  className="w-full md:w-auto bg-[#122e53] text-white px-6 py-2 rounded-full"
>
  Rechercher
</button>

</div>

{/* FILTRES + TOGGLE */}
<div className="flex justify-between items-center">

{/* 👇 FILTRES MASQUÉS SUR MOBILE */}
<div className="hidden md:flex flex-wrap gap-3">

<button 
onClick={() => setIsFilterOpen(true)}
className="hidden md:flex items-center gap-2 border px-4 py-2 rounded-full text-sm bg-white text-gray-900 hover:border-black"
>
  <SlidersHorizontal size={16} />
  Tous les filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
</button>

<div className="relative">

<button 
onClick={() => toggleDropdown("type")}
className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm bg-white text-gray-900 hover:border-black"
>
  <Home size={16} />
  {filters.type}
</button>

{openDropdown === "type" && (
  <div className="absolute top-full mt-2 bg-white text-gray-900 border shadow-xl w-[200px] z-50">

    {["Tous","Maison","Appartement","Terrain"].map((item) => (
      <div
        key={item}
        onClick={() => setType(item)}
        className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
      >
        {item}
      </div>
    ))}

  </div>
)}

</div>

<div className="relative">

<button 
onClick={() => toggleDropdown("bedrooms")}
className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm bg-white text-gray-900"
>
  <BedDouble size={16} />
  {filters.bedrooms || "Chambres"}
</button>

{openDropdown === "bedrooms" && (
  <div className="absolute top-full mt-2 bg-white text-gray-900 border shadow-xl w-[200px] z-50">

    {["1","2","3","4"].map((item) => (
      <div
        key={item}
        onClick={() => {
          setFilters(prev => ({ ...prev, bedrooms: item }));
          setOpenDropdown(null);
        }}
        className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
      >
        {item}+
      </div>
    ))}

  </div>
)}

</div>

<div className="relative">

<button 
onClick={() => toggleDropdown("surface")}
className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm bg-white text-gray-900"
>
  <Maximize size={16} />
  {filters.surface ? `${filters.surface}+ m²` : "Taille"}
</button>

{openDropdown === "surface" && (
  <div className="absolute top-full mt-2 bg-white text-gray-900 border shadow-xl w-[200px] z-50">

    {["50","100","150"].map((item) => (
      <div
        key={item}
        onClick={() => {
          setFilters(prev => ({ ...prev, surface: item }));
          setOpenDropdown(null);
        }}
        className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
      >
        {item}+ m²
      </div>
    ))}

  </div>
)}

</div>

<div className="relative">

<button 
onClick={() => toggleDropdown("amenities")}
className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm bg-white text-gray-900"
>
  <SlidersHorizontal size={16} />
  Équipements
</button>

{openDropdown === "amenities" && (
  <div className="absolute top-full mt-2 bg-white text-gray-900 border shadow-xl w-[260px] z-50 p-3 flex flex-wrap gap-2">

    {[
      "Piscine",
      "Terrasse",
      "Jardin",
      "Parking",
      "Clim",
      "Garage",
      "Sauna",

    ].map((item) => (
      <div
        key={item}
        onClick={() => toggleAmenity(item)}
        className={`px-3 py-2 border rounded-full text-xs cursor-pointer
          ${isActive(item)
            ? "bg-[#122e53] text-white border-[#122e53]"
            : "bg-white hover:bg-gray-100"
          }`}
      >
        {item}
      </div>
    ))}

  </div>
)}

</div>

<div className="relative">

<button 
onClick={() => toggleDropdown("bathrooms")}
className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm bg-white text-gray-900"
>
  <BedDouble size={16} />
  {filters.bathrooms || "SDB"}
</button>

{openDropdown === "bathrooms" && (
  <div className="absolute top-full mt-2 bg-white text-gray-900 border shadow-xl w-[200px] z-50">

    {["1","2","3","4"].map((item) => (
      <div
        key={item}
        onClick={() => {
          setFilters(prev => ({ ...prev, bathrooms: item }));
          setOpenDropdown(null);
        }}
        className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
      >
        {item}+
      </div>
    ))}

  </div>
)}

</div>

</div>

<div className="flex items-center gap-4">
    

<button
onClick={() => setView("list")}
className={`flex items-center gap-2 text-sm ${
  view === "list" ? "text-black border-b-2 border-black pb-1" : "text-gray-500"
}`}
>
<LayoutGrid size={18} />
List
</button>

<button
onClick={() => setView("map")}
className={`flex items-center gap-2 text-sm ${
  view === "map" ? "text-black border-b-2 border-black pb-1" : "text-gray-500"
}`}
>
<Map size={18} />
Map
</button>

</div>

</div>

{/* 🔥 FILTRES ACTIFS (STYLE LUXURY) */}
<div className="flex flex-wrap gap-2 mt-4">

{filters.type !== "Tous" && (
  <div className="px-3 py-1 bg-[#122e53] text-white text-xs rounded-full cursor-pointer"
       onClick={() => setFilters(prev => ({ ...prev, type: "Tous" }))}>
    {filters.type} ✕
  </div>
)}

{filters.transaction && (
  <div className="px-3 py-1 bg-[#122e53] text-white text-xs rounded-full cursor-pointer"
  onClick={() => setFilters(prev => ({ ...prev, transaction: "" }))}>
    {filters.transaction === "vente" ? "À vendre" : "À louer"} ✕
  </div>
)}

{filters.bedrooms && (
  <div className="px-3 py-1 bg-[#122e53] text-white text-xs rounded-full cursor-pointer"
       onClick={() => setFilters(prev => ({ ...prev, bedrooms: "" }))}>
    {filters.bedrooms} chambres ✕
  </div>
)}

{filters.bathrooms && (
  <div className="px-3 py-1 bg-[#122e53] text-white text-xs rounded-full cursor-pointer"
       onClick={() => setFilters(prev => ({ ...prev, bathrooms: "" }))}>
    {filters.bathrooms} SDB ✕
  </div>
)}

{filters.surface && (
  <div className="px-3 py-1 bg-[#122e53] text-white text-xs rounded-full cursor-pointer"
       onClick={() => setFilters(prev => ({ ...prev, surface: "" }))}>
    {filters.surface} m² ✕
  </div>
)}

{filters.amenities.map((item) => (
  <div
    key={item}
    onClick={() =>
      setFilters(prev => ({
        ...prev,
        amenities: prev.amenities.filter(a => a !== item)
      }))
    }
    className="px-3 py-1 bg-[#122e53] text-white text-xs rounded-full cursor-pointer"
  >
    {item} ✕
  </div>
))}

</div>

</div>

<div className="flex min-h-[calc(100vh-140px)] bg-[#f5f5f5] pb-24">

{/* ========================= */}
{/* 🟢 MODE LISTE (PLEIN LARGE) */}
{/* ========================= */}
{view === "list" && (
  <div className="flex justify-center w-full bg-[#f5f5f5] py-6">

    <div className="w-full max-w-[1200px] flex gap-6">

      {/* LISTE GAUCHE */}
      <div className="flex-1">
        <PropertyList
          properties={filteredProperties}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
        />
      </div>

      {/* IMAGE / PUB DROITE */}
      <div className="hidden lg:block w-[300px]">
        <div className="sticky top-[110px]">
          <img
            src="/pub.png"
            className="w-full h-[500px] object-cover"
          />
        </div>
      </div>

    </div>

  </div>
)}

{view === "map" && (
  <div className="flex w-full h-[calc(100vh-140px)] overflow-hidden">

    {/* ========================= */}
    {/* LISTE */}
    {/* ========================= */}
    <div className="
      w-[420px]
      min-w-[420px]
      xl:w-[480px]
      bg-white
      border-r
      overflow-y-auto
      scrollbar-thin
    ">
      <div className="px-5 py-4 border-b bg-white sticky top-0 z-20">
        <h2 className="text-xl font-semibold text-[#122e53]">
          {filteredProperties.length} biens disponibles
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Découvrez notre sélection immobilière
        </p>
      </div>

      <div className="p-4">
        <PropertyList
          properties={filteredProperties}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
        />
      </div>
    </div>

    {/* ========================= */}
    {/* MAP */}
    {/* ========================= */}
    <div className="flex-1 relative">

      <div className="absolute inset-0">
        <PropertyMap
          properties={filteredProperties}
          hoveredId={hoveredId}
        />
      </div>

    </div>

  </div>
)}



</div>
</div>

{/* MODAL GLOBAL */}
{isFilterOpen && (
  <div 
    className="fixed inset-0 z-50 flex items-start justify-center bg-black/40"
    onClick={() => setIsFilterOpen(false)}
  >

    <div 
      className="bg-white w-full max-w-[900px] mt-10 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >

      <div className="bg-[#122e53] text-white px-6 py-4 flex justify-between">
        <span>Filtres</span>
        <button onClick={() => setIsFilterOpen(false)}>✕</button>
      </div>

      <div className="p-6 text-[#122e53]">

{/* TRANSACTION */}
<div className="relative py-4 border-b">

  <div 
    onClick={() => toggleDropdown("transaction")}
    className="flex items-center justify-between cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <Home size={18} />
      <span className="font-medium">Transaction</span>
    </div>

    <div className="flex items-center gap-2 text-gray-500">
    <span>
  {filters.transaction === "vente" ? "À vendre" : "À louer"}
</span>
      <span>▾</span>
    </div>
  </div>

  {openDropdown === "transaction" && (
    <div className="absolute right-0 mt-2 w-[220px] bg-white border shadow-xl z-50 animate-[fadeIn_.2s_ease]">


<div onClick={() => setTransaction("vente")} className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
  À vendre
</div>

<div onClick={() => setTransaction("location")} className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
  À louer
</div>

    </div>
  )}

</div>

{/* TYPE DE BIEN */}
<div className="relative py-4 border-b">

  <div 
    onClick={() => toggleDropdown("type")}
    className="flex items-center justify-between cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <Home size={18} />
      <span className="font-medium">Type de bien</span>
    </div>

    <div className="flex items-center gap-2 text-gray-500">
    <span>{filters.type}</span>
      <span>▾</span>
    </div>
  </div>

  {openDropdown === "type" && (
    <div className="absolute right-0 mt-2 w-[240px] bg-white border shadow-xl z-50 animate-[fadeIn_.2s_ease]">

{["Tous","Maison", "Appartement", "Terrain"].map((item) => (
  <div
    key={item}
    onClick={() => setType(item)}
    className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
  >
    {item}
  </div>
))}

    </div>
  )}

</div>

{/* ÉQUIPEMENTS */}
<div className="py-4 border-b">

  <div className="flex items-center gap-3 mb-3">
    <SlidersHorizontal size={18} />
    <span className="font-medium">Équipements</span>
  </div>

  <div className="flex flex-wrap gap-2">
  {[
  "Piscine",
  "Meublé",
  "Terrasse",
  "Ascenseur",
  "Climatisation",
  "Jardin",
  "Balcon",
  "Parking"
].map((item) => (
  <button
    key={item}
    onClick={() => toggleAmenity(item)}
    className={`px-3 py-2 border text-sm transition
      ${isActive(item)
        ? "bg-[#122e53] text-white border-[#122e53]"
        : "bg-white hover:bg-gray-100"
      }
    `}
  >
    {item}
  </button>
))}
  </div>

</div>

{/* PRIX */}
<div className="py-4 border-b">

  <div className="flex items-center gap-3 mb-4">
    <Maximize size={18} />
    <span className="font-medium">Prix</span>
  </div>

  <div className="flex flex-col gap-4">

    <input
      type="range"
      min="0"
      max="1000000"
      step="50000"
      value={filters.priceMax || 1000000}
      onChange={(e) =>
        setFilters((prev) => ({ ...prev, priceMax: e.target.value }))
      }
      className="w-full accent-[#122e53]"
    />

    <div className="flex justify-between text-sm text-gray-500">
      <span>0€</span>
      <span>{filters.priceMax || "1 000 000"} €</span>
    </div>

  </div>

</div>

{/* SURFACE */}
<div className="relative py-4 border-b">

  <div 
    onClick={() => toggleDropdown("surface")}
    className="flex items-center justify-between cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <Maximize size={18} />
      <span className="font-medium">Surface</span>
    </div>

    <div className="flex items-center gap-2 text-gray-500">
      <span>{filters.surface || "Peu importe"}</span>
      <span>▾</span>
    </div>
  </div>

  {openDropdown === "surface" && (
    <div className="absolute right-0 mt-2 w-[200px] bg-white border shadow-xl z-50">

      {["50+", "100+", "150+"].map((item) => (
        <div
          key={item}
          onClick={() => {
            setFilters((prev) => ({ ...prev, surface: item }));
            setOpenDropdown(null);
          }}
          className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
        >
          {item} m²
        </div>
      ))}

    </div>
  )}

</div>

{/* SALLES DE BAIN */}
<div className="relative py-4 border-b">

  <div 
    onClick={() => toggleDropdown("bathrooms")}
    className="flex items-center justify-between cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <BedDouble size={18} />
      <span className="font-medium">Salle de bain</span>
    </div>

    <div className="flex items-center gap-2 text-gray-500">
    <span>{filters.bathrooms || "Peu importe"}</span>
          <span>▾</span>
    </div>
  </div>

  {openDropdown === "bathrooms" && (
    <div className="absolute right-0 mt-2 w-[200px] bg-white border shadow-xl z-50">

      {["1+", "2+", "3+", "4+"].map((item) => (
        <div
          key={item}
          onClick={() => {
            setFilters((prev) => ({ ...prev, bathrooms: item }));
            setOpenDropdown(null);
          }}
          className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
        >
          {item}
        </div>
      ))}

    </div>
  )}

</div>

{/* CHAMBRES */}
<div className="relative py-4 border-b">

  <div 
    onClick={() => toggleDropdown("bedrooms")}
    className="flex items-center justify-between cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <BedDouble size={18} />
      <span className="font-medium">Chambres</span>
    </div>

    <div className="flex items-center gap-2 text-gray-500">
      <span>{filters.bedrooms || "Peu importe"}</span>
      <span>▾</span>
    </div>
  </div>

  {openDropdown === "bedrooms" && (
    <div className="absolute right-0 mt-2 w-[200px] bg-white border shadow-xl z-50">

      {["1+", "2+", "3+", "4+"].map((item) => (
        <div
          key={item}
          onClick={() => {
            setFilters((prev) => ({ ...prev, bedrooms: item }));
            setOpenDropdown(null);
          }}
          className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
        >
          {item}
        </div>
      ))}

    </div>
  )}

</div>

</div>

<div className="flex justify-between items-center p-4 border-t">

<button 
  onClick={() => {
    setFilters({
      amenities: [],
      type: "Tous",
      transaction: "vente",
      priceMax: "",
      bedrooms: "",
      bathrooms: "",
      surface: "",
      location: "",
    });
  }}
  className="text-gray-500 hover:text-black"
>
  Réinitialiser
</button>

<button 
  onClick={() => {
    setIsFilterOpen(false);
  }}
  className="bg-[#122e53] hover:bg-[#0f2442] transition text-white px-6 py-2 rounded-full"
>
  Voir les biens
</button>

</div>

    </div>

  </div>
)}

{/* BOUTON FILTRES MOBILE FLOTTANT */}
<button
  onClick={() => setIsFilterOpen(true)}
  className="
    md:hidden
    fixed
    bottom-6
    left-1/2
    -translate-x-1/2
    z-[999]
    bg-[#122e53]
    text-white
    px-6
    py-3
    rounded-full
    shadow-2xl
    flex
    items-center
    gap-2
  "
>
  <SlidersHorizontal size={18} />
  Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
</button>

</>
);

}

