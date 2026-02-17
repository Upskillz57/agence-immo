import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import { Inter, Source_Serif_4, Montserrat } from "next/font/google";
import Footer from "../components/Footer";




const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Marchal Immobilier",
  description: "Agence immobilière à Metz",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${montserrat.className} antialiased relative`}>

        <Header />
        {children}
        <Footer />

      </body>
    </html>
  );
}
