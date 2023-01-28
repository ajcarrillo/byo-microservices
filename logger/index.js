import developmentLogger from './development-logger.js'
import productionLogger from './production-logger.js'

let logger = null

if (process.env.NODE_ENV === 'development') {
  logger = developmentLogger()
} else {
  logger = productionLogger()
}

export default logger
