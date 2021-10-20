const withLess = require('next-with-less')
const withTM = require('next-transpile-modules')([
  '@solana/wallet-adapter-base',
  '@solana/wallet-adapter-react',
  '@solana/wallet-adapter-ledger',
  '@solana/wallet-adapter-phantom',
  '@solana/wallet-adapter-sollet',
  '@solana/wallet-adapter-slope',
  '@solana/wallet-adapter-wallets'
])

/** @type {import('next').NextConfig} */
module.exports = withTM(
  withLess({
    lessLoaderOptions: {
      lessOptions: {
        modifyVars: {
          'primary-color': 'rgb(111, 116, 201)'
        }
      }
    },
    reactStrictMode: true,
    poweredByHeader: false,
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback.fs = false
      }
      return config
    }
  })
)
