const PDFDocument = require('pdfkit');
const { transporter, USER_1 } = require('../config/mailer');

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwHQD1Djs9fR-dkY1ORNEH2TJp-On_mMXupgut0VtvGHJ0mTUVPAEdLBjx8D8IfvUKSPA/exec';

// --- GENERADOR DE PDF ---
function generarPDF(datos) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 0, size: 'A4', bufferPages: true });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end',  () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const PAGE_W  = doc.page.width;   
    const PAGE_H  = doc.page.height;
    const L = 40;  
    const R = 555; 
    const COL_W = R - L;

    const {
      fecha, nombreContacto, emailContacto, ejecutivo, referencia,
      doble_dos_camas, dobleMatrimonial, suiteFamiliar, individual,
      adultos, ninos, aceptaCheck, copiaPasaporte, pasajeros,
    } = datos;

    const dibujarPie = () => {
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.rect(0, PAGE_H - 28, PAGE_W, 28).fill('#ffffff');
        doc.fillColor('#555555').fontSize(7)
          .text(
            `© ${new Date().getFullYear()} Fiesta Tours Peru — Documento generado automáticamente`,
            L, PAGE_H - 18, { width: COL_W, align: 'center' }
          );
      }
    };

    doc.rect(0, 0, PAGE_W, 72).fill('#ffffff');
    doc.fillColor('#2a4e33').fontSize(20).font('Helvetica-Bold')
      .text('Registro de Cliente', L, 34, { width: COL_W, align: 'start' });
    
    try {
      doc.image('path/logo-fti.png', L * 7, 15, { width: 280 });
    } catch (e) {
      // Evita interrupciones si no se encuentra la imagen
    }

    let curY = 90;

    const seccion = (titulo) => {
      curY += 10;
      doc.rect(L, curY, COL_W, 20).fill('#ffffff');
      doc.rect(L, curY, 4, 15).fill('#93a89c');
      doc.fillColor('#1a1a1a').fontSize(10).font('Helvetica-Bold')
        .text(titulo.toUpperCase(), L + 12, curY + 5, { width: COL_W - 12, characterSpacing: 1 });
      curY += 26;
    };

    let filaIndex = 0;
    const fila = (label, valor, esSubtitulo = false) => {
      const h    = 20;
      const lw   = Math.round(COL_W * 0.38);
      const vw   = COL_W - lw;
      const bg   = esSubtitulo ? '#9dc5ae' : (filaIndex % 2 === 0 ? '#ffffff' : '#fafafa');
      const textColor = esSubtitulo ? '#1a1a1a' : '#2c2c2c';

      doc.rect(L, curY, COL_W, h).fill(bg);
      doc.rect(L, curY + h - 0.5, COL_W, 0.5).fill('#e8e8e8');

      if (esSubtitulo) {
        doc.fillColor('#1a1a1a').fontSize(8).font('Helvetica-Bold')
          .text(label, L + 8, curY + 6, { width: COL_W - 8 });
      } else {
        doc.fillColor('#888888').fontSize(7.5).font('Helvetica')
          .text(label, L + 8, curY + 7, { width: lw - 8 });
        doc.fillColor(textColor).fontSize(9).font('Helvetica-Bold')
          .text(valor || '—', L + lw + 6, curY + 6, { width: vw - 10 });
      }

      curY += h;
      if (!esSubtitulo) filaIndex++;

      if (curY > PAGE_H - 68) {
        doc.addPage({ margin: 0, size: 'A4' });
        doc.rect(0, 0, PAGE_W, 32).fill('#ffffff');
        doc.fillColor('#D9B244').fontSize(7).font('Helvetica-Bold')
          .text('FIESTA TOURS PERU', L, 10, { width: COL_W, align: 'start', characterSpacing: 2 });
        doc.fillColor('#2a4e33').fontSize(11).font('Helvetica-Bold')
          .text('Registro de Cliente — continuación', L, 18, { width: COL_W, align: 'start' });
        curY = 46;
        filaIndex = 0;
      }
    };

    seccion('Datos de Contacto');
    filaIndex = 0;
    fila('Fecha',      fecha);
    fila('Nombre',     nombreContacto);
    fila('Email',      emailContacto);
    fila('Ejecutivo',  ejecutivo);
    fila('Referencia', referencia);

    seccion('Habitaciones');
    filaIndex = 0;
    curY += 4;
    const hHab = 20;
    const halfW = COL_W / 2;
    doc.rect(L,           curY, halfW, hHab).fill('#ffffff');
    doc.rect(L + halfW,   curY, halfW, hHab).fill('#ffffff');
    doc.rect(L, curY + hHab - 0.5, COL_W, 0.5).fill('#ffffff');
    doc.fillColor('#888888').fontSize(7.5).font('Helvetica').text('Adultos',  L + 8,          curY + 3, { width: 50 });
    doc.fillColor('#1a1a1a').fontSize(9).font('Helvetica-Bold').text(adultos || '1', L + 60,  curY + 3);
    doc.fillColor('#888888').fontSize(7.5).font('Helvetica').text('Niños',    L + halfW + 8,  curY + 3, { width: 50 });
    doc.fillColor('#1a1a1a').fontSize(9).font('Helvetica-Bold').text(ninos || '0', L + halfW + 60, curY + 3);
    curY += hHab + 4;

    const habGrid = [
      ['Doble (dos camas)', doble_dos_camas],
      ['Doble matrimonial', dobleMatrimonial],
      ['Suite familiar',    suiteFamiliar],
      ['Individual',        individual],
    ];
    habGrid.forEach(([lbl, val]) => fila(lbl, val));

    if (pasajeros && pasajeros.length > 0) {
      seccion('Pasajeros');
      const colWidths = { tit: 40, nom: 110, ape: 110, pas: 85, nac: 85, fNac: 85 };
      const colX = {
        tit: L,
        nom: L + colWidths.tit,
        ape: L + colWidths.tit + colWidths.nom,
        pas: L + colWidths.tit + colWidths.nom + colWidths.ape,
        nac: L + colWidths.tit + colWidths.nom + colWidths.ape + colWidths.pas,
        fNac: L + colWidths.tit + colWidths.nom + colWidths.ape + colWidths.pas + colWidths.nac
      };
      const rowH = 20; 

      doc.rect(L, curY, COL_W, rowH).fill('#9dc5ae');
      doc.fillColor('#1a1a1a').fontSize(8).font('Helvetica-Bold');
      doc.text('Tít.',     colX.tit + 4,  curY + 6, { width: colWidths.tit - 4 });
      doc.text('Nombre',   colX.nom + 4,  curY + 6, { width: colWidths.nom - 4 });
      doc.text('Apellido', colX.ape + 4,  curY + 6, { width: colWidths.ape - 4 });
      doc.text('Pasaporte',colX.pas + 4,  curY + 6, { width: colWidths.pas - 4 });
      doc.text('Nacionalidad.',     colX.nac + 4,  curY + 6, { width: colWidths.nac - 4 });
      doc.text('F. Nacimiento.',  colX.fNac + 4, curY + 6, { width: colWidths.fNac - 4 });
      curY += rowH;

      pasajeros.forEach((p, index) => {
        if (curY > PAGE_H - 68) {
          doc.addPage({ margin: 0, size: 'A4' });
          doc.rect(0, 0, PAGE_W, 32).fill('#ffffff');
          doc.fillColor('#D9B244').fontSize(7).font('Helvetica-Bold').text('FIESTA TOURS PERU', L, 10, { width: COL_W, align: 'start', characterSpacing: 2 });
          doc.fillColor('#2a4e33').fontSize(11).font('Helvetica-Bold').text('Registro de Cliente — continuación pasajeros', L, 18, { width: COL_W, align: 'start' });
          curY = 46;
          doc.rect(L, curY, COL_W, rowH).fill('#9dc5ae');
          doc.fillColor('#1a1a1a').fontSize(8).font('Helvetica-Bold');
          doc.text('Tít.', colX.tit + 4, curY + 6);
          doc.text('Nombre', colX.nom + 4, curY + 6);
          doc.text('Apellido', colX.ape + 4, curY + 6);
          curY += rowH;
        }

        const bg = index % 2 === 0 ? '#ffffff' : '#fafafa';
        doc.rect(L, curY, COL_W, rowH).fill(bg);
        doc.fillColor('#2c2c2c').fontSize(8).font('Helvetica');
        doc.text(p.titulo || '—',       colX.tit + 4,  curY + 6, { width: colWidths.tit - 6, ellipsis: true });
        doc.text(p.nombre || '—',       colX.nom + 4,  curY + 6, { width: colWidths.nom - 6, ellipsis: true });
        doc.text(p.apellido || '—',     colX.ape + 4,  curY + 6, { width: colWidths.ape - 6, ellipsis: true });
        doc.text(p.pasaporte || '—',    colX.pas + 4,  curY + 6, { width: colWidths.pas - 6, ellipsis: true });
        doc.text(p.nacionalidad || '—', colX.nac + 4,  curY + 6, { width: colWidths.nac - 6, ellipsis: true });
        doc.text(p.fechaNac || '—',     colX.fNac + 4, curY + 6, { width: colWidths.fNac - 6, ellipsis: true });
        curY += rowH;
      });
    }
       
    seccion('Validacion');
    filaIndex = 0;
    fila('Acepta traer varias copias de sus pasaportes', aceptaCheck    ? 'Si' : 'No');
    fila('Pasaportes estaran vigentes durante los dias de viaje', copiaPasaporte ? 'Si' : 'No');

    dibujarPie();
    doc.end();
  });
}

