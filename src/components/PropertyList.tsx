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
  onMouseEnter={() => setHoveredId(property.id)}
  onMouseLeave={() => setHoveredId(null)}
  className={`
    group
    flex
    flex-col
    xl:flex-row
    bg-white
    rounded-2xl
    overflow-hidden
    transition-all
    duration-300
    cursor-pointer
    border
    shadow-sm
    hover:shadow-2xl
    hover:-translate-y-1

    ${
      hoveredId === property.id
        ? "border-[#122e53] shadow-xl"
        : "border-gray-100"
    }
  `}
>
  
            {/* IMAGE GAUCHE */}
            <div className="relative w-full md:w-[260px] md:min-w-[260px] h-[220px] md:h-[200px]">

              <img
                src={property.image}
                className="w-full h-full object-cover"
              />
  
              {/* BADGE */}
              {property.status && (
  <div
    className={`
      absolute top-3 left-3
      text-white text-xs px-3 py-1 rounded-full font-medium

      ${
        property.status === "VENDU"
          ? "bg-red-600"
          : "bg-[#c79b4b]"
      }
    `}
  >
    {property.status}
  </div>
)}
  
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
<span>{property.rooms || 0} pièces</span>
<span>•</span>
<span>{property.bedrooms || 0} ch.</span>

</div>

<p className="text-sm text-gray-500 mt-3 line-clamp-2">
  {property.description || `Bien situé à ${property.city}`}
</p>

  
              </div>
  
              {/* BAS */}
              <div className="flex items-center justify-between mt-4">
  
              <p className="text-sm text-gray-500">
  {property.postalCode} {property.city}
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