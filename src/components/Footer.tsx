// src/components/Footer.tsx

import Image from "next/image";
import Link from "next/link";
import FooterContactForm from "@/components/FooterContactForm";


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
              <li className="hover:text-white transition cursor-pointer">
                <Link href="agence/qui-sommes-nous">Qui sommes-nous</Link>
              </li>
              <li className="hover:text-white transition cursor-pointer">
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="uppercase tracking-[0.35em] text-[11px] text-[#C6A75E] mb-8">
              Pour les vendeurs
            </h3>
            <ul className="space-y-5 text-gray-300 text-sm">
              <li className="hover:text-white transition cursor-pointer">
                <Link href="/vendre">Vendre avec nous</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* COLONNE CENTRE - RÉSEAUX */}
        <div className="flex flex-col items-center text-center">
          <h3 className="uppercase tracking-[0.35em] text-[11px] text-[#C6A75E] mb-10">
            Suivez-nous
          </h3>

          <div className="flex items-center gap-8">
            <a href="https://www.facebook.com/profile.php?id=100078900047893" target="_blank" rel="noopener noreferrer">
              <Image src="/fb.png" alt="Facebook" width={24} height={24} className="opacity-70 hover:opacity-100 transition duration-300" />
            </a>
            <a href="https://www.instagram.com/centredaffairesmarchalimmo/" target="_blank" rel="noopener noreferrer">
              <Image src="/insta.png" alt="Instagram" width={24} height={24} className="opacity-70 hover:opacity-100 transition duration-300" />
            </a>
            <a href="https://www.youtube.com/@fabienmarchalimmobilier6981" target="_blank" rel="noopener noreferrer">
              <Image src="/yt.png" alt="Youtube" width={24} height={24} className="opacity-70 hover:opacity-100 transition duration-300" />
            </a>
          </div>
        </div>

        {/* COLONNE DROITE - FORMULAIRE */}
        {/* COLONNE DROITE - FORMULAIRE */}
<div>
  <h3 className="uppercase tracking-[0.35em] text-[11px] text-[#C6A75E] mb-8">
    Être recontacté
  </h3>
  <FooterContactForm />
</div>

      </div>

      {/* Ligne dorée premium */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C6A75E] to-transparent opacity-60" />

      {/* BAS */}
      <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs tracking-widest">
        <p>
          © {new Date().getFullYear()} Marchal Immobilier — Tous droits réservés. Réalisation Upskillz
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