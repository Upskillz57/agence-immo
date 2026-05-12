//src/components/PropertyMap.tsx
"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";


console.log("TOKEN MAPBOX:", process.env.NEXT_PUBLIC_MAPBOX_TOKEN);
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

console.log("TOKEN MAPBOX:", MAPBOX_TOKEN);

mapboxgl.accessToken = MAPBOX_TOKEN;

export default function PropertyMap({ properties, hoveredId }: any) {

const mapContainer = useRef<HTMLDivElement | null>(null);
const map = useRef<mapboxgl.Map | null>(null);

useEffect(() => {
  if (!mapContainer.current) return;

  // 🔥 INIT UNE SEULE FOIS
  if (!map.current) {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [6.175, 49.119],
      zoom: 11,
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    // 🔥 CRUCIAL → attendre que la map soit prête
    map.current.on("load", () => {
      map.current?.resize();
    });
  }

  const currentMap = map.current;
  if (!currentMap) return;

  // 🔥 nettoyage markers
  document.querySelectorAll(".property-pin").forEach((p) => p.remove());

  const bounds = new mapboxgl.LngLatBounds();

  properties?.forEach((property: any) => {
    if (!property.lng || !property.lat) return;

    bounds.extend([property.lng, property.lat]);

    const el = document.createElement("div");

    el.className = "property-pin";
    el.style.background = "#c79b4b";
    el.style.color = "white";
    el.style.padding = "6px 10px";
    el.style.borderRadius = "20px";
    el.style.fontSize = "13px";
    el.style.fontWeight = "600";
    el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.25)";
    el.style.cursor = "pointer";
    el.style.whiteSpace = "nowrap";

    el.innerHTML = (property.price || 0).toLocaleString() + " €";

    el.addEventListener("click", () => {
      window.location.href = `/bien/${property.id}`;
    });
    
    if (property.id === hoveredId) {
      el.style.transform = "scale(1.15)";
      el.style.background = "#122e53";
    }
    
    // ✅ POPUP AU SURVOL
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 25,
    }).setHTML(`
      <div style="width:220px;font-family:sans-serif;">
        
        ${
          property.images?.[0]
            ? `
          <img 
            src="${property.images[0]}" 
            style="
              width:100%;
              height:140px;
              object-fit:cover;
              border-radius:10px;
              margin-bottom:10px;
            "
          />
        `
            : ""
        }
    
        <div style="font-weight:700;font-size:15px;color:#122e53;">
          ${property.title || ""}
        </div>
    
        <div style="margin-top:4px;font-size:13px;color:#666;">
          ${property.city || ""}
        </div>
    
        <div style="
          margin-top:8px;
          font-size:16px;
          font-weight:700;
          color:#c79b4b;
        ">
          ${property.price?.toLocaleString()} €
        </div>
    
      </div>
    `);
    
    el.addEventListener("mouseenter", () => {
      popup
        .setLngLat([property.lng, property.lat])
        .addTo(currentMap);
    });
    
    el.addEventListener("mouseleave", () => {
      popup.remove();
    });
    
    new mapboxgl.Marker(el)
      .setLngLat([property.lng, property.lat])
      .addTo(currentMap);
  });

  // 🔥 FIT BOUNDS (APRÈS RENDER)
  if (properties?.length > 0 && !bounds.isEmpty()) {
    currentMap.fitBounds(bounds, {
      padding: 80,
      maxZoom: 14,
      duration: 800,
    });
  } else {
    currentMap.setCenter([6.175, 49.119]);
    currentMap.setZoom(11);
  }
}, [properties, hoveredId]);

return (
<div
ref={mapContainer}
className="w-full h-[100%] min-h-[500px]"
/>
);

}