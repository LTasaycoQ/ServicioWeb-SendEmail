const express = require('express');
const nodemailer = require('nodemailer');
const PDFDocument = require("pdfkit");


const cors = require('cors');
const PORT = process.env.PORT || 8000;


const app = express();
app.use(cors());
app.use(express.json());


const USER_1 = "luistasayco3030@gmail.com";
const PASS_1 = "xkii szmn wopp rqdr";

const USER_2 = "noreply.terraandina@gmail.com"; 
const PASS_2 = "vvkh jkzc vozm jbji"; 

const EMAIL_USER = "noreply.fiestatoursperu@gmail.com";
const EMAIL_PASS = "ztcn lsxw sbwy mktw";


const transporterGeneral = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: USER_1, pass: PASS_1 }
});

const transporterEducativo = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: USER_2, pass: PASS_2 }
});


const SECRET_KEY_TURNSTILE_PERU_LUXURY = "0x4AAAAAADPRDAWehbe_VFhuGTxSXn4SnK4";
const SECRET_KEY_TURNSTILE = "0x4AAAAAACw3a24bV1FooWeaaH8KsZdr_cE";



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    }
});


function drawLine(doc) {
    doc.moveDown(0.5);
    doc.strokeColor('#cccccc')
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();
    doc.moveDown(0.5);
}

function checkPageBreak(doc, margin = 80) {
    if (doc.y > doc.page.height - margin) {
        doc.addPage();
    }
}

function drawSection(doc, titulo, data, getName, getValue) {
    const green = "#2a4e33";
    checkPageBreak(doc);

    doc.fillColor(green)
        .font("Helvetica-Bold")
        .fontSize(12)
        .text(titulo);

    doc.moveDown(0.5);

    const startX = 60;
    const endX = 500;

    data.forEach(item => {
        checkPageBreak(doc);

        const y = doc.y;

        doc.fillColor("#000")
            .fontSize(10)
            .font("Helvetica")
            .text(getName(item), startX, y, { width: 300 });

        doc.fillColor(green)
            .font("Helvetica-Bold")
            .text(getValue(item), startX, y, {
                width: endX - startX,
                align: "right"
            });

        doc.moveDown(0.4);

        doc.moveTo(startX, doc.y)
            .lineTo(endX, doc.y)
            .strokeColor("#eee")
            .stroke();

        doc.moveDown(0.4);
    });

    doc.moveDown(1);
}

function drawComment(doc, titulo, texto) {
    const green = "#376442";
    checkPageBreak(doc);

    doc.fillColor(green)
        .font("Helvetica-Bold")
        .fontSize(12)
        .text(titulo);

    doc.moveDown(0.3);

    doc.fillColor("#333")
        .font("Helvetica")
        .fontSize(10)
        .text(texto || "Sin comentarios", { width: 480 });

    doc.moveDown(2);
}

function drawHeader(doc) {
    const PAGE_W = 612;
    const L = 50;
    const green = "#2a4e33";
    const HEADER_H = 80;

    doc.rect(0, 0, PAGE_W, HEADER_H).fill('#ffffff');

    doc.fillColor(green)
        .font('Helvetica-Bold')
        .fontSize(7)
        .text('FIESTA TOURS PERU', L, 18, { characterSpacing: 3 });

    doc.fillColor(green)
        .font('Helvetica-Bold')
        .fontSize(18)
        .text('Resumen de Evaluación', L, 30);

    doc.fillColor('#5dad72')
        .font('Helvetica')
        .fontSize(9)
        .text('Peru Luxury Journeys', L, 52);

    try {
        doc.image('path/logo-fti.png', PAGE_W - 280, 20, { width: 250 });
    } catch (_) { }

    doc.y = HEADER_H + 20;
}


