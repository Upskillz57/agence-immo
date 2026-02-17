//src/components/Header.tsx
"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";


interface HeaderProps {
  transparent?: boolean;
  forceScrollBackground?: boolean; // 👈 AJOUT
}


export default function Header({ transparent = false }: HeaderProps) {
  const pathname = usePathname();

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
  
        setActive(currentSection === 1 || currentSection >= 3);
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
  
  

  return (
<header className="fixed top-0 left-0 w-full z-50 h-[90px]">



      {/* BACKGROUND ANIMÉ */}
      {!transparent && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: active ? "0%" : "-100%" }}
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
  <nav className="hidden md:flex gap-12">

        <Link href="#estimation" className="relative group text-white text-[14px] font-bold">
  Estimer un bien
  <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
</Link>

<Link href="/biens-a-vendre" className="relative group text-white text-[14px] font-semibold">
  Vendre
  <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
</Link>

<Link href="/biens-a-vendre" className="relative group text-white text-[14px] font-semibold">
  Acheter
  <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
</Link>

<div className="relative group">
  <span
    className="relative text-white text-[14px] font-semibold cursor-default"
  >
    Agence
    <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
  </span>

  <div className="absolute left-1/2 -translate-x-1/2 top-[100%] mt-4 w-[220px] bg-white shadow-2xl py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 rounded-sm">

    <Link
      href="/agence/conseillers"
      className="block px-6 py-3 text-[13px] text-[#122e53] hover:text-[#d4af37] transition"
    >
      Nos Conseillers
    </Link>

  </div>
</div>





<Link href="/contact" className="relative group text-white text-[14px] font-semibold">
  Contact
  <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
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

      <Link href="#estimation" onClick={() => setMenuOpen(false)}>
        Estimer un bien
      </Link>

      <Link href="/biens-a-vendre" onClick={() => setMenuOpen(false)}>
        Vendre
      </Link>

      <Link href="/biens-a-vendre" onClick={() => setMenuOpen(false)}>
        Acheter
      </Link>

      <Link href="/agence/conseillers" onClick={() => setMenuOpen(false)}>
        Nos Conseillers
      </Link>

      <Link href="/contact" onClick={() => setMenuOpen(false)}>
        Contact
      </Link>

    </motion.div>
  </>
)}


    </header>
  );
}
