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
  className={`${montserrat.className} snap-start min-h-screen bg-[#f5f5f5] flex items-center py-12 md:py-0`}
>
  <div className="max-w-7xl mx-auto w-full px-5 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">

    {/* IMAGE */}
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9 }}
      viewport={{ once: true }}
      className="relative h-[260px] sm:h-[380px] lg:h-[550px] w-full overflow-hidden rounded-xl md:rounded-none"
    >
      <motion.img
        src="/la-maxe.jpg"
        alt="Marchal Immobilier"
        className="w-full h-full object-cover"
        initial={{ scale: 1.05 }}
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
      className="bg-white p-6 md:p-10 shadow-lg md:shadow-xl rounded-xl md:rounded-none"
    >
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 text-[#2e3040] leading-tight">
        Découvrez notre agence immobilière à Metz
      </h2>

      <div className="space-y-3 text-sm sm:text-base text-gray-700 leading-relaxed">
        <p>
          Bienvenue chez Marchal Immobilier, votre agence immobilière à Metz et dans tout le secteur Mosellan.
        </p>
        <p>
          Fondée en 2015, l’agence a su évoluer avec rigueur, bienveillance et efficacité.
        </p>
        <p>
          Transaction, location, gestion locative et syndic.
        </p>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-5 px-6 py-3 bg-[#2e3040] text-white uppercase tracking-wider text-xs sm:text-sm rounded-full hover:bg-black transition-all duration-300 w-full md:w-auto"
      >
        Nous contacter
      </motion.button>
    </motion.div>

  </div>
</section>


{/* SECTION 3*/}

<section
  id="estimation"
  className="relative snap-start min-h-screen flex items-center justify-center px-5 md:px-6 bg-cover bg-center"
  style={{ backgroundImage: "url('/image-section3.jpg')" }}
>
  <div className="absolute inset-0 bg-black/70 md:bg-black/60"></div>

  <div className="relative z-10 max-w-5xl w-full text-center text-white">

    <h2 className="text-2xl sm:text-3xl md:text-5xl font-light mb-8 md:mb-10">
      Estimer un bien d'exception
    </h2>

    <div className="bg-white/15 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-5 md:p-8 flex flex-col md:flex-row gap-4">

      <input
        type="text"
        placeholder="Entrez l'adresse du bien"
        className="w-full px-5 py-4 rounded-xl bg-white text-black focus:outline-none text-base"
      />

      <button
        onClick={() => window.location.href = "/estimation"}
        className="w-full md:w-auto bg-white text-black px-8 py-4 rounded-xl hover:bg-gray-200 transition font-semibold"
      >
        Estimer
      </button>

    </div>
  </div>
</section>


{/* SECTION 4 */}
<section
  id="section-4"
  className="snap-start bg-[#f5f5f5] py-20 md:py-32 relative"
>
  <div className="max-w-6xl mx-auto px-5 md:px-6 relative">

    {/* IMAGE */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="relative w-full md:w-[75%] h-[300px] md:h-[520px] overflow-hidden"
    >
      <img
        src="/section4-achat.jpg"
        alt="Acheter"
        className="w-full h-full object-cover"
      />
    </motion.div>

    {/* CARTE TEXTE */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      viewport={{ once: true }}
      className="
        relative
        md:absolute
        md:right-0
        md:top-1/2
        md:-translate-y-1/2
        bg-white
        shadow-2xl
        p-8 md:p-14
        w-full
        md:max-w-xl
        mt-8 md:mt-0
      "
    >
      <p className="uppercase text-xs tracking-widest text-gray-500 mb-4">
        VOUS SOUHAITEZ
      </p>

      <h2 className="text-3xl md:text-4xl font-semibold text-[#2e3040] mb-6">
        Acheter un bien
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Vous cherchez la maison ou l’appartement idéal ? Nous vous guidons dans votre parcours d’achat avec transparence et efficacité.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Notre sélection de biens est mise à jour quotidiennement, et nos conseillers prennent le temps de comprendre vos besoins pour vous proposer les opportunités les plus pertinentes.
      </p>

      <p className="text-gray-700 leading-relaxed mb-8">
        Acheter un bien immobilier est une étape importante, et nous sommes là pour que tout se passe en toute confiance.
      </p>

      <a
        href="/biens-a-vendre"
        className="inline-block px-7 py-3 bg-[#2e3040] text-white uppercase tracking-wider text-sm rounded-full hover:bg-black transition-all duration-300"
      >
        Voir nos biens
      </a>
    </motion.div>

  </div>
</section>




{/* SECTION 5 */}
<section
  id="section-5"
  className="snap-start bg-[#f5f5f5] py-20 md:py-32 relative"
>
  <div className="max-w-6xl mx-auto px-5 md:px-6 relative">

    {/* IMAGE */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="relative ml-auto w-full md:w-[75%] h-[300px] md:h-[520px] overflow-hidden"
    >
      <img
        src="/section4-loc.jpg"
        alt="Louer"
        className="w-full h-full object-cover"
      />
    </motion.div>

    {/* CARTE TEXTE */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      viewport={{ once: true }}
      className="
        relative
        md:absolute
        md:left-0
        md:top-1/2
        md:-translate-y-1/2
        bg-white
        shadow-2xl
        p-8 md:p-14
        w-full
        md:max-w-xl
        mt-8 md:mt-0
      "
    >
      <p className="uppercase text-xs tracking-widest text-gray-500 mb-4">
        VOUS CHERCHEZ À
      </p>

      <h2 className="text-3xl md:text-4xl font-semibold text-[#2e3040] mb-6">
        Louer un bien
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Vous êtes propriétaire et souhaitez louer votre bien ? Marchal Immobilier s’occupe de tout.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        De la recherche de locataires fiables jusqu’à la rédaction du bail, en passant par les visites et la sélection des dossiers, nous vous proposons un service complet pour sécuriser la location de votre logement.
      </p>

      <p className="text-gray-700 leading-relaxed mb-8">
        Avec nous, vous louez sans stress, avec sérieux et réactivité.
      </p>

      <a
        href="/biens-a-louer"
        className="inline-block px-7 py-3 bg-[#2e3040] text-white uppercase tracking-wider text-sm rounded-full hover:bg-black transition-all duration-300"
      >
        Voir nos locations
      </a>
    </motion.div>

  </div>
</section>


{/* SECTION 6 */}
<section
  id="section-6"
  className="snap-start bg-[#f5f5f5] py-20 md:py-32 relative"
>
  <div className="max-w-6xl mx-auto px-5 md:px-6 relative">

    {/* IMAGE */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="relative w-full md:w-[75%] h-[300px] md:h-[520px] overflow-hidden"
    >
      <img
        src="/section4-vendre.jpg"
        alt="Vendre"
        className="w-full h-full object-cover"
      />
    </motion.div>

    {/* CARTE TEXTE */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      viewport={{ once: true }}
      className="
        relative
        md:absolute
        md:right-0
        md:top-1/2
        md:-translate-y-1/2
        bg-white
        shadow-2xl
        p-8 md:p-14
        w-full
        md:max-w-xl
        mt-8 md:mt-0
      "
    >
      <p className="uppercase text-xs tracking-widest text-gray-500 mb-4">
        VOUS ENVISAGEZ DE
      </p>

      <h2 className="text-3xl md:text-4xl font-semibold text-[#2e3040] mb-6">
        Vendre avec nous
      </h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        Vous souhaitez vendre un bien immobilier ? Confiez votre projet à Marchal Immobilier.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        Grâce à notre parfaite connaissance du marché local et à des outils de communication puissants, nous mettons tout en œuvre pour valoriser votre bien et attirer les bons acquéreurs.
      </p>

      <p className="text-gray-700 leading-relaxed mb-8">
        Visuels de qualité, stratégie de diffusion, accompagnement humain : notre objectif est de vendre dans les meilleures conditions, rapidement et sereinement.
      </p>

      <a
        href="/vendre"
        className="inline-block px-7 py-3 bg-[#122e53] text-white uppercase tracking-wider text-sm rounded-full hover:bg-black transition-all duration-300"
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
