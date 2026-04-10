import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/getProperties";
import Header from "@/components/Header";

export default async function PropertyPage({ params }: { params: { id: string } }) {

  const { id } = params;
  
    const property = await getPropertyById(id);

  if (!property) return notFound();


  return (
      
  
      <main className="pt-[80px] bg-[#f5f5f5] min-h-screen">

   

      {/* GALERIE */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[500px]">

          <div className="md:col-span-2 h-full">
            <img src={property.images[0]} className="w-full h-full object-cover rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-2 h-full">
            {property.images.slice(1, 5).map((img, i) => (
              <img key={i} src={img} className="w-full h-full object-cover rounded-lg" />
            ))}
          </div>

        </div>
      </div>

      {/* INFOS */}
      <div className="max-w-7xl mx-auto px-10 mt-6">
        <h1 className="text-3xl font-semibold mb-4">{property.title}</h1>
        <div className="text-2xl font-bold mb-4">
          {property.price.toLocaleString()} €
        </div>

      </div>

     {/* CONTENT PREMIUM */}
<div className="max-w-7xl mx-auto px-4 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-12">

  {/* LEFT CONTENT */}
  <div className="lg:col-span-2">

    {/* LOCALISATION + TITRE */}
    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
      📍 {property.city}
    </div>

    <h1 className="text-3xl md:text-4xl font-semibold text-gray-600 mb-4 leading-tight">
      {property.title}
    </h1>

    {/* PRIX */}
    <div className="text-2xl font-bold text-orange-600 mb-6">
      {property.price.toLocaleString()} €
    </div>

    {/* INFOS */}
    <div className="flex gap-8 text-gray-600 text-sm border-b pb-6 mb-6">
      <span>{property.surface} m²</span>
      <span>{property.bedrooms} chambres</span>
      <span>{property.bathrooms} sdb</span>
    </div>

    {/* DESCRIPTION */}
    <div>
      <h2 className="text-xl font-semibold text-gray-600 mb-4">Description</h2>

      <p className="text-gray-600 leading-relaxed line-clamp-5">
        {property.description}
      </p>

      <button className="mt-3 text-sm font-medium text-gray-600 underline">
        Lire plus
      </button>
    </div>

  </div>

  {/* RIGHT SIDEBAR */}
  <div className="sticky top-[100px] h-fit bg-white border rounded-xl p-6 shadow-sm">

    {/* AGENCE */}
    <div className="mb-6">
      <div className="font-semibold text-gray-600 text-lg">Marchal Immobilier</div>
      <div className="text-sm text-gray-500">Moselle, France</div>
    </div>

    {/* MESSAGE AUTO */}
    <div className="bg-gray-100 text-sm text-gray-600 p-3 rounded-lg mb-4">
      Je suis intéressé par ce bien.
    </div>

    {/* FORM */}
    <input
      placeholder="Nom"
      className="w-full border p-3 mb-3 text-gray-600 rounded-lg"
    />
    <input
      placeholder="Email"
      className="w-full border p-3 mb-3 text-gray-600 rounded-lg"
    />
    <input
      placeholder="Téléphone"
      className="w-full border p-3 mb-3 text-gray-600 rounded-lg"
    />

    {/* CTA */}
    <button className="w-full bg-black text-white py-3 rounded-lg mt-2 font-medium hover:bg-gray-800 transition">
      Contacter
    </button>

    {/* LEGAL */}
    <div className="flex items-start gap-2 mt-4 text-xs text-gray-500">
      <input type="checkbox" />
      <span>
        J'accepte les conditions et la politique de confidentialité
      </span>
    </div>

  </div>
</div>
    </main>
  );
}