import Image from "next/image"
import { MapPin, Users, Clock } from "lucide-react";


export default function ContactPage() {
  return (
    <main className="bg-white">

      {/* HERO (PAS plein écran) */}
      <section className="relative h-[350px] w-full overflow-hidden">
        <Image
          src="/contact.jpg"
          alt="Contact Marchal Immobilier"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="uppercase tracking-widest text-sm mb-2">
              Vous avez un projet immobilier ?
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold font-serif">
              Contactez-nous
            </h1>
          </div>
        </div>
      </section>

      {/* Ligne dorée séparatrice */}
<div className="w-full h-[2px] bg-[#d4af37]" />

      {/* SECTION CONTACT + FORM */}
      <section className="max-w-7xl mx-auto px-8 pt-10 pb-10 grid md:grid-cols-2 gap-8 text-[#1a1a1a]">




        
        {/* INFOS */}
        <div className="flex flex-col justify-start">


{/* LOGO */}
<Image
  src="/mi_noirok.png"
  alt="Marchal Immobilier"
  width={280}
  height={120}
  className="w-[220px] md:w-[200px] h-auto mb-10"
/>

{/* BLOC INFOS */}
<div className="space-y-8">

  <div>
    <h3 className="text-sm font-semibold tracking-[0.2em] text-[#122e53] uppercase mb-2">
      Téléphone
    </h3>
    <p className="text-lg text-[#1a1a1a] font-medium">
      03 87 74 44 73
    </p>
  </div>

  <div>
    <h3 className="text-sm font-semibold tracking-[0.2em] text-[#122e53] uppercase mb-2">
      Adresse
    </h3>
    <p className="text-base text-gray-700">
      2 rue du stade
    </p>
    <p className="text-base text-gray-700">
      57580 Lemud
    </p>
  </div>

  <div>
    <h3 className="text-sm font-semibold tracking-[0.2em] text-[#122e53] uppercase mb-2">
      Horaires
    </h3>
    <p className="text-base text-gray-700">
      Uniquement sur rendez-vous
    </p>
  </div>

</div>
</div>


        {/* FORMULAIRE */}
        <form className="space-y-6">

          <div className="grid md:grid-cols-2 gap-6">
            <input type="text" placeholder="Prénom"
              className="border border-neutral-300 p-4 w-full focus:outline-none focus:border-black"
            />
            <input type="text" placeholder="Nom"
              className="border border-neutral-300 p-4 w-full focus:outline-none focus:border-black"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <input type="email" placeholder="Email"
              className="border border-neutral-300 p-4 w-full focus:outline-none focus:border-black"
            />
            <input type="tel" placeholder="Téléphone"
              className="border border-neutral-300 p-4 w-full focus:outline-none focus:border-black"
            />
          </div>

          <select className="border border-neutral-300 p-4 w-full focus:outline-none focus:border-black">
            <option>Votre commune</option>
          </select>

          <select className="border border-neutral-300 p-4 w-full focus:outline-none focus:border-black">
            <option>Vous souhaitez</option>
            <option>Vendre</option>
            <option>Acheter</option>
            <option>Faire estimer</option>
            <option>Louer</option>
          </select>

          <textarea
            placeholder="Votre message"
            rows={5}
            className="border border-neutral-300 p-4 w-full focus:outline-none focus:border-black"
          />

          {/* RGPD */}
          <div className="flex items-start gap-3 text-sm text-gray-700">

            <input type="checkbox" className="mt-1" required />
            <p>
              J'accepte le traitement de mes données personnelles
              conformément au RGPD. Vos informations ne seront
              utilisées que pour répondre à votre demande.
            </p>
          </div>

          <button
            type="submit"
            className="bg-[#122e53] text-white px-10 py-4 tracking-widest uppercase text-sm hover:bg-[#0d223d] transition duration-300"

          >
            Envoyer
          </button>
        </form>
      </section>

           {/* SECTION VALEURS / ACCOMPAGNEMENT */}
<section className="bg-[#f4f6f8] py-24">
  <div className="max-w-7xl mx-auto px-6 text-center mb-16">
    <p className="uppercase tracking-widest text-sm text-[#c89b3c] font-medium">
      Rencontrons-nous pour parler
    </p>
    <h2 className="text-4xl mt-4 text-[#122e53] font-semibold">
      de votre projet immobilier
    </h2>
    <p className="mt-6 text-gray-700 max-w-3xl mx-auto leading-relaxed">
      Que vous souhaitiez vendre, acheter, louer ou faire estimer un bien,
      Marchal Immobilier vous accompagne avec proximité et engagement.
    </p>
  </div>

  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">

    {/* CARD 1 */}
    <div className="bg-white p-12 shadow-lg border border-gray-200 transition duration-300 hover:-translate-y-2 hover:shadow-2xl text-center">

  <MapPin
    className="mx-auto mb-6 text-[#122e53] stroke-[2.5]"
    size={48}
  />

  <h3 className="text-xl font-semibold text-[#122e53] mb-6">
    Une connaissance pointue du marché local
  </h3>

  <p className="text-gray-700 leading-relaxed">
    Installée depuis 2015 à Rémilly et active sur tout le secteur
    Mosellan, notre agence connaît chaque quartier et chaque tendance.
  </p>

</div>


    {/* CARD 2 */}
    <div className="bg-white p-12 shadow-lg border border-gray-200 transition duration-300 hover:-translate-y-2 hover:shadow-2xl text-center">

  <Users
    className="mx-auto mb-6 text-[#122e53] stroke-[2.5]"
    size={48}
  />

  <h3 className="text-xl font-semibold text-[#122e53] mb-6">
    Un accompagnement humain et personnalisé
  </h3>

  <p className="text-gray-700 leading-relaxed">
    Nous prenons le temps d'écouter votre projet et vous guidons
    à chaque étape du parcours immobilier.
  </p>

</div>

{/* CARD 3 */}

<div className="bg-white p-12 shadow-lg border border-gray-200 transition duration-300 hover:-translate-y-2 hover:shadow-2xl text-center">

  <Clock
    className="mx-auto mb-6 text-[#122e53] stroke-[2.5]"
    size={48}
  />

  <h3 className="text-xl font-semibold text-[#122e53] mb-6">
    Une équipe réactive et disponible
  </h3>

  <p className="text-gray-700 leading-relaxed">
    Nous fonctionnons uniquement sur rendez-vous afin de garantir
    un échange qualitatif et confidentiel.
  </p>

</div>



  </div>
</section>


    </main>
  )
}

