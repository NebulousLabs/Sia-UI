export const REGULAR_COMMAND = -1
export const WALLET_SEED = 0
export const WALLET_UNLOCK = 1
export const WALLET_033X = 2
export const WALLET_SIAG = 3
export const HELP = 4
export const HELP_QMARK = 5

//These commands need a password prompt or other special handling.
export const specialCommands = [
	['wallet', 'load', 'seed'],
	['wallet', 'unlock'],
	['wallet', 'load', '033x'],
	['wallet', 'load', 'siag'],
	['help'],
	['?'],
]
