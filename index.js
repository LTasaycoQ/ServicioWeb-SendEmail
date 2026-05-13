const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const USER_1 = "luistasayco3030@gmail.com";
const PASS_1 = "xkii szmn wopp rqdr";

const USER_2 = "noreply.terraandina@gmail.com"; 
const PASS_2 = "vvkh jkzc vozm jbji"; 


const transporterGeneral = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: USER_1, pass: PASS_1 }
});

const transporterEducativo = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: USER_2, pass: PASS_2 }
});



const SECRET_KEY_TURNSTILE_PERU_LUXURY = "0x4AAAAAADOng4r_T-E8Y3UGNi-5BD1RtQE";


app.post('/contact', async (req, res) => {
  const { nombre, email } = req.body;
  try {
    await transporterGeneral.sendMail({
      from: `"Web Peru Luxury Journeys" <${USER_1}>`,
      to: 'dw@fiestatoursperu.com',
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

                  <!-- Header -->
                  <tr>
                    <td style="background:#1a1a1a;padding:32px 40px;text-align:center;">
                      <p style="margin:0;color:#D9B244;font-size:11px;letter-spacing:4px;text-transform:uppercase;">Peru Luxury Journeys</p>
                      <h1 style="margin:10px 0 0;color:#ffffff;font-size:22px;font-weight:normal;letter-spacing:1px;">Solicitud de Itinerario Personalizado</h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">

                      <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
                        Un visitante ha solicitado un itinerario personalizado desde el sitio web.
                      </p>

                      <!-- Data card -->
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
                        </tr>
                      </table>

                    </td>
                  </tr>

                  <!-- Footer -->
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
    res.json({ mensaje: 'Enviado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/subscribe', async (req, res) => {
  const { nombre, email, apellido } = req.body;
  try {
    await transporterGeneral.sendMail({
      from: `"Peru Luxury - WEB Suscripcion" <${USER_1}>`,
      to: 'dw@fiestatoursperu.com', 
      subject: 'Nueva suscripción',
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

                  <!-- Header -->
                  <tr>
                    <td style="background:#1a1a1a;padding:32px 40px;text-align:center;">
                      <p style="margin:0;color:#D9B244;font-size:11px;letter-spacing:4px;text-transform:uppercase;">Peru Luxury Journeys</p>
                      <h1 style="margin:10px 0 0;color:#ffffff;font-size:22px;font-weight:normal;letter-spacing:1px;">Nueva Suscripción</h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">

                      <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
                        Se ha registrado un nuevo suscriptor desde el sitio web.
                      </p>

                      <!-- Data card -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-left:4px solid #D9B244;border-radius:4px;">
                        <tr>
                          <td style="padding:24px 28px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding:8px 0;border-bottom:1px solid #eee;">
                                  <span style="color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Nombre</span><br/>
                                  <span style="color:#1a1a1a;font-size:16px;">${nombre} ${apellido}</span>
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

                  <!-- Footer -->
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
    res.json({ mensaje: 'Enviado desde cuenta educativa' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// TERRA ANDINA HOTEL - ENVIO DE CORREO

const SECRET_KEY_TURNSTILE = "0x4AAAAAACw3a24bV1FooWeaaH8KsZdr_cE";

app.post('/form-terra', async (req, res) => {
  const { nombre, apellido, telefono, email, mensaje, captcha } = req.body;

  if (!email || !captcha) {
    return res.status(400).json({ ok: false, mensaje: 'Email y Captcha son requeridos' });
  }

  try {
    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: SECRET_KEY_TURNSTILE,
        response: captcha,
      }),
    });

    const outcome = await response.json();

    if (!outcome.success) {
      return res.status(403).json({ ok: false, mensaje: 'Fallo la validación del Captcha' });
    }

    await transporterEducativo.sendMail({
      from: `"Terra Andina" <${USER_2}>`,
      to: 'dw@fiestatoursperu.com', 
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

                  <!-- Header con color del hotel -->
                  <tr>
                    <td style="background:#6B1010;padding:32px 40px;text-align:center;">
                      <p style="margin:0;color:#C9A84C;font-size:11px;letter-spacing:4px;text-transform:uppercase;">Terra Andina Colonial Mansion</p>
                      <h1 style="margin:10px 0 0;color:#ffffff;font-size:22px;font-weight:normal;letter-spacing:1px;">Nueva Consulta Recibida</h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">
                      <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
                        Se ha recibido una nueva consulta desde el sitio web del hotel.
                      </p>

                      <!-- Data card -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-left:4px solid #C9A84C;border-radius:4px;">
                        <tr>
                          <td style="padding:24px 28px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding:10px 0;border-bottom:1px solid #eee;">
                                  <span style="color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Nombre y Apellido</span><br/>
                                  <span style="color:#1a1a1a;font-size:16px;">${nombre} ${apellido}</span>
                                </td>
                              </tr>

                              <tr>
                                <td style="padding:10px 0;border-bottom:1px solid #eee;">
                                  <span style="color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Telefono</span><br/>
                                  <span style="color:#1a1a1a;font-size:16px;">${telefono}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding:10px 0;border-bottom:1px solid #eee;">
                                  <span style="color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Email</span><br/>
                                  <span style="color:#C9A84C;font-size:16px;text-decoration:none;">${email}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding:10px 0;border-bottom:1px solid #eee;">
                                  <span style="color:#7c2421;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Mensaje</span><br/>
                                  <span style="color:#222222;font-size:16px;text-decoration:none;">${mensaje}</span>
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

                      <!-- CTA -->
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

                  <!-- Footer -->
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
              </td>
            </tr>
          </table>

        </body>
        </html>
      `
    });

    res.json({ ok: true, mensaje: 'Enviado con éxito tras validar captcha' });

  } catch (error) {
    console.error('Error en /form-terra:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
});


app.listen(8080, () => {
  console.log('Servidor corriendo en http://localhost:8080');
});