function generarPDF(datos) {
    return new Promise((resolve, reject) => {
        const {
            nombre, email, fecha,
            hotelTransfer, restaurantes,
            tours, hotel,
            comentarioHotelTransfer,
            comentarioRestaurante,
            comentarioHotel,
            comentariosToursGuia,
            comentario,
            calificacion
        } = datos;

        const green = "#2a4e33";

        // Inicializa el documento con buffer vacío
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

        doc.on("data", chunk => buffers.push(chunk));
        doc.on("error", reject);
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        // REPETICIÓN AUTOMÁTICA: Se dispara en la página 2 en adelante
        doc.on('pageAdded', () => {
            drawHeader(doc);
        });

        // Dibuja el header en la primera página manualmente al iniciar
        drawHeader(doc);

        // --- CUERPO DEL DOCUMENTO ---
        doc.fillColor(green).fontSize(12).font('Helvetica-Bold').text('Nombre: ', { continued: true });
        doc.fillColor("#3f3f3f").font('Helvetica-Bold').fontSize(12).text(nombre);

        doc.moveDown(1);

        doc.fillColor(green).fontSize(12).font('Helvetica-Bold').text('Fecha: ', { continued: true });
        doc.fillColor("#3f3f3f").font('Helvetica-Bold').fontSize(12).text(fecha);

        doc.moveDown(2);

        drawSection(doc, "Hotel Transfer", hotelTransfer,
            i => i.hotelTransfer_name || "-",
            i => i.hotelTransfer_calificacion || "-"
        );
        drawComment(doc, "Comentario Hotel Transfer", comentarioHotelTransfer);
        drawLine(doc);
        doc.moveDown(2);

        drawSection(doc, "Tours y Guías", tours,
            i => i.tours_name || "-",
            i => i.tours_calificacion || "-"
        );
        drawComment(doc, "Comentario Tours Guia", comentariosToursGuia);
        drawLine(doc);
        doc.moveDown(2);

        drawSection(doc, "Hoteles", hotel,
            i => `${i.hotel_ubicacion || "-"} - ${i.hotel_name || "-"}`,
            i => i.hotel_calificacion || "-"
        );
        drawComment(doc, "Comentario Hotel", comentarioHotel);
        drawLine(doc);
        doc.moveDown(2);

        drawSection(doc, "Restaurantes", restaurantes,
            i => `${i.restaurante_ubicacion || "-"} - ${i.restaurante_name || "-"}`,
            i => i.restaurante_calificacion || "-"
        );
        drawComment(doc, "Comentario Restaurantes", comentarioRestaurante);
        drawLine(doc);
        doc.moveDown(2);

        drawComment(doc, "Comentarios Generales", comentario);
        doc.moveDown(2);

        checkPageBreak(doc);
        doc.fillColor(green).fontSize(10).font("Helvetica-Bold").text('Email: ', { continued: true });
        doc.fillColor("#3f3f3f").font("Helvetica-Bold").text(email || '-');

        doc.moveDown(4);

        doc.fillColor("#1f1f1f")
            .font("Helvetica-Bold")
            .fontSize(12)
            .text(`Calificación general: ${calificacion} /10`, { align: "center" });

        doc.moveDown(2);

        doc.fillColor("#646464")
            .fontSize(9)
            .text("Fiesta Tours Peru & Peru Luxury Journeys", { align: "center" });

        doc.end();
    });
}


