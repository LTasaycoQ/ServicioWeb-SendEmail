const PDFDocument = require("pdfkit");
const { transporter, EMAIL_USER } = require('../config/mailers');

function drawLine(doc) {
    doc.moveDown(0.5);
    doc.strokeColor('#cccccc').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);
}

function checkPageBreak(doc, margin = 80) {
    if (doc.y > doc.page.height - margin) { doc.addPage(); }
}

function drawSection(doc, titulo, data, getName, getValue) {
    const green = "#2a4e33";
    checkPageBreak(doc);
    doc.fillColor(green).font("Helvetica-Bold").fontSize(12).text(titulo);
    doc.moveDown(0.5);

    const startX = 60;
    const endX = 500;

    data.forEach(item => {
        checkPageBreak(doc);
        const y = doc.y;
        doc.fillColor("#000").fontSize(10).font("Helvetica").text(getName(item), startX, y, { width: 300 });
        doc.fillColor(green).font("Helvetica-Bold").text(getValue(item), startX, y, { width: endX - startX, align: "right" });
        doc.moveDown(0.4);
        doc.moveTo(startX, doc.y).lineTo(endX, doc.y).strokeColor("#eee").stroke();
        doc.moveDown(0.4);
    });
    doc.moveDown(1);
}

function drawComment(doc, titulo, texto) {
    const green = "#376442";
    checkPageBreak(doc);
    doc.fillColor(green).font("Helvetica-Bold").fontSize(12).text(titulo);
    doc.moveDown(0.3);
    doc.fillColor("#333").font("Helvetica").fontSize(10).text(texto || "Sin comentarios", { width: 480 });
    doc.moveDown(2);
}

function drawHeader(doc) {
    const PAGE_W = 612;
    const L = 50;
    const green = "#2a4e33";
    const HEADER_H = 80;

    doc.rect(0, 0, PAGE_W, HEADER_H).fill('#ffffff');
    doc.fillColor(green).font('Helvetica-Bold').fontSize(18).text('Resumen de Evaluación', L, 30);

    try { doc.image('path/logo-fti.png', PAGE_W - 280, 20, { width: 250 }); } catch (_) { }
    doc.y = HEADER_H + 20;
}

function generarPDF(datos) {
    return new Promise((resolve, reject) => {
        const {
            nombre, email, fecha, hotelTransfer, restaurantes, tours, hotel,
            comentarioHotelTransfer, comentarioRestaurante, comentarioHotel,
            comentariosToursGuia, comentario, calificacion
        } = datos;

        const green = "#2a4e33";
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

        doc.on("data", chunk => buffers.push(chunk));
        doc.on("error", reject);
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        doc.on('pageAdded', () => { drawHeader(doc); });
        drawHeader(doc);

        doc.fillColor(green).fontSize(12).font('Helvetica-Bold').text('Nombre: ', { continued: true });
        doc.fillColor("#3f3f3f").font('Helvetica-Bold').fontSize(12).text(nombre);
        doc.moveDown(1);

        doc.fillColor(green).fontSize(12).font('Helvetica-Bold').text('Fecha: ', { continued: true });
        doc.fillColor("#3f3f3f").font('Helvetica-Bold').fontSize(12).text(fecha);
        doc.moveDown(2);

        drawSection(doc, "Hotel Transfer", hotelTransfer, i => i.hotelTransfer_name || "-", i => i.hotelTransfer_calificacion || "-");
        drawComment(doc, "Comentario Hotel Transfer", comentarioHotelTransfer);
        drawLine(doc); doc.moveDown(2);

        drawSection(doc, "Tours y Guías", tours, i => i.tours_name || "-", i => i.tours_calificacion || "-");
        drawComment(doc, "Comentario Tours Guia", comentariosToursGuia);
        drawLine(doc); doc.moveDown(2);

        drawSection(doc, "Hoteles", hotel, i => `${i.hotel_ubicacion || "-"} - ${i.hotel_name || "-"}`, i => i.hotel_calificacion || "-");
        drawComment(doc, "Comentario Hotel", comentarioHotel);
        drawLine(doc); doc.moveDown(2);

        drawSection(doc, "Restaurantes", restaurantes, i => `${i.restaurante_ubicacion || "-"} - ${i.restaurante_name || "-"}`, i => i.restaurante_calificacion || "-");
        drawComment(doc, "Comentario Restaurantes", comentarioRestaurante);
        drawLine(doc); doc.moveDown(2);

        drawComment(doc, "Comentarios Generales", comentario); doc.moveDown(2);

        checkPageBreak(doc);
        doc.fillColor(green).fontSize(10).font("Helvetica-Bold").text('Email: ', { continued: true });
        doc.fillColor("#3f3f3f").font("Helvetica-Bold").text(email || '-');
        doc.moveDown(4);

        doc.fillColor("#1f1f1f").font("Helvetica-Bold").fontSize(12).text(`Calificación general: ${calificacion} /10`, { align: "center" });
        doc.moveDown(2);
        doc.fillColor("#646464").fontSize(9).text("Fiesta Tours Peru & Peru Luxury Journeys", { align: "center" });

        doc.end();
    });
}

