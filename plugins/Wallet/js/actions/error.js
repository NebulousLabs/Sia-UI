import { SIAD_ERROR } from '../constants/error.js';

export const siadError = (err) => ({
	type: SIAD_ERROR,
	err,
});
