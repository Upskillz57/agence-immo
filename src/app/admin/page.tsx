"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Lock } from "lucide-react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className={`${montserrat.className} min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-4`}>

      {/* LOGO */}
      <div className="relative w-[180px] h-[60px] mb-10">
        <Image
          src="/logo-marchal.png"
          alt="Marchal Immobilier"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* CARTE LOGIN */}
      <div className="bg-white shadow-xl rounded-xl p-8 md:p-12 w-full max-w-md">

        {/* ICÔNE + TITRE */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#122e53] flex items-center justify-center mb-4">
            <Lock size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-[#122e53]">Espace administration</h1>
          <p className="text-sm text-gray-400 mt-1">Accès réservé à l'équipe Marchal</p>
        </div>

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full border ${error ? "border-red-400" : "border-gray-200"} rounded-lg px-4 py-3 text-sm text-[#122e53] outline-none focus:border-[#122e53] transition`}
              required
            />
            {error && (
              <p className="text-red-500 text-xs mt-2">Mot de passe incorrect.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-[#122e53] text-white py-3 rounded-full uppercase tracking-widest text-xs font-semibold hover:bg-black transition disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>

      {/* FOOTER */}
      <p className="text-xs text-gray-300 mt-8">© Marchal Immobilier</p>
    </div>
  );
}