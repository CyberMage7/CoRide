const nodemailer = require("nodemailer")

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false,
    })

    let info = await transporter.sendMail({
      from: `"Co-Rider" <${process.env.MAIL_USER}>`, // sender address
      to: `${email}`, // list of receivers
      subject: `${title}`, // Subject line
      html: `${body}`, // html body
    })
    console.log(info.response)
    return info
  } catch (error) {
    console.log(error.message)
    return error.message
  }
}

module.exports = mailSender

// import nodemailer from "nodemailer"
// import dotenv from "dotenv"

// dotenv.config()

// Create a transporter
// const transporter = nodemailer.createTransport({
//   service: process.env.EMAIL_SERVICE,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// })

// /**
//  * Send an email
//  * @param {Object} options - Email options
//  * @param {string} options.to - Recipient email
//  * @param {string} options.subject - Email subject
//  * @param {string} options.html - Email HTML content
//  * @returns {Promise} - Resolves with info about the sent email
//  */
// export const sendEmail = async (options) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL_FROM,
//       to: options.to,
//       subject: options.subject,
//       html: options.html,
//     }

//     const info = await transporter.sendMail(mailOptions)
//     console.log("Email sent: ", info.messageId)
//     return info
//   } catch (error) {
//     console.error("Error sending email:", error)
//     throw error
//   }
// }

