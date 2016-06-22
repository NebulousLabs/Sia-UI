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
			reject({ message: err })
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
				size: (new BigNumber(file.capacity)).times("1e-9").toString(),
				free: (new BigNumber(file.capacityremaining)).times("1e-9").toString(),
			})
		)).toList())
	}).catch( (e) => {
		SiaAPI.showError({ title: "Error Fetching Folders", content: e.message })
		reject(e)
	})
})

function *announceHost(action) {
	try {
		yield put( actions.showAnnounceDialog(action.address) )
		let closeAction = yield take( constants.HIDE_ANNOUNCE_DIALOG )
		if (closeAction.address !== ''){ //If size is zero just hide the dialog.
			const resp = yield siadCall({
				url: '/host/announce',
				method: 'POST',
				qs: { netaddress: closeAction.address },
			})
		}
	} catch (e) {
		SiaAPI.showError({ title: "Error Announcing Host", content: e.message })
	}
}

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
				"maxduration": helper.weeksToBlocks(action.settings.get("usersettings").get(MAX_DUR).get("value")).toString(),
				"collateral": 
					helper.SCTBMonthToHastingsByteBlock(action.settings.get("usersettings").get(COLLATERAL).get("value")).toString(),
				"minstorageprice": 
					helper.SCTBMonthToHastingsByteBlock(action.settings.get("usersettings").get(PRICE).get("value")).toString(), //bytes->TB, blocks -> month
				"mindownloadbandwidthprice":
					helper.SCTBToHastingsByte(action.settings.get("usersettings").get(BANDWIDTH).get("value")).toString(),
			},
		})
		yield put( actions.fetchData() )
	} catch (e) {
		SiaAPI.showError({ title: "Error Updating Settings", content: e.message })
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
		SiaAPI.showError({ title: "Error Adding Folder", content: e.message })
	}
}


function *addFolderAskPathSize(action) {
	const newLocation = helper.chooseFileLocation();
	try {
		yield put( actions.showResizeDialog(Map({ path: newLocation, size: 50 }), true) )
		let closeAction = yield take( constants.HIDE_RESIZE_DIALOG )
		if (closeAction.folder.get("size")){
			yield put( actions.addFolder(Map({
				path: newLocation,
				size: (new BigNumber(closeAction.folder.get("size"))).times(new BigNumber("1e9")).toString(),
			})) )
		}
		else { console.log("Folder size is zero.") }
	} catch (e) {
		SiaAPI.showError({ title: "Error Adding Folder", content: e.message })
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
		SiaAPI.showError({ title: "Error Removing Folder", content: e.message })
	}
}

function *resizeFolder(action) {
	try {
		yield put( actions.showResizeDialog(action.folder, action.ignoreInitial) )
		let closeAction = yield take( constants.HIDE_RESIZE_DIALOG )
		if (closeAction.folder.get("size")){ //If size is zero just hide the dialog.
			const resp = yield siadCall({
				url: '/storage/folders/resize',
				method: 'POST',
				qs: {
					path: closeAction.folder.get("path"),
					newsize: (new BigNumber(closeAction.folder.get("size"))).times("1e9").toString(),
				},
			})
			yield put( actions.fetchData() )
		}
	} catch (e) {
		SiaAPI.showError({ title: "Error Resizing Folder", content: e.message })
	}
}


function *fetchData(action) {
	try {
		const updatedData = yield siadCall({
			url: '/host',
			method: 'GET',
		})

		const walletUnlocked = yield siadCall({
			url: '/wallet'
		})

		const data = Map({
			acceptingContracts: updatedData.externalsettings.acceptingcontracts,
			usersettings: List([
				Map({
					name: "Max Duration (Weeks)",
					value: helper.blocksToWeeks(updatedData.externalsettings.maxduration).toString(),
					min: 12,
				}),
				Map({
					name: "Collateral per TB per Month (SC)",
					value: helper.hastingsByteBlockToSCTBMonth(updatedData.externalsettings.collateral).toFixed(0),
				}),
				Map({
					name: "Price per TB per Month (SC)",
					value: helper.hastingsByteBlockToSCTBMonth(updatedData.externalsettings.storageprice).toFixed(0),
				}),
				Map({
					name: "Bandwidth Price (SC/TB)",
					value: helper.hastingsByteToSCTB(updatedData.externalsettings.downloadbandwidthprice).toString(),
				}),
			]),
			numContracts: updatedData.financialmetrics.contractcount,
			storage: (new BigNumber(updatedData.externalsettings.totalstorage)).minus(new BigNumber(updatedData.externalsettings.remainingstorage)).toString(),
			earned: (new BigNumber(updatedData.financialmetrics.contractcompensation)).toString(),
			expected: (new BigNumber(updatedData.financialmetrics.potentialcontractcompensation)).toString(),
			files: yield fetchStorageFiles(),
			walletLocked: !walletUnlocked.unlocked,
			defaultAnnounceAddress: updatedData.externalsettings.netaddress,
		})

		yield put( actions.fetchDataSuccess(data, action.ignoreSettings) )
	} catch (e) {
		SiaAPI.showError({ title: "Error Fetching Data", content: e.message })
	}
}

function *showWarning(action) {
	yield put( actions.showWarningModal(action.modal) )
	let closeAction = yield take( constants.HIDE_WARNING_MODAL )
	if (closeAction.accepted){ action.acceptAction() }
	else { if (action.declineAction){ action.declineAction() } }
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
function *announceHostListener () {
	yield *takeEvery("ANNOUNCE_HOST", announceHost)
}
function *showWarningModalListener () {
	yield *takeEvery("SHOW_WARNING", showWarning)
}

export default function *initSaga() {
	try {
		yield [
			fork(updateSettingsListener),
			fork(fetchSettingsListener),
			fork(addFolderListener),
			fork(addFolderAskListener),
			fork(removeFolderListener),
			fork(resizeFolderListener),
			fork(announceHostListener),
			fork(showWarningModalListener),
		]
		yield put(actions.fetchData())
	}

	catch (e) {
		SiadAPI.showError({ title: "Init Saga Error", content: e.message })
	}
}
