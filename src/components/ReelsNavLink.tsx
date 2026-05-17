"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play } from "lucide-react";

export default function ReelsNavLink({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/reels" onClick={onClick} className="relative inline-flex shrink-0">

      {/* Anneau de pulsation externe */}
      <motion.span
        className="absolute inset-0 rounded-full bg-[#d4af37]/40"
        animate={{ scale: [1, 1.22, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Deuxième anneau décalé */}
      <motion.span
        className="absolute inset-0 rounded-full bg-[#d4af37]/20"
        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />

      {/* Pill principal */}
      <motion.span
        className="relative flex items-center gap-2 bg-[#d4af37] text-[#122e53] rounded-full px-4 py-1.5 text-[13px] font-bold tracking-wide overflow-hidden"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {/* Shimmer au survol */}
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
          animate={{ translateX: ["−100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
        />

        {/* Icône play animée */}
        <motion.span
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <Play size={12} fill="#122e53" strokeWidth={0} />
        </motion.span>

        <span className="relative">Biens en vidéo</span>
      </motion.span>
    </Link>
  );
}
