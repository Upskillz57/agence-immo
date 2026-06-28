//src/components/Header.tsx
"use client";

import { useEffect, useState } from "react";
import { Menu, X, Video } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GoogleReviewsBadge from "./GoogleReviewsBadge";
import ReelsNavLink from "./ReelsNavLink";



interface HeaderProps {
  transparent?: boolean;
  forceScrollBackground?: boolean; // 👈 AJOUT
}


export default function Header({ transparent = false, forceScrollBackground = false }: HeaderProps) {
  const pathname = usePathname();

  // Cache le header sur les pages admin
if (pathname.startsWith("/admin")) return null;
  const isRecherche = pathname.startsWith("/recherche");

  const isAgence = pathname.startsWith("/agence");



  const [active, setActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  

  useEffect(() => {
    if (transparent) return;
  
    // 🔥 PAGE CONTACT
    if (pathname === "/contact") {
      const handleScroll = () => {
        setActive(window.scrollY > 40);
      };
  
      window.addEventListener("scroll", handleScroll);
      handleScroll();
  
      return () => window.removeEventListener("scroll", handleScroll);
    }
  
    // 🔵 HOME (scroll container)
    if (pathname === "/") {
      const main = document.getElementById("main-scroll");
      if (!main) return;
  
      const handleScroll = () => {
        const scrollTop = main.scrollTop;
        const viewportHeight = window.innerHeight;
        const currentSection = Math.round(scrollTop / viewportHeight);
  
        setActive(currentSection !== 0);
      };
  
      main.addEventListener("scroll", handleScroll);
      handleScroll();
  
      return () => main.removeEventListener("scroll", handleScroll);
    }
  
    // 🟡 AUTRES PAGES (agence, biens, etc.)
    const handleScroll = () => {
      setActive(window.scrollY > 20);
    };
  
    window.addEventListener("scroll", handleScroll);
    handleScroll();
  
    return () => window.removeEventListener("scroll", handleScroll);
  
  }, [transparent, pathname]);
  
  useEffect(() => {
    const main = document.getElementById("main-scroll");
  
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      if (main) main.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      if (main) main.style.overflow = "scroll";
    }
  
    return () => {
      document.body.style.overflow = "auto";
      if (main) main.style.overflow = "scroll";
    };
  }, [menuOpen]);
  
  const isPropertyPage = pathname.startsWith("/bien");

  if (pathname.startsWith("/admin")) return null;

  return (
<header className="fixed top-0 left-0 w-full z-50 h-[90px]">



      {/* BACKGROUND ANIMÉ */}
      {!transparent && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: (active || forceScrollBackground || isRecherche || isPropertyPage) ? "0%" : "-100%" }}
          transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
          className="absolute top-0 left-0 w-full h-full bg-[#122e53] z-0"



        />
      )}

      {/* CONTENU */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-8 h-full flex items-center justify-between">

  {/* MOBILE HAMBURGER */}
  <div className="md:hidden">
    <button
      onClick={() => setMenuOpen(!menuOpen)}
      className="text-white"
    >
      {menuOpen ? <X size={28} /> : <Menu size={28} />}
    </button>
  </div>

  {/* ICÔNE VIDÉO MOBILE */}
<div className="md:hidden absolute right-6">
  <Link href="/reels" className="relative flex items-center justify-center w-10 h-10">

    {/* Anneau externe qui pulse */}
    <motion.span
      className="absolute inset-0 rounded-full bg-[#d4af37]/35"
      animate={{ scale: [1, 1.55, 1], opacity: [0.6, 0, 0.6] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Anneau interne décalé */}
    <motion.span
      className="absolute inset-0 rounded-full bg-[#d4af37]/50"
      animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0, 0.7] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
    />

    {/* Fond doré de l'icône */}
    <span className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#d4af37]">
      {/* Icône caméra avec micro-vibration */}
      <motion.span
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center justify-center"
      >
        <Video size={16} className="text-[#122e53]" strokeWidth={2.5} />
      </motion.span>
    </span>

  </Link>
</div>

  {/* LOGO CENTRÉ MOBILE / GAUCHE DESKTOP */}
  <Link
    href="/"
    className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 w-[150px] md:w-[200px] h-[55px] md:h-[70px]"
    >
    <Image
      src="/logo-marchal.png"
      alt="Marchal Immobilier"
      fill
      className="object-contain"
      priority
    />
  </Link>

  {/* NAV DESKTOP */}
  <nav className="hidden md:flex items-center gap-4 flex-nowrap whitespace-nowrap">



  {/*<Link href="/estimation" className="relative group text-white text-[14px] font-bold">
  Estimer un bien
</Link>*/}

{/* NAV DESKTOP 
<Link href="/recherche?transaction=vente" className="relative group text-white text-[14px] font-semibold">
  Vendre
  <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
</Link>*/}



<div className="relative group">
  <span
    className="relative text-white text-[14px] font-semibold cursor-default"
  >
    Notre agence
    <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
  </span>

  <div className="absolute left-1/2 -translate-x-1/2 top-[100%] mt-4 w-[220px] bg-white shadow-2xl py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 rounded-sm">



  <Link
      href="/agence/nos-agences"
      className="block px-6 py-3 text-[13px] text-[#122e53] hover:text-[#d4af37] transition"
    >
      Nos agences
    </Link>

    <Link
      href="/agence/conseillers"
      className="block px-6 py-3 text-[13px] text-[#122e53] hover:text-[#d4af37] transition"
    >
      Notre équipe
    </Link>

    <Link
      href="/agence/qui-sommes-nous"
      className="block px-6 py-3 text-[13px] text-[#122e53] hover:text-[#d4af37] transition"
    >
      Qui sommes-nous
    </Link>
    

    

  </div>
</div>

<Link href="/recherche" className="relative group text-white text-[14px] font-semibold whitespace-nowrap">
  Nos biens
  <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
</Link>

<Link href="/recherche?transaction=vendu" className="relative group text-white text-[14px] font-semibold whitespace-nowrap">
  Nos biens vendus
  <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
</Link>

<Link href="/centre-affaires" className="relative group text-white text-[14px] font-semibold whitespace-nowrap">
  Centre d&apos;affaires
  <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
</Link>





<Link href="/contact" className="relative group text-white text-[14px] font-semibold whitespace-nowrap">
  Contact
  <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
</Link>



<ReelsNavLink />

<GoogleReviewsBadge />

<Link
  href="/admin"
  className="text-white/30 hover:text-white/60 transition text-xs"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M20 21a8 8 0 1 0-16 0"/>
  </svg>
</Link>

        </nav>
      </div>
      {/* MOBILE MENU OVERLAY */}
      {menuOpen && (
  <>
    {/* BACKDROP FADE */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
      onClick={() => setMenuOpen(false)}
    />

    {/* MENU PANEL SLIDE */}
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 right-0 h-full w-[280px] bg-[#122e53] z-50 md:hidden shadow-2xl flex flex-col pt-24 px-8 gap-8 text-white text-lg"
    >

      {/* BOUTON FERMER */}
      <button
        onClick={() => setMenuOpen(false)}
        className="absolute top-6 right-6"
      >
        <X size={28} />
      </button>

      <Link href="/agence/nos-agences" onClick={() => setMenuOpen(false)}>
  Nos agences
</Link>

<Link href="/agence/conseillers" onClick={() => setMenuOpen(false)}>
  Notre équipe
</Link>

<Link href="/agence/qui-sommes-nous" onClick={() => setMenuOpen(false)}>
  Qui sommes-nous
</Link>

<Link href="/recherche" onClick={() => setMenuOpen(false)}>
  Nos biens
</Link>

<Link href="/recherche?transaction=vendu" onClick={() => setMenuOpen(false)}>
  Nos biens vendus
</Link>

<Link href="/centre-affaires" onClick={() => setMenuOpen(false)}>
  Centre d&apos;affaires
</Link>

<Link href="/contact" onClick={() => setMenuOpen(false)}>
  Contact
</Link>

<div className="pt-2">
  <ReelsNavLink onClick={() => setMenuOpen(false)} />
</div>

<div className="mt-auto pt-6 border-t border-white/20">
  <GoogleReviewsBadge />
</div>

    </motion.div>
  </>
)}


    </header>
  );
}
