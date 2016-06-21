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


export const validNumbers = (values) => (
	values.reduce((isValid, val) => (!isNaN(val) && val > 0) && isValid, true)
)

export const hastingsByteBlockToSCTBMonth = function (hastings){
	
}

export const SCTBMonthToHastingsByteBlock = function (SC){

}

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
