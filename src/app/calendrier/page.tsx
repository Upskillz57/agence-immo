// src/app/calendrier/page.tsx
import CalendrierClient from "@/components/calendrier/CalendrierClient";
import Header from "@/components/Header";

export const metadata = {
  title: "Calendrier Vidéo | Marchal Immobilier",
  robots: "noindex, nofollow",
};

export default function CalendrierPage() {
  return (
    <div className="min-h-screen bg-[#0d2240]">
      <Header forceScrollBackground />
      <CalendrierClient />
    </div>
  );
}