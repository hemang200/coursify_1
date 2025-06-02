import nodemailer from "nodemailer";

// Create a test account or replace with real credentials.
const sendEmail = async function (email, subject, message){
    // Create a transporter object using the default SMTP transport.
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
        },
});


// send mail with defined transport object
    
    await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL, // sender address
    to: email,
    subject: subject,
    html: message, // HTML body
  });
};

  export default sendEmail;
  