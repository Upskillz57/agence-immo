"use client";

import { useEffect, useState } from "react";
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

  return (
    <div className="relative h-screen w-full overflow-hidden">

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
      <div className="absolute bottom-20 left-16 text-white z-20 max-w-xl">
      <h2
  className={`${sourceSerif.className} text-4xl md:text-5xl lg:text-5xl font-medium leading-[1.08] tracking-[-0.01em] mb-6`}
>
  {slides[index].title}
</h2>

<p className="text-lg md:text-xl font-normal opacity-85 max-w-lg">
  {slides[index].subtitle}
</p>

      </div>

      {/* Flèche gauche */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/40 transition"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Flèche droite */}
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/40 transition"
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
      <div className="relative z-20 flex items-center justify-center h-full px-6">
        <div className="bg-white rounded-full px-6 py-4 flex items-center gap-4 shadow-xl w-full max-w-3xl">
          <select className="bg-transparent outline-none">
            <option>For sale</option>
          </select>
          <select className="bg-transparent outline-none">
            <option>Any price</option>
          </select>
          <input
            type="text"
            placeholder="Location"
            className="flex-1 bg-transparent outline-none"
          />
          <button className="bg-black text-white px-6 py-2 rounded-full">
            Search
          </button>
        </div>
      </div>

    </div>
  );
}
