'use strict';

/*
 * fileElement:
 *   This module holds the creation logic for file elements.
 */

// Node modules
const electron = require('electron');
const clipboard = electron.clipboard;
const $ = require('jquery');
const tools = require('./uiTools');
const BigNumber = require('bignumber.js');

// Format to data size representation with 3 or less digits
function formatByte(bytes) {
	bytes = new BigNumber(bytes);
	if (bytes.isZero()) {
		return '0 B';
	}
	var k = 1000;
	var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	var i = Math.floor((Math.log(bytes) + 1) / Math.log(k));
	var number = new BigNumber(bytes).div(Math.pow(k, i)).round(2);
	return number + " " + units[i];
}

// Make file element with jquery
function addFile(f) {
	var el = $(`
		<div class='file hidden' id='${f.path}'>
			<div class='graphic'>
				<i class='fa fa-file'></i>
			</div>
			<div class='available'>
				<i></i>
			</div>
			<div class='name'></div>
			<div class='size'></div>
			<div class='time'></div>
			<div class='download cssTooltip' tooltip-content="Download"><i class='fa fa-download'></i></div>
			<div class='share cssTooltip' tooltip-content="Share"><i class='fa fa-share-alt'></i></div>
			<div class='delete cssTooltip' tooltip-content="Delete"><i class='fa fa-remove'></i></div>
		</div>
	`);

	// Give the file buttons clickability
	el.find('.download').click(function() {
		var destination = tools.dialog('save');
		if (!destination) {
			return;
		}
		tools.notify('Downloading ' + f.name + ' to '+ destination, 'download');
		f.download(destination);
	});
	el.find('.share').click(function() {
		// Get the ascii share string
		f.shareASCII(function(result) {
			clipboard.writeText(result.File);
			tools.notify('Copied ' + f.name + '.sia to clipboard!', 'asciifile');
		});
	});
	el.find('.delete').click(function() {
		// Confirm deletion dialog
		var confirmation = tools.dialog('message', {
			type: 'warning',
			title: 'Confirm Deletion',
			message: `Are you sure you want to delete ${f.name}?`,
			detail: 'This will permanently remove it from your library!',
			buttons: ['Okay', 'Cancel'],
		});
		if (confirmation === 0) {
			f.delete(el.remove);
		}
	});

	// Set field display values
	el.find('.name').html(f.name);
	el.find('.size').html(tools.formatBytes(f.Filesize, 2));
	if (f.UploadProgress === 0) {
		el.find('.time').html('Processing...');
	} else if (f.UploadProgress < 100) {
		el.find('.time').html(f.UploadProgress.toFixed(0) + '%');
	} else {
		el.find('.time').html(f.TimeRemaining + ' blocks left');
	}

	// Set graphic
	el.find('.graphic i').classList.add('fa-file');

	// Set availability graphic
	if (f.Available) {
		el.find('.available i').get(0).className = 'fa fa-check';
	} else {
		el.find('.available i').get(0).className = 'fa fa-refresh fa-spin';
	}
}

module.exports = addFile;
