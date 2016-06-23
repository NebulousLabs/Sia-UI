import BigNumber from 'bignumber.js'

export const chooseFileLocation = function() {
	return SiaAPI.openFile({
		title: 'Choose new storage location.',
		properties: [ 'openDirectory' ],
	})[0]
}

export const hastingsByteToSCTB = (hastings) => (
	SiaAPI.hastingsToSiacoins(hastings).times('1e12')
)

export const SCTBToHastingsByte = (SC) => (
	SiaAPI.siacoinsToHastings(SC).dividedBy('1e12')
)

export const validNumbers = (values) => (
	//Expects array of dict, first is value, second is minimum.
	values.reduce((isValid, val) => (!isNaN(val.val) && val.val > val.min) && isValid, true)
)

export const hastingsByteBlockToSCTBMonth = (hastings) => (
	hastingsByteToSCTB(hastings).times('4320') //4320 = blocks per month
)

export const SCTBMonthToHastingsByteBlock = (SC) => (
	SCTBToHastingsByte(SC).dividedBy('4320') //4320 = blocks per month
)

export const blocksToWeeks = (blocks) => (
	(new BigNumber(blocks)).dividedBy('1008') //1008 = blocks per week
)

export const weeksToBlocks = (weeks) => (
	(new BigNumber(weeks)).times('1008') //1008 = blocks per week
)
