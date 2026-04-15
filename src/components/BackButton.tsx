"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }}
      className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm shadow hover:bg-white transition"
    >
      ← Retour
    </button>
  );
}