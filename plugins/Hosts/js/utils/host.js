import { Map, List } from 'immutable'
import BigNumber from 'bignumber.js'

// Retrieve host status information
const getStatus = function (callback) {
	SiaAPI.call('/host', function(result) {
		updateStatus(result, callback);
	});
}

// Announce host on the network
const announce = function (settings, callback) {
	settings = settings || null;
	SiaAPI.call({
		url: '/host/announce',
		method: 'POST',
		qs: settings,
	}, callback);
}

// Save hosting settings
const save = function (settings, callback) {
	// Send configuration call
	SiaAPI.call({
		url: '/host',
		method: 'POST',
		qs: settings,
	}, callback);
}

const MAX_DUR = 0
const COLLATERAL = 1
const PRICE = 2
const BANDWIDTH = 3

export const saveSettings = function (state, callback){
	save({
		"acceptingcontracts": state.get("acceptingContracts"),
		"maxduration": state.get("usersettings").get(MAX_DUR).get("value"),
		"collateral": 
			SiaAPI.siacoinsToHastings(state.get("usersettings").get(COLLATERAL).get("value")).toString(),
		"minimumstorageprice": 
			SiaAPI.siacoinsToHastings(state.get("usersettings").get(PRICE).get("value")).toString(),
		"minimumdownloadbandwidthprice":
			SiaAPI.siacoinsToHastings(state.get("usersettings").get(BANDWIDTH).get("value")).toString(),
	}, callback)
}

export const addFile = function (file, callback){
	SiaAPI.call({
			url: '/storage/folders/add',
			method: 'POST',
			qs: {
				path: file.get("path"),
				size: file.get("size"),
			},
		},
		function (e) {
			console.log(e)
			callback(file)
		}
	)
}

export const chooseFileLocation = function (){
	return SiaAPI.openFile({
			title: "Choose new storage location.",
			properties: [ "openDirectory" ]
		})[0]
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
