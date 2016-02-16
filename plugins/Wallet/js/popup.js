'use strict';

// Make a popup with a password prompt
function passwordPopup(callback) {
	var el = $(`
		<div class='popup m-font'>
			<div class='row'>
				<div class='title l-font'>Enter your password</div>
				<div class='button close'>
					<i class='fa fa-times'></i>
				</div>
			</div>
			<input type='checkbox' class='save-password'>Save password <br/>
			<div class='hidden warning s-font'>Warning: This is equivalent to having an
				unencrypted wallet and poses a security risk!</div>
			<input type='password' placeholder='Wallet password'>
			<div class='button enter'>
				<i class='fa fa-check-circle'></i>
			</div>
		</div>
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

	// Exit popup
	el.find('.close').click(function() {
		el.remove();
	});

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
	return el;
}

module.exports = passwordPopup;
