"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const paragraphs = [
  {
    lead: "Créée en 2015 par Fabien Marchal,",
    text: "Marchal Immobilier est une agence indépendante née d'une volonté simple : proposer une approche plus humaine, moderne et qualitative de l'immobilier.",
  },
  {
    lead: null,
    text: "Initialement implantée sur le secteur de Rémilly, l'agence s'est progressivement développée sur l'ensemble du territoire mosellan grâce à une forte proximité terrain, une relation de confiance avec ses clients et une véritable passion du métier.",
  },
  {
    lead: null,
    text: "Aujourd'hui installée sur un emplacement premium à Metz, Marchal Immobilier poursuit son développement avec la même philosophie : accompagner chaque projet immobilier avec sérieux, transparence et bienveillance.",
  },
  {
    lead: null,
    text: "Au fil des années, l'agence est devenue une véritable aventure familiale, rejointe notamment par Sylvain Marchal, ancien footballeur professionnel, partageant les mêmes valeurs humaines et le même goût du travail d'équipe. Ensemble, entourés de plusieurs collaborateurs, nous avons construit une structure dynamique où la proximité, l'écoute et l'honnêteté occupent une place essentielle.",
  },
];

const values = [
  {
    number: "01",
    title: "Humain avant tout",
    description:
      "Un projet immobilier est avant tout un projet de vie. Disponibilité, implication et exigence sont au cœur de chaque accompagnement.",
  },
  {
    number: "02",
    title: "Transparence & confiance",
    description:
      "Nos clients méritent une relation franche, sans compromis sur l'honnêteté, à chaque étape du projet.",
  },
  {
    number: "03",
    title: "Commercialisation moderne",
    description:
      "Forte présence digitale, outils innovants et stratégie de diffusion performante pour valoriser chaque bien.",
  },
  {
    number: "04",
    title: "Expertise locale",
    description:
      "Une connaissance approfondie du marché mosellan, de Metz à l'ensemble du territoire, pour des conseils vraiment ancrés.",
  },
];

export default function QuiSommesNousPage() {
  return (
    <main className={`${montserrat.className} bg-white`}>

      {/* HERO */}
      <section className="relative h-[320px] md:h-[480px] w-full flex items-center justify-center overflow-hidden">
        <Image
          src="/facade.jpg"
          alt="Marchal Immobilier - Qui sommes-nous"
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
            Marchal Immobilier
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-wide">
            Qui sommes-nous ?
          </h1>
          <div className="mt-5 mx-auto w-10 h-[2px] bg-[#d4af37]" />
        </motion.div>
      </section>

      <div className="w-full h-[2px] bg-[#d4af37]" />

      {/* SECTION HISTOIRE */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* TEXTE */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="uppercase text-xs tracking-[0.25em] text-gray-400 mb-3 font-medium">
                Notre histoire
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#122e53] mb-8 leading-snug">
                Une agence née d'une passion,<br className="hidden md:block" /> portée par des valeurs.
              </h2>
              <div className="w-10 h-[2px] bg-[#d4af37] mb-8" />
            </motion.div>

            <div className="space-y-6">
              {paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: i * 0.12 }}
                  viewport={{ once: true }}
                  className="text-gray-700 leading-relaxed text-sm md:text-base"
                >
                  {p.lead && (
                    <span className="font-semibold text-[#122e53]">{p.lead} </span>
                  )}
                  {p.text}
                </motion.p>
              ))}
            </div>
          </div>

          {/* IMAGE + CITATION */}
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
              className="relative h-[300px] md:h-[420px] overflow-hidden"
            >
              <Image
                src="/accueilca.jpg"
                alt="Agence Marchal Immobilier Metz"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>

            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="border-l-4 border-[#d4af37] pl-6 py-2"
            >
              <p className="text-[#122e53] text-base md:text-lg font-medium leading-relaxed italic">
                "Chez Marchal Immobilier, nous sommes convaincus qu'un projet immobilier est avant tout un projet de vie."
              </p>
              <footer className="mt-3 text-xs uppercase tracking-[0.2em] text-gray-400 font-medium">
                Fabien Marchal — Directeur
              </footer>
            </motion.blockquote>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-gray-700 leading-relaxed text-sm md:text-base"
            >
              Grâce à une commercialisation moderne, une forte présence digitale et une parfaite connaissance du marché local, notre équipe accompagne aujourd'hui vendeurs, acquéreurs et investisseurs sur Metz et l'ensemble de la Moselle.
            </motion.p>
          </div>

        </div>
      </section>

      {/* SECTION VALEURS */}
      <section className="bg-[#f4f6f8] py-20 md:py-28 px-5 md:px-8">
        <div className="max-w-7xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="uppercase text-xs tracking-[0.25em] text-gray-400 mb-3 font-medium">
              Ce qui nous guide
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#122e53]">
              Nos valeurs
            </h2>
            <div className="mt-5 mx-auto w-10 h-[2px] bg-[#d4af37]" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-7 max-w-4xl mx-auto">
            {values.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                viewport={{ once: true, amount: 0.2 }}
                className="bg-white rounded-xl p-7 md:p-9 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 group"
              >
                <span className="block text-[11px] font-semibold tracking-[0.2em] text-gray-300 mb-4 group-hover:text-[#d4af37] transition-colors duration-300">
                  {item.number}
                </span>
                <h3 className="text-base md:text-lg font-semibold text-[#122e53] mb-3 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}
