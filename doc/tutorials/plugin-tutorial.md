# Plugins and Sia-UI

The new Sia-UI looks a bit lacking, why is that you ask? We steam-rolled the
older version because it felt very hard-coded. This new design allows easy
development of modular parts, called plugins, to interact with our system from
anyone with a little webdev knowledge.

## What is a plugin?

A plugin, in the context of Sia-UI, is a self-contained add-on that offers
graphical functionality to interact with the Sia-network. We'll develop plugins
we believe would be widely used, but we're also redesigning Sia-UI to enable
third-party developers interested in our project to make their own plugins.

The structure of a plugin is the exact same as a webpage, with some added
functionality via Node.js & Electron, the core library that supports the Atom
text editor. There are only two hard-rules to a plugin:

1. It must be self-contained in a directory of its name.
2. It must have an index.html in this directory.

## Why plugins?

We at NebulousLabs are all about decentralization... of everything! Thus we are
redesigning our GUI desktop application with that in mind. We want the
community interested in the Sia network to be able to:

1. Use Sia-UI in the way they want with only the plugins they care about instead
of using our rigid set of tools.
2. Be able to design and implement their own plugins.
3. Customize their own UI experience simply without obfuscating menubars.

In the works already is a product that would serve up the locations of files on
the network, not only for optimizing file storage across the world, but for
file-sharing via host-approved listing (think torrents).

We're also designing a GPU-mining software that would efficiently support the
network's transactions.

A third is a blockexplorer that would allow developers and prospectors alike to
understand and watch the flow of the network's coins, files, etc.

These are all products that we don't want to include with every Sia-UI
distribution so it makes sense to dynamically load them with the UI.

# How to write a plugin

## It's a webpage... it's that simple.

Plugins are loaded into Sia-UI on run-time through an electron utility called
the [web-view tag](http://electron.atom.io/docs/v0.29.0/api/web-view-tag/).
These tags open up the viewing of guest content by pointing to an HTML file
that displays the rest of the plugin, importing CSS, Javascript as is usually
done in a webpage.

One could make a plugin that views Github.com by making a folder
`app/plugins/Github` and placing a one-line index.html file:
`<meta http-equiv="refresh" content="0; url=http://Github.com/" />`
Suddenly, there's a button labeled 'Github' and upon click, shows ![Note:
Though this is currently a bit buggy due to sites using global variables that
conflict with nodeintegration being turned on.](/doc/assets/github-plugin.png)

## Making a Sidebar Button

However, we don't want developers to launch a webpage on a server just to make
a plugin. We're trying to make a basic plugin that serves an actual function.
For this, we'll go through implementing the Overview plugin.

Plugins are loaded dynamically based on the folders in the /app/plugins
directory. The sidebar is handled on our part so plugins only need a properly
placed png file and folder name for a button. 

The plugin directory should now be:

```text
Sia-UI/app/plugins/Overview/
└── assets/
    └── button.png
```

The Overview uses the 'bars' [font awesome icon in png form](http://fa2png.io/).
Loading up Sia-UI again, we'll see: ![Impressive plugin ain't
it?](/doc/assets/sidebar.png)

## Making a Mainbar View

Now to insert some content for our plugin. The overview plugin will be the home
plugin for most everyone, so we'll add a nice little greeting and title to it:

```html
<!DOCTYPE html>
<html>
	<head>
	</head>
	<body>
		<!-- Header -->
		<div class='header'>
			<div class='title' id='title'>Overview</div>
		</div>

		<!-- Frame -->
		<div class='frame'>
			<div class='welcome'>
				<div class='large'>Welcome to Sia</div>
				<div class='small'>A highly efficient decentralized storage network.</div>
			</div>
		</div>
	</body>
</html>
```

We've got how our users will be greeted upon entering the UI, now we should
determine what information should be regularly viewed upon entry by most every
user. Inspired by the previous UI, we pick the block height, peer count, and
wallet balance. The first lets the user know they're up to date with the
blockchain. The second lets the user further know that they're connected with
other people on the network. Lastly each and every user, whether they host,
rent, or mine, will probably have some balance of Siacoin.

We'll add a containing div, let's call it 'capsule' for our header section and
div fields for each of these to our index.html, keeping them all the same class
name, say 'pod' so that we can later style them alike CSS while giving them
unique id's to update each of them separately later in JS.

```html
		<!-- Header -->
		<div class='header'>
			<div class='title' id='title'>Overview</div>
			<div class='capsule'>
				<div class='pod' id='balance'>Balance: 0</div>
				<div class='pod' id='peers'>Peers: 0</div>
				<div class='pod' id='block-height'>Block Height: 0</div>
			</div>
		</div>
```

The plugin directory should now be:

```text
Sia-UI/app/plugins/Overview/
├── index.html
└── assets/
    └── button.png
```
Loading up Sia-UI again, we'll see: ![Impressive plugin ain't it?](/doc/assets/basic-overview.png)

## Styling the View

