import winston from 'winston'
import { S3StreamLogger } from 's3-streamlogger'
import aws from 'aws-sdk'

const { createLogger, format } = winston
const { combine, timestamp } = format

const productionLogger = () => {
  const s3Stream = new S3StreamLogger({
    bucket: process.env.BYOWAVE_SERVICE_LOGS_BUCKET_NAME,
    config: {
      endpoint: new aws.Endpoint(process.env.BYOWAVE_SERVICE_LOGS_BUCKET_ENDPOINT),
      credentials: {
        secretAccessKey: process.env.BYOWAVE_RESOURCES_PROTEUS_SECRET_KEY,
        accessKeyId: process.env.BYOWAVE_RESOURCES_PROTEUS_ACCESS_KEY,
      },
    },
    tags: {type: 'mytype', project: 'myproject'},
  })

  const s3Transport = new winston.transports.Stream({
    stream: s3Stream,
  })

  s3Transport.on('error', function(err) {
    console.log(err)
  })

  return createLogger({
    level: 'error',
    format: combine(
      timestamp(),
      format.json(),
    ),
    transports: [
      s3Transport,
    ],
  })
}

export default productionLogger
