"use client";

import { useState } from "react";

export default function PropertyContactForm({ property }: any) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    const data = {
      firstName: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: "Demande sur un bien",
      propertyTitle: property.title,
      propertyRef: property.id,
      propertyUrl: window.location.href,
      source: "annonce",
      formStart: Date.now() - 5000,
    };

    const res = await fetch("/api/send-mail", {
      method: "POST",
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      alert("Demande envoyée !");
      e.target.reset();
    } else {
      alert("Erreur, réessayez.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">

<input
  name="name"
  placeholder="Nom"
  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
/>

<input
  name="email"
  placeholder="Email"
  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
/>

<input
  name="phone"
  placeholder="Téléphone"
  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
/>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#122e53] text-white py-3 rounded-lg"
      >
        {loading ? "Envoi..." : "Contacter"}
      </button>

    </form>
  );
}