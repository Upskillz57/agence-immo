
import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/getProperties";
import Link from "next/link";
import PropertyContactForm from "@/components/PropertyContactForm";
import Gallery from "@/components/Gallery";
import { BedDouble, Bath, Maximize, MapPin, Share2, Trash2, Heart } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getPropertyVideo } from "@/lib/getPropertyVideo";
import ShareButton from "@/components/ShareButton";
import PropertyDescription from "@/components/PropertyDescription";
import VirtualTourButton from "@/components/VirtualTourButton";


export async function generateMetadata({ params }: any) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) return {};

  const image = property.images?.[0];
  const description = (property.description || "").slice(0, 200);
  const title = `${property.title} — Marchal Immobilier`;
  const url = `https://marchal-immo.fr/bien/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Marchal Immobilier",
      images: image ? [{ url: image, width: 1200, height: 800 }] : [],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function PropertyPage({ params }: any) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) return notFound();
  const videoUrl = await getPropertyVideo(property.id);

  return (
    <main className="pt-[80px] bg-white min-h-screen overflow-x-hidden">


      {/* ← RETOUR */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <Link href="/recherche" className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded hover:bg-gray-50 transition">
          ← Résultats de recherche
        </Link>
      </div>

     {/* GALERIE */}
<div className="max-w-7xl mx-auto px-4 mt-4 relative">
  <Gallery images={property.images || []} />
  {property.virtualTour && (
    <VirtualTourButton url={property.virtualTour} />
  )}
</div>

      {/* VIDÉO */}
{videoUrl && (
  <div className="max-w-7xl mx-auto px-4 mt-4 flex justify-center">
    <video
      src={videoUrl}
      controls
      playsInline
      preload="metadata"
      className="rounded-xl bg-black h-[500px] w-auto max-w-full"

      poster={property.images?.[0]}
    >
      Votre navigateur ne supporte pas la lecture vidéo.
    </video>
  </div>
)}



      {/* CONTENU PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 mt-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* COLONNE GAUCHE */}
          <div className="lg:col-span-2">

            {/* MINIMAP + TITRE + ACTIONS */}
            <div className="flex items-start justify-between gap-4 mb-6">

              <div className="flex items-start gap-4">
                {/* MINIMAP PLACEHOLDER */}
                <div className="w-[80px] h-[80px] overflow-hidden shrink-0 flex items-center justify-center">
  <img
    src="/mi_noirok.png"
    className="w-full h-full object-contain"
  />
</div>

                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
                    {property.title}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    {property.postalCode} {property.city}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
<div className="flex items-center gap-2 shrink-0">
  
  {/*
  <button className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-sm text-rose-500 hover:border-rose-300">
    <Heart size={15} /> Sauvegarder
  </button>*/}

  <WhatsAppButton
    propertyTitle={property.title}
    propertyId={property.id}
  />
</div>

<ShareButton title={property.title} id={property.id} />


            </div>

            {/* PRIX + STATS */}
<div className="border-t border-b py-5 mb-8">
  <div className="text-4xl font-bold text-gray-900">
    {(property.price || 0).toLocaleString("fr-FR")} €
  </div>

  <div className="flex flex-wrap gap-4 md:gap-8 mt-4 text-sm text-gray-600">

    <span className="flex items-center gap-2">
      <Maximize size={16} className="text-gray-400" />
      {property.surface} m²
    </span>
    <span className="flex items-center gap-2">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      </svg>
      {property.rooms || "—"} pièces
    </span>
    <span className="flex items-center gap-2">
      <BedDouble size={16} className="text-gray-400" />
      {property.bedrooms} ch.
    </span>
  </div>
</div>



            {/* DESCRIPTION */}
<PropertyDescription description={property.description} />

            

            {/* AGENT INLINE */}
            <div className="border rounded-xl p-4 flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#122e53] flex items-center justify-center text-white text-xs font-bold rounded">
                  MI
                </div>
                <div>
                  <p className="text-xs text-gray-400">Si vous voulez en savoir plus, contactez</p>
                  <p className="text-sm font-semibold text-gray-800">Marchal Immobilier</p>
                </div>
              </div>
              <a href="tel:+33387744473" className="text-sm font-semibold text-gray-900 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-50 transition">
  Nous appeler
</a>
            </div>

               

            {/* DETAILS */}
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Détails</h2>
              <div className="grid grid-cols-2 gap-y-5 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <BedDouble size={18} className="text-gray-400" />
                  <span>Chambres : <strong>{property.bedrooms}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  
                  <span className="flex items-center gap-2">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  </svg>
  {property.rooms || "—"} pièces
</span>
                </div>
                <div className="flex items-center gap-3">
                  <Maximize size={18} className="text-gray-400" />
                  <span>Surface : <strong>{property.surface} m²</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-400" />
                  <span>Référence : <strong>{property.id?.slice(0, 6).toUpperCase()}</strong></span>
                </div>
              </div>

             
            </div>

            {/* GALLERY SECTION */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Galerie</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(property.images || []).slice(0, 6).map((img: string, i: number) => (
                  <img key={i} src={img} className="w-full h-[160px] object-cover rounded-lg" />
                ))}
              </div>
            </div>

          </div>

          {/* SIDEBAR */}
<div className="relative">
  <div className="lg:sticky lg:top-[100px]">
    <div className="border rounded-xl shadow-sm overflow-hidden">

      {/* LOGO AGENCE */}
      <div className="p-5 border-b">
        <div className="w-full h-[80px] bg-[#122e53] flex items-center justify-center rounded mb-3">
          <span className="text-white font-bold text-lg tracking-wide">Renseignements</span>
        </div>
        <p className="font-semibold text-gray-900 text-sm">Marchal Immobilier</p>
        <p className="text-xs text-gray-400 mt-0.5">Moselle, France</p>
      </div>

   

      {/* FORMULAIRE */}
      <div id="contact-form" className="p-5">
        <PropertyContactForm property={property} />
        <div className="flex items-start gap-2 mt-4 text-xs text-gray-400">
          <input type="checkbox" className="mt-0.5 shrink-0" />
          <span>J'ai plus de 18 ans, j'ai lu et j'accepte les <span className="underline cursor-pointer">CGU</span> et la <span className="underline cursor-pointer">politique de confidentialité</span></span>
        </div>
      </div>

    </div>
  </div>
</div>

        </div>
      </div>

    </main>
  );
}