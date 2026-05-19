"use client";

import Image from "next/image";
import { MapPin, Users, Clock } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      commune: formData.get("commune"),
      requestType: formData.get("requestType"),
      message: formData.get("message"),
      source: "contact",
      formStart: Date.now() - 5000,
      company: "",
    };

    try {
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Votre message a bien été envoyé.");
        e.currentTarget.reset();
      } else {
        alert("Erreur lors de l’envoi. Veuillez réessayer.");
      }
    } catch (error) {
      alert("Erreur lors de l’envoi. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative h-[350px] w-full overflow-hidden">
        <Image
          src="/contact.jpg"
          alt="Contact Marchal Immobilier"
          fill
          sizes="100vw"
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

      <div className="w-full h-[2px] bg-[#d4af37]" />

      {/* SECTION CONTACT + FORM */}
      <section className="max-w-7xl mx-auto px-8 pt-10 pb-10 grid md:grid-cols-2 gap-8 text-[#1a1a1a]">
        {/* INFOS */}
        <div className="flex flex-col justify-start">
          <Image
            src="/mi_noirok.png"
            alt="Marchal Immobilier"
            width={280}
            height={120}
            sizes="(max-width: 768px) 220px, 200px"
            className="w-[220px] md:w-[200px] h-auto mb-10"
          />

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
              <p className="text-base text-gray-700">2 rue du XXeme corps américain</p>
              <p className="text-base text-gray-700">57000 Metz</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-[0.2em] text-[#122e53] uppercase mb-2">
                Horaires
              </h3>
              <p className="text-base text-gray-700">
                Lun - Ven : 8h - 12h3O et 13h30 - 19H

              </p>
              <p className="text-base text-gray-700">

                Samedi : 9h - 12h30 et 13h30 - 18H
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-[0.2em] text-[#122e53] uppercase mb-3">
                WhatsApp
              </h3>
              <a
                href="https://wa.me/33633067523"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] text-white px-5 py-3 rounded-full font-semibold text-sm hover:bg-[#1ebe5d] transition-colors shadow-md"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Nous écrire sur WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="company"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid md:grid-cols-2 gap-6">
            <input
              name="firstName"
              type="text"
              placeholder="Prénom"
              className="border border-neutral-300 p-4 w-full focus:outline-none focus:border-black"
            />
            <input
              name="lastName"
              type="text"
              placeholder="Nom"
              className="border border-neutral-300 p-4 w-full focus:outline-none focus:border-black"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="border border-neutral-300 p-4 w-full focus:outline-none focus:border-black"
            />
            <input
              name="phone"
              type="tel"
              placeholder="Téléphone"
              className="border border-neutral-300 p-4 w-full focus:outline-none focus:border-black"
            />
          </div>

          <input
  name="commune"
  type="text"
  placeholder="Votre commune"
  className="border border-neutral-300 p-4 w-full focus:outline-none focus:border-black"
/>

          <select
            name="requestType"
            className="border border-neutral-300 p-4 w-full focus:outline-none focus:border-black"
          >
            <option value="">Vous souhaitez</option>
            <option value="Vendre">Vendre</option>
            <option value="Acheter">Acheter</option>
            <option value="Faire estimer">Faire estimer</option>
            <option value="Louer">Louer</option>
            <option value="Louer">Effectuer des diagnostiques</option>
            <option value="Louer">Financer un projet</option>
            <option value="Louer">Construire ou rénover</option>
            <option value="Louer">Aménagement ou décorer</option>
            
          </select>

          <textarea
            name="message"
            placeholder="Votre message"
            rows={5}
            required
            className="border border-neutral-300 p-4 w-full focus:outline-none focus:border-black"
          />

          <div className="flex items-start gap-3 text-sm text-gray-700">
            <input type="checkbox" className="mt-1" required />
            <p>
              J'accepte le traitement de mes données personnelles conformément
              au RGPD. Vos informations ne seront utilisées que pour répondre à
              votre demande.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#122e53] text-white px-10 py-4 tracking-widest uppercase text-sm hover:bg-[#0d223d] transition duration-300 disabled:opacity-60"
          >
            {loading ? "Envoi..." : "Envoyer"}
          </button>
        </form>
      </section>

      {/* SECTION VALEURS */}
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
          <div className="bg-white p-12 shadow-lg border border-gray-200 transition duration-300 hover:-translate-y-2 hover:shadow-2xl text-center">
            <MapPin className="mx-auto mb-6 text-[#122e53] stroke-[2.5]" size={48} />
            <h3 className="text-xl font-semibold text-[#122e53] mb-6">
              Une connaissance pointue du marché local
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Installée depuis 2015 à Rémilly et active sur tout le secteur
              Mosellan, notre agence connaît chaque quartier et chaque tendance.
            </p>
          </div>

          <div className="bg-white p-12 shadow-lg border border-gray-200 transition duration-300 hover:-translate-y-2 hover:shadow-2xl text-center">
            <Users className="mx-auto mb-6 text-[#122e53] stroke-[2.5]" size={48} />
            <h3 className="text-xl font-semibold text-[#122e53] mb-6">
              Un accompagnement humain et personnalisé
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Nous prenons le temps d'écouter votre projet et vous guidons à
              chaque étape du parcours immobilier.
            </p>
          </div>

          <div className="bg-white p-12 shadow-lg border border-gray-200 transition duration-300 hover:-translate-y-2 hover:shadow-2xl text-center">
            <Clock className="mx-auto mb-6 text-[#122e53] stroke-[2.5]" size={48} />
            <h3 className="text-xl font-semibold text-[#122e53] mb-6">
              Une équipe réactive et disponible
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Nous fonctionnons uniquement sur rendez-vous afin de garantir un
              échange qualitatif et confidentiel.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}