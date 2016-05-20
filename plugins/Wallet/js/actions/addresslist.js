import * as constants from '../constants/addresslist.js';

export const getAddresses = () => ({
	type: constants.GET_ADDRESSES,
});
export const setAddresses = (addresses) => ({
	type: constants.SET_ADDRESSES,
	addresses,
});
