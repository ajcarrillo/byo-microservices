import winston from 'winston'

const { createLogger, format, transports } = winston
const { combine, timestamp, printf } = format

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`
})

const developmentLogger = () => {
  return createLogger({
    level: 'debug',
    format: combine(
      format.colorize(),
      timestamp(),
      logFormat,
    ),
    transports: [
      new transports.Console(),
    ],
  })
}

export default developmentLogger
