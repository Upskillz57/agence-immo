"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown, MapPin } from "lucide-react";
import { Source_Serif_4 } from "next/font/google";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const slides = [
  {
    image: "/la-maxe.jpg",
    title: "Villa contemporaine à La Maxe",
    subtitle: "Propriété d'exception avec prestations haut de gamme",
  },
  {
    image: "/villa2.jpg",
    title: "Maison de prestige",
    subtitle: "Volumes généreux et architecture moderne",
  },
  {
    image: "/villa3.jpg",
    title: "Résidence exclusive",
    subtitle: "Cadre privilégié et finitions luxueuses",
  },
];

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

// ─── Dropdown générique ────────────────────────────────────────────────────────
function Dropdown({
  label,
  options,
  value,
  onChange,
  icon,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
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
        {icon && <span className="text-[#122e53]">{icon}</span>}
        <span>{selected?.label ?? label}</span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
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
                  opt.value === value
                    ? "text-[#122e53] font-semibold"
                    : "text-gray-700"
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

// ─── Séparateur vertical ───────────────────────────────────────────────────────
function Divider() {
  return <div className="hidden md:block h-6 w-px bg-gray-200 flex-shrink-0" />;
}

// ─── Composant principal ───────────────────────────────────────────────────────
export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const [transaction, setTransaction] = useState("vente");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("5");

  const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams({ transaction, location, radius });
    router.push(`/recherche?${params.toString()}`);
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">

      {/* SLIDES */}
      {slides.map((slide, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1 }}
          animate={{
            opacity: i === index ? 1 : 0,
            scale: i === index ? 1.2 : 1.05,
          }}
          transition={{
            opacity: { duration: 2.5 },
            scale: { duration: 7, ease: "linear" },
          }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Texte bas gauche */}
      <div className="absolute bottom-32 left-6 right-6 md:bottom-20 md:left-16 md:right-auto text-white z-20 max-w-xl">
        <h2 className={`${sourceSerif.className} text-3xl md:text-5xl font-medium leading-[1.08] tracking-[-0.01em] mb-6`}>
          {slides[index].title}
        </h2>
        <p className="text-base md:text-xl font-normal opacity-90 max-w-lg text-gray-200">
          {slides[index].subtitle}
        </p>
      </div>

      {/* Flèches */}
      <button onClick={prevSlide} className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/40 transition">
        <ChevronLeft size={28} />
      </button>
      <button onClick={nextSlide} className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/40 transition">
        <ChevronRight size={28} />
      </button>

      {/* Indicateurs */}
      <div className="absolute bottom-8 left-16 flex gap-3 z-30">
        {slides.map((_, i) => (
          <div key={i} className={`h-[3px] w-10 ${i === index ? "bg-white" : "bg-white/40"} transition-all`} />
        ))}
      </div>

      {/* ── BARRE DE RECHERCHE ────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center justify-center z-20 px-6">
        <div className="
          bg-white/95 backdrop-blur-md
          rounded-2xl md:rounded-full
          px-4 py-4
          flex flex-col md:flex-row
          items-stretch md:items-center
          gap-3
          shadow-2xl
          w-full max-w-4xl
        ">

          {/* ── GAUCHE : label "Nos biens" + dropdown transaction ─── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Badge "Nos biens" */}
            <span className="hidden md:inline-flex items-center gap-1.5 text-[#122e53] font-semibold text-sm whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-[#c79b4b] inline-block" />
              Nos biens
            </span>

            {/* Séparateur */}
            <div className="hidden md:block h-4 w-px bg-gray-300 mx-1" />

            {/* Dropdown transaction */}
            <Dropdown
              label="Type de bien"
              options={TRANSACTION_OPTIONS}
              value={transaction}
              onChange={setTransaction}
            />
          </div>

          <Divider />

          {/* ── LOCALISATION ──────────────────────────────────────── */}
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

          {/* ── RAYON ─────────────────────────────────────────────── */}
          <Dropdown
            label="Rayon"
            options={RADIUS_OPTIONS}
            value={radius}
            onChange={setRadius}
          />

          {/* ── BOUTON RECHERCHER Desktop ─────────────────────────── */}
          <button
            onClick={handleSearch}
            className="hidden md:flex bg-[#122e53] text-white px-6 py-2 rounded-full items-center justify-center font-medium text-sm hover:bg-[#1a3f72] transition-colors"
          >
            Rechercher
          </button>

          {/* ── BOUTON RECHERCHER Mobile ──────────────────────────── */}
          <button
            onClick={handleSearch}
            className="md:hidden w-full h-12 rounded-full bg-[#122e53] flex items-center justify-center text-white font-medium text-sm"
          >
            Rechercher
          </button>

        </div>
      </div>

    </div>
  );
}