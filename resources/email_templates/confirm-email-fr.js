// TODO: Add correct email content
const html = (params) => ({
  subject: 'Please Confirm Your Email',
  body: `
    <h1>Thank you for signing up ${params.userName}.</h1>
    <p>Please follow this link to confirm your email address: 
      <a href='${params.url}' title='Confirm your email address'>Confirm your email address</a>
    </p>
  `,
})

const text = (params) => ({
  subject: 'Please Confirm Your Email',
  body: `
    Thank you for signing up ${params.userName}.\n
    Please follow this link to confirm your email address: ${params.url}\n
  `,
})

export {
  html,
  text,
}
