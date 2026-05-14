require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configurar transportadores de correo
const transporterGeneral = nodemailer.createTransport({
  service: 'gmail',
  auth: { 
    user: process.env.EMAIL_USER_1, 
    pass: process.env.EMAIL_PASS_1 
  }
});

const transporterEducativo = nodemailer.createTransport({
  service: 'gmail',
  auth: { 
    user: process.env.EMAIL_USER_2, 
    pass: process.env.EMAIL_PASS_2 
  }
});

// Endpoint: Contacto Peru Luxury
app.post('/contact', async (req, res) => {
  const { nombre, email, captcha } = req.body;

  if (!nombre || !email || !captcha) {
    return res.status(400).json({ 
      ok: false, 
      mensaje: 'Nombre, Email y Captcha son requeridos' 
    });
  }

  try {
    // Validar Turnstile
    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_PERU_LUXURY,
        response: captcha,
      }),
    });

    const outcome = await response.json();

    if (!outcome.success) {
      return res.status(403).json({ 
        ok: false, 
        mensaje: 'Fallo la validación del Captcha' 
      });
    }

    // Enviar email
    await transporterGeneral.sendMail({
      from: `"Web Peru Luxury Journeys" <${process.env.EMAIL_USER_1}>`,
      to: process.env.DESTINATION_EMAIL,
      subject: `✉️ Solicitud de Itinerario — ${nombre}`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Georgia,serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
                  <tr>
                    <td style="background:#1a1a1a;padding:32px 40px;text-align:center;">
                      <p style="margin:0;color:#D9B244;font-size:11px;letter-spacing:4px;text-transform:uppercase;">Peru Luxury Journeys</p>
                      <h1 style="margin:10px 0 0;color:#ffffff;font-size:22px;font-weight:normal;letter-spacing:1px;">Solicitud de Itinerario Personalizado</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px;">
                      <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
                        Un visitante ha solicitado un itinerario personalizado desde el sitio web.
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-left:4px solid #D9B244;border-radius:4px;">
                        <tr>
                          <td style="padding:24px 28px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #eee;">
                                  <span style="color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Nombre</span><br/>
                                  <span style="color:#1a1a1a;font-size:16px;">${nombre}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding:8px 0;">
                                  <span style="color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Email</span><br/>
                                  <a href="mailto:${email}" style="color:#D9B244;font-size:16px;text-decoration:none;">${email}</a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </table>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #eee;text-align:center;">
                      <p style="margin:0;color:#aaa;font-size:11px;letter-spacing:1px;">
                        © ${new Date().getFullYear()} Peru Luxury Journeys — Notificación automática
                      </p>
                    </td>
                  </tr>
                </table>
              <tr>
            </td>
          </table>
        </body>
        </html>
      `
    });
    
    res.json({ ok: true, mensaje: 'Enviado correctamente' });
    
  } catch (error) {
    console.error('Error en /contact:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Endpoint: Suscripción Peru Luxury
app.post('/subscribe', async (req, res) => {
  const { nombre, email, apellido } = req.body;
  
  if (!email) {
    return res.status(400).json({ 
      ok: false, 
      mensaje: 'Email es requerido' 
    });
  }
  
  try {
    await transporterGeneral.sendMail({
      from: `"Peru Luxury - WEB Suscripcion" <${process.env.EMAIL_USER_1}>`,
      to: process.env.DESTINATION_EMAIL,
      subject: '📢 Nueva suscripción',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Georgia,serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
                  <tr>
                    <td style="background:#1a1a1a;padding:32px 40px;text-align:center;">
                      <p style="margin:0;color:#D9B244;font-size:11px;letter-spacing:4px;text-transform:uppercase;">Peru Luxury Journeys</p>
                      <h1 style="margin:10px 0 0;color:#ffffff;font-size:22px;font-weight:normal;letter-spacing:1px;">Nueva Suscripción</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px;">
                      <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
                        Se ha registrado un nuevo suscriptor desde el sitio web.
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-left:4px solid #D9B244;border-radius:4px;">
                        <tr>
                          <td style="padding:24px 28px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #eee;">
                                  <span style="color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Nombre</span><br/>
                                  <span style="color:#1a1a1a;font-size:16px;">${nombre || ''} ${apellido || ''}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding:8px 0;">
                                  <span style="color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Email</span><br/>
                                  <a href="mailto:${email}" style="color:#D9B244;font-size:16px;text-decoration:none;">${email}</a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #eee;text-align:center;">
                      <p style="margin:0;color:#aaa;font-size:11px;letter-spacing:1px;">
                        © ${new Date().getFullYear()} Peru Luxury Journeys — Notificación automática
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });
    
    res.json({ ok: true, mensaje: 'Suscripción registrada correctamente' });
    
  } catch (error) {
    console.error('Error en /subscribe:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Endpoint: Formulario Terra Andina
app.post('/form-terra', async (req, res) => {
  const { nombre, apellido, telefono, email, mensaje, captcha } = req.body;

  if (!email || !captcha) {
    return res.status(400).json({ 
      ok: false, 
      mensaje: 'Email y Captcha son requeridos' 
    });
  }

  try {
    // Validar Turnstile
    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_TERRA_ANDINA,
        response: captcha,
      }),
    });

    const outcome = await response.json();

    if (!outcome.success) {
      return res.status(403).json({ 
        ok: false, 
        mensaje: 'Fallo la validación del Captcha' 
      });
    }

    // Enviar email
    await transporterEducativo.sendMail({
      from: `"Terra Andina" <${process.env.EMAIL_USER_2}>`,
      to: process.env.DESTINATION_EMAIL,
      subject: `🔔 Consulta Terra Andina - ${nombre}`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Georgia,serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
                  <tr>
                    <td style="background:#6B1010;padding:32px 40px;text-align:center;">
                      <p style="margin:0;color:#C9A84C;font-size:11px;letter-spacing:4px;text-transform:uppercase;">Terra Andina Colonial Mansion</p>
                      <h1 style="margin:10px 0 0;color:#ffffff;font-size:22px;font-weight:normal;letter-spacing:1px;">Nueva Consulta Recibida</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px;">
                      <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
                        Se ha recibido una nueva consulta desde el sitio web del hotel.
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-left:4px solid #C9A84C;border-radius:4px;">
                        <tr>
                          <td style="padding:24px 28px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding:10px 0;border-bottom:1px solid #eee;">
                                  <span style="color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Nombre y Apellido</span><br/>
                                  <span style="color:#1a1a1a;font-size:16px;">${nombre || ''} ${apellido || ''}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding:10px 0;border-bottom:1px solid #eee;">
                                  <span style="color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Teléfono</span><br/>
                                  <span style="color:#1a1a1a;font-size:16px;">${telefono || 'No especificado'}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding:10px 0;border-bottom:1px solid #eee;">
                                  <span style="color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Email</span><br/>
                                  <span style="color:#C9A84C;font-size:16px;">${email}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding:10px 0;border-bottom:1px solid #eee;">
                                  <span style="color:#7c2421;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Mensaje</span><br/>
                                  <span style="color:#222222;font-size:16px;">${mensaje || 'Sin mensaje adicional'}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding:10px 0;">
                                  <span style="color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Fecha y Hora</span><br/>
                                  <span style="color:#1a1a1a;font-size:15px;">
                                    ${new Date().toLocaleString('es-PE', { timeZone: 'America/Lima', dateStyle: 'full', timeStyle: 'short' })}
                                  </span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
                        <tr>
                          <td align="center">
                            <a href="mailto:${email}"
                              style="display:inline-block;background:#6B1010;color:#ffffff;font-size:13px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:4px;">
                              Responder al cliente
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #eee;text-align:center;">
                      <p style="margin:0 0 4px;color:#aaa;font-size:11px;letter-spacing:1px;">
                        Calle Unión 184, Cusco, Perú
                      </p>
                      <p style="margin:0;color:#aaa;font-size:11px;letter-spacing:1px;">
                        © ${new Date().getFullYear()} Terra Andina Colonial Mansion — Notificación automática
                      </p>
                    </td>
                  </tr>
                </table>
              </table>
            </table>
          </table>
        </body>
        </html>
      `
    });

    res.json({ ok: true, mensaje: 'Consulta enviada con éxito' });

  } catch (error) {
    console.error('Error en /form-terra:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    endpoints: ['/contact', '/subscribe', '/form-terra']
  });
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}