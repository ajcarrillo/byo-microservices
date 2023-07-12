import { MailService } from '@sendgrid/mail'

import logger from '../logger/index.js'

/**
 * Creates a SendGrid email client
 * @return {any}
 */
const createSendGridClient = () => {
  try {
    const sendgridClient = new MailService()
    sendgridClient.setApiKey(process.env.SENDGRID_API_KEY || '')
    return sendgridClient
  } catch (e) {
    logger.error(`email-lib: Failed to create SendGrid client: ${e}`)
    return null
  }
}

/**
 * Sends an email using SendGrid service
 * @param {string} emailAddress The recipient email address
 * @param {string} subject The email subject
 * @param {string} messageHTML The email as HTML
 * @param {string} messageText The email as plain text
 * @return {Promise}
 */
const sendEmail = (emailAddress, subject, messageHTML, messageText) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sendGrid = createSendGridClient()
      if (sendGrid) {
        const msg = {
          to: emailAddress,
          from: process.env.NOREPLY_EMAIL_ADDRESS || '',
          subject: subject,
          text: messageText,
          html: messageHTML,
        }
        const result = await sendGrid.send(msg)
        resolve(result)
      } else {
        throw new Error('FAILED_TO_CREATE_SENDGRID_CLIENT')
      }
    } catch (e) {
      logger.error(`email-lib: Failed to send email with SendGrid: ${e}`)
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
  generateEmailContent,
  sendEmail,
}
