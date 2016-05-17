// locking.js: wallet locking actions
import * as constants from '../constants/locking.js';

export const getLockStatus = () => ({
	type: constants.GET_LOCK_STATUS,
});
export const lockWallet = () => ({
	type: constants.LOCK_WALLET,
});
export const unlockWallet = () => ({
	type: constants.UNLOCK_WALLET,
});
