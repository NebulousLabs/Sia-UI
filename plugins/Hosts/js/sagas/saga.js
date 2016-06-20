import { takeEvery } from 'redux-saga'
import { call, put, take, fork } from 'redux-saga/effects'
import * as actions from '../actions/actions.js'
import * as constants from '../constants/constants.js'
import * as helper from '../utils/host.js'
import { Map, List } from 'immutable'
import BigNumber from 'bignumber.js'

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


const fetchStorageFiles = (action) => new Promise((resolve, reject) => {
	siadCall({
		url: '/storage',
		method: 'GET',
	}).then((fetchedFiles) => { 
		resolve(List(fetchedFiles.StorageFolderMetadata).map((file, key) => (
			Map({
				path: file.path,
				size: (new BigNumber(file.capacity)).times(new BigNumber("1e-9")),
				free: (new BigNumber(file.capacityremaining)).times(new BigNumber("1e-9"))
			})
		)).toList())
	}).catch( (e) => {
		console.log(e)
		reject(e)
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
					SiaAPI.siacoinsToHastings(action.settings.get("usersettings").get(PRICE).get("value")).dividedBy("1e9").dividedBy("4320").toString(), //TB -> bytes, blocks -> month
				"minimumdownloadbandwidthprice":
					SiaAPI.siacoinsToHastings(action.settings.get("usersettings").get(BANDWIDTH).get("value")).toString(),
			},
		})
		yield put( actions.fetchData() )
	} catch (e) {
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

function *addFolder(action) {
	try {
		const resp = yield siadCall({
			url: '/storage/folders/add',
			method: 'POST',
			qs: {
				path: action.folder.get("path"),
				size: action.folder.get("size"), //Is given in GB.
			},
		})
		yield put( actions.fetchData() )
	} catch (e) {
		console.log(e)
	}
}


function *addFolderAskPathSize(action) {
	const newLocation = helper.chooseFileLocation();
	try {
		yield put( actions.showResizeDialog(Map({ path: newLocation, size: 50 })) )
		let closeAction = yield take( constants.HIDE_RESIZE_DIALOG )
		if (closeAction.folder.get("size")){
			yield put( actions.addFolder(Map({
				path: newLocation,
				size: (new BigNumber(closeAction.folder.get("size"))).times(new BigNumber("1e9")).toString(),
			})) )
		}
		else { console.log("Folder size is zero.") }
	} catch (e) {
		console.log(e)
	}
}


function *removeFolder(action) {
	try {
		const resp = yield siadCall({
			url: '/storage/folders/remove',
			method: 'POST',
			qs: {
				path: action.folder.get("path"),
			},
		})
		yield put( actions.fetchData() )
	} catch (e) {
		console.log(e)
	}
}

function *resizeFolder(action) {
	try {
		yield put( actions.showResizeDialog(action.folder) )
		let closeAction = yield take( constants.HIDE_RESIZE_DIALOG )
		if (closeAction.folder.get("size")){
			const resp = yield siadCall({
				url: '/storage/folders/resize',
				method: 'POST',
				qs: {
					path: closeAction.folder.get("path"),
					newsize: (new BigNumber(closeAction.folder.get("size"))).times(new BigNumber("1e9")).toString(),
				},
			})
			yield put( actions.fetchData() )
		}
		else { console.log("Folder size is zero.") }
	} catch (e) {
		console.log(e)
	}
}


function *fetchData(action) {
	try {
		const updatedData = yield siadCall({
			url: '/host',
			method: 'GET',
		})

		const data = Map({
			acceptingContracts: updatedData.externalsettings.acceptingcontracts,
			usersettings: List([
				Map({
					name: "Max Duration (Weeks)",
					value: (new BigNumber(updatedData.externalsettings.maxduration)).toString(),
					min: 12,
				}),
				Map({
					name: "Collateral per TB per Month (SC)",
					value: SiaAPI.hastingsToSiacoins(updatedData.externalsettings.collateral).toString(),
				}),
				Map({
					name: "Price per TB per Month (SC)",
					value: SiaAPI.hastingsToSiacoins(updatedData.externalsettings.storageprice).times("1e9").times("4320").toFixed(0), //bytes -> TB, 4320 = blocks per month
				}),
				Map({
					name: "Bandwidth Price (SC/TB)",
					value: SiaAPI.hastingsToSiacoins(updatedData.externalsettings.downloadbandwidthprice).toString(),
				}),
			]),
			numContracts: updatedData.networkmetrics.formcontractcalls,
			storage: (new BigNumber(updatedData.externalsettings.totalstorage)).minus(new BigNumber(updatedData.externalsettings.remainingstorage)).toString(),
			earned: (new BigNumber(updatedData.financialmetrics.contractcompensation)).toString(),
			expected: (new BigNumber(updatedData.financialmetrics.potentialcontractcompensation)).toString(),
			files: yield fetchStorageFiles(),
		})

		yield put( actions.fetchDataSuccess(data) )
	} catch (e) {
		//TODO: Add error handling.
		console.log(e)
	}
}

function *updateSettingsListener () {
	yield *takeEvery("UPDATE_SETTINGS", updateSettings)
}
function *fetchSettingsListener () {
	yield *takeEvery("FETCH_DATA", fetchData)
}
function *addFolderListener () {
	yield *takeEvery("ADD_FOLDER", addFolder)
}
function *addFolderAskListener () {
	yield *takeEvery("ADD_FOLDER_ASK", addFolderAskPathSize)
}
function *removeFolderListener () {
	yield *takeEvery("REMOVE_FOLDER", removeFolder)
}
function *resizeFolderListener () {
	yield *takeEvery("RESIZE_FOLDER", resizeFolder)
}

export default function *initSaga() {
	yield [
		fork(updateSettingsListener),
		fork(fetchSettingsListener),
		fork(addFolderListener),
		fork(addFolderAskListener),
		fork(removeFolderListener),
		fork(resizeFolderListener),
	]
	yield put(actions.fetchData())
}
