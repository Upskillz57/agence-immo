"use client";

import { useState } from "react";

export default function PropertyContactForm({ property, defaultMessage = "" }: { property: any; defaultMessage?: string }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState(defaultMessage);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    const data = {
      firstName: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: message || "Demande de renseignement",
      propertyTitle: property.title,
      propertyRef: property.id,
      propertyUrl: window.location.href,
      source: "annonce",
      formStart: Date.now() - 5000,
    };

    const res = await fetch("/api/send-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      setSent(true);
      e.target.reset();
      setMessage("");
    } else {
      alert("Erreur, réessayez.");
    }
  }

  if (sent) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="font-semibold text-gray-900 text-sm">Message envoyé !</p>
        <p className="text-xs text-gray-400 mt-1">Nous vous répondrons rapidement.</p>
        <button onClick={() => setSent(false)} className="mt-4 text-xs text-[#122e53] underline">
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        name="name"
        placeholder="Nom"
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#122e53] text-sm"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#122e53] text-sm"
      />
      <input
        name="phone"
        placeholder="Téléphone"
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#122e53] text-sm"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Votre message"
        rows={3}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#122e53] text-sm resize-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#122e53] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#1a3f72] transition-colors disabled:opacity-60"
      >
        {loading ? "Envoi en cours…" : "Envoyer ma demande"}
      </button>
    </form>
  );
}
