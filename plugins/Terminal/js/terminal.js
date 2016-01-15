const child_process = require('child_process');
const path = require('path');

var form = document.getElementById("terminal-form");
var terminal = document.getElementById("terminal-log");
form.addEventListener("submit", function(e){
	e.preventDefault();
	var inputCommand = document.getElementById("terminal-command");
	terminal.innerHTML = terminal.innerHTML + "<h4>" + inputCommand.value + "</h4>";
	terminal.scrollTop = terminal.scrollHeight;
	siacCommand(inputCommand.value);
	terminalHistory.push(inputCommand.value);
	inputCommand.value = "";
});





function siacCommand(command){
	const os = require('os');
	console.log(os.type());
	switch(os.type()){
		case 'Windows_NT':
			var osCommand = 'cd resources/app/Sia & siac.exe ';
		case 'Linux':
			var osCommand = 'cd resources/app/Sia & siac ';
		case 'Darwin':
			var osCommand = 'cd resources/app/Sia & siac ';
		/*default:
			var osCommand = 'cd resources/app/Sia & siac.exe ';*/
	}
	child_process.exec(osCommand + command,function(err,stdout){
		var terminal = document.getElementById("terminal-log");
		if(err){
			console.log(err);
			terminal.innerHTML = terminal.innerHTML + err;
		}
		stdout = stdout.replace(/(?:\r\n|\r|\n)/g, '<br />');
		terminal.innerHTML = terminal.innerHTML + "<p>" + stdout + "</p>";
		
		terminal.scrollTop = terminal.scrollHeight;
	});
}

siacCommand("help");



// History

var terminalHistory = [];
var historyPosition = -1;

var input = document.getElementById("terminal-command");

input.onkeyup = function(evt) {
	if(evt.keyCode === 38){
		if(historyPosition < terminalHistory.length){
			historyPosition++;
			inputHistory(terminalHistory, historyPosition);
		}
	}
	if(evt.keyCode === 40){
		if(historyPosition > 0){
			historyPosition--;
			inputHistory(terminalHistory, historyPosition);
		}
	}
	else{
		return;
	}
};

function inputHistory(terminalHistory, historyPosition){
	if(terminalHistory[historyPosition]){
		input.value = terminalHistory.reverse()[historyPosition];
	}
}