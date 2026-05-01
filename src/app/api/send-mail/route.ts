import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      message,
      advisorEmail,
      advisorName,
      propertyTitle,
      propertyRef,
      propertyUrl,
      company,
      formStart
    } = await req.json();

    // 🛑 Anti-spam (champ caché)
    if (company) {
      return NextResponse.json({ success: true });
    }

    // 🛑 Anti-bot (remplissage trop rapide)
    const now = Date.now();
    const timeSpent = formStart ? now - formStart : 9999;

    if (timeSpent < 2000) {
      return NextResponse.json({ success: true });
    }

    // 🛑 Vérification champs
    if (!email || !message) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    // 📧 SMTP Microsoft 365
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 📩 Envoi du mail
    await transporter.sendMail({
      from: `"Marchal Immobilier" <${process.env.SMTP_USER}>`,

      // destinataire principal
      to: advisorEmail || "admin.marchal@marchalimmobilier.com",

      // copie agence
      cc: "admin.marchal@marchalimmobilier.com",

      // réponse directe au client
      replyTo: email,

      subject: `🔥 Nouveau lead - ${propertyTitle || "Site web"}`,

      html: `
        <h2 style="color:#000;">Nouveau contact site</h2>

        <p><b>Date :</b> ${new Date().toLocaleString()}</p>

        <hr/>

        <p><b>Nom :</b> ${firstName || ""} ${lastName || ""}</p>
        <p><b>Email :</b> ${email}</p>
        <p><b>Téléphone :</b> ${phone || "Non renseigné"}</p>

        ${
          propertyTitle
            ? `
          <hr/>
          <h3>Bien concerné</h3>
          <p><b>${propertyTitle}</b></p>
          <p><b>Référence :</b> ${propertyRef || "Non renseignée"}</p>
          <p>
            ${
              propertyUrl
                ? `<a href="${propertyUrl}">Voir le bien</a>`
                : "Lien non disponible"
            }
          </p>
          `
            : ""
        }

        <hr/>

        <p><b>Message :</b></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erreur envoi email :", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}