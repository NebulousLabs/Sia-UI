# Plugins

In order to form a more modular codebase, most functionality in the UI is
contained in webpage like structures we call "Plugins".

## What is a plugin?

A plugin, in the context of Sia-UI, is a self-contained add-on that offers
graphical functionality to interact with the Sia-network. We'll develop plugins
we believe would be widely used, but we're also redesigning Sia-UI to enable
third-party developers interested in our project to make their own plugins.

The structure of a plugin is the exact same as a webpage, with some added
functionality via Node.js & Electron. There are only two hard-rules to a
plugin:

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

