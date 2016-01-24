'use strict';

/*
 * fileElement function module:
 *   This module holds the creation logic for file elements.
 */

// Node modules
const $ = require('jquery');
const tools = require('./uiTools');

// File icons by extension
const fileIcons = {
	'pdf':'file-pdf-o',
	'jpg':'file-image-o',
	'bmp':'file-image-o',
	'png':'file-image-o',
	'tiff':'file-image-o',
	'tif':'file-image-o',
	'txt':'file-text-o',
	'ppt':'file-powerpoint-o',
	'pptx':'file-powerpoint-o',
	'js':'file-code-o',
	'c':'file-code-o',
	'php':'file-code-o',
	'css':'file-code-o',
	'html':'file-code-o',
	'zip':'file-archive-o',
	'gz':'file-archive-o',
	'tar':'file-archive-o',
	'mpg':'file-video-o',
	'wmv':'file-video-o',
	'mp4':'file-video-o',
	'mov':'file-video-o',
	'mp3':'file-sound-o',
	'wav':'file-sound-o',
	'xls':'file-excel-o',
	'doc':'file-word-o',
	'docx':'file-word-o',
};

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

	return el;
}

// Make file element with jquery
function makeFileElement(f) {
	// Get extension from name
	var re = /(?:\.([^.]+))?$/;
	var ext = re.exec(f.name)[1]; 
	var type = 'file-o';
	if (ext in fileIcons) {
		type = fileIcons[ext];
	}
	var subClass = 'fileicon';
	if (f.type === 'folder') {
		type = 'folder';
		var subClass = 'foldericon';
	}
	// TODO: Spaces in IDs is not valid HTML5. Use an alternative to f.name (which may contain spaces)
	var el = $(`
		<div class='file' id='${f.hashedPath}'>
			<i class='fa fa-${type} ${subClass}'></i>
			<div class='name' id='${f.name}'>${f.name}</div>
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
