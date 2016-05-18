// locking.js: wallet locking actions
import * as constants from '../constants/locking.js';

export const getLockStatus = () => ({
	type: constants.GET_LOCK_STATUS,
});
export const setLocked = () => ({
	type: constants.SET_LOCKED,
});
export const setUnlocked = () => ({
	type: constants.SET_UNLOCKED,
});
export const showPasswordPrompt = () => ({
	type: constants.SHOW_PASSWORD_PROMPT,
});
export const unlockWallet = (password) => ({
	type: constants.UNLOCK_WALLET,
	password,
});