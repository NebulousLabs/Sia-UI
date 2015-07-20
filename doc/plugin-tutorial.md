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
		<title>Overview</title>
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

The plugin directory should now include an index.html at the root level of the plugin:
```text
Sia-UI/app/plugins/Overview/
├── index.html
└── assets/
	└── button.png
```
Loading up Sia-UI again, we'll see: ![Impressive plugin ain't it?](/doc/assets/basic-html.png)

## Adding Data Fields

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
unique id's to fill each of them separately later in JS.
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

Now we need to make a JS file to contain logic to fill these data fields. First
let's include the JS file-to-be-made in our index.html at the bottom to load
and fill our fields after the general skeleton has been parsed.
```html
		<!-- JS -->
		<script type='text/javascript' src='js/overview.js'></script>
	</body>
</html>
```

Let's make it pretty basic for now and set all fields to 0 to modularize this
tutorial. In our `js/overview.js` we'll put the following code.
```js
'use strict';
// Variables to store values
var balance = 0;
var peerCount = 0;
var blockHeight = 0;

// Fill header capsule fields
document.getElementById('balance').innerHTML = 'Balance: ' + balance;
document.getElementById('peers').innerHTML = 'Peers: ' + peerCount;
document.getElementById('block-height').innerHTML = 'Block Height: ' + blockHeight;
```

The plugin directory should reflect our addition:
```text
Sia-UI/app/plugins/Overview/
├── index.html
└── assets/
	└── button.png
```
Loading up Sia-UI again, we'll see: ![Impressive plugin ain't it?](/doc/assets/data-fields.png)

## Styling the View

Now that we have mock data to display to our user, we want this view to start
taking shape, form, and last-but-not-least, style! The UI has a font that we
use for the sidebar buttons called roboto condensed, so let's just copy paste
that into our folder so our plugin remains modular.

From terminal at the Sia-UI root directory:
```bash
cp app/assets/roboto-condensed-min.css app/plugins/Overview/assets
```

With a cool font, we need a cool layout. The following css was adopted from the
old Sia-UI and we'll throw it in a css folder in our plugin directory.
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

