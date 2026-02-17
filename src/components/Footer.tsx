// src/components/Footer.tsx

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#122e53] text-white">

      <div className="max-w-7xl mx-auto px-8 py-28 grid md:grid-cols-3 gap-20">

        {/* COLONNE GAUCHE */}
        <div className="space-y-14">

          <div>
            <h3 className="uppercase tracking-[0.35em] text-[11px] text-[#C6A75E] mb-8">
              Marchal Immobilier
            </h3>
            <ul className="space-y-5 text-gray-300 text-sm">
              <li className="hover:text-white transition">À propos</li>
              <li className="hover:text-white transition">Contact</li>
            </ul>
          </div>

          <div>
            <h3 className="uppercase tracking-[0.35em] text-[11px] text-[#C6A75E] mb-8">
              Pour les vendeurs
            </h3>
            <ul className="space-y-5 text-gray-300 text-sm">
              <li className="hover:text-white transition">Estimer mon bien</li>
              <li className="hover:text-white transition">Vendre avec nous</li>
            </ul>
          </div>

        </div>

        {/* COLONNE CENTRE - RÉSEAUX */}
        <div className="flex flex-col items-center text-center">
          <h3 className="uppercase tracking-[0.35em] text-[11px] text-[#C6A75E] mb-10">
            Follow us
          </h3>

          <div className="flex items-center gap-8">

            <Image src="/fb.png" alt="Facebook" width={24} height={24} className="opacity-70 hover:opacity-100 transition duration-300" />
            <Image src="/insta.png" alt="Instagram" width={24} height={24} className="opacity-70 hover:opacity-100 transition duration-300" />
            <Image src="/yt.png" alt="Youtube" width={24} height={24} className="opacity-70 hover:opacity-100 transition duration-300" />
            <Image src="/tiktok.png" alt="TikTok" width={24} height={24} className="opacity-70 hover:opacity-100 transition duration-300" />

          </div>
        </div>

        {/* COLONNE DROITE - FORMULAIRE */}
        <div>
          <h3 className="uppercase tracking-[0.35em] text-[11px] text-[#C6A75E] mb-8">
            Être recontacté
          </h3>

          <form className="space-y-5">

            <input
              type="text"
              placeholder="Votre nom"
              className="w-full bg-transparent border-b border-white/30 pb-2 text-sm placeholder-gray-400 focus:outline-none focus:border-[#C6A75E] transition"
            />

            <input
              type="tel"
              placeholder="Votre téléphone"
              className="w-full bg-transparent border-b border-white/30 pb-2 text-sm placeholder-gray-400 focus:outline-none focus:border-[#C6A75E] transition"
            />

            <button
              type="submit"
              className="mt-6 border border-[#C6A75E] text-[#C6A75E] px-6 py-2 text-sm tracking-widest uppercase hover:bg-[#C6A75E] hover:text-[#122e53] transition duration-300"
            >
              Envoyer
            </button>

          </form>
        </div>

      </div>

      {/* Ligne dorée premium */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C6A75E] to-transparent opacity-60" />

      {/* BAS */}
      <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs tracking-widest">

        <p>
          © {new Date().getFullYear()} Marchal Immobilier — Tous droits réservés.
        </p>

        <Image
          src="/logo-marchal.png"
          alt="Marchal Immobilier"
          width={170}
          height={50}
          className="mt-6 md:mt-0 opacity-90"
        />

      </div>

    </footer>
  );
}