Now that we have mock data to display to our user, we want this view to start
taking shape, form, and last-but-not-least, style! The UI has a font that we
use for the sidebar buttons called roboto condensed, so let's just copy paste
that into our folder so our plugin remains modular.

From terminal at the Sia-UI root directory:

```bash
cp app/assets/roboto-condensed-min.css app/plugins/Overview/assets
```

Then we're going to need the plugin's index.html to know about this font and
our custom plugin CSS through adding two lines in the head section:

```html
	<head>
		<!-- CSS -->
		<link rel='stylesheet' href='assets/roboto-condensed-min.css'>
		<link rel='stylesheet' href='css/overview.css'>
	</head>

```

With a cool font, we need a cool layout. The following css was adopted from the
old Sia-UI and we'll throw it in a css folder in our plugin directory. We're
skimming over this because it's not too important to review in this particular
guide.

```css
/*	Style Guide:
 *		Transparent: 70% Opacity
 *
 * 		White:      #FFFFFF
 * 		Grey-White: #F5F5F5
 *		Faint-Grey: #ECECEC
 *		Light-Grey: #DDDDDD
 *		Grey:       #C5C5C5
 * 		Grey-Black: #4A4A4A
 * 		Black:      #000000
 */
body {
	margin: 0px;
	padding: 0px;
	border-spacing: 0px;
	font-family: 'Roboto Condensed', sans-serif;
	font-weight: 300;
	font-size: 18px;
}
.header {
	opacity: .7;
	padding: 20px;
	border-bottom: 2px solid #f5f5f5;
	background-color: #4a4a4a;
	color: #fff;
	height: 50px;
	vertical-align: top;
}
.header .title {
	display: inline-block;
	font-size: 32px;
	color: #fff;
}
.header .capsule {
	float: right;
}
.capsule {
	display: inline-block;
	border: 1px solid #ffffff;
	border-radius: 4px;
	overflow: hidden;
}
.capsule .pod {
	display: inline-block;
	padding: 10px;
	padding-left: 16px;
	padding-right: 16px;
	border-right: 1px solid #ffffff;
	color: #f5f5f5;
}
.capsule .pod:last-child {
	border: none;
	padding-right: 20px;
}
.frame {
	color: #f5f5f5;
	font-size: 32px;
	padding-top: 18px;
	padding-bottom: 0px;
	padding-left: 30px;
	padding-right: 16px;
}
.frame .text {
	color: #c5c5c5;
}
.welcome {
	margin-top: 50px;
	text-align: center;
}
.welcome .large {
	font-size: 72px;
	color: #c5c5c5;
}
.welcome .small {
	margin-top: 20px;
	font-size: 32px;
	color: #c5c5c5;
}
```

Quite a lot to take in without review, but that's how styling webpages goes. 

The plugin directory should reflect our css files:

```text
Sia-UI/app/plugins/Overview/
├── index.html
├── assets/
│   ├── button.png
│   └── roboto-condensed-min.css
└── css/
    └── overview.css
```

Loading up Sia-UI again, we'll see: ![Impressive plugin ain't it?](/doc/assets/styled-overview.png)

## Updating our View

Now we need to make a JS file to contain logic to fill these data fields. First
let's include the JS file-to-be-made in our index.html at the bottom to load
and fill our fields after the general skeleton has been parsed.

```html
		<!-- JS -->
		<script type='text/javascript' src='js/overview.js'></script>
	</body>
</html>
```

After we make such a javascript file, we should cover the additional tools
Sia-UI gives to its plugins beyond just a sidebar-button.

### IPC

We must first understand that plugins, due to their webview nature, run in a
separate process with different permissions than the general UI. This is so
plugin behavior is very controlled and encapsulated. Commmunication between it
and the UI will be through an asynchronous electron library tool called 'ipc' or
'inter-process-communication'. Thus, the top of our file should contain:

```js
'use strict';
// Library for communicating with Sia-UI
const IPC = require('ipc');
```

Asynchronous messages sent through ipc are picked up based on their channels.
On can send primitives, objects, or nothing at all through these channels and
the UI reacts accordingly. For example, turn chromium devtools on using:

```js
IPC.sendToHost('devtools');
```

It's like a mini API but the UI currently registers only 'devtools', and
'api-call' channels. For more detail, see app/js/pluginManager.js

### Making API calls

To send api calls through the UI to a hosted siad, call ipc's sendToHost()
function along the message channel 'api-call' and pass in the string of the
call address (for GET calls only).

```js
function callAPI() {
	IPC.sendToHost('api-call', '/wallet/status');
	IPC.sendToHost('api-call', '/gateway/status');
	IPC.sendToHost('api-call', '/consensus/status');
}
```

To do something with the result of said calls, one has to listen on the IPC
channel corresponding to the call string.

```js
// Update values per call
IPC.on('/wallet/status', function(err, result) {
	document.getElementById('balance').innerHTML = 'Balance: ' + result.Balance;
});
IPC.on('/gateway/status', function(err, result) {
	document.getElementById('peers').innerHTML = 'Peers: ' + result.Peers.length;
});
IPC.on('/consensus/status', function(err, result) {
	document.getElementById('block-height').innerHTML = 'Block Height: ' + result.Height;
});
```

