import { join } from 'path'
import winston from 'winston'

const { createLogger, format, transports } = winston
const { combine, timestamp } = format

const productionLogger = () => {
  const errorLogFile = join(process.env.SERVER_ROOT_FOLDER, 'logs', 'error.log')
  const combinedLogFile = join(process.env.SERVER_ROOT_FOLDER, 'logs', 'combined.log')

  return createLogger({
    level: 'info',
    format: combine(
      timestamp(),
      format.json(),
    ),
    transports: [
      new transports.File({ filename: errorLogFile, level: 'error' }),
      new transports.File({ filename: combinedLogFile }),
    ],
  })
}

export default productionLogger
