"use client";

import Header from "../../components/Header";
import EstimationForm from "../../components/estimation/EstimationForm";



export default function EstimationPage() {
  return (
    <div className="relative">

      {/* Header transparent */}
      <Header transparent />

      {/* HERO */}
      
      <section
  className="relative flex items-center justify-center bg-cover bg-center"
  style={{
    backgroundImage: "url('/hero-estimation.jpg')",
    minHeight: "calc(100vh - 80px)",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/55"></div>

  {/* Contenu */}
  <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

    {/* TEXTE */}
    <div className="text-white space-y-6">
      <h1 className="text-4xl md:text-6xl font-semibold tracking-tight font-[var(--font-montserrat)]">
        Estimez votre propriété
      </h1>

      <p className="text-lg md:text-xl text-white/90 max-w-lg">
        Une estimation confidentielle en quelques clics.
      </p>
    </div>

    {/* FORMULAIRE */}
    <div className="relative bg-white/95 backdrop-blur-md 
p-6 md:p-1
rounded-xl
shadow-[0_15px_40px_-5px_rgba(0,0,0,0.35)]
border border-white/30
max-w-sm w-full
mt-7

transition-all duration-500">

  <EstimationForm />

</div>

  </div>
</section>




    </div>
  );
}
