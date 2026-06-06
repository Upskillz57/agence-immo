"use client";

import { useState } from "react";
import { Eye, X } from "lucide-react";

export default function VirtualTourButton({ url }: { url: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* BOUTON SUR LA GALERIE */}
      <button
        onClick={() => setOpen(true)}
        className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md px-4 py-2.5 rounded-full text-sm font-semibold text-gray-800 hover:bg-white transition"
      >
        <Eye size={16} className="text-[#122e53]" />
        Visite virtuelle 360°
      </button>

      {/* POPUP */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src={url}
              title="Visite virtuelle 360°"
              allowFullScreen
              className="w-full h-full border-0"
            />
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition"
            >
              <X size={20} className="text-gray-800" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}