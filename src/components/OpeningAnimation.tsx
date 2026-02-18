"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function OpeningAnimation() {
  const [open, setOpen] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const openTimer = setTimeout(() => {
      setOpen(true);
    }, 1000);

    const hideTimer = setTimeout(() => {
      setHide(true);
    }, 2300);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (hide) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      
      {/* HERO DERRIÈRE */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[2500ms]"
        style={{
          backgroundImage: "url('/hero.jpg')",
        }}
      />

      {/* LUEUR DORÉE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 0 : 0.4 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(212,160,55,0.3) 0%, transparent 60%)",
        }}
      />

      {/* VOLET GAUCHE */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: open ? "-100%" : 0 }}
        transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
        className="absolute top-0 left-0 w-1/2 h-full bg-[#122e53]"
      />

      {/* VOLET DROIT */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: open ? "100%" : 0 }}
        transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
        className="absolute top-0 right-0 w-1/2 h-full bg-[#122e53]"
      />

      {/* LOGO RESPONSIVE */}
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{
          opacity: open ? 0 : 0.8,
          scale: open ? 0.95 : 1,
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="relative w-[220px] h-[110px] sm:w-[280px] sm:h-[140px] md:w-[420px] md:h-[220px]">
          <Image
            src="/logo-marchal.png"
            alt="Marchal Immobilier"
            fill
            className="object-contain"
            priority
          />
        </div>
      </motion.div>

    </div>
  );
}
