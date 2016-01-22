'use strict';

/*
 * fileElement function module:
 *   This module holds the creation logic for file elements.
 */

// Node modules
const $ = require('jquery');
const tools = require('./uiTools');

// Update file element with jquery
function updateFileElement(f, el) {
	el = el || $('#' + f.hashedPath);
	el.id = f.hashedPath;

	// Set unavailable graphic if needed
	if (!f.available) {
		el.find('.fa.fa-file')
			.removeClass('fa-file')
			.addClass('fa-refresh fa-spin');
	} else {
		el.find('.fa.fa-refresh.fa-spin')
			.removeClass('fa-refresh fa-spin')
			.addClass('fa-file');
	}

	// Set detail text
	var detailText;
	if (f.uploadprogress === 0) {
		detailText = 'Processing...';
	} else if (f.uploadprogress < 100) {
		detailText = f.uploadprogress.toFixed(0) + '%'; 
	} else if (f.renewing) {
		detailText = 'Renewing';
	} else {
		detailText = 'Expires on block ' + f.expiration;
	}
	el.find('.detail').text(detailText);

	// Set size
	var sizeText = tools.formatByte(f.filesize);
	el.find('.size').text(sizeText);

	// Set type
	el.find('.type').text('File');

	return el;
}

// Make file element with jquery
function makeFileElement(f) {
	var el = $(`
		<div class='file' id='${f.hashedPath}'>
			<i class='fa fa-${f.type}'></i>
			<div class='name' id='${f.name}'>${f.name}</div>
			<i class='button fa fa-pencil'></i>
			<div class='info'>
				<div class='size'></div>
				<div class='type'></div>
				<div class='detail'></div>
			</div>
		</div>
	`);

	// Populate its fields and graphics
	updateFileElement(f, el);

	// Double clicking a file prompts to download
	el.dblclick(function() {
		// Save file/folder into specific place
		var destination = tools.dialog('save', {
			title:       'Download ' + f.name,
			defaultPath: f.name,
		});

		// Ensure destination exists
		if (!destination) {
			return;
		}

		tools.notify(`Downloading ${f.name} to ${destination}`, 'download');
		f.download(destination, function() {
			tools.notify(`Downloaded ${f.name} to ${destination}`, 'success');
		});
	});
	el.find('.name').keydown(function(e) {
		var field = $(this);
		var newName = field.text();
		var nameChanged = newName !== f.name ? true : false;

		// Pressing 'Enter' saves the name change
		if (e.keyCode === 13 && nameChanged) {
			e.preventDefault();
			f.setName(newName, () => {
				updateFileElement(f, el);
			});
			this.contentEditable = false;
		} else if (e.keyCode === 27) {
			// Pressing 'Esc' resets the name
			$(this).text(f.name).attr('contentEditable', false);
		}
	});
	el.find('.fa-pencil.button').click(function() {
		// Allow user to rename the file
		var name = $(this).prev();
		name.attr('contentEditable', true);
		name.focus()
;	});
	
	// Add and return the new element
	// TODO: Implement right click actions on these files
	$('#file-list').append(el);
	return el;
}

module.exports = function(f) {
	// Determine to update or add a file element based on if it exists already
	if (!$('#' + f.hashedPath).length) {
		return makeFileElement(f);
	} else {
		return updateFileElement(f);
	}
};
