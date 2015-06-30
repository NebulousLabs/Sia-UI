// system.js handles system calls, abstracting system calls to a module opens
// the possibility that we simulate system calls with calls to a web server to
// make a web-only client.
// 
// This system module uses NodeJS to interact with the host computer.

system = (function() {

    function getUIConfig(callback) {
        fs.readFile("config.json", function(err, data) {
            if (err) {
                console.log("Couldn't get config.json, loading default ui config");
                getDefaultUIConfig(callback);
            } else {
                callback(JSON.parse(data));
            }
        });
    }

    function getDefaultUIConfig(callback) {
        callback({
            "siad_cmd": "siad",
            "siad_addr": "http://localhost:9980"
        });
    }

    function startDaemon(cmd, onFinish) {
        ipc.send("start-daemon");

        // TODO: determine when daemon is ready to receive requests
        setTimeout(onFinish, 400);
    }

    function stopDaemon() {
        ipc.send("stop-daemon");
    }

    return {
        "getUIConfig": getUIConfig,
        "startDaemon": startDaemon,
        "stopDaemon": stopDaemon
    };
})();
