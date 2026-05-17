"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const atouts = [
  "Une forte présence locale sur Metz et la Moselle",
  "Une communication moderne et une visibilité accrue",
  "Des outils performants et une formation continue",
  "Un environnement de travail stimulant et bienveillant",
  "Une équipe passionnée et une aventure familiale ambitieuse",
];

export default function NousRejoindreePage() {
  return (
    <main className={`${montserrat.className} bg-white`}>

      {/* HERO */}
      <section className="relative h-[320px] md:h-[500px] w-full flex items-center justify-center overflow-hidden">
        <Image
          src="/rejoindre.jpg"
          alt="Rejoindre Marchal Immobilier"
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
            Marchal Immobilier — Rejoignez l&apos;aventure
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-wide">
            Nous rejoindre
          </h1>
          <div className="mt-5 mx-auto w-10 h-[2px] bg-[#d4af37]" />
        </motion.div>
      </section>

      <div className="w-full h-[2px] bg-[#d4af37]" />

      {/* CONTENU PRINCIPAL */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* TEXTE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="uppercase text-xs tracking-[0.25em] text-gray-400 mb-3 font-medium">
              Une opportunité de carrière
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#122e53] mb-6 leading-snug">
              Évoluez au sein d&apos;une agence<br className="hidden md:block" /> moderne et humaine.
            </h2>
            <div className="w-10 h-[2px] bg-[#d4af37] mb-8" />

            <div className="space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
              <p>
                Vous souhaitez évoluer dans l&apos;immobilier au sein d&apos;une structure moderne,
                dynamique et humaine ?
              </p>
              <p>
                Chez Marchal Immobilier, nous plaçons l&apos;humain, la proximité et la qualité de
                service au cœur de notre métier. Grâce à une forte présence locale, une communication
                moderne et un environnement de travail stimulant, notre agence poursuit aujourd&apos;hui
                son développement sur Metz et l&apos;ensemble de la Moselle.
              </p>
              <p>
                Que vous soyez déjà expérimenté dans l&apos;immobilier ou en reconversion
                professionnelle, nous recherchons avant tout des personnalités motivées, impliquées et
                partageant nos valeurs de bienveillance, d&apos;honnêteté et d&apos;accompagnement
                client.
              </p>
              <p>
                Rejoindre Marchal Immobilier, c&apos;est intégrer une aventure familiale ambitieuse,
                bénéficier d&apos;outils modernes, d&apos;une forte visibilité et évoluer au sein
                d&apos;une équipe passionnée.
              </p>
            </div>
          </motion.div>

          {/* ATOUTS + PHOTO */}
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
              className="relative h-[260px] md:h-[320px] overflow-hidden"
            >
              <Image
                src="/rejoindre.jpg"
                alt="Équipe Marchal Immobilier"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-[#f4f6f8] p-7 md:p-8"
            >
              <p className="uppercase text-xs tracking-[0.25em] text-gray-400 mb-5 font-medium">
                Ce que nous offrons
              </p>
              <ul className="space-y-4">
                {atouts.map((atout, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 text-sm md:text-base text-[#1a1a1a]"
                  >
                    <CheckCircle2 className="text-[#d4af37] shrink-0 mt-0.5" size={18} strokeWidth={2} />
                    {atout}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-[#122e53] py-20 md:py-24 px-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="uppercase text-xs tracking-[0.3em] text-[#d4af37] mb-4 font-medium">
            Prenons contact
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
            Nous serons heureux d&apos;échanger avec vous.
          </h2>
          <div className="mx-auto w-10 h-[2px] bg-[#d4af37] mb-8" />
          <p className="text-white/70 text-sm md:text-base leading-relaxed mb-10">
            Envoyez-nous votre candidature ou contactez-nous directement pour en savoir plus sur
            les opportunités disponibles au sein de notre équipe.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-[#d4af37] text-[#122e53] uppercase tracking-wider text-sm font-semibold rounded-full hover:bg-white transition-all duration-300"
          >
            Nous contacter
          </Link>
        </motion.div>
      </section>

    </main>
  );
}
