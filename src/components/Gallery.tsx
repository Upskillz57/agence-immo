"use client";

import { useState } from "react";
import BackArrow from "@/components/BackArrow";

export default function Gallery({ images }: { images: string[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* ===================== */}
      {/* GALERIE */}
      {/* ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 aspect-[16/10] overflow-hidden rounded-2xl">

        {/* IMAGE PRINCIPALE */}
        <div className="md:col-span-2 relative group z-0">
          <BackArrow />

          <img
            src={images[0]}
            onClick={() => {
                console.log("CLICK MINI"); // DEBUG
                setIndex(i + 1);
                setOpen(true);
              }}
              className="w-full h-full object-cover rounded-xl cursor-pointer relative z-10"
            />

          <div className="absolute bottom-4 left-4">
            <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              📷 {images.length} photos
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl pointer-events-none" />
        </div>

        {/* IMAGES SECONDAIRES */}
        <div className="grid grid-cols-2 gap-3 h-full">
  {images.slice(1, 5).map((img, i) => (
    <div key={i} className="relative w-full h-full">
     <img
  src={images[0]}
  onClick={() => {
    console.log("CLICK OK"); // DEBUG
    setIndex(0);
    setOpen(true);
  }}
  className="w-full h-full object-cover object-center cursor-pointer relative z-10"
/>
    </div>
  ))}
</div>
      </div>

      {/* ===================== */}
      {/* POPUP */}
      {/* ===================== */}
      {open && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">

          {/* CLOSE */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-white text-3xl z-50"
          >
            ✕
          </button>

          {/* IMAGE */}
          <img
            src={images[index]}
            className="max-h-[90%] max-w-[90%] object-contain"
          />

          {/* LEFT */}
          <button
            onClick={() =>
              setIndex(index === 0 ? images.length - 1 : index - 1)
            }
            className="absolute left-6 text-white text-5xl z-50"
          >
            ‹
          </button>

          {/* RIGHT */}
          <button
            onClick={() =>
              setIndex(index === images.length - 1 ? 0 : index + 1)
            }
            className="absolute right-6 text-white text-5xl z-50"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}