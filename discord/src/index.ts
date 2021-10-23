import dotenv from 'dotenv'
import Espresso from './espresso'
import { version } from '../package.json'

dotenv.config()

const esp = new Espresso(version, {
  acceptedGms: process.env.ACCEPTED_GMS!.split(','),
  channelId: process.env.CHANNEL_ID!,
  clusterEndpoint: process.env.CLUSTER_ENDPOINT!,
  keypairPath: process.env.KEYPAIR_PATH!
})

esp.initialize().then(() => esp.run(process.env.DISCORD_TOKEN!))
