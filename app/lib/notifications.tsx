import { web3 } from '@project-serum/anchor'
import { notification } from 'antd'

/**
 * Display an Antd success notification with a link
 * to the transaction signature on SolScan
 * @param {string} signature
 * @param {web3.Cluster | undefined} [cluster]
 */
export function notifySolScan(signature: string, cluster?: web3.Cluster) {
  let clusterParam: string = ''
  if (cluster) {
    clusterParam = `?cluster=${cluster}`
  }

  notification.success({
    message: 'Transaction Success',
    description: (
      <a
        target="_blank"
        rel="noreferrer"
        href={`https://solscan.io/tx/${signature}${clusterParam}`}
      >
        View on SolScan
      </a>
    ),
    placement: 'bottomLeft',
    duration: 10
  })
}

/**
 * Display an Antd error notification for fetching
 * global program state account data from on-chain
 * @export
 * @param {Error} err
 */
export function notifyStateFetchError(err: Error) {
  notification.error({
    message: 'State Fetch Error',
    description: (err as Error).message,
    placement: 'bottomLeft',
    duration: 10
  })
}

/**
 * Display an Antd error notification with the
 * transaction error message for the user to see
 * @param {Error} err
 */
export function notifyTransactionError(err: Error) {
  notification.error({
    message: 'Transaction Error',
    description: (err as Error).message,
    placement: 'bottomLeft',
    duration: 10
  })
}

/**
 * Display an Antd error notification for fetching
 * user data from on-chain
 * @export
 * @param {Error} err
 */
export function notifyUserFetchError(err: Error) {
  notification.error({
    message: 'User Fetch Error',
    description: (err as Error).message,
    placement: 'bottomLeft',
    duration: 10
  })
}

/**
 * Displays an Antd notification alerting the user of
 * connection status changes with their browser wallet
 * @export
 * @param {boolean} connected
 */
export function notifyWalletConnectionStatus(connected: boolean) {
  connected
    ? notification.success({
        message: 'Wallet Connected',
        placement: 'bottomLeft',
        duration: 10
      })
    : notification.warning({
        message: 'Wallet Disconnected',
        placement: 'bottomLeft',
        duration: 10
      })
}
