const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // replace with your email
    pass: 'your-app-password'     // replace with an app password
  }
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: '"FlowStock Admin" <your-email@gmail.com>',
    to,
    subject,
    html
  });
};

module.exports = sendEmail;
