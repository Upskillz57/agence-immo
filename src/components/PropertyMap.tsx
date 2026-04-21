//src/components/PropertyMap.tsx
"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";



mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function PropertyMap({ properties, hoveredId }: any) {

const mapContainer = useRef<HTMLDivElement | null>(null);
const map = useRef<mapboxgl.Map | null>(null);

useEffect(() => {

  if (!mapContainer.current) return;

  // 🔥 INIT MAP
  if (!map.current) {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [6.175, 49.119],
      zoom: 11
    });

    map.current.addControl(new mapboxgl.NavigationControl());
  }

  const currentMap = map.current;
  if (!currentMap) return;

  // 🔥 FIX RENDER (OBLIGATOIRE)
  setTimeout(() => {
    currentMap.resize();
  }, 300);

  // 🔥 supprimer anciens pins
  document.querySelectorAll(".property-pin").forEach(p => p.remove());

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

    el.innerHTML = property.price.toLocaleString() + " €";

    el.addEventListener("click", () => {
      window.location.href = `/bien/${property.id}`;
    });

    if (property.id === hoveredId) {
      el.style.transform = "scale(1.15)";
      el.style.background = "#122e53";
    }

    new mapboxgl.Marker(el)
      .setLngLat([property.lng, property.lat])
      .addTo(currentMap);
  });

  // 🔥 FIT BOUNDS APRÈS RENDER
  setTimeout(() => {
    if (properties?.length > 0 && !bounds.isEmpty()) {
      currentMap.fitBounds(bounds, {
        padding: 80,
        maxZoom: 14,
        duration: 1000,
      });
    } else {
      currentMap.setCenter([6.175, 49.119]);
      currentMap.setZoom(11);
    }
  }, 400);

}, [properties, hoveredId]);

return (
<div
ref={mapContainer}
className="w-full h-[100%] min-h-[500px]"
/>
);

}