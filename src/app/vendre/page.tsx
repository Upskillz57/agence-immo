"use client";

import { motion } from "framer-motion";
import { Montserrat } from "next/font/google";
import { useState } from "react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const services = [
  {
    num: "01",
    title: "Commercialisation premium",
    subtitle: "Photos pro, vidéos, réseaux sociaux.",
    description: "Photographe professionnel, vidéo cinématique, diffusion sur les grands portails.",
    img: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=85",
  },
  {
    num: "02",
    title: "Vente interactive",
    subtitle: "Créer l'émulation pour maximiser le prix.",
    description: "Notre méthode crée une dynamique de compétition entre acquéreurs pour un prix souvent supérieur aux estimations initiales.",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=85",
  },
  {
    num: "03",
    title: "Accompagnement global",
    subtitle: "Courtage, assurances, travaux, diagnostics…",
    description: "Un seul interlocuteur coordonne tous les intervenants. Vous êtes guidé de l'estimation à la signature.",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85",
  },
  {
    num: "04",
    title: "Puissance locale",
    subtitle: "Expertise terrain de Metz et la Moselle.",
    description: "Implantés depuis 2015, nous connaissons le marché local : quartiers, prix, acquéreurs actifs.",
    img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=85",
  },
];

export default function VendrePage() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    message: "",
    cgu: false,
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Honeypot anti-spam (champ caché)
  const [formStart] = useState(() => Date.now());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cgu) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "vendre",
          // Champs mappés sur le format attendu par la route API
          name: formData.nom,
          email: formData.email,
          phone: formData.telephone,
          message: `${formData.adresse ? `Adresse du bien : ${formData.adresse}\n\n` : ""}${formData.message || "Demande d'estimation"}`,
          // Champs supplémentaires utilisés dans buildVendreHtml
          adresse: formData.adresse,
          formStart,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error("Erreur serveur");
      }

      setSent(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer ou nous appeler directement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={montserrat.className}>

      {/* ── HERO ── */}
      <section className="relative w-full overflow-hidden" style={{ height: "100dvh" }}>
        <img
          src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1600&q=85"
          alt="Vendre avec Marchal"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/65" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 pt-[90px]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="uppercase text-[10px] md:text-xs tracking-[0.3em] text-white/70 mb-3"
          >
            Votre projet immobilier
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-semibold text-white leading-tight max-w-3xl"
          >
            Pourquoi vendre avec<br />Marchal Immobilier ?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-5 text-white/75 text-sm md:text-base max-w-lg leading-relaxed"
          >
            Une méthode éprouvée, des outils modernes, et une équipe engagée
            pour obtenir le meilleur résultat.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-white/35 text-[10px] uppercase tracking-widest">Découvrir</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="w-px h-10 bg-gradient-to-b from-white/35 to-transparent"
            />
          </motion.div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="bg-[#f5f5f5] py-14 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center px-5"
        >
          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Implantée à Metz depuis 2015, notre agence accompagne vendeurs,
            acquéreurs et investisseurs avec une approche moderne, humaine et
            exigeante. Grâce à une commercialisation premium et une forte
            présence digitale, nous obtenons les meilleures conditions de vente.
          </p>
        </motion.div>
      </section>

      {/* ── SERVICES ── */}
      {services.map((service, i) => {
        const isEven = i % 2 === 0;
        return (
          <section key={service.num} className="overflow-hidden">
            <div
              className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
              style={{ height: "clamp(280px, 35vw, 420px)" }}
            >
              {/* IMAGE 60% */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9 }}
                viewport={{ once: true }}
                className="relative overflow-hidden"
                style={{ flex: "0 0 60%" }}
              >
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute bottom-3 ${
                    isEven ? "right-3" : "left-3"
                  } text-[70px] md:text-[110px] font-bold text-white/10 leading-none select-none pointer-events-none`}
                >
                  {service.num}
                </span>
              </motion.div>

              {/* TEXTE 40% */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.12 }}
                viewport={{ once: true }}
                className="flex flex-col justify-center overflow-hidden bg-[#173152] px-7 md:px-12"
                style={{ flex: "0 0 40%" }}
              >
                <p className="uppercase text-[9px] tracking-[0.25em] mb-2 text-white/35">
                  {service.num}
                </p>
                <h2 className="text-base md:text-xl font-semibold leading-snug mb-2 text-white">
                  {service.title}
                </h2>
                <p className="text-[11px] md:text-xs font-medium mb-2 text-white/55 leading-relaxed">
                  {service.subtitle}
                </p>
                <p className="text-[11px] md:text-sm leading-relaxed text-white/65 line-clamp-2">
                  {service.description}
                </p>
              </motion.div>
            </div>
          </section>
        );
      })}

      {/* ── STATS ── */}
      <section className="bg-[#2e3040] py-12 md:py-16 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: "2015", label: "Année de création" },
            { val: "+300", label: "Biens vendus" },
            { val: "98%",  label: "Clients satisfaits" },
            { val: "21 j", label: "Délai moyen de vente" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <p className="text-3xl md:text-4xl font-bold text-white">{stat.val}</p>
              <p className="text-xs text-white/50 mt-2 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FORMULAIRE DE CONTACT ── */}
      <section id="contact" className="bg-[#f5f5f5] py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Colonne gauche */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
          >
            <p className="uppercase text-xs tracking-[0.25em] text-gray-400 mb-4">
              Nous contacter
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#173152] mb-6 leading-tight">
              Vous souhaitez vendre votre bien ?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Confiez-nous votre projet. Un conseiller vous recontacte
              rapidement pour une estimation gratuite et sans engagement.
            </p>
            <div className="space-y-4 text-sm text-gray-700">
              {[
                "Estimation gratuite et sans engagement",
                "Réponse sous 24h",
                "Accompagnement personnalisé de A à Z",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#173152] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Colonne droite — formulaire */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white shadow-xl rounded-xl p-8 md:p-10"
          >
            {sent ? (
              /* ── CONFIRMATION ── */
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#173152] mb-2">
                  Message envoyé !
                </h3>
                <p className="text-gray-500 text-sm">
                  Nous vous recontacterons dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Nom + Téléphone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      required
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#173152] transition"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#173152] transition"
                      placeholder="06 XX XX XX XX"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#173152] transition"
                    placeholder="votre@email.fr"
                  />
                </div>

                {/* Adresse du bien */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    Adresse du bien
                  </label>
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#173152] transition"
                    placeholder="Adresse du bien à vendre"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#173152] transition resize-none"
                    placeholder="Décrivez votre bien ou votre projet…"
                  />
                </div>

                {/* Message d'erreur */}
                {error && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                    {error}
                  </p>
                )}

                {/* CGU */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="cgu"
                    id="cgu"
                    checked={formData.cgu}
                    onChange={handleChange}
                    className="mt-0.5 shrink-0 accent-[#173152]"
                  />
                  <label htmlFor="cgu" className="text-xs text-gray-400 leading-relaxed">
                    J'ai plus de 18 ans, j'ai lu et j'accepte les{" "}
                    <span className="underline cursor-pointer">CGU</span> et la{" "}
                    <span className="underline cursor-pointer">politique de confidentialité</span>
                  </label>
                </div>

                {/* Bouton envoi */}
                <button
                  type="submit"
                  disabled={loading || !formData.cgu}
                  className="w-full py-3.5 bg-[#173152] text-white text-sm uppercase tracking-wider rounded-full hover:bg-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                      </svg>
                      Envoi en cours…
                    </>
                  ) : (
                    "Demander une estimation gratuite"
                  )}
                </button>

              </form>
            )}
          </motion.div>

        </div>
      </section>

    </div>
  );
}