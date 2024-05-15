const { dataReturn } = require('../helpers/constants');
const nodemailer = require('nodemailer');

const SendEmail = async (req, res) => {
  // Verifica si el cuerpo de la solicitud contiene los datos necesarios
  if (!req.body.envio || !req.body.correo) {
    return res.status(400).json({ error: 'Los datos de envío y el correo electrónico son obligatorios.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: 'halconet@tractozone.com.mx',
        pass: 'tracto2017',
      },
    });

    const info = await transporter.sendMail({
      from: '"Halconet 👻" <halconet@tractozone.com.mx>', // Dirección del remitente
      to: req.body.correo, // Dirección del destinatario obtenida del cuerpo de la solicitud
      subject: 'Envio te correo test API', // Asunto
      text: req.body.envio, // Cuerpo del mensaje en texto plano, obtenido del cuerpo de la solicitud
      html: `<b>${req.body.envio}</b>`, // Cuerpo del mensaje en HTML, obtenido del cuerpo de la solicitud
    });

    res.json('Envío correcto');
    console.log('Mensaje enviado: %s', info.messageId);
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar el correo electrónico', details: error });
  }
};





module.exports = {
    SendEmail
};
