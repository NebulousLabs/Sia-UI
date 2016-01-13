'use strict';

// Save password to the UI's config.json
function savePassword(pw) {
	IPCRenderer.sendSync('config', 'walletPassword', pw);
}

// Make a basic popup 
function popup() {
	var el = $(`
			<div class='popup m-font'>
				<div class='row'>
					<div class='title l-font'>TITLE</div>
					<div class='button close'>
						<i class='fa fa-times'></i>
					</div>
				</div>
				<div class='button enter'>
					<i class='fa fa-check-circle'></i>
				</div>
			</div>
	`);

	// Exit popup
	el.find('.close').click(function() {
		el.remove();
	});

	return el;
}

// Edit a password input onto a popup
function makePasswordPopup(el) {
	el.find('.row').after(`
		<input type='checkbox' class='save-password'>Save password <br/>
		<div class='hidden warning s-font'>Warning: This is equivalent to having an
			unencrypted wallet and poses a security risk!</div>
		<input type='password' placeholder='Wallet password'>
	`);
	
	// An 'Enter' keypress in the input field will submit it.
	el.find('input:password').keydown(function(e) {
		e = e || window.event;
		if (e.keyCode === 13) {
			el.find('.enter').click();
		}
	});
	
	// If the user wants to save the password in either popup, they
	// should be warned of the security risks
	el.find('.save-password').click(function() {
		if (this.checked) {
			el.find('.warning').show();
		} else {
			el.find('.warning').hide();
		}
	});

	return el;
}

// Edit a seed input onto a popup
function makeSeedPopup(el) {
	el.find('.row').after(`
		<input type='text' placeholder='Seed'>
	`);
	
	// An 'Enter' keypress in the input field will submit it.
	el.find('input:text').keydown(function(e) {
		e = e || window.event;
		if (e.keyCode === 13) {
			el.find('.enter').click();
		}
	});

	return el;
}

// Make a popup with a password prompt
function passwordPopup(callback) {
	var el = makePasswordPopup(popup());
	el.find('.title').text('Enter your password');

	// Entering the password calls the callback with it
	el.find('.enter').click(function() {
		// Save password if checked
		var pw = el.find('input:password').val();
		if (el.find('.save-password').get(0).checked) {
			savePassword(pw);
		}
	
		// Destroy popup and call the callback
		callback(pw);
		el.remove();
	});

	// Show the popup
	$('#wallet').append(el);
	el.find('input:password').focus();
}

// Make a popup with an input field for seeds
function seedPopup(callback) {
	var el = makeSeedPopup(popup());
	el.find('.title').text('Enter your seed');

	// Entering the seed calls the callback with it passed
	el.find('.enter').click(function() {
		// Destroy popup and call the callback
		var seed = el.find('input:text').val();
		callback(seed);
		el.remove();
	});

	// Show the popup
	$('#wallet').append(el);
	el.find('input:text').focus();
}

// Make a popup with an input field for seeds
function passwordSeedPopup(callback) {
	var el = makeSeedPopup(makePasswordPopup(popup()));
	el.find('.title').text('Enter your password and seed');

	// Entering the seed calls the callback with it passed
	el.find('.enter').click(function() {
		// Destroy popup and call the callback
		var pw = el.find('input:password').val();
		var seed = el.find('input:text').val();
		callback(pw, seed);
		el.remove();
	});

	// Show the popup
	$('#wallet').append(el);
	el.find('input:password').focus();
}

module.exports = {
	password: passwordPopup,
	seed: seedPopup,
	passwordSeed: passwordSeedPopup,
};
