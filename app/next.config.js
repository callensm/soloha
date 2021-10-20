const withTM = require('next-transpile-modules')([
  '@solana/wallet-adapter-base',
  '@solana/wallet-adapter-react',
  '@solana/wallet-adapter-ledger',
  '@solana/wallet-adapter-phantom',
  '@solana/wallet-adapter-sollet',
  '@solana/wallet-adapter-slope',
  '@solana/wallet-adapter-wallets'
])

module.exports = withTM({
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    return config
  }
})
