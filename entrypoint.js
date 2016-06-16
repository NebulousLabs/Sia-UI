const Path = require('path')


require('electron-compile').init(Path.resolve(__dirname), Path.join(__dirname, 'index.js'))

