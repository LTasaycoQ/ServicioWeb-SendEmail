const { transporterGeneral, USER_1 } = require('../config/mailers');

const handleContact = async (req, res) => {
  const { nombre, email, captcha } = req.body;

  if (!nombre || !email || !captcha) {
    return res.status(400).json({ ok: false, mensaje: 'Email y Captcha son requeridos' });
  }
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
                  <tr>
                    <td style="background:#1a1a1a;padding:32px 40px;text-align:center;">
                      <p style="margin:0;color:#D9B244;font-size:11px;letter-spacing:4px;text-transform:uppercase;">Peru Luxury Journeys</p>
                      <h1 style="margin:10px 0 0;color:#ffffff;font-size:22px;font-weight:normal;letter-spacing:1px;">Solicitud de Itinerario Personalizado</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px;">
                      <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
                        Un visitante ha solicitado un itinerary personalizado desde el sitio web.
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
    res.json({ mensaje: 'Enviado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const handleSubscribe = async (req, res) => {
  const { nombre, email, apellido } = req.body;
  try {
    await transporterGeneral.sendMail({
      from: `"Peru Luxury - WEB Suscripcion" <${USER_1}>`,
      to: 'dw@fiestatoursperu.com', 
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
};

module.exports = { handleContact, handleSubscribe };