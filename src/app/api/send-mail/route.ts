//src/app/api/send-mail/route.ts
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

    if (company) {
      return NextResponse.json({ success: true });
    }

    const now = Date.now();
    const timeSpent = formStart ? now - formStart : 9999;

if (timeSpent < 2000) {
  return NextResponse.json({ success: true });
}

    if (!email || !message) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Marchal Immobilier" <${process.env.SMTP_USER}>`,
      to: advisorEmail || "contact@marchalimmo.fr",
cc: "contact@marchalimmo.fr",
replyTo: email,
subject: `Nouveau message pour ${advisorName || "l'agence"}`,

html: `
<h3>Nouveau message depuis le site Marchal Immobilier</h3>

<p><strong>Date :</strong> ${new Date().toLocaleString()}</p>

<p><strong>Nom :</strong> ${firstName || ""} ${lastName || ""}</p>
<p><strong>Email :</strong> ${email}</p>
<p><strong>Téléphone :</strong> ${phone || "Non renseigné"}</p>

${propertyTitle ? `
<hr/>
<p><strong>Bien concerné :</strong> ${propertyTitle}</p>
<p><strong>Référence :</strong> ${propertyRef}</p>
<p><strong>Lien :</strong> ${
  propertyUrl
    ? `<a href="${propertyUrl}">${propertyUrl}</a>`
    : "Non disponible"
}</p>
<hr/>
` : ""}

<p><strong>Message :</strong></p>
<p>${message}</p>
`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {

    console.error("Erreur envoi email :", error);
  
    return NextResponse.json({ success: false }, { status: 500 });
  
  }
  }
