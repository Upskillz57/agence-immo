"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  advisorEmail: string;
  advisorName: string;
  onClose: () => void;
}

export default function EmailModal({
  advisorEmail,
  advisorName,
  onClose,
}: Props) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    consent: false,
  });

  const [sent, setSent] = useState(false);
  type FormErrors = {
    firstName?: boolean;
    lastName?: boolean;
    email?: boolean;
    message?: boolean;
    consent?: boolean;
  };
  
  const [errors, setErrors] = useState<FormErrors>({});
  

  const validate = () => {
    let newErrors: FormErrors = {};


    if (!form.firstName) newErrors.firstName = true;
    if (!form.lastName) newErrors.lastName = true;
    if (!form.email) newErrors.email = true;
    if (!form.message) newErrors.message = true;
    if (!form.consent) newErrors.consent = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    if (!validate()) return;

    await fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        advisorEmail,
      }),
    });

    setSent(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999] px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-[#122e53] w-full max-w-3xl relative text-white shadow-2xl"
        >
          {/* Ligne dorée fine */}
          <div className="h-[3px] bg-[#d4af37] w-full" />

          <div className="p-10 relative">

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white text-2xl hover:text-[#d4af37] transition"
            >
              ✕
            </button>

            <h2 className="text-3xl font-semibold mb-4">
              Contacter {advisorName}
            </h2>

            <p className="text-gray-300 mb-8">
              Merci de remplir le formulaire, nous reviendrons vers vous dans les plus brefs délais.
            </p>

            {sent ? (
              <p className="text-[#d4af37] text-lg">
                Votre message a bien été envoyé.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Nom / Prenom */}
                <div className="grid md:grid-cols-2 gap-6">
                <Input
  placeholder="Prénom"
  value={form.firstName}
  error={errors.firstName}
  onChange={(v) => setForm({ ...form, firstName: v })}
/>

<Input
  placeholder="Nom"
  value={form.lastName}
  error={errors.lastName}
  onChange={(v) => setForm({ ...form, lastName: v })}
/>

<Input
  placeholder="Email"
  type="email"
  value={form.email}
  error={errors.email}
  onChange={(v) => setForm({ ...form, email: v })}
/>

<Input
  placeholder="Téléphone"
  value={form.phone}
  onChange={(v) => setForm({ ...form, phone: v })}
/>

                </div>

                {/* Message */}
                <textarea
                  placeholder="Votre message"
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className={`w-full bg-white text-[#122e53] p-3 outline-none border-2 transition 
                    ${errors.message ? "border-red-500" : "border-transparent focus:border-[#d4af37]"}`}
                />

                {/* RGPD */}
                <div className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed">
                  <input
                    type="checkbox"
                    className="mt-1 accent-[#d4af37]"
                    onChange={(e) =>
                      setForm({ ...form, consent: e.target.checked })
                    }
                  />
                  <p className={errors.consent ? "text-red-400" : ""}>
                    J'accepte le traitement de mes données personnelles conformément au RGPD.
                    Si vous ne souhaitez pas faire l'objet de prospection commerciale par voie
                    téléphonique, vous pouvez vous inscrire gratuitement sur{" "}
                    <span className="text-[#d4af37]">www.bloctel.gouv.fr</span>.
                  </p>
                </div>

                {/* Bouton */}
                <div className="text-center pt-6">
                  <button
                    type="submit"
                    className="bg-[#d4af37] text-white px-10 py-3 tracking-wide 
                    hover:bg-white hover:text-[#122e53] transition duration-300"
                  >
                    ENVOYER
                  </button>
                </div>

              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* Input Premium */
interface InputProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    error?: boolean;
  }
  
  function Input({
    placeholder,
    value,
    onChange,
    type = "text",
    error = false,
  }: InputProps) {
    return (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-white text-[#122e53] p-3 outline-none border-2 transition 
          ${error ? "border-red-500" : "border-transparent focus:border-[#d4af37]"}`}
      />
    );
  }
  
