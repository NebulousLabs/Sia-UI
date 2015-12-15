'use strict';

// This script, much like how the name says, downloads a Sia release into the
// UI's root directory.
const SiadWrapper = require('sia.js');
const Path = require('path');

SiadWrapper.download(Path.join(__dirname, '..', 'Sia'));
