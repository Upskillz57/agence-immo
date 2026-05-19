import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Marchal Immobilier <ne-pas-repondre@marchalimmobilier.com>";
const TO_AGENCE = "centredaffaires.marchal@marchalimmobilier.com";

// ─── Templates HTML ────────────────────────────────────────────────────────────

function emailHeader(title: string) {
  return `
    <tr>
      <td style="background:#122e53;padding:28px 40px 20px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td>
              <div style="font-family:Georgia,serif;color:#d4af37;font-size:22px;font-weight:bold;letter-spacing:3px;">MARCHAL</div>
              <div style="font-family:Arial,sans-serif;color:rgba(255,255,255,0.6);font-size:10px;letter-spacing:4px;margin-top:2px;">IMMOBILIER</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="background:#d4af37;padding:10px 40px;">
        <span style="font-family:Arial,sans-serif;color:#122e53;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">${title}</span>
      </td>
    </tr>
  `;
}

function emailFooter() {
  return `
    <tr>
      <td style="background:#f4f6f8;padding:24px 40px;border-top:2px solid #d4af37;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td>
              <div style="font-family:Arial,sans-serif;color:#122e53;font-size:12px;font-weight:bold;">Marchal Immobilier</div>
              <div style="font-family:Arial,sans-serif;color:#888;font-size:11px;margin-top:3px;">2 rue du XXème corps américain — 57000 Metz</div>
              <div style="font-family:Arial,sans-serif;color:#888;font-size:11px;">03 87 74 44 73 · centredaffaires.marchal@marchalimmobilier.com</div>
            </td>
            <td align="right" style="vertical-align:middle;">
              <div style="font-family:Georgia,serif;color:#d4af37;font-size:18px;font-weight:bold;letter-spacing:2px;">MI</div>
            </td>
          </tr>
        </table>
        <div style="font-family:Arial,sans-serif;color:#bbb;font-size:10px;margin-top:14px;">
          Ce message a été généré automatiquement depuis le site marchalimmobilier.com
        </div>
      </td>
    </tr>
  `;
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">
        <span style="font-family:Arial,sans-serif;color:#999;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">${label}</span><br/>
        <span style="font-family:Arial,sans-serif;color:#1a1a1a;font-size:14px;">${value || "—"}</span>
      </td>
    </tr>
  `;
}

function buildAnnonceHtml(data: any) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6f8;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:30px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
      ${emailHeader("Nouveau lead — Annonce")}

      <!-- CORPS -->
      <tr><td style="padding:32px 40px;">

        <!-- Bien concerné -->
        <div style="background:#122e53;border-radius:6px;padding:16px 20px;margin-bottom:28px;">
          <div style="font-family:Arial,sans-serif;color:#d4af37;font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Bien concerné</div>
          <div style="font-family:Arial,sans-serif;color:white;font-size:16px;font-weight:bold;">${data.propertyTitle || "—"}</div>
          <div style="font-family:Arial,sans-serif;color:rgba(255,255,255,0.6);font-size:12px;margin-top:4px;">Réf. ${data.propertyRef?.slice(0, 8).toUpperCase() || "—"}</div>
          ${data.propertyUrl ? `<div style="margin-top:10px;"><a href="${data.propertyUrl}" style="font-family:Arial,sans-serif;color:#d4af37;font-size:12px;text-decoration:none;">→ Voir l'annonce</a></div>` : ""}
        </div>

        <!-- Coordonnées -->
        <div style="font-family:Arial,sans-serif;color:#122e53;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">Coordonnées du contact</div>
        <table cellpadding="0" cellspacing="0" width="100%">
          ${row("Nom", data.firstName || data.name || "")}
          ${row("Email", data.email)}
          ${row("Téléphone", data.phone)}
          ${row("Message", data.message)}
          ${row("Date", new Date().toLocaleString("fr-FR"))}
        </table>

      </td></tr>
      ${emailFooter()}
    </table>
  </td></tr>
</table>
</body></html>`;
}

function buildContactHtml(data: any) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6f8;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:30px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
      ${emailHeader("Nouveau message de contact")}

      <!-- CORPS -->
      <tr><td style="padding:32px 40px;">

        <div style="font-family:Arial,sans-serif;color:#122e53;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">Coordonnées du contact</div>
        <table cellpadding="0" cellspacing="0" width="100%">
          ${row("Prénom", data.firstName)}
          ${row("Nom", data.lastName)}
          ${row("Email", data.email)}
          ${row("Téléphone", data.phone)}
          ${row("Commune", data.commune)}
          ${row("Projet", data.requestType)}
        </table>

        <!-- Message -->
        <div style="margin-top:24px;background:#f8f9fb;border-left:3px solid #d4af37;padding:16px 20px;border-radius:0 6px 6px 0;">
          <div style="font-family:Arial,sans-serif;color:#999;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Message</div>
          <div style="font-family:Arial,sans-serif;color:#1a1a1a;font-size:14px;line-height:1.6;">${data.message}</div>
        </div>

        <div style="margin-top:16px;font-family:Arial,sans-serif;color:#bbb;font-size:11px;">Reçu le ${new Date().toLocaleString("fr-FR")}</div>

      </td></tr>
      ${emailFooter()}
    </table>
  </td></tr>
</table>
</body></html>`;
}

