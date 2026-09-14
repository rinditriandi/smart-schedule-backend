const nodemailer = require("nodemailer")
const fs = require('fs')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465 ? true : false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

const sendEmail = ({ from, to, cc, subject, html, attachments = undefined, deleteFiles = false }) => {
  return new Promise(async (resolve, reject) => {
    try {
      await transporter.sendMail({
        from,
        to,
        cc: Array.isArray(cc) ? cc : undefined,
        subject,
        html,
        attachments
      })

      if (deleteFiles === true && attachments && Array.isArray(attachments)) {
        attachments.forEach(item => {
          fs.unlinkSync(item?.path)
        })
      }

      resolve('Success send email for create new user')
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

module.exports = { sendEmail }