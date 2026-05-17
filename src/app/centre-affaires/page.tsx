"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Montserrat } from "next/font/google";
import Link from "next/link";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const services = [
  "La transaction immobilière",
  "Le courtage en financement",
  "Les assurances",
  "La construction",
  "L'architecture et l'architecture d'intérieur",
  "L'agencement sur mesure et les cuisines",
  "Les travaux et la rénovation",
  "Les diagnostics immobiliers",
  "Le conseil patrimonial",
];

export default function CentreAffairesPage() {
  return (
    <main className={`${montserrat.className} bg-white`}>

      {/* HERO */}
      <section className="relative h-[320px] md:h-[500px] w-full flex items-center justify-center overflow-hidden">
        <Image
          src="/cafacade.jpg"
          alt="Centre d'affaires Marchal Immobilier Metz"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#122e53]/60" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative text-center text-white z-10 px-4"
        >
          <p className="uppercase text-xs tracking-[0.3em] text-[#d4af37] mb-4 font-medium">
            Marchal Immobilier — Metz
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-wide">
            Notre Centre d&apos;affaires
          </h1>
          <div className="mt-5 mx-auto w-10 h-[2px] bg-[#d4af37]" />
        </motion.div>
      </section>

      <div className="w-full h-[2px] bg-[#d4af37]" />

      {/* INTRO + SERVICES */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* TEXTE INTRO */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="uppercase text-xs tracking-[0.25em] text-gray-400 mb-3 font-medium">
              Un lieu, tous les experts
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#122e53] mb-6 leading-snug">
              L&apos;immobilier simplifié,<br className="hidden md:block" /> sous un même toit.
            </h2>
            <div className="w-10 h-[2px] bg-[#d4af37] mb-8" />

            <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-6">
              Marchal Immobilier a créé à Metz un centre d&apos;affaires unique réunissant plusieurs
              professionnels de l&apos;immobilier, de la construction et de l&apos;habitat afin
              d&apos;accompagner nos clients de manière globale et efficace.
            </p>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-10">
              Au sein d&apos;un même lieu, nous réunissons différents partenaires spécialisés dans :
            </p>

            <ul className="space-y-3">
              {services.map((service, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 text-sm md:text-base text-[#1a1a1a]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shrink-0" />
                  {service}
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-10 p-6 bg-[#f4f6f8] border-l-4 border-[#d4af37]"
            >
              <p className="text-[#122e53] font-medium text-sm md:text-base leading-relaxed">
                Notre objectif : simplifier les projets immobiliers de nos clients en centralisant
                l&apos;ensemble des services nécessaires dans un environnement moderne, professionnel
                et convivial.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <Link
                href="/contact"
                className="inline-block px-7 py-3 bg-[#122e53] text-white uppercase tracking-wider text-sm rounded-full hover:bg-black transition-all duration-300"
              >
                Prendre rendez-vous
              </Link>
            </motion.div>
          </motion.div>

          {/* PHOTOS */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="col-span-2 relative h-[260px] md:h-[320px] overflow-hidden">
              <Image
                src="/boxinterieur.jpg"
                alt="Intérieur centre d'affaires"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="relative h-[180px] md:h-[220px] overflow-hidden">
              <Image
                src="/boxinter2.jpg"
                alt="Espace de travail"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="relative h-[180px] md:h-[220px] overflow-hidden">
              <Image
                src="/reunion.jpg"
                alt="Salle de réunion"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>

        </div>
      </section>

    </main>
  );
}