function buildEstimationHtml(data: any) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6f8;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:30px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
      ${emailHeader("Nouvelle demande d'estimation")}

      <tr><td style="padding:32px 40px;">
        <div style="font-family:Arial,sans-serif;color:#122e53;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">Coordonnées</div>
        <table cellpadding="0" cellspacing="0" width="100%">
          ${row("Prénom", data.firstName)}
          ${row("Nom", data.lastName)}
          ${row("Email", data.email)}
          ${row("Téléphone", data.phone)}
          ${row("Commune", data.commune)}
        </table>
        <div style="margin-top:24px;background:#f8f9fb;border-left:3px solid #d4af37;padding:16px 20px;border-radius:0 6px 6px 0;">
          <div style="font-family:Arial,sans-serif;color:#999;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Message</div>
          <div style="font-family:Arial,sans-serif;color:#1a1a1a;font-size:14px;line-height:1.6;">${data.message}</div>
        </div>
      </td></tr>
      ${emailFooter()}
    </table>
  </td></tr>
</table>
</body></html>`;
}

function buildConseillerHtml(data: any) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6f8;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:30px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
      ${emailHeader(`Message pour ${data.advisorName || "un conseiller"}`)}

      <tr><td style="padding:32px 40px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          ${row("Nom", `${data.firstName || ""} ${data.lastName || ""}`)}
          ${row("Email", data.email)}
          ${row("Téléphone", data.phone)}
        </table>
        <div style="margin-top:24px;background:#f8f9fb;border-left:3px solid #d4af37;padding:16px 20px;border-radius:0 6px 6px 0;">
          <div style="font-family:Arial,sans-serif;color:#999;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Message</div>
          <div style="font-family:Arial,sans-serif;color:#1a1a1a;font-size:14px;line-height:1.6;">${data.message}</div>
        </div>
      </td></tr>
      ${emailFooter()}
    </table>
  </td></tr>
</table>
</body></html>`;
}

// ─── Route ─────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { source, email, message, advisorEmail, advisorName, propertyTitle, company, formStart } = body;

    if (company) return NextResponse.json({ success: true });

    const now = Date.now();
    if (formStart && now - formStart < 2000) return NextResponse.json({ success: true });

    if (!email || !message) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }
    if (!email.includes("@")) {
      return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 });
    }

    let subject: string;
    let html: string;

    if (source === "annonce") {
      subject = `Nouveau lead — ${propertyTitle || "Bien immobilier"}`;
      html = buildAnnonceHtml(body);
    } else if (source === "conseiller") {
      subject = `Nouveau message pour ${advisorName || "un conseiller"}`;
      html = buildConseillerHtml(body);
    } else if (source === "estimation") {
      subject = "Nouvelle demande d'estimation";
      html = buildEstimationHtml(body);
    } else {
      subject = "Nouveau message de contact";
      html = buildContactHtml(body);
    }

    await resend.emails.send({
      from: FROM,
      to: advisorEmail || TO_AGENCE,
      cc: [TO_AGENCE, "verna.gio57@gmail.com"],
      replyTo: email,
      subject,
      html,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erreur envoi email :", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
