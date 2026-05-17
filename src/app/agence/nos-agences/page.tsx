"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Clock, CalendarCheck } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const agencies = [
  {
    name: "Agence de Metz",
    image: "/accueilca.jpg",
    address: ["2 rue du XXème corps américain", "57000 Metz"],
    phone: "03 87 74 44 73",
    email: "centredaffaires.marchal@marchalimmobilier.com",
    hours: [
      { label: "Lundi — Vendredi", time: "8h - 12h30  |  13h30 - 19h" },
      { label: "Samedi", time: "9h - 12h30  |  13h30 - 18h" },
    ],
    rdv: false,
  },
  {
    name: "Agence de Remilly",
    image: "/vitrine.jpeg",
    address: ["2 rue Auguste Rolland", "57580 Remilly"],
    phone: "03 87 74 44 73",
    email: "admin.marchal@marchalimmobilier.com",
    hours: null,
    rdv: true,
  },
];

export default function NosAgencesPage() {
  return (
    <main className={`${montserrat.className} bg-white`}>
      {/* HERO */}
      <section className="relative h-[320px] md:h-[420px] w-full flex items-center justify-center overflow-hidden">
        <Image
          src="/accueilca.jpg"
          alt="Nos agences Marchal Immobilier"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#122e53]/65" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative text-center text-white z-10 px-4"
        >
          <p className="uppercase text-xs tracking-[0.3em] text-[#d4af37] mb-4 font-medium">
            Marchal Immobilier
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-wide">
            Nos Agences
          </h1>
          <div className="mt-5 mx-auto w-10 h-[2px] bg-[#d4af37]" />
        </motion.div>
      </section>

      <div className="w-full h-[2px] bg-[#d4af37]" />

      {/* CARDS AGENCES */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
          {agencies.map((agency, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="group overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 flex flex-col"
            >
              {/* PHOTO */}
              <div className="relative h-[260px] md:h-[360px] overflow-hidden">
                <Image
                  src={agency.image}
                  alt={agency.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#122e53]/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <h2 className="text-white text-2xl md:text-3xl font-semibold tracking-wide drop-shadow-lg">
                    {agency.name}
                  </h2>
                </div>
              </div>

              {/* INFOS */}
              <div className="flex-1 bg-white p-8 md:p-10 border-b-4 border-[#d4af37] space-y-6">
                {/* ADRESSE */}
                <div className="flex gap-4 items-start">
                  <MapPin className="text-[#122e53] shrink-0 mt-0.5" size={20} strokeWidth={2} />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-1 font-medium">
                      Adresse
                    </p>
                    {agency.address.map((line, j) => (
                      <p key={j} className="text-[#1a1a1a] font-medium text-sm md:text-base">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {/* TÉLÉPHONE */}
                {agency.phone && (
                  <div className="flex gap-4 items-start">
                    <Phone className="text-[#122e53] shrink-0 mt-0.5" size={20} strokeWidth={2} />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-1 font-medium">
                        Téléphone
                      </p>
                      <a
                        href={`tel:${agency.phone.replace(/\s/g, "")}`}
                        className="text-[#122e53] font-medium text-sm md:text-base hover:text-[#d4af37] transition-colors duration-300"
                      >
                        {agency.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* EMAIL */}
                {agency.email && (
                  <div className="flex gap-4 items-start">
                    <Mail className="text-[#122e53] shrink-0 mt-0.5" size={20} strokeWidth={2} />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-1 font-medium">
                        Email
                      </p>
                      <a
                        href={`mailto:${agency.email}`}
                        className="text-[#122e53] font-medium text-sm md:text-base hover:text-[#d4af37] transition-colors duration-300 break-all"
                      >
                        {agency.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* HORAIRES */}
                <div className="flex gap-4 items-start">
                  {agency.rdv ? (
                    <CalendarCheck className="text-[#122e53] shrink-0 mt-0.5" size={20} strokeWidth={2} />
                  ) : (
                    <Clock className="text-[#122e53] shrink-0 mt-0.5" size={20} strokeWidth={2} />
                  )}
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-1 font-medium">
                      Horaires
                    </p>
                    {agency.rdv ? (
                      <p className="text-[#122e53] font-semibold text-sm md:text-base italic">
                        Sur rendez-vous uniquement
                      </p>
                      
                      
                    ) : (
                      <div className="space-y-2">
                        {agency.hours!.map((h, j) => (
                          <div key={j} className="flex flex-col sm:flex-row sm:gap-4">
                            <span className="text-gray-500 text-sm shrink-0 w-40">
                              {h.label}
                            </span>
                            <span className="text-[#1a1a1a] font-medium text-sm">
                              {h.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
