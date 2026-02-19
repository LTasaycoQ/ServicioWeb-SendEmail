require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/subscribe', async (req, res) => {
  const { nombre, email } = req.body;

  if (!email) {
    return res.status(400).json({ mensaje: 'El email es requerido' });
  }

  try {
    await transporter.sendMail({
      from: `"Web Suscripción" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, 
      subject: '🔔 Nueva suscripción',
      html: `
        <h2>Nueva suscripción recibida</h2>
        <p><strong>Nombre:</strong> ${nombre || 'No proporcionado'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-MX')}</p>
      `
    });

    await transporter.sendMail({
      from: `"Tu Sitio Web" <${process.env.EMAIL_USER}>`,
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

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});