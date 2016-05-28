import { WALLET_UNLOCK_ERROR } from '../constants/error.js'

export const walletUnlockError = (err) => ({
	type: WALLET_UNLOCK_ERROR,
	err,
})
