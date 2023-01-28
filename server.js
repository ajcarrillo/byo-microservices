import { createServer } from 'http'

import app from './app.js'

const port = process.env.PORT || 4000
const server = createServer(app)

server.listen(port)
