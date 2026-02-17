"use client";

import { useState } from "react";
import {
  Home,
  Building2,
  Ruler,
  BedDouble,
  Sparkles,
  Paintbrush,
  Wrench,
} from "lucide-react";

type Data = {
  type?: string;
  surface?: number;
  rooms?: number;
  address?: string;
  condition?: string;
};

export default function EstimationForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Data>({});
  const [submitted, setSubmitted] = useState(false);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  // 🧮 Calcul estimation
  const prixM2 = 3200;
  let base = (data.surface || 0) * prixM2;

  if (data.condition === "excellent") base *= 1.05;
  if (data.condition === "renover") base *= 0.9;

  const min = Math.round(base * 0.95);
  const max = Math.round(base * 1.05);

  const handleSubmit = async () => {
    await fetch("/api/estimation", {
      method: "POST",
      body: JSON.stringify({ ...data, min, max }),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-20">
        <h3 className="text-3xl font-semibold text-black tracking-tight">

          Merci. Nous vous contactons sous 24h.
        </h3>
      </div>
    );
  }

  return (
<div className="p-4 md:p-5 max-h-[70vh] overflow-y-auto">

 

      {/* Progress */}
      <div className="h-1 bg-gray-200 rounded-full mb-8">
        <div
          className="h-1 bg-black rounded-full transition-all duration-500"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-8 text-center">
          <h3 className="text-2xl font-semibold text-black tracking-tight">
            Quel type de bien ?
          </h3>

          <div className="grid grid-cols-2 gap-6">
            <button
              onClick={() => {
                setData({ ...data, type: "maison" });
                next();
              }}
              className="flex flex-col items-center justify-center 
              bg-white border border-gray-300 rounded-2xl py-10 
              text-gray-800 shadow-sm 
              hover:bg-black hover:text-white hover:shadow-xl 
              transition-all duration-300 group"
            >
              <Home
                size={40}
                className="mb-4 text-gray-700 group-hover:text-white group-hover:scale-110 transition-all duration-300"
              />
              <span className="text-lg font-medium">Maison</span>
            </button>

            <button
              onClick={() => {
                setData({ ...data, type: "appartement" });
                next();
              }}
              className="flex flex-col items-center justify-center 
              bg-white border border-gray-300 rounded-2xl py-10 
              text-gray-800 shadow-sm 
              hover:bg-black hover:text-white hover:shadow-xl 
              transition-all duration-300 group"
            >
              <Building2
                size={40}
                className="mb-4 text-gray-700 group-hover:text-white group-hover:scale-110 transition-all duration-300"
              />
              <span className="text-lg font-medium">Appartement</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-black">
            Caractéristiques
          </h3>

          <div className="space-y-6">
            <div className="relative">
              <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                 type="text"
  inputMode="numeric"   
                placeholder="Surface (m²)"
                className="relative z-10 w-full bg-white text-black 
                pl-12 pr-4 py-4 border border-gray-300 rounded-2xl 
                focus:ring-2 focus:ring-black focus:border-black 
                outline-none transition"
                onChange={(e) =>
                  setData({ ...data, surface: Number(e.target.value) })
                }
              />
            </div>

            <div className="relative">
              <BedDouble className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                 type="text"
  inputMode="numeric"   
                placeholder="Nombre de pièces"
                className="relative z-10 w-full bg-white text-black 
                pl-12 pr-4 py-4 border border-gray-300 rounded-2xl 
                focus:ring-2 focus:ring-black focus:border-black 
                outline-none transition"
                
                onChange={(e) =>
                  setData({ ...data, rooms: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 pt-3">
  <button
    onClick={back}
    className="text-gray-500 hover:text-black transition"
  >
    Retour
  </button>

  <button
    onClick={next}
    className="bg-black text-white px-6 py-3 rounded-lg"
  >
    Continuer
  </button>
</div>

        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-8 text-center">
          <h3 className="text-2xl font-semibold text-black">
            État du bien
          </h3>

          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "Excellent", value: "excellent", icon: <Sparkles size={26} /> },
              { label: "Bon état", value: "bon", icon: <Home size={26} /> },
              { label: "À rafraîchir", value: "rafraichir", icon: <Paintbrush size={26} /> },
              { label: "À rénover", value: "renover", icon: <Wrench size={26} /> },
            ].map((c) => (
              <button
                key={c.value}
                onClick={() => {
                  setData({ ...data, condition: c.value });
                  next();
                }}
                className="flex flex-col items-center justify-center 
                bg-white border border-gray-200 rounded-2xl py-8 
                text-black shadow-sm 
                hover:bg-black hover:text-white hover:shadow-xl 
                transition-all duration-300 group"
              >
                <div className="mb-3 text-gray-700 group-hover:text-white transition-all duration-300">
                  {c.icon}
                </div>
                <span className="font-medium">{c.label}</span>
              </button>
            ))}
          </div>

          <button onClick={back} className="text-gray-600">
            Retour
          </button>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
  <div className="space-y-4 text-center">


<h3 className="text-2xl font-semibold text-black tracking-tight">


            Estimation entre
          </h3>

          <div className="text-3xl md:text-4xl font-semibold my-3 text-black tracking-tight">


            {min.toLocaleString()} € – {max.toLocaleString()} €
          </div>

          <p className="text-gray-600">
            Recevez le rapport détaillé et les comparables du secteur.
          </p>

          <input
            placeholder="Nom"
            className="w-full bg-white text-black border border-gray-300 
px-4 py-3 rounded-xl focus:ring-2 focus:ring-black focus:border-black 
outline-none transition"


          />
          <input
            placeholder="Téléphone"
            className="w-full bg-white text-black border border-gray-300 
px-4 py-3 rounded-xl focus:ring-2 focus:ring-black focus:border-black 
outline-none transition"

          />
          <input
            placeholder="Email"
            className="w-full bg-white text-black border border-gray-300 
px-4 py-3 rounded-xl focus:ring-2 focus:ring-black focus:border-black 
outline-none transition"

          />

          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-3 rounded-xl"

          >
            Recevoir mon estimation
          </button>

          <button onClick={back} className="text-gray-600">
            Retour
          </button>
        </div>
      )}
    </div>
  );
}