function generarHTML({ nombre, email, fecha, hotelTransfer, restaurantes, tours, hotel,
    comentarioHotelTransfer, comentarioRestaurante, comentarioHotel,
    comentariosToursGuia, comentario, calificacion }) {

    const filas = (arr, getCols) =>
        arr.map(i => {
            const [left, right] = getCols(i);
            return `
        <tr>
          <td style="padding:6px 0; border-bottom:1px solid #eee;">${left}</td>
          <td align="right" style="padding:6px 0; border-bottom:1px solid #eee; font-weight:bold;">${right}</td>
        </tr>`;
        }).join("");

    const bloqueSec = (titulo, arr, getCols) => `
    <tr>
      <td>
        <h3 style="color:#2e7d32;">${titulo}</h3>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${filas(arr, getCols)}
        </table>
      </td>
    </tr>`;

    const bloqueComentario = (titulo, texto) => `
    <tr>
      <td style="padding-top:10px;">
        <h3 style="color:#2e7d32;">${titulo}</h3>
        <div style="background:#f9fbf9; border-left:4px solid #2e7d32; padding:10px; border-radius:6px; font-size:14px;">
          ${texto || "<i style='color:#999;'>Sin comentarios</i>"}
        </div>
      </td>
    </tr>`;

    const separador = `<tr><td style="border-bottom:1px solid gray; padding-top:15px;"></td></tr>`;

    return `
    <div style="background:#f4f6f5; padding:20px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;">
    <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:20px;">

      <tr><td align="center" style="padding-bottom:10px;">
        <h2 style="color:#2e7d32; margin:0;">RESUMEN DE EVALUACIÓN</h2>
      </td></tr>

      <tr><td align="start" style="font-size:14px; color:#555;">
        <br>
        <strong><span style="color:green">Nombre: </span>${nombre}</strong><br>
        <strong><span style="color:green">Fecha: </span>${fecha}</strong>
      </td></tr>

      ${bloqueSec("Hotel Transfer", hotelTransfer,
        i => [i.hotelTransfer_name || "-", i.hotelTransfer_calificacion || "-"])}
      ${bloqueComentario("Comentario Hotel Transfer", comentarioHotelTransfer)}
      ${separador}

      ${bloqueSec("Tours y Guías", tours,
            i => [i.tours_name || "-", i.tours_calificacion || "-"])}
      ${bloqueComentario("Comentario Tours", comentariosToursGuia)}
      ${separador}

      ${bloqueSec("Hoteles", hotel,
                i => [`${i.hotel_ubicacion || "-"} - ${i.hotel_name || "-"}`, i.hotel_calificacion || "-"])}
      ${bloqueComentario("Comentario Hotel", comentarioHotel)}
      ${separador}

      ${bloqueSec("Restaurantes", restaurantes,
                    i => [`${i.restaurante_ubicacion || "-"} - ${i.restaurante_name || "-"}`, i.restaurante_calificacion || "-"])}
      ${bloqueComentario("Comentario Restaurante", comentarioRestaurante)}
      ${separador}

      <tr><td>
        <h3 style="color:#2e7d32;">Comentarios</h3>
        <div style="background:#f4f6f5; border:1px solid #e0e0e0; padding:12px; border-radius:6px; font-size:14px;">
          ${comentario || "<i style='color:#999;'>Sin comentarios</i>"}
        </div>
      </td></tr>

      <tr><td>
        <h3 style="color:#105A40;">Email</h3>
        <div style="background:#f4f6f5; border:1px solid #e0e0e0; padding:12px; border-radius:6px; font-size:14px;">
          ${email || "-"}
        </div>
      </td></tr>

      <tr><td height="15"></td></tr>

      <tr><td align="center">
        <h3 style="color:#2e7d32; margin:0;">Calificación general: ${calificacion}</h3>
      </td></tr>

      <tr><td height="20"></td></tr>

      <tr><td align="center" style="font-size:12px; color:#888;">
        Fiesta Tours Peru & Peru Luxury Journeys
      </td></tr>

    </table>
    </td></tr>
    </table>
    </div>`;
}


app.post('/evaluacion', async (req, res) => {
    const datos = {
        nombre: req.body.nombre ?? "",
        email: req.body.email ?? "",
        fecha: req.body.fecha ?? "",
        hotelTransfer: req.body.hotelTransfer ?? [],
        restaurantes: req.body.restaurantes ?? [],
        tours: req.body.tours ?? [],
        hotel: req.body.hotel ?? [],
        comentarioHotelTransfer: req.body.comentarioHotelTransfer ?? "",
        comentarioRestaurante: req.body.comentarioRestaurante ?? "",
        comentarioHotel: req.body.comentarioHotel ?? "",
        comentariosToursGuia: req.body.comentariosToursGuia ?? "",
        comentario: req.body.comentario ?? "",
        calificacion: req.body.calificacion ?? "",
    };

    try {
        const pdfData = await generarPDF(datos);

        await transporter.sendMail({
            from: `"Fiesta Tours Peru" <${EMAIL_USER}>`,
            to: "dw@fiestatoursperu.com",
            subject: `Evaluación Viaje - ${datos.nombre}`,
            html: generarHTML(datos),
            attachments: [
                {
                    filename: `evaluacion-${datos.nombre}.pdf`,
                    content: pdfData,
                }
            ]
        });

        res.json({ mensaje: '¡Correo enviado con éxito!' });

    } catch (error) {
        console.error("Error en /evaluacion:", error);
        res.status(500).json({ mensaje: 'Error interno en el servidor' });
    }
});



app.post('/contact', async (req, res) => {
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
                                  <span style="color: #999;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Email</span><br/>
                                  <span style="color: #C9A84C;font-size:16px;">${email}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding:10px 0;border-bottom:1px solid #eee;">
                                  <span style="color: #7c2421;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Mensaje</span><br/>
                                  <span style="color: #222222;font-size:16px;">${mensaje}</span>
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


app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});