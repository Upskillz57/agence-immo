"use client";

import { useEffect, useState } from "react";
import SearchTransactionDropdown from "./SearchTransactionDropdown";
import SearchPriceDropdown from "./SearchPriceDropdown";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Source_Serif_4 } from "next/font/google";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


const slides = [
  {
    image: "/la-maxe.jpg",
    title: "Villa contemporaine à La Maxe",
    subtitle: "Propriété d’exception avec prestations haut de gamme",
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

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  const router = useRouter();

const [transaction, setTransaction] = useState("vente");
const [location, setLocation] = useState("");
const [price, setPrice] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000); // 8 secondes
    return () => clearInterval(interval);
  }, [index]);
  

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSearch = () => {

    const params = new URLSearchParams({
      transaction,
      location,
      price
    });
  
    router.push(`/recherche?${params.toString()}`);
  
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden">


      {/* IMAGES SUPERPOSÉES POUR CROSSFADE */}
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
      scale: { duration: 7, ease: "linear" }, // zoom long continu
    }}
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: `url(${slide.image})`,
    }}
  />
))}


      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Texte bas gauche */}
      <div className="
  absolute
  bottom-32
  left-6
  right-6
  md:bottom-20
  md:left-16
  md:right-auto
  text-white
  z-20
  max-w-xl
">

      <h2
  className={`${sourceSerif.className} text-3xl md:text-5xl lg:text-5xl font-medium leading-[1.08] tracking-[-0.01em] mb-6`}
>
  {slides[index].title}
</h2>

<p className="text-base md:text-xl font-normal opacity-90 max-w-lg text-gray-200">
  {slides[index].subtitle}
</p>

      </div>

      {/* Flèche gauche */}
      <button
  onClick={prevSlide}
  className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/40 transition"
>
  <ChevronLeft size={28} />
</button>


      {/* Flèche droite */}
      <button
  onClick={nextSlide}
  className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/40 transition"
>
  <ChevronRight size={28} />
</button>


      {/* Indicateurs */}
      <div className="absolute bottom-8 left-16 flex gap-3 z-30">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-[3px] w-10 ${
              i === index ? "bg-white" : "bg-white/40"
            } transition-all`}
          />
        ))}
      </div>

      {/* Search bar centrée */}
<div className="absolute inset-0 flex items-center justify-center z-20 px-6">

<div className="
  bg-white/95
  backdrop-blur-md
  rounded-2xl md:rounded-full
  px-4
  py-4
  flex
  flex-col md:flex-row
  items-stretch md:items-center
  gap-3
  shadow-2xl
  w-full
  max-w-4xl
">

  {/* Transaction */}
  <SearchTransactionDropdown
  value={transaction}
  onChange={setTransaction}
/>

  {/* Prix */}
  <SearchPriceDropdown
  value={price}
  onChange={setPrice}
/>

{/* Localisation */}
<input
  type="text"
  placeholder="Ville ou code postal"
  value={location}
  onChange={(e)=>setLocation(e.target.value)}
  className="w-full md:flex-1 bg-transparent outline-none text-gray-800"
/>
  

  {/* Desktop */}
  <button
    onClick={handleSearch}
    className="hidden md:flex bg-[#122e53] text-white px-6 py-2 rounded-full items-center justify-center"
  >
    Rechercher
  </button>

  {/* Mobile */}
  <button
  onClick={handleSearch}
  className="
    md:hidden
    w-full
    h-12
    rounded-full
    bg-[#122e53]
    flex
    items-center
    justify-center
    text-white
    font-medium
  "
>
  Rechercher
</button>

  </div>
</div>

</div>
);
}
