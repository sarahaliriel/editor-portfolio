import { NextResponse } from "next/server";
import { Resend } from "resend";

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      message?: string;
      website?: string;
    };

    const name = (body?.name || "").trim();
    const email = (body?.email || "").trim();
    const message = (body?.message || "").trim();
    const website = (body?.website || "").trim();

    if (website) return NextResponse.json({ ok: true });

    if (name.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Escreve um nome válido." },
        { status: 400 }
      );
    }

    if (!isEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Escreve um email válido." },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Escreve uma mensagem um pouco maior." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO;
    const from = process.env.CONTACT_FROM;

    if (!apiKey || !to || !from) {
      return NextResponse.json(
        { ok: false, error: "Configuração do Resend em falta no servidor." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const subject = `Novo contacto: ${name}`;

    const result = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject,
      text: `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}\n`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6">
          <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#666;margin-bottom:14px">
            Novo contacto
          </div>
          <h2 style="margin:0 0 12px 0;font-size:22px;line-height:1.2">Mensagem recebida</h2>
          <p style="margin:0 0 8px 0"><strong>Nome:</strong> ${escapeHtml(
            name
          )}</p>
          <p style="margin:0 0 16px 0"><strong>Email:</strong> ${escapeHtml(
            email
          )}</p>
          <div style="padding:14px 16px;border:1px solid #e6e6e6;border-radius:12px;background:#fafafa">
            <div style="white-space:pre-wrap">${escapeHtml(message)}</div>
          </div>
        </div>
      `,
    });

    if ("error" in result && result.error) {
      return NextResponse.json(
        { ok: false, error: "Falha ao enviar. Tenta novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Falha ao enviar. Tenta novamente." },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
