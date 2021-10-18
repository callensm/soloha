import * as anchor from '@project-serum/anchor'

module.exports = async function (provider: anchor.Provider) {
  anchor.setProvider(provider)
}
