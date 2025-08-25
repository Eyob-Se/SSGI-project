import nodemailer from "nodemailer";

const MAIL_USER = "ayanoeyob346@gmail.com";
const MAIL_PASS = "hrnlankkbmkcuwwx"; // Gmail app password

export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"COR GIS System" <${MAIL_USER}>`,
    to,
    subject,
    text: text || undefined,
    html: html || undefined,
  };

  return transporter.sendMail(mailOptions);
};
