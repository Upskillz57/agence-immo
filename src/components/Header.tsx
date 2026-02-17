//src/components/Header.tsx
"use client";

import { useEffect, useState } from "react";
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
      <div className="relative z-20 max-w-7xl mx-auto px-8 h-full flex justify-between items-center">


      <Link href="/" className="relative w-[200px] h-[70px] block">
  <Image
    src="/logo-marchal.png"
    alt="Marchal Immobilier"
    fill
    className="object-contain cursor-pointer"
    priority
  />
</Link>


        <nav className="flex gap-12">
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
    </header>
  );
}
