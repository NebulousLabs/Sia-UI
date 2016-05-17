// locking.js: wallet locking actions
import * as constants from '../constants/locking.js';

export const getLockStatus = () => ({
	type: constants.GET_LOCK_STATUS,
});
