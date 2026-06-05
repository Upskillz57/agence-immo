"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import EmailModal from "../../../components/EmailModal";

export default function ConseillersPage() {
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/equipe").then(r => r.json()).then(setAdvisors);
  }, []);

  return (
    <main className="bg-white">

      {/* HERO */}
      <section className="relative h-[320px] md:h-[420px] w-full flex items-center justify-center">
        <Image src="/conseillers.jpg" alt="Notre équipe" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative text-center text-white">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-wide">Notre équipe</h1>
          <p className="mt-3 text-xs md:text-base tracking-[2px] uppercase text-[#d4af37]">
            L'excellence au service de vos projets
          </p>
        </div>
      </section>

      <div className="w-full h-[2px] bg-[#d4af37]" />

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-14 md:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12">
          {advisors.map((advisor, index) => (
            <div key={advisor.id || index} className="group bg-white shadow-sm md:hover:shadow-xl transition duration-500 rounded-lg overflow-hidden">
              <div className="relative w-full h-[210px] md:h-[320px] overflow-hidden">
                <Image
                  src={advisor.image}
                  alt={advisor.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 25vw"
                  priority={index < 4}
                  className="object-cover object-top transition duration-700 md:group-hover:scale-105"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-base md:text-lg font-semibold text-[#122e53]">{advisor.name}</h3>
                <p className="text-sm text-[#d4af37] mt-2 uppercase tracking-wide">{advisor.role}</p>
                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  <p className="hover:text-[#122e53] transition">{advisor.phone}</p>
                  <button
                    onClick={() => setSelectedAdvisor(advisor)}
                    className="block w-full mt-3 py-1.5 md:py-2 border border-[#122e53] text-[#122e53] text-xs md:text-sm uppercase tracking-wide rounded-full hover:bg-[#122e53] hover:text-white transition duration-300"
                  >
                    Envoyer un e-mail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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