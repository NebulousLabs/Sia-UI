import { takeEvery } from 'redux-saga'
import { call, put, fork } from 'redux-saga/effects'
import * as actions from '../actions/actions.js'
import * as constants from '../constants/constants.js'
import { Map, List } from 'immutable'

// siadCall: promisify Siad API calls.  Resolve the promise with `response` if the call was successful,
// otherwise reject the promise with `err`.
const siadCall = (uri) => new Promise((resolve, reject) => {
	SiaAPI.call(uri, (err, response) => {
		if (err) {
			reject(err)
		} else {
			resolve(response)
		}
	})
})

const MAX_DUR = 0
const COLLATERAL = 1
const PRICE = 2
const BANDWIDTH = 3
function *updateSettings(action) {
	try {
		const resp = yield siadCall({
			url: '/host',
			method: 'POST',
			qs: {
				"acceptingcontracts": action.settings.get("acceptingContracts"),
				"maxduration": action.settings.get("usersettings").get(MAX_DUR).get("value"),
				"collateral": 
					SiaAPI.siacoinsToHastings(action.settings.get("usersettings").get(COLLATERAL).get("value")).toString(),
				"minimumstorageprice": 
					SiaAPI.siacoinsToHastings(action.settings.get("usersettings").get(PRICE).get("value")).toString(),
				"minimumdownloadbandwidthprice":
					SiaAPI.siacoinsToHastings(action.settings.get("usersettings").get(BANDWIDTH).get("value")).toString(),
			},
		})
		yield put({ type: constants.FETCH_SETTINGS})
	} catch (e) {
		//TODO: Add error handling.
		console.log(e)
	}
}


/*const a = {
	"externalsettings": {
		"acceptingcontracts":false,
		"maxdownloadbatchsize":17825792,
		"maxrevisebatchsize":17825792,
		"maxduration":30,
		"netaddress":"76.119.238.92:9982",
		"remainingstorage":50000000000,
		"sectorsize":4194304,
		"totalstorage":50000000000,
		"unlockhash":"bcacd7ecd82df66f5a3d2d202151bb38972457f3c3227e57ac0cb03e9e4289fecadf5332f97f",
		"windowsize":144,
		"collateral":"0",
		"maxcollateral":"250000000000000000000000000000",
		"contractprice":"30000000000000000000000000",
		"downloadbandwidthprice":"2000000000000000000000000",
		"storageprice":"1000000000000000000000000",
		"uploadbandwidthprice":"1000000000000000",
		"revisionnumber":35,
		"version":"0.6.0"
	},
	"financialmetrics":{
		"contractcompensation":"0",
		"potentialcontractcompensation":"0",
		"lockedstoragecollateral":"0",
		"lostrevenue":"0",
		"loststoragecollateral":"0",
		"potentialerevenue":"0",
		"riskedstoragecollateral":"0",
		"storagerevenue":"0",
		"transactionfeeexpenses":"0",
		"downloadbandwidthrevenue":"0",
		"potentialdownloadbandwidthrevenue":"0",
		"potentialuploadbandwidthrevenue":"0",
		"uploadbandwidthrevenue":"0"
	},
	"internalsettings":{
		"acceptingcontracts":false,
		"maxduration":30,
		"maxdownloadbatchsize":17825792,
		"maxrevisebatchsize":17825792,
		"netaddress":"",
		"windowsize":144,
		"collateral":"0",
		"collateralbudget":"5000000000000000000000000000000",
		"maxcollateral":"250000000000000000000000000000",
		"downloadlimitgrowth":0,
		"downloadlimitcap":0,
		"downloadspeedlimit":0,
		"uploadlimitgrowth":0,
		"uploadlimitcap":0,
		"uploadspeedlimit":0,
		"contractprice":"30000000000000000000000000",
		"minimumdownloadbandwidthprice":"2000000000000000000000000",
		"storageprice":"1000000000000000000000000",
		"minimumuploadbandwidthprice":"1000000000000000"
	},
	"networkmetrics":{
		"downloadbandwidthconsumed":0,
		"uploadbandwidthconsumed":0,
		"downloadcalls":0,
		"errorcalls":0,
		"formcontractcalls":0,
		"renewcalls":0,
		"revisecalls":0,
		"settingscalls":0,
		"unrecognizedcalls":0
	}
}*/



function *fetchSettings(action) {
	try {
		const updatedData = yield siadCall({
			url: '/host',
			method: 'GET',
		})

		const settings = Map({
			acceptingContracts: updatedData.externalsettings.acceptingcontacts,
			usersettings: List([
				Map({
					name: "Max Duration (Weeks)",
					value: updatedData.externalsettings.maxduration,
					min: 12,
				}),
				Map({
					name: "Collateral (SC)",
					value: SiaAPI.hastingsToSiacoins(updatedData.externalsettings.maxcollateral).toString(),
				}),
				Map({
					name: "Price per GB (SC)",
					value:  SiaAPI.hastingsToSiacoins(updatedData.externalsettings.storageprice).toString(),
					notes: "Current average price is 3 SC/GB",
				}),
				Map({
					name: "Bandwidth Price (SC/byte)",
					value:  SiaAPI.hastingsToSiacoins(updatedData.externalsettings.downloadbandwidthprice).toString(),
				}),
			]),
		})
		yield put( actions.updateSettingsSuccess(settings) )
		//yield put({ type: constants.UPDATE_SETTINGS_SUCCESS, settings: settings })
	} catch (e) {
		//TODO: Add error handling.
		console.log(e)
	}
}

function *updateSettingsListener () {
	yield *takeEvery("UPDATE_SETTINGS", updateSettings)
}
function *fetchSettingsListener () {
	yield *takeEvery("FETCH_SETTINGS", fetchSettings)
}

export default function *initSaga() {
	yield [
		fork(updateSettingsListener),
		fork(fetchSettingsListener),
	]
}
