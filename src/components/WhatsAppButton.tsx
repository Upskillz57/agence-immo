"use client";
import { useState, useEffect, useRef } from "react";
import { X, Phone, Mail } from "lucide-react";

const WHATSAPP_NUMBER = "33788188000"; // 07 88 18 80 00

interface WhatsAppButtonProps {
  propertyTitle: string;
  propertyId: string;
  onEmailClick?: () => void; // optionnel : ouvre la modale contact
}

export default function WhatsAppButton({ propertyTitle, propertyId, onEmailClick }: WhatsAppButtonProps) {
  const [open, setOpen] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Fermer si clic en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const waMessage = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par le bien suivant :\n"${propertyTitle}"\n\nRéférence : ${propertyId}\n\nPouvez-vous me recontacter ?`
  );
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

  return (
    <div ref={bubbleRef} className="relative">

      {/* BULLE */}
      {open && (
        <div className="absolute bottom-[56px] right-0 w-[260px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">

          {/* HEADER BULLE */}
          <div className="bg-[#122e53] px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-white text-[13px] font-semibold">Intéressé par ce bien ?</p>
              <p className="text-white/70 text-[11px] mt-0.5">Contactez-nous directement</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              <X size={16} />
            </button>
          </div>

          {/* OPTIONS */}
          <div className="p-3 flex flex-col gap-2">

            {/* WHATSAPP */}
            <a
             href={waUrl}
             onClick={(e) => {
               e.stopPropagation();
               setOpen(false);
               window.location.href = waUrl;
             }}
             className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition group"
           >
              {/* Icône WhatsApp SVG */}
              <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-900 group-hover:text-[#25D366] transition">WhatsApp</p>
                <p className="text-[11px] text-gray-400">Réponse rapide</p>
              </div>
            </a>

            {/* TÉLÉPHONE */}
            <a
             href="tel:+33788188000"
             onClick={(e) => {
               e.stopPropagation();
               setOpen(false);
             }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition group"
            >
              <div className="w-9 h-9 rounded-full bg-[#122e53] flex items-center justify-center flex-shrink-0">
                <Phone size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-900">Appeler</p>
                <p className="text-[11px] text-gray-400">07 88 18 80 00</p>
              </div>
            </a>

            {/* EMAIL */}
            <button
              onClick={() => { setOpen(false); onEmailClick?.(); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition group w-full text-left"
            >
              <div className="w-9 h-9 rounded-full bg-[#c79b4b] flex items-center justify-center flex-shrink-0">
                <Mail size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-900">Email</p>
                <p className="text-[11px] text-gray-400">Formulaire de contact</p>
              </div>
            </button>

          </div>

          {/* PETIT TRIANGLE BAS */}
          <div className="absolute -bottom-2 right-5 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45" />
        </div>
      )}

      {/* BOUTON PRINCIPAL */}
      <button
        onClick={() => setOpen(!open)}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all duration-200
          ${open
            ? "bg-[#122e53] text-white scale-95"
            : "bg-[#25D366] text-white hover:bg-[#20b858] hover:shadow-xl hover:scale-105"
          }
        `}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="text-[13px] font-semibold">Nous contacter</span>
      </button>

    </div>
  );
}