'use strict';

/*
 * fileElement function module:
 *   This module holds the creation logic for file elements.
 */

// Node modules
const electron = require('electron');
const clipboard = electron.clipboard;
const tools = require('./uiTools');
const entityElement = require('./entityElement');

// Make file element with jquery
function makeFileElement(f) {
	var el = entityElement(f);

	// Set availability graphic
	var availabilityGraphic = f.Available ? 'fa-check' : 'fa-refresh fa-spin';
	el.find('.graphic').after(`
		<div class='available'>
			<i class='fa ${availabilityGraphic}'></i>
		</div>
	`);

	// Set time text
	var timeText;
	if (f.UploadProgress === 0) {
		timeText = 'Processing...';
	} else if (f.UploadProgress < 100) {
		timeText = f.UploadProgress.toFixed(0) + '%'; 
	} else {
		timeText = 'Expires on block ' + f.Expiration;
	}
	el.find('.size').after(`<div class='time'>${timeText}</div>`);

	// Share button, when clicked, asks to download a .sia or copy an ascii
	el.find('.share').click(function() {
		// Present option between .Sia or ASCII method of sharing
		var option = tools.dialog('message', {
			type:    'question',
			title:   'Share ' + f.name,
			message: 'Share via .sia file or ASCII text?',
			detail:  'Choose to download .sia file or copy ASCII text to clipboard.',
			buttons: ['.Sia file', 'ASCII text', 'Cancel'],
		});

		// Choose a location to download the .sia file to
		if (option === 0) {
			var destination = tools.dialog('save', {
				title:       `Share ${f.name}.sia`,
				defaultPath: f.name + '.sia',
				filters:     [{ name: 'Sia file', extensions: ['sia'] }],
			});

			// Download siafile to location
			f.share(destination, function() {
				tools.notify(`Put ${f.name}'s .sia files at ${destination}`, 'download');
			});
		} else if (option === 1) {
			// Get the ascii share string
			f.shareASCII(function(result) {
				clipboard.writeText(result.File);
				tools.notify(`Copied ${f.name}.sia to clipboard!`, 'asciifile');
			});
		}
	});
	
	// Return the new element
	return el;
}

module.exports = makeFileElement;
