// TODO: Add correct email content
const html = (params) => ({
  subject: 'Password Reset Request',
  body: `
    <h1>Dear ${params.userName}.</h1>
    <p>Please follow this link to reset your password: 
      <a href='${params.url}' title='Reset your password'>Reset your password</a>
    </p>
  `,
})

const text = (params) => ({
  subject: 'Password Reset Request',
  body: `
    Dear ${params.userName}.\n
    Please follow this link to reset your password: ${params.url}\n
  `,
})

export {
  html,
  text,
}
