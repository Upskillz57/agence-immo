//src/components/PropertyMap.tsx
"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function PropertyMap({ properties, hoveredId }: any) {

const mapContainer = useRef<HTMLDivElement | null>(null);
const map = useRef<mapboxgl.Map | null>(null);

useEffect(() => {

  console.log("TOKEN MAPBOX:", process.env.NEXT_PUBLIC_MAPBOX_TOKEN);
  console.log("MAP CONTAINER:", mapContainer.current);

  if (!mapContainer.current) {
    console.log("❌ container null → la map ne peut pas s'initialiser");
    return;
  }

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

if (!currentMap) {
  console.log("❌ map non initialisée");
  return;
}

// supprimer anciens pins
document.querySelectorAll(".property-pin").forEach(p => p.remove());

properties?.forEach((property:any)=>{

  if (!property.lng || !property.lat) {
    console.log("❌ BAD PROPERTY:", property);
    return;
  }

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

el.innerHTML = property.price.toLocaleString()+" €";

if(property.id === hoveredId){
el.style.transform = "scale(1.15)";
el.style.background = "#122e53";
}

new mapboxgl.Marker(el)
.setLngLat([property.lng, property.lat])
.addTo(currentMap);

});

// chargement dynamique futur
const handleMove = () => {

const bounds = currentMap.getBounds();

if (bounds) {
    console.log("zone carte", {
      west: bounds.getWest(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      north: bounds.getNorth()
    });
  }

};

currentMap.on("moveend", handleMove);

return () => {
currentMap.off("moveend", handleMove);
};

}, [properties, hoveredId]);

return (
<div
ref={mapContainer}
className="w-full h-full"
/>
);

}