// --- AUXILIARES DE CORREO HTML ---
const emailFila = (label, valor) =>
  valor && valor !== '-' && valor !== '0' ? `
  <tr>
    <td style="padding:9px 0;border-bottom:1px solid #f0f0f0;">
      <span style="color:#999;font-size:10px;letter-spacing:2px;text-transform:uppercase;display:block;">${label}</span>
      <span style="color:#1a1a1a;font-size:14px;">${valor}</span>
    </td>
  </tr>` : '';

const emailBase = (titulo, subtitulo, cuerpo) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 14px rgba(0,0,0,0.09);">
          <tr>
            <td style="background:#54705d;padding:30px 40px;text-align:start;">
              <p style="margin:0;color:#f3ca5b;font-size:12px;letter-spacing:3px;text-transform:uppercase;">Fiesta Tours Peru</p>
              <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:normal;letter-spacing:1px;">${titulo}</h1>
              ${subtitulo ? `<p style="margin:6px 0 0;color:#fdfdfd;font-size:12px;">${subtitulo}</p>` : ''}
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px;">${cuerpo}</td>
          </tr>
          <tr>
            <td style="background:#f9f9f9;padding:18px 40px;border-top:1px solid #eee;text-align:center;">
              <p style="margin:0;color:#bbb;font-size:10px;letter-spacing:1px;">
                © ${new Date().getFullYear()} Fiesta Tours Peru — Notificación automática
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

