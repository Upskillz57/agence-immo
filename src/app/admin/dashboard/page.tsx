"use client";

import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Video, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function AdminDashboard() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <div className={`${montserrat.className} min-h-screen bg-[#f5f5f5]`}>

      {/* HEADER */}
      <header className="bg-[#122e53] px-6 md:px-10 h-[70px] flex items-center justify-between">
        <div className="relative w-[140px] h-[45px]">
          <Image src="/logo-marchal.png" alt="Marchal Immobilier" fill sizes="140px" className="object-contain" />
        </div>
      </header>

      {/* CONTENU */}
      <main className="max-w-4xl mx-auto px-6 py-14">
        <h1 className="text-2xl font-semibold text-[#122e53] mb-2">Tableau de bord</h1>
        <p className="text-sm text-gray-400 mb-10">Gérez les vidéos des biens immobiliers</p>

        {/* CARTE */}
        <div
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex items-center gap-6 hover:shadow-md transition cursor-pointer"
          onClick={() => router.push("/admin/videos")}
        >
          <div className="w-14 h-14 rounded-full bg-[#122e53] flex items-center justify-center flex-shrink-0">
            <Video size={24} className="text-[#d4af37]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#122e53]">Gérer les vidéos</h2>
            <p className="text-sm text-gray-400 mt-1">Associer une vidéo à un bien</p>
          </div>
          <span className="ml-auto text-gray-300 text-xl">→</span>
        </div>

        {/* DÉCONNEXION + RETOUR */}
        <div className="mt-10 flex items-center gap-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-[#122e53] text-sm transition"
          >
            <LogOut size={16} />
            Se déconnecter
          </button>

          
          <a href="/" className="flex items-center gap-2 text-gray-400 hover:text-[#122e53] text-sm transition">
            ← Retour au site
          </a>
        </div>

      </main>
    </div>
  );
}