var controller = (function() {

	var data = {};
	var createdAddressList = [];
	var recentAddressList = [];
	var dataListeners = {};
	var uiConfig;

	function init() {
		system.getUIConfig(function(config) {
			uiConfig = config;

			controller.daemonManager.start(config, function() {
				prepareUI();
			});
		});
	}

	function prepareUI() {
		update();
		addListeners();

		setInterval(function() {
			update();
		}, 250);

		// Wait two seconds then check for a Sia client update
		setTimeout(function() {
			promptUserIfUpdateAvailable();
		}, 2000);
	}

	function promptUserIfUpdateAvailable() {
		checkForUpdate(function(update) {
			if (update.Available) {
				ui.notify("New Sia Client Available: Click to update to " + update.Version + "!", "update", function() {
					updateClient(update.Version);
				});
			} else {
				ui.notify("Sia client up to date!", "success");
			}
		});
	}

	function getVersion(callback) {
		$.getJSON(uiConfig.siad_addr + "/daemon/version", callback);
	}

	function checkForUpdate(callback) {
		$.getJSON(uiConfig.siad_addr + "/daemon/updates/check", callback);
	}

	function updateClient(version) {
		var shell = require('shell');
		shell.openExternal('https://www.github.com/NebulousLabs/Sia-UI/releases');
	}

	function httpApiCall(url, params, callback, errorCallback) {
		params = params || {};
		$.getJSON(uiConfig.siad_addr + url, params, function(data) {
			if (callback) callback(data);
		}).error(function(err) {
			if (!errorCallback) {
				console.error("BAD CALL TO", url, arguments);
				ui.notify("Error calling " + url + " : " + err.responseText, "error");
			} else {
				errorCallback();
			}
		});
	}

	function addListeners() {
		ui.addListener("save-host-config", function(hostInfo) {
			console.log(hostInfo);
			httpApiCall("/host/configure", hostInfo);
		});
		ui.addListener("send-money", function(info) {
			ui.wait();
			var address = info.to.address.replace(/[^A-Fa-f0-9]/g, "");
			httpApiCall("/wallet/send", {
				"amount": info.from.amount,
				"destination": address
			}, function(data) {
				updateWallet(function() {
					ui.stopWaiting();
					ui.switchView("manage-account");
				});
			});
		});
		ui.addListener("create-address", function() {
			ui.wait();
			httpApiCall("/wallet/address", {}, function(info) {
				createdAddressList.push({
					"Address": info.Address,
					"Balance": 0
				});
				recentAddressList = [];
				recentAddressList.push({
					"Address": info.Address,
					"Balance": 0
				});
				updateWallet(function() {
					ui.stopWaiting();
				});
			});
			updateWallet(function() {
				ui.stopWaiting();
			});
		});
		ui.addListener("download-file", function(fileNickname) {
			var savePath = ipc.sendSync("save-file-dialog", fileNickname);
			if (!savePath) {
				return
			}
			ui.notify("Downloading " + fileNickname + " to "+savePath+" folder", "download");
			httpApiCall("/renter/files/download", {
				"nickname": fileNickname,
				"destination": savePath
			});
		});
		ui.addListener("upload-file", function(filePath, nickName){
			ui.notify("Uploading " + nickName + " to Sia Network", "upload");
			httpApiCall("/renter/files/upload", {
				"source": filePath,
				"nickname": nickName,
			});
		});
		ui.addListener("announce-host", function(){
			httpApiCall("/host/announce", {}, function(data){
				ui.notify("Host successfully announced!", "success");
			});
		});
		ui.addListener("update-peers", function(peers) {
			ui.notify("Updating Network...", "peers");

			function addPeer(peerAddr) {
				httpApiCall("/gateway/peers/add", {
					"address": peerAddr
				}, function() {
					ui.notifySmall("Successfully added peer: " + peerAddr, "success");
				}, function(err) {
					ui.notifySmall("Error adding peer: " + peerAddr, "error");
				});
			}

			function removePeer(peerAddr) {
				httpApiCall("/gateway/peers/remove", {
					"address": peerAddr
				}, function() {
					ui.notifySmall("Successfully removed peer: " + peerAddr, "success");
				}, function(err) {
					ui.notifySmall("Error removing peer: " + peerAddr, "error");
				});
			}

			var oldPeers = data.peer.Peers;
			for (var i = 0; i < oldPeers.length; i++) {
				if (peers.indexOf(oldPeers[i]) == -1) {
					// this peer has been removed
					removePeer(oldPeers[i]);
				}
			}
			peers.forEach(function(peerAddr) {
				if (data.peer.Peers.indexOf(peerAddr) == -1) {
					// This peer needs to be added
					addPeer(peerAddr);
				}
			});
		});
		ui.addListener("share-file", function(fileNickname){
			// Make a request to get the ascii share string
			httpApiCall("/renter/files/shareascii", {
				"nickname": fileNickname
			}, function(response){
				ipc.send("share-file", response["File"]);
			});
		});
		ui.addListener("add-ascii-file", function(asciiText){
			httpApiCall("/renter/files/loadascii", {
				"file": asciiText
			}, function(response){
				console.log(response);
			});
		});
		ui.addListener("delete-file", function(fileNickname){
			// Make the request to delete the file.
			httpApiCall("/renter/files/delete", {
				"nickname": fileNickname
			}, function(response){
				console.log(response);
			});
		});
	}

	var lastUpdateTime = Date.now();
	var lastBalance = 0;
	var runningIncomeRateAverage = 0;

	function updateWallet(callback) {
		$.getJSON(uiConfig.siad_addr + "/wallet/status", function(response) {
			data.wallet = {
				"Balance": response.Balance,
				"FullBalance": response.FullBalance,
				"NumAddresses": response.NumAddresses,
				"DefaultAccount": "Main Account",
				"Accounts": [{
					"Name": "Default",
					"Balance": response.Balance,
					"NumAddresses": response.NumAddresses,
					"Addresses": createdAddressList,
					"Transactions": []
				}]
			};

			createdAddressList = [];
			var recLen = recentAddressList.length;
			for (var i = 0; i < recLen; i++) {
				createdAddressList.push(recentAddressList[i]);
			}
			if (recLen > 0) {
				createdAddressList.push({});
			}
			var visLen = response.VisibleAddresses.length;
			for (var i = 0; i < visLen; i++) {
				createdAddressList.push({
					"Address": response.VisibleAddresses[i],
					"Balance": 0
				});
			}

			updateUI();
			if (callback) callback();
			triggerListener("wallet");
		});
	}

	function updateHost(callback) {
		$.getJSON(uiConfig.siad_addr + "/host/status", function(response) {
			data.host = {
				"HostInfo": response
			};
			updateUI();
			if (callback) callback();
			triggerListener("host");
		}).error(function() {
			console.log(arguments);
		});
	}

	function updateFile(callback) {
		$.getJSON(uiConfig.siad_addr + "/renter/files/list", function(response) {
			data.file = {
				"Files": response || []
			};
			updateUI();
			if (callback) callback();
			triggerListener("file");
		}).error(function() {
			console.log(arguments);
		});
	}

	function updateRenter(callback) {
		$.getJSON(uiConfig.siad_addr + "/renter/status", function(response) {
			data.filePrice = response.Price;
			data.hostCount = response.KnownHosts;
			updateUI();
			if (callback) callback();
			triggerListener("file");
		}).error(function() {
			console.log(arguments);
		});
	}

	function updateConsensus(callback) {
		$.getJSON(uiConfig.siad_addr + "/consensus/status", function(response) {
			data.consensus = {
				"Height": response.Height,
				"CurrentBlock": response.CurrentBlock,
				"Target": response.Target
			};
			updateUI();
			if (callback) callback();
			triggerListener("consensus");
		}).error(function() {
			console.log(arguments);
		});
	}

	function updatePeer(callback) {
		$.getJSON(uiConfig.siad_addr + "/gateway/status", function(response) {
			data.peer = response;
			updateUI();
			if (callback) callback();
			triggerListener("peer");
		}).error(function() {
			console.log(arguments);
		});
	}

	function updateQueue(callback){
		data.downloadqueue = data.downloadqueue || [];
		$.getJSON(uiConfig.siad_addr + "/renter/downloadqueue", function(response) {
			data.downloadqueue = response;
			updateUI();
			if (callback) callback();
			triggerListener("downloadqueue");
		}).error(function() {
			console.log(arguments);
		});
	}

	function updateVersion() {
		getVersion(function(version) {
			data.Version = version;
		});
	}

	function update() {
		updateWallet();
		updateHost();
		updateFile();
		updateRenter();
		updateConsensus();
		updatePeer();
		updateQueue();
		updateVersion();
	}

	function updateUI() {
		if (data.wallet && data.host && data.file && data.consensus) {
			ui.update(data);
		}
	}

	function triggerListener(type){
		if (dataListeners[type]){
			dataListeners[type] = dataListeners[type].filter(function(callback){
				return !callback(data);
			});
		}
	}

	function addDataListener(type, callback){
		dataListeners[type] = dataListeners[type] || [];
		dataListeners[type].push(callback);
	}

	return {
		"init": init,
		"update": update,
		"addDataListener": addDataListener,
		"promptUserIfUpdateAvailable": promptUserIfUpdateAvailable
	};
})();
