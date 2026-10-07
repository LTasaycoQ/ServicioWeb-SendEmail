const { transporter, EMAIL_USER } = require('../config/mailers');

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const handleFiestaToursPeru = async (req, res) => {
  const {
    nombre = '',
    apellido = '',
    email = '',
    telefono = '',
    textExperience = '',
    fecha = '',
    pasajeros = '',
    descripcion = '',
  } = req.body;

  try {
    const fields = [
      ['Nombre', nombre],
      ['Apellido', apellido],
      ['Email', email],
      ['Teléfono', telefono],
      ['Experiencia', textExperience],
      ['Fecha', fecha],
      ['Pasajeros', pasajeros],
      ['Descripción', descripcion],
    ];

    const rows = fields.map(([label, value]) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee;color:#777;font-size:13px;">${label}</td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;color:#222;font-size:15px;">${escapeHtml(value) || '-'}</td>
      </tr>
    `).join('');

    await transporter.sendMail({
      from: `"Fiesta Tours Peru" <${EMAIL_USER}>`,
      to: 'dw@fiestatoursperu.com',
      replyTo: email || undefined,
      subject: `Nueva solicitud Fiesta Tours Peru - ${nombre} ${apellido}`.trim(),
      html: `
        <div style="background:#f4f6f5;padding:32px 16px;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;padding:24px;border-collapse:collapse;">
            <tr><td><h1 style="margin:0 0 20px;color:#2a4e33;font-size:22px;">Nueva solicitud de experiencia</h1></td></tr>
            ${rows}
          </table>
        </div>
      `,
    });

    res.json({ ok: true, mensaje: 'Solicitud enviada correctamente' });
  } catch (error) {
    console.error('Error en /fiestatoursperu:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
};

const handleFiestaToursPeruBasic = async (req, res) => {
  const { nombre = '', email = '' } = req.body;

  if (!email) {
    return res.status(400).json({ ok: false, mensaje: 'Nombre y email son requeridos' });
  }

  try {
    await transporter.sendMail({
      from: `"Fiesta Tours Peru" <${EMAIL_USER}>`,
      to: 'marco.paredes@fiestatoursperu.com',
      replyTo: email,
      subject: 'Nuevo contacto desde Fiesta Tours Peru',
      html: `
        <div style="font-family:Arial,sans-serif;color:#222;">
          <h2>Nuevo contacto</h2>
          <p><strong>Nombre:</strong> ${escapeHtml(nombre) || 'No proporcionado'}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        </div>
      `,
    });

    res.json({ ok: true, mensaje: 'Solicitud enviada correctamente' });
  } catch (error) {
    console.error('Error en /fiestatoursperu-basic:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
};

module.exports = { handleFiestaToursPeru, handleFiestaToursPeruBasic };