import { HANDLE_PASSWORD_CHANGE } from '../constants/passwordprompt.js';

export const handlePasswordChange = (password) => ({
	type: HANDLE_PASSWORD_CHANGE,
	password,
});
