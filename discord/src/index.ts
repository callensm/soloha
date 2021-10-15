// import { web3 } from '@project-serum/anchor'
import Captain from './captain'
import { version } from '../package.json'

const captain = new Captain(version, {
  channelId: '',
  clusterEndpoint: 'http://localhost:8899', // web3.clusterApiUrl('testnet'),
  keypairPath: '',
  programId: ''
})

captain.initialize().then(() => captain.run(process.env.DISCORD_TOKEN as string))
