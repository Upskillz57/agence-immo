"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { BedDouble, Maximize, Volume2, VolumeX } from "lucide-react";
import videos from "@/lib/propertyVideos.json";

const videoMap = videos as Record<string, string>;

export default function ReelsPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [muted, setMuted] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((all) => {
        const withVideo = all
          .map((p: any) => ({ ...p, videoUrl: videoMap[p.id] ?? null }))
          .filter((p: any) => p.videoUrl !== null);
        setProperties(withVideo);
      });
  }, []);

  useEffect(() => {
    const observers = videoRefs.current.map((video) => {
      if (!video) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) video.play();
          else { video.pause(); video.currentTime = 0; }
        },
        { threshold: 0.8 }
      );
      observer.observe(video);
      return observer;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [properties]);

  useEffect(() => {
    videoRefs.current.forEach((v) => {
      if (v) v.muted = muted;
    });
  }, [muted]);

  if (!properties.length) return (
    <div style={{ height: "100dvh" }} className="bg-black flex items-center justify-center text-white">
      Chargement...
    </div>
  );

  return (
    <div
      className="overflow-y-scroll snap-y snap-mandatory bg-black md:bg-gray-950"
      style={{ height: "100dvh" }}
    >
      {/* BOUTON RETOUR */}
      <div className="fixed top-5 left-4 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full border border-white/20 hover:bg-black/70 transition"
        >
          ← Retour au site
        </Link>
      </div>

      {/* BOUTON SON — coin haut droit de la vidéo */}
<button
  onClick={() => setMuted(!muted)}
  className="absolute z-20 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 text-white hover:bg-black/70 transition
    /* MOBILE : coin haut droit de l'écran */
    top-5 right-4
    /* DESKTOP : coin haut droit de la vidéo — ajusté selon la largeur vidéo */
    md:top-4 md:right-[calc(50%-theme(spacing.48))]"
>
  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
</button>

      {properties.map((property, i) => (
        <div
          key={property.id}
          className="relative w-full snap-start snap-always flex-shrink-0
            /* MOBILE : plein écran */
            flex items-end
            /* DESKTOP : centré avec vidéo contenue */
            md:flex-row md:items-center md:justify-center md:gap-12 md:px-16"
          style={{ height: "100dvh" }}
        >

          {/* VIDÉO */}
          <video
            ref={(el) => { videoRefs.current[i] = el; }}
            src={property.videoUrl}
            loop
            muted
            playsInline
            preload="metadata"
            className="
              /* MOBILE : fond plein écran */
              absolute inset-0 h-full w-full object-cover
              /* DESKTOP : vidéo centrée, taille contenue */
              md:static md:inset-auto md:h-[80dvh] md:w-auto md:rounded-2xl md:shadow-2xl md:flex-shrink-0
            "
          />

          {/* OVERLAY GRADIENT — mobile seulement */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent md:hidden" />

          {/* INFOS */}
          <div className="
            relative z-10 p-6 pb-10 text-white w-full
            md:static md:w-[320px] md:p-0 md:text-white
          ">
            <p className="text-xs uppercase tracking-widest text-white/60 mb-1">
              {property.postalCode} {property.city}
            </p>
            <h2 className="text-xl font-semibold leading-tight mb-2">
              {property.title}
            </h2>
            <p className="text-2xl font-bold mb-4">
              {(property.price || 0).toLocaleString("fr-FR")} €
            </p>
            <div className="flex gap-4 text-sm text-white/70 mb-6">
              <span className="flex items-center gap-1"><Maximize size={14} /> {property.surface} m²</span>
              <span className="flex items-center gap-1"><BedDouble size={14} /> {property.bedrooms} ch.</span>
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
          <div className="absolute top-5 right-16 text-white/50 text-xs z-10">
            {i + 1} / {properties.length}
          </div>

        </div>
      ))}
    </div>
  );
}