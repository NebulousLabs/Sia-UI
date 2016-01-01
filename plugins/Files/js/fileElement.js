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

// Make file element with jquery
function makeFileElement(f) {
	var el = $(`
		<div class='file entity' id='${f.path}'>
			<div class='graphic'>
				<i class='fa fa-file'></i>
			</div>
			<div class='available'>
				<i class='fa'></i>
			</div>
			<div class='name'>${f.name}</div>
			<div class='size'>${tools.formatByte(f.size())}</div>
			<div class='time'></div>
			<div class='download cssTooltip' tooltip-content="Download"><i class='fa fa-download'></i></div>
			<div class='share cssTooltip' tooltip-content="Share"><i class='fa fa-share-alt'></i></div>
			<div class='delete cssTooltip' tooltip-content="Delete"><i class='fa fa-remove'></i></div>
		</div>
	`);

	// Give the file buttons clickability
	el.find('.download').click(function() {
		// Get path to download to
		var destination = tools.dialog('save');
		if (!destination) {
			return;
		}
		tools.notify(`Downloading ${f.name} to ${destination}`, 'download');
		f.download(destination, function() {
			tools.notify(`{f.name} downloaded to ${destination}`, 'success');
		});
	});
	el.find('.share').click(function() {
		// Get the ascii share string
		f.shareASCII(function(result) {
			clipboard.writeText(result.File);
			tools.notify(`Copied ${f.name}.sia to clipboard!`, 'asciifile');
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
			f.delete(function() {
				el.remove();
				// TODO: Not sure how to verify if this deletes all references
				// to this file
				delete f.parentFolder.contents[f.name];
				f = null;
			});
		}
	});

	// Set field display values
	var timeText
	if (f.UploadProgress === 0) {
		timeText = 'Processing...';
	} else if (f.UploadProgress < 100) {
		timeText = f.UploadProgress.toFixed(0) + '%'; 
	} else {
		timeText = 'Expires at block ' + f.Expiration;
	}
	el.find('.time').text(timeText);

	// Set availability graphic
	var availabilityGraphic = f.Available ? 'fa-check' : 'fa-refresh fa-spin';
	el.find('.available i').addClass(availabilityGraphic);
	
	// Return the new element
	return el;
}

module.exports = makeFileElement;
