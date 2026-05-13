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


app.post('/contact', async (req, res) => {
  const { nombre, email } = req.body;
  try {
    await transporterGeneral.sendMail({
      from: `"Web General" <${USER_1}>`,
      to: USER_1,
      subject: '🔔 Nuevo Contacto',
      html: `<p>De: ${nombre} (${email})</p>`
    });
    res.json({ mensaje: 'Enviado desde cuenta general' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/subscribe', async (req, res) => {
  const { nombre, email, apellido } = req.body;
  try {
    await transporterGeneral.sendMail({
      from: `"Suscripciones Educativas" <${USER_1}>`,
      to: USER_1, 
      subject: 'Nueva suscripción académica',
      html: `<h2>Registro: ${nombre} ${apellido}</h2><p>Email: ${email}</p>`
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
      to: 'luistasayco3030@gmail.com', 
      subject: `🔔 Consulta Terra Andina - ${nombre}`,
      html: `
        <h2>Nueva consulta recibida</h2>
        <p><strong>Nombre:</strong> ${nombre} ${apellido}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })}</p>
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