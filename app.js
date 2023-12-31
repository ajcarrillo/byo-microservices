import express, { static as isStatic, raw, urlencoded, json } from 'express'
import morgan from 'morgan'

import adminRoutes from './api/controllers/admin.js'
import mediaRoutes from './api/controllers/media.js'
import stripeRoutes from './api/controllers/stripe.js'
import authRoutes from './api/controllers/auth.js'
import controllerRoutes from './api/controllers/controllers.js'
import proteusRoutes from './api/controllers/proteus.js'
import shopRoutes from './api/controllers/shop.js'
import userProfileRoutes from './api/controllers/user-profile.js'
import communityRoutes from './api/controllers/community.js'

const app = express()

// API Call Logging
app.use(morgan('dev'))

// Static folders
app.use('/public', isStatic('public'))

// Parsing api calls
app.use('/api/stripe/webhook', raw({type: '*/*'}))
app.use(urlencoded({ extended: false }))
app.use(json())

// CORS - must set headers before routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', `${process.env.SITE_DOMAIN}`)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', `${process.env.SITE_DOMAIN}`)
    // Methods our API supports
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE')
    return res.status(200).json({})
  }
  next()
})

// API Routes
app.use('/api/admin', adminRoutes)
app.use('/api/media', mediaRoutes)
app.use('/api/stripe', stripeRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/controllers', controllerRoutes)
app.use('/api/proteus', proteusRoutes)
app.use('/api/shop', shopRoutes)
app.use('/api/user', userProfileRoutes)
app.use('/api/community', communityRoutes)

// Route error handling
app.use((req, res, next) => {
  const error = new Error('RESOURCE_NOT_FOUND')
  error.status = 404
  next(error)
})

// Catch errors anywhere in the app
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    error: {
      message: err.message,
      code: err.status || 500,
    },
  })
})

export default app
