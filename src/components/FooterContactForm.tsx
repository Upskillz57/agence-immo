"use client";
import { useState } from "react";

export default function FooterContactForm() {
  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source:  "contact",
          email:   "ne-pas-repondre@marchalimmobilier.com",
          message: `Le client ${name} souhaite être rappelé au : ${phone}`,
          firstName: name,
          phone,
        }),
      });

      const data = await res.json();
      setStatus(data.success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="text"
        placeholder="Votre nom"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        className="w-full bg-transparent border-b border-white/30 pb-2 text-sm placeholder-gray-400 focus:outline-none focus:border-[#C6A75E] transition"
      />
      <input
        type="tel"
        placeholder="Votre téléphone"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        required
        className="w-full bg-transparent border-b border-white/30 pb-2 text-sm placeholder-gray-400 focus:outline-none focus:border-[#C6A75E] transition"
      />

      {status === "success" ? (
        <p className="text-[#C6A75E] text-sm mt-4">
          ✓ Demande envoyée, nous vous rappelons rapidement.
        </p>
      ) : (
        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-6 border border-[#C6A75E] text-[#C6A75E] px-6 py-2 text-sm tracking-widest uppercase hover:bg-[#C6A75E] hover:text-[#122e53] transition duration-300 disabled:opacity-50"
        >
          {status === "loading" ? "Envoi..." : "Envoyer"}
        </button>
      )}

      {status === "error" && (
        <p className="text-red-400 text-xs mt-2">Une erreur est survenue, veuillez réessayer.</p>
      )}
    </form>
  );
}