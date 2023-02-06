import mailer from 'nodemailer'

import logger from '../logger/index.js'

/**
 * Creates an email transporter object
 * @return {mailer.Transporter}
 */
const createMailerTransport = () => {
  try {
    const transporter = mailer.createTransport({
      host: process.env.NOREPLY_EMAIL_SERVER,
      // port: 25,
      // secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.NOREPLY_EMAIL_USER,
        pass: process.env.NOREPLY_EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    })

    return transporter
  } catch (e) {
    logger.error(`email-lib: Failed to create Mailer Transport: ${e}`)
    return null
  }
}

/**
 * Sends an email
 * @param {string} email The recipient email address
 * @param {string} subject The email subject
 * @param {string} messageHTML The email as HTML
 * @param {string} messageText The email as plain text
 * @return {Promise}
 */
const sendEmail = (email, subject, messageHTML, messageText) => {
  return new Promise(async (resolve, reject) => {
    try {
      const transporter = createMailerTransport()
      if (transporter) {
        const info = await transporter.sendMail({
          from: `"${process.env.NOREPLY_EMAIL_NAME}" <${process.env.NOREPLY_EMAIL_USER}>`,
          to: email,
          subject: subject,
          text: messageText,
          html: messageHTML,
        })
        resolve(info)
      } else {
        throw new Error('FAILED_TO_CREATE_EMAIL_TRANSPORTER')
      }
    } catch (e) {
      logger.error(`email-lib: Failed to send email: ${e}`)
      reject(e)
    }
  })
}

/**
 * Generate an email content from the given type and language
 * @param {string} type The email type
 * @param {string} lang The language
 * @param {Object} params An Object containing params to inject into the email body
 * @return {Object}
 */
const generateEmailContent = (type, lang, params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { html, text } = await import(`../resources/email_templates/${type}-${lang}.js`)
      const htmlEmail = html(params)
      const textEmail = text(params)
      resolve({htmlEmail, textEmail})
    } catch (e) {
      logger.error(`email-lib: Failed to import ${type}-${lang} email template: ${e}`)
      reject(new Error('FAILED_TO_IMPORT_EMAIL_TEMPLATE'))
    }
  })
}

export {
  createMailerTransport,
  generateEmailContent,
  sendEmail,
}
