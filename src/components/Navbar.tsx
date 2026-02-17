//src/components/Navbar.tsx
"use client";

import Image from "next/image";

export default function Navbar() {
  return (
    <header className="absolute top-0 left-0 w-full z-50 px-10 py-6 flex justify-between items-center">
      <Image
        src="/logo-marchal.png"
        alt="Marchal"
        width={160}
        height={60}
      />
      <nav className="text-white space-x-8 tracking-widest text-sm">
        <a href="#">BIENS</a>
        <a href="#">AGENCE</a>
        <a href="#">CONTACT</a>
      </nav>
    </header>
  );
}
