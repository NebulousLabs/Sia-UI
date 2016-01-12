'use strict';

/*
 * fileElement function module:
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
		<div class='file' id='${f.name}'>
			<div class='graphic'>
				<i class='fa fa-${f.type}'></i>
			</div>
			<div class='name button'>${f.name}</div>
			<div class='size'>${tools.formatByte(f.filesize)}</div>
			<div class='detail'></div>
		</div>
	`);

	// Set unavailable graphic if needed
	if (!f.available) {
		el.find('.fa.fa-file').removeClass('fa-file').addClass('fa-refresh fa-spin');
	}

	// Set detail text
	var detailText;
	if (f.uploadprogress === 0) {
		detailText = 'Processing...';
	} else if (f.uploadprogress < 100) {
		detailText = f.uploadprogress.toFixed(0) + '%'; 
	} else if (f.renewing) {
		detailText = 'Renews on block ' + f.expiration;
	} else {
		detailText = 'Expires on block ' + f.expiration;
	}
	el.find('.detail').text(detailText);

	// Share button, when clicked, asks to download a .sia or copy an ascii
	/* TODO: move to browser for aggregate action
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
				clipboard.writeText(result.file);
				tools.notify(`Copied ${f.name}.sia to clipboard!`, 'asciifile');
			});
		}
	});
	*/

	// Allow user to rename the file
	el.find('.name.button').click(function() {
		this.contentEditable = true;
		$(this).focus();
	}).keypress(function(e) {
		var field = $(this);
		var newName = field.text();
		var nameChanged = newName !== f.name ? true : false;

		// Pressing 'Enter' saves the name change
		if (e.which === 13 && nameChanged) {
			//e.preventDefault();
			f.setName(newName, () => {
				this.id = newName;
			});
			this.contentEditable = false;
		} else if (e.which === 27) {
			// Pressing 'Esc' resets the name
			$(this).text(f.name).attr('contentEditable', false);
		}
	});
	
	// Return the new element
	// TODO: Implement right click actions on these files
	return el;
}

module.exports = makeFileElement;
