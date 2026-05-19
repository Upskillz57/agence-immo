"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import { Source_Serif_4 } from "next/font/google";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const TRANSACTION_OPTIONS = [
  { value: "vente", label: "À vendre" },
  { value: "location", label: "À louer" },
  { value: "professionnels", label: "Professionnels" },
];

const RADIUS_OPTIONS = [
  { value: "1", label: "1 km" },
  { value: "5", label: "5 km" },
  { value: "10", label: "10 km" },
  { value: "20", label: "20 km" },
  { value: "50", label: "20 km +" },
];

function Dropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 text-gray-700 font-medium text-sm whitespace-nowrap px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <span>{selected?.label ?? label}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 min-w-[150px]"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  opt.value === value ? "text-[#122e53] font-semibold" : "text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Divider() {
  return <div className="hidden md:block h-6 w-px bg-gray-200 flex-shrink-0" />;
}

export default function HeroSlider() {
  const router = useRouter();
  const [transaction, setTransaction] = useState("vente");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("5");

  const handleSearch = () => {
    const params = new URLSearchParams({ transaction, location, radius });
    router.push(`/recherche?${params.toString()}`);
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">

      {/* VIDÉO DE FOND */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/cavideo.mov" type="video/mp4" />
      </video>

      {/* VOILE */}
      <div className="absolute inset-0 bg-black/45" />

      {/* ── DESKTOP : texte bas gauche + barre centrée ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="hidden md:block absolute bottom-20 left-16 text-white z-20 max-w-xl"
      >
        <h2 className={`${sourceSerif.className} text-5xl font-medium leading-[1.08] tracking-[-0.01em] mb-4`}>
          L&apos;immobilier autrement,<br />à Metz et en Moselle.
        </h2>
        <p className="text-lg font-normal opacity-80 text-gray-200">
          Accompagnement humain, moderne et sans compromis.
        </p>
      </motion.div>

      <div className="hidden md:flex absolute inset-0 items-center justify-center z-20 px-6">
        <div className="bg-white/95 backdrop-blur-md rounded-full px-4 py-4 flex flex-row items-center gap-3 shadow-2xl w-full max-w-4xl">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 text-[#122e53] font-semibold text-sm whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-[#c79b4b] inline-block" />
              Nos biens
            </span>
            <div className="h-4 w-px bg-gray-300 mx-1" />
            <Dropdown label="Type de bien" options={TRANSACTION_OPTIONS} value={transaction} onChange={setTransaction} />
          </div>
          <Divider />
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <MapPin size={15} className="text-[#c79b4b] flex-shrink-0" />
            <input
              type="text"
              placeholder="Ville ou code postal"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full bg-transparent outline-none text-gray-800 text-sm placeholder:text-gray-400"
            />
          </div>
          <Divider />
          <Dropdown label="Rayon" options={RADIUS_OPTIONS} value={radius} onChange={setRadius} />
          <button
            onClick={handleSearch}
            className="bg-[#122e53] text-white px-6 py-2 rounded-full flex items-center justify-center font-medium text-sm hover:bg-[#1a3f72] transition-colors"
          >
            Rechercher
          </button>
        </div>
      </div>

      {/* ── MOBILE : texte + barre en bas ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="md:hidden absolute bottom-0 left-0 right-0 z-20 px-4 pb-8 pt-16 bg-gradient-to-t from-black/75 via-black/30 to-transparent"
      >
        {/* Texte */}
        <h2 className={`${sourceSerif.className} text-[1.75rem] font-medium leading-[1.1] tracking-[-0.01em] text-white mb-2`}>
          L&apos;immobilier autrement,<br />à Metz et en Moselle.
        </h2>
        <p className="text-sm text-white/70 mb-5">
          Accompagnement humain, moderne et sans compromis.
        </p>

        {/* Barre de recherche mobile redessinée */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">

          {/* Ligne 1 : type + rayon */}
          <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-gray-100">
            <span className="flex items-center gap-1.5 text-[#122e53] font-semibold text-sm whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-[#c79b4b] inline-block shrink-0" />
              Nos biens
            </span>
            <div className="h-4 w-px bg-gray-200 mx-1" />
            <Dropdown label="Type de bien" options={TRANSACTION_OPTIONS} value={transaction} onChange={setTransaction} />
            <div className="h-4 w-px bg-gray-200 mx-1" />
            <Dropdown label="Rayon" options={RADIUS_OPTIONS} value={radius} onChange={setRadius} />
          </div>

          {/* Ligne 2 : localisation */}
          <div className="flex items-center gap-2 px-4 py-3">
            <MapPin size={15} className="text-[#c79b4b] shrink-0" />
            <input
              type="text"
              placeholder="Ville ou code postal"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full bg-transparent outline-none text-gray-800 text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Bouton */}
          <div className="px-3 pb-3">
            <button
              onClick={handleSearch}
              className="w-full h-11 rounded-xl bg-[#122e53] text-white font-semibold text-sm hover:bg-[#1a3f72] transition-colors"
            >
              Rechercher
            </button>
          </div>

        </div>
      </motion.div>

    </div>
  );
}
