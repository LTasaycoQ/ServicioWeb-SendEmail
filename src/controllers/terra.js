const { transporterEducativo, SECRET_KEY_TURNSTILE, USER_2 } = require('../config/mailers');

const handleTerraForm = async (req, res) => {
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
      html: ``
    });

    res.json({ ok: true, mensaje: 'Enviado con éxito tras validar captcha' });

  } catch (error) {
    console.error('Error en /form-terra:', error);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
  }
};

module.exports = { handleTerraForm };