### Plugin Lifecycle

Currently, the UI checks for and executes a function called init() upon loading
and kill() upon transitioning away from said function. Thus a plugin needs to
initialize and update its fields based on these two functions, even though it
continues to exist in the background when another view is shown.

A good way to do this is to have a global variable that points to a function
being executed periodically using native Javascript's setInterval().

```js
// Keeps track of if the view is shown
var updating;

function init() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Call the API regularly to update page
	updating = setInterval(callAPI, 1000);
}

function kill() {
	clearInterval(updating);
}
```

### Usability

This all functions well enough, but it's a bit of an amateur design when one
actually uses the plugin. Numbers are jerky and we see a large amount of
numbers for our balance since it's in 10^-24 Siacoin, or what we call
baseunits, similar to Bitcoin and satoshis.

```js
function formatSiacoin(baseUnits) {
	var ConversionFactor = Math.pow(10, 24);
	var display = baseUnits / ConversionFactor);
	return display + ' SC';
}
```

There's an issue with Javascript that we must circumvent, and that is that all
numbers are stored as 64 bit floating point values. Thus rounding occurs when
one, say, subtracts 1 from 3. When displayed to enough precision, we'll find
that the value is actually something like 1.9999999 instead of 2. We'll
incorporate the [bignumber.js library](https://github.com/MikeMcl/bignumber.js/) to solve our problems.

```js
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');

function formatSiacoin(baseUnits) {
	var ConversionFactor = new BigNumber(10).pow(24);
	var display = new BigNumber(baseUnits).dividedBy(ConversionFactor);
	return display + ' SC';
}

function init() {
	// Ensure precision
	BigNumber.config({ DECIMAL_PLACES: 24 })
	BigNumber.config({ EXPONENTIAL_AT: 1e+9 })
	
	// Call the API regularly to update page
	updating = setInterval(callAPI, 1000);
}
```

We should have global variables that are updated and not just update the markup
directly, so as to maintain non-initial values and avoid that 0 to actual
number jerk each and every time a user opens up our plugin.

```js
// Variables to store api result values
var balance = 0;
var peerCount = 0;
var blockHeight = 0;

// Update values per call
IPC.on('/wallet/status', function(err, result) {
	balance = formatSiacoin(result.Balance) || balance;
	document.getElementById('balance').innerHTML = 'Balance: ' + balance;
});
IPC.on('/gateway/status', function(err, result) {
	peerCount = result.Peers.length || peerCount;
	document.getElementById('peers').innerHTML = 'Peers: ' + peerCount;
});
IPC.on('/consensus/status', function(err, result) {
	blockHeight = result.Height || blockHeight;
	document.getElementById('block-height').innerHTML = 'Block Height: ' + blockHeight;
});
```

Finally, the aggregated Javascript code should look like this:

```
'use strict';
// Library for communicating with Sia-UI
const IPC = require('ipc');
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Variables to store api result values
var balance = 0;
var peerCount = 0;
var blockHeight = 0;
// Keeps track of if the view is shown
var updating;

function callAPI() {
	IPC.sendToHost('api-call', '/wallet/status');
	IPC.sendToHost('api-call', '/gateway/status');
	IPC.sendToHost('api-call', '/consensus');
}

function formatSiacoin(baseUnits) {
	var ConversionFactor = new BigNumber(10).pow(24);
	var display = new BigNumber(baseUnits).dividedBy(ConversionFactor);
	return display + ' SC';
}

// Update values per call
IPC.on('/wallet/status', function(err, result) {
	balance = formatSiacoin(result.Balance) || balance;
	document.getElementById('balance').innerHTML = 'Balance: ' + balance;
});
IPC.on('/gateway/status', function(err, result) {
	peerCount = result.Peers.length || peerCount;
	document.getElementById('peers').innerHTML = 'Peers: ' + peerCount;
});
IPC.on('/consensus', function(err, result) {
	blockHeight = result.Height || blockHeight;
	document.getElementById('block-height').innerHTML = 'Block Height: ' + blockHeight;
});

function init() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Ensure precision
	BigNumber.config({ DECIMAL_PLACES: 24 })
	BigNumber.config({ EXPONENTIAL_AT: 1e+9 })
	
	// Call the API regularly to update page
	updating = setInterval(callAPI, 1000);
}

function kill() {
	clearInterval(updating);
}
```

```text
Sia-UI/app/plugins/Overview/
├── index.html
├── assets/
│   ├── button.png
│   └── roboto-condensed-min.css
├── css/
│   └── overview.css
└── js/
	└── overview.js
```

Loading up Sia-UI again, we'll all see something different because the numbers
should be pulled from the API and one's siad-state. In our case, the view shows
the highly active dev network:
![Impressive plugin ain't it?](/doc/assets/dev-overview.png)

