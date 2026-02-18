"use client";

import Image from "next/image";
import { useState } from "react";
import EmailModal from "../../../components/EmailModal";


const advisors = [
  {
    name: "Fabien Marchal",
    role: "Directeur",
    phone: "06 33 06 75 23",
    email: "f.marchal@marchal.immo",
    image: "/fabien.jpg",
  },
  {
    name: "Elodie Marchal",
    role: "Agent commercial",
    phone: "07 82 37 37 88",
    email: "e.marchal@marchal.immo",
    image: "/elo.jpg",
  },
  {
    name: "Aziza Marchal",
    role: "Agent commercial",
    phone: "06 19 08 84 25",
    email: "a.marchal@marchal.immo",
    image: "/aziza.jpg",
  },
  {
    name: "Benoit Callizot",
    role: "Agent commercial",
    phone: "06 85 01 03 05",
    email: "b.callizot@marchal.immo",
    image: "/BenoitCallizot.jpg",
  },
  {
    name: "Laurent Krempt",
    role: "Agent commercial",
    phone: "07 66 57 45 12",
    email: "l.krempt@marchal.immo",
    image: "/LaurentKrempt.jpg",
  },
  {
    name: "Jean-Paul Schlecht",
    role: "Agent commercial",
    phone: "06 75 97 60 37",
    email: "jp.schlecht@marchal.immo",
    image: "/JeanPaulSchlecht.jpg",
  },
  {
    name: "Jérôme Bon",
    role: "Agent commercial",
    phone: "06 85 88 86 11",
    email: "j.bon@marchal.immo",
    image: "/JeromeBon.jpg",
  },
  {
    name: "Axel Szwec",
    role: "Agent commercial",
    phone: "06 22 49 07 57",
    email: "a.szwec@marchal.immo",
    image: "/AxelSzwec.jpg",
  },
  {
    name: "Tatiana Hennequin",
    role: "Agent commercial",
    phone: "06 69 57 60 98",
    email: "t.hennequin@marchal.immo",
    image: "/TatianaHennequin.jpg",
  },
];

export default function ConseillersPage() {
  const [selectedAdvisor, setSelectedAdvisor] = useState<any>(null);

  return (
    <main className="bg-white">

      {/* HERO */}
      <section className="relative h-[320px] md:h-[420px] w-full flex items-center justify-center">
      <Image
          src="/conseillers.jpg"
          alt="Nos conseillers"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center text-white">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-wide">
        Nos Conseillers
          </h1>
          <p className="mt-3 text-xs md:text-base tracking-[2px] uppercase text-[#d4af37]">
          L'excellence au service de vos projets
          </p>
        </div>
      </section>

      <div className="w-full h-[2px] bg-[#d4af37]" />

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-20">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12">


          {advisors.map((advisor, index) => (
            <div
              key={index}
              className="group bg-white shadow-sm md:hover:shadow-xl transition duration-500 rounded-lg overflow-hidden"
              >
<div className="relative w-full h-[210px] md:h-[320px] overflow-hidden">
  <Image
    src={advisor.image}
    alt={advisor.name}
    fill
    className="object-cover object-top transition duration-700 md:group-hover:scale-105"
  />
</div>



              <div className="p-6 text-center">
              <h3 className="text-base md:text-lg font-semibold text-[#122e53]">

                  {advisor.name}
                </h3>

                <p className="text-sm text-[#d4af37] mt-2 uppercase tracking-wide">
                  {advisor.role}
                </p>

                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  <p className="hover:text-[#122e53] transition">
                    {advisor.phone}
                  </p>

                  <button
  onClick={() => setSelectedAdvisor(advisor)}
  className="block w-full mt-3 py-2 border border-[#122e53] text-[#122e53] text-sm uppercase tracking-wide rounded-full hover:bg-[#122e53] hover:text-white transition duration-300"
>
  Envoyer un e-mail
</button>

                </div>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* MODAL EN DEHORS DU MAP */}
      {selectedAdvisor && (
        <EmailModal
          advisorEmail={selectedAdvisor.email}
          advisorName={selectedAdvisor.name}
          onClose={() => setSelectedAdvisor(null)}
        />
      )}

    </main>
  );
}
