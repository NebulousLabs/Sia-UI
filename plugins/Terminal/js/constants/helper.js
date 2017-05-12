export const REGULAR_COMMAND = -1
export const WALLET_SEED = 0
export const WALLET_INIT_SEED = 1
export const WALLET_UNLOCK = 2
export const WALLET_033X = 3
export const WALLET_SIAG = 4
export const HELP = 5
export const HELP_QMARK = 6

//These commands need a password prompt or other special handling.
export const specialCommands = [
	['wallet', 'load', 'seed'],
	['wallet', 'init-seed'],
	['wallet', 'unlock'],
	['wallet', 'load', '033x'],
	['wallet', 'load', 'siag'],
	['help'],
	['?'],
]
