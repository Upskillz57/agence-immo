"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { BedDouble, Maximize } from "lucide-react";

export default function ReelsClient({ properties }: { properties: any[] }) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const observers = videoRefs.current.map((video, i) => {
      if (!video) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
            video.currentTime = 0;
          }
        },
        { threshold: 0.8 }
      );
      observer.observe(video);
      return observer;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black">
      {properties.map((property, i) => (
        <div
          key={property.id}
          className="relative h-screen w-full snap-start snap-always flex items-center justify-center overflow-hidden"
        >
          {/* VIDÉO */}
          <video
            ref={(el) => { videoRefs.current[i] = el; }}
            src={property.videoUrl}
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* OVERLAY GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          {/* INFOS */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 text-white">
            <p className="text-xs uppercase tracking-widest text-white/60 mb-1">
              {property.postalCode} {property.city}
            </p>
            <h2 className="text-xl font-semibold leading-tight mb-2">
              {property.title}
            </h2>
            <p className="text-2xl font-bold mb-4">
              {(property.price || 0).toLocaleString("fr-FR")} €
            </p>

            <div className="flex gap-4 text-sm text-white/80 mb-5">
              <span className="flex items-center gap-1">
                <Maximize size={14} /> {property.surface} m²
              </span>
              <span className="flex items-center gap-1">
                <BedDouble size={14} /> {property.bedrooms} ch.
              </span>
              <span>{property.rooms} pièces</span>
            </div>

            <Link
              href={`/bien/${property.id}`}
              className="inline-block bg-white text-black text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-100 transition"
            >
              Voir le bien →
            </Link>
          </div>

          {/* COMPTEUR */}
          <div className="absolute top-6 right-4 text-white/50 text-xs">
            {i + 1} / {properties.length}
          </div>
        </div>
      ))}
    </div>
  );
}