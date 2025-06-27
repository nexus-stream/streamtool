# Streamtool

The streamtool for Project Nexus that connects therun.gg to OBS overlays and Advanced Scene Switcher through a Redux store that's shared between an OBS custom dock and browser sources.

## Overview

The backbone of this tool is a Redux store with the redux-persist and redux-sync-state middlewares. This lets us treat Redux as a shared data store between all browser tabs on the same origin - in this case meaning between a page running in an OBS custom browser dock and in Browser Sources within OBS scenes.

We also emit this store to obs-websocket as an Advanced Scene Switcher vendor event, which lets you ingest its data in a macro and use it in that tool as well.

## TheRun Integration

The tool tries to keep integration with TheRun as contained as possible so we only need to make focused changes if they make changes on their end. The gist is that we store the raw responses from their http and realtime APIs in the `races` and `users` redux slices. We _never_ use this data directly in the app though, everything is converted to our internal `DisplayRace` and `DisplayParticipant` types before being shown.

More info about this is in comments in the files under `data/display`.

## Setup

Because we need to communicate with obs-websocket, this tool needs to be served over http. However, to communicate with Twitch we need to be served over https.

The "right" way to deal with this would be to reverse tunnel your obs-websocket port out into the internet and make it accessible over https. That's a huge pain though, so I recommend just serving this tool over localhost. Twitch special cases localhost and lets you integrate with them despite being served over http.

## Usage

Hopefully the tool's pretty self explanatory, but if it isn't feel free to ping me (kylebyte) or Seren on Discord. The one wacky hidden thing is that ctrl+a when on the docked page will switch you between "admin mode" (shows tools necessary to build layouts) and "host mode" (hides all that stuff).

## Contributing

For most contributions to the tool, you should only need to touch files under `data/display`, `pages/browser-source/frames`, and extremely small changes to `editor/components/StageEditor.tsx` or `editor/components/ParticipantEditor.tsx`. If you're making changes anywhere else, make sure you're not reinventing the wheel for something there's already a helper for.

### I want to make more data from therun.gg accessible in the tool

This should be a four step process:

1. Add a field in the `DisplayRace` or `DisplayParticipant` interfaces
2. Add a builder for that field in `displayRaceFields.ts` or `displayParticipantFields.ts` (your change in step 1 will cause a type error in this file, so it'll be easy to find where to make the change)
3. (optional) Add or edit a frame to display your new field. If it's a simple text field, you can add it to the "kind" enum in the params of `raceText.tsx` or `participantText.tsx`, otherwise you can add a new frame and then add that to the mapping in `frames/index.ts`
4. (optional) Add an editor to `StageEditor.tsx` or `ParticipantEditor.tsx` for your new field. Follow the patterns in those files

And if you get stuck, please reach out either through this repo or to me (kylebyte) on Discord.
