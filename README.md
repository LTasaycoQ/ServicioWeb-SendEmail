# node-mailer---Prueba

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tu@gmail.com',
    pass: 'tu_contraseña_app'
  }
});

app.post('/subscribe', (req, res) => {
  const { email } = req.body;

  transporter.sendMail({
    from: 'tu@gmail.com',
    to: 'tu@gmail.com',
    subject: 'Nueva suscripción',
    text: `Se suscribió: ${email}`
  });
});