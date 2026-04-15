"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPropertyById } from "@/lib/getProperties";

export default function PropertyPage({ params }: any) {
  const { id } = params;

  const router = useRouter();
  const [property, setProperty] = useState<any>(null);

  useEffect(() => {
    getPropertyById(id).then(setProperty);
  }, [id]);

  // ⏳ Loading
  if (!property) {
    return (
      <div className="h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  return (
    <main className="pt-[80px] bg-[#f7f7f7] min-h-screen">

      {/* ✅ BOUTON RETOUR */}
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm shadow hover:bg-white transition"
      >
        ← Retour
      </button>



      {/* ===================== */}
      {/* GALERIE LUXURY */}
      {/* ===================== */}
      <div className="max-w-7xl mx-auto px-4 mt-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[260px] md:h-[480px] overflow-hidden rounded-2xl">
          {/* IMAGE PRINCIPALE */}
          <div className="md:col-span-2 relative group">
            <img
              src={property.images?.[0] || "/placeholder.jpg"}
             className="w-full h-full object-cover"
            />

            {/* OVERLAY */}
            <div className="absolute bottom-4 left-4 flex gap-3">
            <div className="bg-black/70 text-white backdrop-blur px-4 py-2 rounded-full text-sm shadow">
                📷 {property.images?.length || 0} photos
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl" />
          </div>

          {/* IMAGES SECONDAIRES */}
          <div className="grid grid-cols-2 gap-3">
            {property.images?.slice(1, 5).map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                className="w-full h-full object-cover"
              />
            ))}
          </div>
        </div>
      </div>

      {/* ===================== */}
      {/* TITRE + INFOS */}
      {/* ===================== */}
      <div className="max-w-7xl mx-auto px-4 mt-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2">

            {/* LOCALISATION */}
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
              📍 {property.city}
            </div>

            {/* TITRE */}
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight mb-4">
              {property.title}
            </h1>

            {/* PRIX */}
            <div className="text-3xl font-bold text-black mb-6">
              {property.price.toLocaleString("fr-FR")} €
            </div>

            {/* INFOS */}
            <div className="flex gap-10 text-gray-600 text-sm border-y py-6 mb-8">
              <span>{property.surface} m²</span>
              <span>{property.rooms} pièces</span>
              <span>{property.bedrooms} chambres</span>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Description
              </h2>

              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

          </div>

          {/* ===================== */}
          {/* SIDEBAR PREMIUM */}
          {/* ===================== */}
          <div className="relative">

            <div className="lg:sticky lg:top-[100px]">

              <div className="bg-white rounded-2xl shadow-md border p-6">

                {/* AGENCE */}
                <div className="mb-6 border-b pb-4">
                  <div className="text-lg font-semibold text-gray-900">
                    Marchal Immobilier
                  </div>
                  <div className="text-sm text-gray-500">
                    Moselle, France
                  </div>
                </div>

                {/* MESSAGE */}
                <div className="bg-gray-100 text-sm text-gray-600 p-3 rounded-lg mb-4">
                  Je suis intéressé par ce bien.
                </div>

                {/* FORM */}
                <div className="space-y-3">

                <input
  placeholder="Nom"
  className="w-full border border-gray-300 p-3 rounded-lg text-black placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"/>


<input
  placeholder="Email"
  className="w-full border border-gray-300 p-3 rounded-lg text-black placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"/>

<input
  placeholder="Téléphone"
  className="w-full border border-gray-300 p-3 rounded-lg text-black placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-black"/>

                  {/* CTA */}
                  <button className="w-full bg-black text-white py-3 rounded-lg mt-2 font-medium hover:bg-gray-800 transition">
                    Contacter
                  </button>

                </div>

                {/* LEGAL */}
                <div className="flex items-start gap-2 mt-4 text-xs text-gray-500">
                  <input type="checkbox" />
                  <span>
                    J'accepte les conditions et la politique de confidentialité
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

    </main>
  );
}