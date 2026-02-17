"use client";

import { motion } from "framer-motion";

import OpeningAnimation from "../components/OpeningAnimation";
import HeroSlider from "../components/HeroSlider";
import { Montserrat } from "next/font/google";


const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});



export default function HomePage() {
  return (
    <>
      <OpeningAnimation />

      <main
  id="main-scroll"
  className="snap-y snap-mandatory h-[100dvh] overflow-y-scroll scroll-smooth"
>


        {/* HERO */}
        <section className="snap-start h-[100dvh] relative">
  <HeroSlider />
  <div className="absolute inset-0 bg-black/40 md:hidden pointer-events-none" />
</section>





        {/* SECTION 2 */}
        <section
  id="section-2"
  className={`${montserrat.className} snap-start min-h-screen bg-[#f5f5f5] flex items-center py-16 md:py-0`}
>

  <div className="max-w-7xl mx-auto w-full px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

    {/* IMAGE */}
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9 }}
      viewport={{ once: true }}
      className="relative h-[350px] sm:h-[450px] lg:h-[550px] w-full overflow-hidden"
    >
      <motion.img
        src="/la-maxe.jpg"
        alt="Marchal Immobilier"
        className="w-full h-full object-cover"
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      />
    </motion.div>

    {/* TEXTE */}
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.2 }}
      viewport={{ once: true }}
      className="
        bg-white 
        p-6 sm:p-8 lg:p-10 
        shadow-xl 
        relative 
        lg:-ml-16 
        max-w-full 
        lg:max-w-[520px]
      "
    >
      <h2 className="text-2xl sm:text-3xl lg:text-3xl font-semibold mb-5 text-[#2e3040] leading-tight">
        DÉCOUVREZ <br />
        notre agence immobilière à Metz
      </h2>

      <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
        <p>
          Bienvenue chez Marchal Immobilier, votre agence immobilière
          à Metz et dans tout le secteur Mosellan.
        </p>

        <p>
          Fondée en 2015 par Fabien Marchal, l’agence a su évoluer
          avec rigueur, bienveillance et efficacité.
        </p>

        <p>
          Spécialistes de la transaction immobilière, de la location,
          de la gestion locative et du syndic.
        </p>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        viewport={{ once: true }}
        className="
          mt-6 
          px-7 py-3 
          bg-[#2e3040] 
          text-white 
          uppercase 
          tracking-wider 
          text-xs sm:text-sm 
          rounded-full 
          hover:bg-black 
          transition-all duration-300
        "
      >
        Nous contacter
      </motion.button>
    </motion.div>

  </div>
</section>

{/* SECTION 3*/}

<section
  id="estimation"
  className="relative snap-start min-h-screen flex items-center justify-center px-6 bg-cover bg-center"
  style={{ backgroundImage: "url('/image-section3.jpg')" }}
>
  {/* Overlay sombre premium */}
  <div className="absolute inset-0 bg-black/60"></div>

  <div className="relative z-10 max-w-5xl w-full text-center text-white">

    <h2 className="text-4xl md:text-5xl font-light mb-10">
      Estimer un bien d'exception
    </h2>

    <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-4">

      <input
        type="text"
        placeholder="Entrez l'adresse du bien"
        className="flex-1 px-6 py-4 rounded-xl bg-white text-black focus:outline-none text-lg"
      />

      <button
        onClick={() => window.location.href = "/estimation"}
        className="bg-white text-black px-8 py-4 rounded-xl hover:bg-gray-200 transition font-semibold"
      >
        Estimer
      </button>

    </div>

  </div>
</section>

{/* SECTION 4 - VERSION AJUSTÉE */}
<section
  id="section-4"
  className="snap-start bg-[#f5f5f5] flex items-center py-20 md:pt-28"
>
  <div className="max-w-6xl mx-auto w-full px-6 relative">

    <div className="flex flex-col md:flex-row items-center gap-12">

      {/* IMAGE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: true }}
        className="relative w-full md:w-[60%] h-[320px] md:h-[520px] overflow-hidden"
      >
        <img
          src="/section4-achat.jpg"
          alt="Acheter"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* TEXTE */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: true }}
        className="bg-white shadow-2xl p-8 md:p-14 w-full md:max-w-xl"
      >
        <p className="uppercase text-sm tracking-widest text-gray-500 mb-4">
          VOUS SOUHAITEZ
        </p>

        <h2 className="text-3xl md:text-4xl font-semibold text-[#2e3040] mb-6">
          acheter un bien
        </h2>

        <p className="text-gray-700 leading-relaxed mb-8">
          Vous cherchez la maison ou l’appartement idéal ? Nous vous guidons dans votre parcours d’achat avec transparence et efficacité.
        </p>

        <a
          href="/biens-a-vendre"
          className="inline-block px-7 py-3 bg-[#2e3040] text-white uppercase tracking-wider text-sm rounded-full hover:bg-black transition-all duration-300"
        >
          Voir nos biens
        </a>
      </motion.div>

    </div>
  </div>
