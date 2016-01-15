'use strict';

const child_process = require('child_process');
const path = require('path');
const os = require('os');


// Up and down arrow history
var terminalHistory = [];
var historyPosition = -1;

// Dir where siac will be
var siaDir = path.join(__dirname, '../..', 'Sia');

// Form
var form = document.getElementById("terminal-form");
// Terminal results div
var terminal = document.getElementById("terminal-log");

// Command handling function
function siacCommand(command){
	// Check os type to choose to look for exe or not
	var osCommand;
	switch(os.type()){
		case 'Windows_NT':
			// Switch to Sia dir and run siac.exe
			osCommand = 'siac.exe';
			break;
		case 'Linux':
		case 'Darwin':
			osCommand = 'siac';
			break;
		default:
			osCommand = 'siac';
	}
	// Execute the command, siac.exe + the command
	child_process.exec("cd " + siaDir + " & " + osCommand + " " + command,function(err,stdout){
		if(err){
			terminal.innerHTML = terminal.innerHTML + '<p class="error">' + err + "</p>";
		}
		// Replace new lines with <br> for html
		stdout = stdout.replace(/(?:\r\n|\r|\n)/g, '<br>');

		// Insert the response into the terminal log
		terminal.innerHTML = terminal.innerHTML + "<p>" + stdout + "</p>";

		// Scroll the the bottom or the terminal div
		terminal.scrollTop = terminal.scrollHeight;
	});
}


// Event listener for the form's submit
form.addEventListener("submit", function(e){
	// Prevent the actual submission
	e.preventDefault();
	// Input field
	var inputCommand = document.getElementById("terminal-command");
	// Add the command to the terminal
	terminal.innerHTML = terminal.innerHTML + "<h4>" + inputCommand.value + "</h4>";
	// And scroll to the bottom
	terminal.scrollTop = terminal.scrollHeight;
	// Run the command
	siacCommand(inputCommand.value);
	// Add the command to history
	terminalHistory.push(inputCommand.value);
	// Empty the input
	inputCommand.value = "";
});

// Run help command on launch
siacCommand("help");

/////////////////////////////////
// History for up down arrow keys

// Form command input
var input = document.getElementById("terminal-command");

// Arrow key reponse handler
function inputHistory(){
	if(terminalHistory[historyPosition]){
		// Reverse the array and set the new value of the input
		input.value = terminalHistory.reverse()[historyPosition];
	}
}

// Bind the onkeyup event
input.onkeyup = function(evt){
	// If up arrorw
	if(evt.keyCode === 38){
		if(historyPosition < terminalHistory.length){
			// Add one to history position
			historyPosition++;
			// Update the value of the input
			inputHistory();
		}
	}
	// If down arrow
	if(evt.keyCode === 40){
		if(historyPosition > 0){
			// Subtract one from history position
			historyPosition--;
			// Update the value of the input
			inputHistory();
		}
	}
	else{
		return;
	}
};