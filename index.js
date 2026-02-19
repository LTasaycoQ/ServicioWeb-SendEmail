const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


const EMAIL_USER = "luistasayco3030@gmail.com";
const EMAIL_PASS = "xkii szmn wopp rqdr";


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

app.post('/subscribe', async (req, res) => {
  const { nombre, email } = req.body;

  if (!email) {
    return res.status(400).json({ mensaje: 'El email es requerido' });
  }

  try {
    await transporter.sendMail({
      from: `"Web Suscripción" <${EMAIL_USER}>`,
      to: EMAIL_USER, 
      subject: '🔔 Nueva suscripción',
      html: `
        <h2>Nueva suscripción recibida</h2>
        <p><strong>Nombre:</strong> ${nombre || 'No proporcionado'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-MX')}</p>
      `
    });

    await transporter.sendMail({
      from: `"Tu Sitio Web" <${EMAIL_USER}>`,
      to: email,
      subject: '¡Gracias por suscribirte!',
      html: `
        <h2>¡Bienvenido${nombre ? ', ' + nombre : ''}!</h2>
        <p>Te has suscrito exitosamente. Pronto recibirás noticias de nuestra parte.</p>
      `
    });

    res.json({ mensaje: '¡Suscripción exitosa!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al enviar el correo' });
  }
});

app.listen(8080, () => {
  console.log('Servidor corriendo en http://localhost:8080');
});