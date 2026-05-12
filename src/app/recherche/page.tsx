import { Suspense } from "react";
import RechercheClient from "@/components/RechercheClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <RechercheClient />
    </Suspense>
  );
}