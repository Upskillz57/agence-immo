"use client";

import Header from "../../components/Header";
import EstimationForm from "../../components/estimation/EstimationForm";
import Image from "next/image";



export default function EstimationPage() {
  return (
    <div className="relative">

      {/* Header transparent */}
      <Header transparent />

      {/* HERO */}
      
      <section className="relative flex items-center justify-center py-20 md:py-0 min-h-[100dvh]">

  {/* IMAGE OPTIMISÉE */}
  <Image
    src="/hero-estimation.jpg"
    alt="Estimation immobilière"
    fill
    priority
    sizes="100vw"
    className="object-cover"
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/55"></div>

  {/* Contenu */}
  <div className="relative z-10 w-full max-w-6xl mx-auto px-5 md:px-6 
flex flex-col md:grid md:grid-cols-2 gap-10 md:gap-16 items-center justify-center">

    {/* TEXTE */}
    <div className="text-white space-y-6 text-center md:text-left">
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tight font-[var(--font-montserrat)] leading-tight">
        Estimation
      </h1>

      <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-md md:max-w-lg mx-auto md:mx-0">
        Une estimation confidentielle en quelques clics.
      </p>
    </div>

    {/* FORMULAIRE */}
    <div className="
      relative 
      bg-white/95 backdrop-blur-md 
      p-5 md:p-1
      rounded-xl
      shadow-[0_15px_40px_-5px_rgba(0,0,0,0.35)]
      border border-white/30
      w-full
      max-w-md md:max-w-sm
      mt-4 md:mt-7
      transition-all duration-500
    ">
      <EstimationForm />
    </div>

  </div>
</section>




    </div>
  );
}