function buildEmailEjecutivo(d) {
  const cuerpo = `
    <p style="margin:0 0 20px;color:#555;font-size:15px;line-height:1.7;">Un nuevo cliente ha completado su registro. El detalle completo está adjunto en PDF.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-left:4px solid #645939;border-radius:4px;margin-bottom:24px;">
      <tr>
        <td style="padding:22px 26px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${emailFila('Nombre',     d.nombreContacto)}
            ${emailFila('Email',      `<a href="mailto:${d.emailContacto}" style="color:#3d6951;text-decoration:none;">${d.emailContacto}</a>`)}
            ${emailFila('Referencia', d.referencia)}
            ${emailFila('Fecha',      d.fecha)}
          </table>
        </td>
      </tr>
    </table>
    <p style="margin:0;color:#888;font-size:12px;line-height:1.6;">
      Adultos: <strong>${d.adultos}</strong> &nbsp;|&nbsp; Niños: <strong>${d.ninos}</strong> &nbsp;|&nbsp; Pasajeros registrados: <strong>${d.pasajeros.length}</strong>
    </p>`;
  return emailBase('Nuevo Registro de Cliente', `Referencia: ${d.referencia || '—'}`, cuerpo);
}

function buildEmailCliente(d) {
  const habs = [
    ['Doble (dos camas)',  d.doble_dos_camas],
    ['Doble matrimonial',  d.dobleMatrimonial],
    ['Suite familiar',     d.suiteFamiliar],
    ['Individual',         d.individual],
  ].filter(([, v]) => v && v !== '-' && v !== '0');

  const filasHab = habs.length 
    ? habs.map(([l, v]) => emailFila(l, v)).join('') 
    : `<tr><td style="padding:9px 0;color:#888;font-size:13px;">Sin habitaciones seleccionadas</td></tr>`;
    
  const filasPax = d.pasajeros.length 
    ? d.pasajeros.map((p, i) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
            <span style="color:#D9B244;font-size:10px;letter-spacing:2px;text-transform:uppercase;">Pasajero ${i + 1}</span><br/>
            <span style="color:#1a1a1a;font-size:14px;">${[p.titulo, p.nombre, p.apellido].filter(Boolean).join(' ')}</span>
            ${p.pasaporte ? `<br/><span style="color:#888;font-size:12px;">Pasaporte: ${p.pasaporte}</span>` : ''}
            ${p.nacionalidad ? `<span style="color:#888;font-size:12px;"> · ${p.nacionalidad}</span>` : ''}
          </td>
        </tr>`).join('') 
    : `<tr><td style="padding:9px 0;color:#888;font-size:13px;">Sin pasajeros registrados</td></tr>`;

  const cuerpo = `
    <p style="margin:0 0 6px;color:#1a1a1a;font-size:16px;">Estimado/a <strong>${d.nombreContacto}</strong>,</p>
    <p style="margin:0 0 28px;color:#555;font-size:14px;line-height:1.7;">Hemos recibido tu registro correctamente. A continuación encontrarás un resumen. El documento completo está adjunto en PDF.</p>
    
    <p style="margin:0 0 8px;color:#4f632f;font-size:11px;font-weight:900;letter-spacing:3px;text-transform:uppercase;">Datos generales</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border-left:4px solid #795c41;border-radius:4px;margin-bottom:28px;">
      <tr>
        <td style="padding:20px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${emailFila('Fecha de registro', d.fecha)}
            ${emailFila('Referencia', d.referencia)}
            ${emailFila('Adultos', d.adultos)}
            ${emailFila('Niños', d.ninos)}
          </table>
        </td>
      </tr>
    </table>
    
    <p style="margin:0 0 8px;color:#4f632f;font-size:11px;font-weight:900;letter-spacing:3px;text-transform:uppercase;">Habitaciones solicitadas</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border-left:4px solid #795c41;border-radius:4px;margin-bottom:28px;">
      <tr>
        <td style="padding:20px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${filasHab}
          </table>
        </td>
      </tr>
    </table>
    
    <p style="margin:0 0 8px;color:#4f632f;font-size:11px;font-weight:900;letter-spacing:3px;text-transform:uppercase;">Pasajeros</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;border-left:4px solid #795c41;border-radius:4px;margin-bottom:28px;">
      <tr>
        <td style="padding:20px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${filasPax}
          </table>
        </td>
      </tr>
    </table>`;
    
  return emailBase('Confirmación de Registro', `Folio: ${d.referencia || '—'}`, cuerpo);
}

async function handleCliente(req, res) {
  const {
    nombreContacto, emailContacto, correoDestino, referencia,
    doble_dos_camas, dobleMatrimonial, suiteFamiliar, individual,
    adultos, ninos, aceptaCheck, copiaPasaporte, pasajeros,
  } = req.body;

  if (!nombreContacto?.trim() || !emailContacto?.trim()) {
    return res.status(400).json({ ok: false, mensaje: 'El nombre y el email son requeridos.' });
  }

  const datosAEnviar = {
    fecha:           new Date().toLocaleString('es-PE'),
    nombreContacto,
    emailContacto,
    ejecutivo:       correoDestino,
    referencia,
    doble_dos_camas: doble_dos_camas  || '-',
    dobleMatrimonial: dobleMatrimonial || '-',
    suiteFamiliar:   suiteFamiliar    || '-',
    individual:      individual       || '-',
    adultos:         adultos          || '1',
    ninos:           ninos            || '0',
    aceptaCheck,
    copiaPasaporte,
    pasajeros:       pasajeros        || [],
  };

  try {
    const [pdfBuffer, sheetResult] = await Promise.all([
      generarPDF(datosAEnviar),
      fetch(GOOGLE_SCRIPT_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(datosAEnviar),
      }).then((r) => {
        if (!r.ok) throw new Error(`Google Sheets error: ${r.status}`);
        return r.json();
      }),
    ]);

    const pdfAdjunto = {
      filename:    `registro_${nombreContacto.replace(/\s+/g, '_')}.pdf`,
      content:     pdfBuffer,
      contentType: 'application/pdf',
    };

    await Promise.all([
      transporter.sendMail({
        from:        `"Fiesta Tours Peru" <${USER_1}>`,
        to:          "luistasayco3030@gmail.com",
        subject:     `Nuevo Registro — ${nombreContacto}`,
        html:        buildEmailEjecutivo(datosAEnviar),
        attachments: [pdfAdjunto],
      }),
      transporter.sendMail({
        from:        `"Fiesta Tours Peru" <${USER_1}>`,
        to:          emailContacto,
        subject:     `Confirmación de tu registro — ${referencia || nombreContacto}`,
        html:        buildEmailCliente(datosAEnviar),
        attachments: [pdfAdjunto], // Se incluye también al cliente por consistencia
      }),
    ]);

    return res.status(200).json({
      ok:       true,
      receptor: correoDestino,
      mensaje:  'Datos enviados correctamente.',
      resultado: sheetResult,
    });

  } catch (error) {
    console.error('[/cliente]', error);
    return res.status(500).json({ ok: false, error: error.message });
  }
}

module.exports = { handleCliente };