/*
Module for stopping/starting the daemon
*/

var child_process = require("child_process");
var path = require("path");
var daemonProcess;

// Catches all messages of the daemon's Readable Streams
// TODO: Allow hook
function daemonData(data) {
    console.log("daemon.js> stdout: " + data);
}
function daemonErrMsg(err) {
    console.error("daemon.js> stderr: " + err);
}

// Catches return values of the daemon's events
// TODO: Allow hook
function daemonError(err) {
    console.error("daemon.js> SIAD ERROR: " + err);
}
function daemonExit(code) {
    console.error("daemon.js> SIAD EXITED: " + code);
}
function daemonClose(code) {
    console.error("daemon.js> SIAD CLOSED: " + code);
}

module.exports = {
    start: function(config, callback) {
        if (daemonProcess) {
            console.error("Daemon process already running");
            return;
        }

        // TODO: Allow arguments from config to daemon
        daemonProcess = child_process.spawn(config.siad_cmd, {cwd: path.join(path.dirname(__dirname), "Sia")});
        daemonProcess.stdout.on("data", daemonData);
        daemonProcess.stderr.on("data", daemonErrMsg);
        daemonProcess.on("error", daemonError);
        daemonProcess.on("exit", daemonExit);
        daemonProcess.on("close", daemonClose);
        callback();
    },
    stop: function() {
        if (!daemonProcess) {
            console.error("daemon.js> process not running!");
            return;
        }
        daemonProcess.kill("SIGINT");
        daemonProcess = null;
    }
};
