import Link from "next/link";

export default function PropertyList({
    properties,
    hoveredId,
    setHoveredId
  }: any) {
  
    return (
  
      <div className="p-6 bg-[#f8f8f8] flex flex-col gap-6">
  
  {properties?.map((property: any) => (

<Link key={property.id} href={`/bien/${property.id}`}>
  
  <div
    className={`
      flex flex-col md:flex-row bg-white overflow-hidden transition cursor-pointer border border-gray-200
      ${hoveredId === property.id
        ? "border-black"
        : "hover:border-gray-400"}
    `}
  >
  
            {/* IMAGE GAUCHE */}
            <div className="relative w-full md:w-[260px] md:min-w-[260px] h-[220px] md:h-[200px]">

              <img
                src={property.image}
                className="w-full h-full object-cover"
              />
  
              {/* BADGE */}
              <div className="absolute top-3 left-3 bg-[#c79b4b] text-white text-xs px-3 py-1 rounded-full">
                EXCLUSIF
              </div>
  
            </div>
  
            {/* INFOS DROITE */}
            <div className="flex flex-col justify-between p-4 md:p-5 flex-1">
  
              {/* HAUT */}
              <div>
  
                {/* TITRE */}
                <h3 className="font-semibold text-md text-[#122e53]">
                  {property.title}
                </h3>
  
                {/* PRIX */}
                <p className="text-[18px] md:text-[20px] font-semibold text-black mt-1">
                  {property.price.toLocaleString("fr-FR")} €
                </p>
  
                {/* INFOS */}
                <div className="flex gap-4 text-sm text-gray-600 mt-3">

                <span>{property.surface || 0} m²</span>
<span>•</span>
<span>{property.rooms || 0} ch.</span>
<span>•</span>
<span>{property.bedrooms || 0} pièces</span>

</div>
  
                {/* DESCRIPTION FAKE */}
                <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                {property.description?.slice(0, 120)}, idéal pour un projet immobilier haut de gamme.
                </p>
  
              </div>
  
              {/* BAS */}
              <div className="flex items-center justify-between mt-4">
  
                <p className="text-sm text-gray-500">
                  {property.city}
                </p>
  
                <div className="flex gap-3 text-gray-400 text-lg">
  
                  <span>♡</span>
                  <span>✉️</span>
  
                </div>
  
              </div>
  
              </div>
  </div>

  </Link>
))}
  
      </div>
  
    );
  
  }