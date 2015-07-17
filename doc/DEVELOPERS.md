# Ming's brief guide to javascript!

We use three major tools in this application and they follow this hierarchy:
Javascript -> Node.js -> Electron

## Javascript

Javascript itself works with a fluid definition of objects. All primitives are
pass by value, though objects themselves are passed by reference. This is
called
["call-by-sharing"](https://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_sharing).

## Node.js

Working with Node.js, one has to get used to callbacks and asynchronous
programming. Essentially, along series of operations that deal with Node
libraries, every call returns immediately in a non-blocking manner. Every
subsequent action cannot guarantee that every previous action was processed to
completion, and in fact assumes the opposite to ensure determinism.

## Electron

Lastly, our tool to develop desktop applications is Electron. It gives us a
variety of tools to easily work with desktop tools like file paths to
browser-windows. The best way to get acquainted with this tool quickly is to
read the codebase, referring to electron's documentation when necessary.

## Modularize!

Organize functions into a logically encompassing module. As a general rule of
thumb, don't let any file get to above 150 lines of code. If it is, it's likely
that you have code that can be separated out and required in this file.

In order to avoid [callback hell](http://callbackhell.com/):
1. Try to name most anonymous functions
2. If it makes sense for readability, move the named functions out to a more
logical place, perhaps even with some other functions into another .js file

## When in doubt...

[Consult this](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
[Or this](http://javascript.crockford.com/code.html)
