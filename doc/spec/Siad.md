# Sia-UI Siad lifecycle specification

## Introduction

The purpose of this spec is to outline the desired behaviour of Sia-UI as it relates to starting, stopping, or connecting to an existing Siad.

## Desired Functionality

- Sia-UI should check for the existence of a running daemon on launch, by calling /daemon/version using the UI's current config.
If the daemon isn't running, Sia-UI should launch a new siad instance, using the bundled siad binary.  If a bundled binary cannot be found, prompt the user for the location of their `siad`.  Siad's lifetime should be bound to Sia-UI, meaning that `/daemon/stop` should be called when Sia-UI is exited.
- Alternatively, if an instance of `siad` is found to be running when Sia-UI starts up, Sia-UI should not quit the daemon when it is exited.

This behaviour can be implemented without any major changes to the codebase by leveraging the existing `detached` flag.

## Considerations

- Calling `/daemon/version` using the UI's config does not actually tell you whether or not there is an active `siad` running on the host, since a different `siad` instance could be running using a bindaddr different than the one specified in `config`.