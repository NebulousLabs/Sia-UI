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

## Summary
Plugins are loaded into Sia-UI through an electron utility called the [web-view
tag](http://electron.atom.io/docs/v0.29.0/api/web-view-tag/). These tags open
up the viewing of guest content by pointing to an HTML file that displays the
rest of the plugin, incorporating CSS, Javascript as is usually done in a
webpage. One could open a plugin that access Github.com by incorporating