</section>





{/* SECTION 5 */}
<section
  id="section-5"
  className="snap-start min-h-screen bg-[#f5f5f5] flex items-center pt-28"
>

  <div className="max-w-6xl mx-auto w-full px-6 relative flex items-center">

    {/* IMAGE (GAUCHE) */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9 }}
      viewport={{ once: true }}
      className="relative w-full h-[520px] overflow-hidden mr-24"
    >
      <img
        src="/section4-loc.jpg"
        alt="Louer"
        className="w-full h-full object-cover"
      />
    </motion.div>

    {/* CARTE TEXTE (DROITE) */}
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.2 }}
      viewport={{ once: true }}
      className="
        absolute
        right-0
        bg-white
        shadow-2xl
        p-10
        md:p-14
        max-w-xl
      "
    >
      <p className="uppercase text-sm tracking-widest text-gray-500 mb-4">
        VOUS CHERCHEZ À
      </p>

      <h2 className="text-4xl font-semibold text-[#2e3040] mb-6">
        louer un bien
      </h2>

      <p className="text-gray-700 leading-relaxed mb-8">
        Marchal Immobilier s’occupe de tout. De la recherche de locataires fiables jusqu’à la rédaction du bail...
      </p>

      <a
        href="/biens-a-louer"
        className="px-7 py-3 bg-[#2e3040] text-white uppercase tracking-wider text-sm rounded-full hover:bg-black transition-all duration-300"
      >
        Voir nos locations
      </a>
    </motion.div>

  </div>
</section>



{/* SECTION 6 */}
<section
  id="section-6"
  className="snap-start min-h-screen bg-[#f5f5f5] flex items-center pt-28"
>

  <div className="max-w-6xl mx-auto w-full px-6 relative flex items-center">

    {/* IMAGE (DROITE) */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9 }}
      viewport={{ once: true }}
      className="relative w-full h-[520px] overflow-hidden ml-24"
    >
      <img
        src="/section4-vendre.jpg"
        alt="Vendre"
        className="w-full h-full object-cover"
      />
    </motion.div>

    {/* CARTE TEXTE (GAUCHE) */}
    <motion.div
      initial={{ opacity: 0, x: -80 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.2 }}
      viewport={{ once: true }}
      className="
        absolute
        left-0
        bg-white
        shadow-2xl
        p-10
        md:p-14
        max-w-xl
      "
    >
      <p className="uppercase text-sm tracking-widest text-gray-500 mb-4">
        VOUS ENVISAGEZ DE
      </p>

      <h2 className="text-4xl font-semibold text-[#2e3040] mb-6">
        vendre avec nous
      </h2>

      <p className="text-gray-700 leading-relaxed mb-8">
        Confiez votre projet à Marchal Immobilier. Grâce à notre parfaite connaissance du marché local...
      </p>

      <a
        href="/vendre"
        className="px-7 py-3 bg-[#122e53] text-white uppercase tracking-wider text-sm rounded-full hover:bg-black transition-all duration-300"
      >
        En savoir +
      </a>
    </motion.div>

  </div>
</section>






      </main>
    </>
  );
}
