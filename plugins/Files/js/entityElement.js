'use strict';

/*
 * entityElement function module:
 *   This module makes an element with all common aspects between file/folder
 *   elements in the browser's file list
 */

// Node modules
const $ = require('jquery');
const tools = require('./uiTools');

// Make entity element with jquery
function makeEntityElement(entity) {
	var el = $(`
		<div class='${entity.type} entity' id='${entity.name}'>
			<div class='graphic'>
				<i class='fa fa-${entity.type}'></i>
			</div>
			<div class='name'>${entity.name}</div>
			<div class='size'>${tools.formatByte(entity.size)}</div>
			<div class='button download cssTooltip' tooltip-content="Download"><i class='fa fa-download'></i></div>
			<div class='button share cssTooltip' tooltip-content="Share"><i class='fa fa-share-alt'></i></div>
			<div class='button delete cssTooltip' tooltip-content="Delete"><i class='fa fa-remove'></i></div>
		</div>
	`);

	// Give the entity buttons clickability
	el.find('.download').click(function() {
		// Get file system path to download to
		var destination = tools.dialog('save', {
			title:       'Download ' + entity.name,
			defaultPath: entity.name,
		});
		if (!destination) {
			return;
		}
		tools.notify(`Downloading ${entity.name} to ${destination}`, 'download');
		entity.download(destination, function() {
			tools.notify(`{entity.name} downloaded to ${destination}`, 'success');
		});
	});
	el.find('.delete').click(function() {
		// Confirm deletion
		var confirmation = tools.dialog('message', {
			type:    'warning',
			title:   'Confirm Deletion',
			message: `Are you sure you want to delete ${entity.name}?`,
			detail:  'This will permanently remove it from your library!',
			buttons: ['Okay', 'Cancel'],
		});
		if (confirmation === 0) {
			entity.delete(() => el.remove());
		}
	});

	// Allow renaming
	el.find('.name').click();
	
	// Return the new element
	return el;
}

module.exports = makeEntityElement;
