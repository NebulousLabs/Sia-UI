import { Map, List } from 'immutable'
import BigNumber from 'bignumber.js'

// Announce host on the network
const announce = function (settings, callback) {
	settings = settings || null;
	SiaAPI.call({
		url: '/host/announce',
		method: 'POST',
		qs: settings,
	}, callback);
}

export const chooseFileLocation = function (){
	return SiaAPI.openFile({
			title: "Choose new storage location.",
			properties: [ "openDirectory" ]
		})[0]
}

export const hastingsByteToSCTB = (hastings) => (
	SiaAPI.hastingsToSiacoins(hastings).times("1e12") //4320 = blocks per month
)

export const SCTBToHastingsByte = (SC) => (
	SiaAPI.siacoinsToHastings(SC).dividedBy("1e12") //4320 = blocks per month
)

export const validNumbers = (values) => (
	values.reduce((isValid, val) => (!isNaN(val) && val > 0) && isValid, true)
)

export const hastingsByteBlockToSCTBMonth = (hastings) => (
	hastingsByteToSCTB(hastings).times("4320") //4320 = blocks per month
)

export const SCTBMonthToHastingsByteBlock = (SC) => (
	SCTBToHastingsByte(SC).dividedBy("4320") //4320 = blocks per month
)

export const blocksToWeeks = (blocks) => (
	(new BigNumber(blocks)).dividedBy("1008") //1008 = blocks per week
)

export const weeksToBlocks = (weeks) => (
	(new BigNumber(weeks)).times("1008") //1008 = blocks per week
)

/*
qsVars := map[string]interface{}{
		"acceptingcontracts":   &settings.AcceptingContracts,
		"maxduration":		  &settings.MaxDuration,
		"maxdownloadbatchsize": &settings.MaxDownloadBatchSize,
		"maxrevisebatchsize":   &settings.MaxReviseBatchSize,
		"netaddress":		   &settings.NetAddress,
		"windowsize":		   &settings.WindowSize,

		"collateral":	   &settings.Collateral,
		"collateralbudget": &settings.CollateralBudget,
		"maxcollateral":	&settings.MaxCollateral,

		"downloadlimitgrowth": &settings.DownloadLimitGrowth,
		"downloadlimitcap":	&settings.DownloadLimitCap,
		"downloadspeedlimit":  &settings.DownloadSpeedLimit,
		"uploadlimitgrowth":   &settings.UploadLimitGrowth,
		"uploadlimitcap":	  &settings.UploadLimitCap,
		"uploadspeedlimit":	&settings.UploadSpeedLimit,

		"minimumcontractprice":		  &settings.MinimumContractPrice,
		"minimumdownloadbandwidthprice": &settings.MinimumDownloadBandwidthPrice,
		"minimumstorageprice":		   &settings.MinimumStoragePrice,
		"minimumuploadbandwidthprice":   &settings.MinimumUploadBandwidthPrice,
	}
*/