function generarHTML({ nombre, email, fecha, hotelTransfer, restaurantes, tours, hotel,
    comentarioHotelTransfer, comentarioRestaurante, comentarioHotel,
    comentariosToursGuia, comentario, calificacion }) {

    const filas = (arr, getCols) =>
        arr.map(i => {
            const [left, right] = getCols(i);
            return `<tr><td style="padding:6px 0; border-bottom:1px solid #eee;">${left}</td><td align="right" style="padding:6px 0; border-bottom:1px solid #eee; font-weight:bold;">${right}</td></tr>`;
        }).join("");

    const bloqueSec = (titulo, arr, getCols) => `<tr><td><h3 style="color:#2e7d32;">${titulo}</h3><table width="100%" cellpadding="0" cellspacing="0">${filas(arr, getCols)}</table></td></tr>`;

    const bloqueComentario = (titulo, texto) => `<tr><td style="padding-top:10px;"><h3 style="color:#2e7d32;">${titulo}</h3><div style="background:#f9fbf9; border-left:4px solid #2e7d32; padding:10px; border-radius:6px; font-size:14px;">${texto || "<i style='color:#999;'>Sin comentarios</i>"}</div></td></tr>`;

    const separador = `<tr><td style="border-bottom:1px solid gray; padding-top:15px;"></td></tr>`;

    return `
    <div style="background:#f4f6f5; padding:20px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;">
    <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:20px;">
      <tr><td align="center" style="padding-bottom:10px;"><h2 style="color:#2e7d32; margin:0;">RESUMEN DE EVALUACIÓN</h2></td></tr>
      <tr><td align="start" style="font-size:14px; color:#555;"><br><strong><span style="color:green">Nombre: </span>${nombre}</strong><br><strong><span style="color:green">Fecha: </span>${fecha}</strong></td></tr>
      ${bloqueSec("Hotel Transfer", hotelTransfer, i => [i.hotelTransfer_name || "-", i.hotelTransfer_calificacion || "-"])}
      ${bloqueComentario("Comentario Hotel Transfer", comentarioHotelTransfer)} ${separador}
      ${bloqueSec("Tours y Guías", tours, i => [i.tours_name || "-", i.tours_calificacion || "-"])}
      ${bloqueComentario("Comentario Tours", comentariosToursGuia)} ${separador}
      ${bloqueSec("Hoteles", hotel, i => [`${i.hotel_ubicacion || "-"} - ${i.hotel_name || "-"}`, i.hotel_calificacion || "-"])}
      ${bloqueComentario("Comentario Hotel", comentarioHotel)} ${separador}
      ${bloqueSec("Restaurantes", restaurantes, i => [`${i.restaurante_ubicacion || "-"} - ${i.restaurante_name || "-"}`, i.restaurante_calificacion || "-"])}
      ${bloqueComentario("Comentario Restaurante", comentarioRestaurante)} ${separador}
      <tr><td><h3 style="color:#2e7d32;">Comentarios</h3><div style="background:#f4f6f5; border:1px solid #e0e0e0; padding:12px; border-radius:6px; font-size:14px;">${comentario || "<i style='color:#999;'>Sin comentarios</i>"}</div></td></tr>
      <tr><td><h3 style="color:#105A40;">Email</h3><div style="background:#f4f6f5; border:1px solid #e0e0e0; padding:12px; border-radius:6px; font-size:14px;">${email || "-"}</div></td></tr>
      <tr><td height="15"></td></tr>
      <tr><td align="center"><h3 style="color:#2e7d32; margin:0;">Calificación general: ${calificacion}</h3></td></tr>
      <tr><td height="20"></td></tr>
      <tr><td align="center" style="font-size:12px; color:#888;">Fiesta Tours Peru & Peru Luxury Journeys</td></tr>
    </table>
    </td></tr>
    </table>
    </div>`;
}

const handleEvaluacion = async (req, res) => {
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
            to: "repevacusco@gmail.com, marco.paredes@fiestatoursperu.com, milagros.tataje@fiestatoursperu.com",
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
};

module.exports = { handleEvaluacion };