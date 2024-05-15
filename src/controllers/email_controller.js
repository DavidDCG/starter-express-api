const { dataReturn } = require('../helpers/constants');
const nodemailer = require('nodemailer');

const SendEmail = async (req, res) => {
  


  try {
    
  
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: "halconet@tractozone.com.mx",
          pass: "tracto2017",
        },
      });

       // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Maddison Foo Koch 👻" <halconet@tractozone.com.mx>', // sender address
        to: "david.cid@tractozone.com.mx", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });
    
      res.json("envio correcto");
      console.log("Message sent: %s", info.messageId);
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
   
    } catch (error) {
    
      res.json(error);

    }
  


};




module.exports = {
    SendEmail
};
