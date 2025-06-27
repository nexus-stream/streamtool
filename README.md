# Streamtool

The streamtool for Project Nexus that connects therun.gg to OBS overlays and Advanced Scene Switcher through a Redux store that's shared between an OBS custom dock and browser sources.

## Overview

This tool's backbone is a Redux store with the redux-persist and redux-sync-state middlewares. This lets us treat Redux as a shared data store between all browser tabs on the same origin - in this case meaning between a page running in an OBS custom browser dock and in Browser Sources within OBS scenes.

The homepage runs in an OBS custom browser dock and handles communications with TheRun, OBS, and Twitch, as well as giving the event host controls to reorder race participants or switch between "stages". This data is all sync'd through Redux to browser sources that can be added to your scenes through the tool, letting you display this data in a consistent, easy to assemble way.

We also emit this data to obs-websocket as an Advanced Scene Switcher vendor event, which lets you ingest its data in a macro and use it in that tool as well.

## TheRun Integration

The tool tries to keep integration with TheRun as contained as possible so we only need to make focused changes if they make changes on their end. The gist is that we store the raw responses from their http and realtime APIs in the `races` and `users` redux slices. We _never_ use this data directly in the app though, everything is converted to our internal `DisplayRace` and `DisplayParticipant` types before being shown.

More info about this is in comments in the files under `data/display`.

## Terminology

| Name             | Definition                                                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Stage            | The current step of the event. Can be associated with a TheRun race, but doesn't have to be - could consist entirely of tags |
| Race             | A TheRun race. The tool currently only supports things like timers and participants when connected to a TheRun race          |
| Participant      | A runner in a TheRun race. We call them participants to reflect the naming in TheRun's api                                   |
| Frame            | A view of the streamtool data that can be inserted into OBS as a browser source. Ex. Participant 1's Display Name            |
| "Display" values | Derived values from the data we get from TheRun's API that we use throughout the streamtool. Never stored in Redux           |

## Setup

Because we need to communicate with obs-websocket, this tool needs to be served over http. However, to communicate with Twitch we need to be served over https.

The "right" way to deal with this would be to reverse tunnel your obs-websocket port out into the internet and make it accessible over https. That's a huge pain though, so I recommend just serving this tool over localhost. Twitch special cases localhost and lets you integrate with them despite being served over http.

## Usage

To use the tool, add its homepage (http://localhost:5173 for a local dev environment) to OBS as a custom browser dock.

Hopefully using the tool's pretty self explanatory from there, but if it isn't feel free to ping me (kylebyte) or Seren on Discord. The one wacky hidden thing is that ctrl+a when on the docked page will switch you between "admin mode" (shows tools necessary to build layouts) and "host mode" (hides all that stuff).

## Contributing

For most contributions to the tool, you should only need to touch files under `data/display`, `pages/browser-source/frames`, and extremely small changes to `editor/components/StageEditor.tsx` or `editor/components/ParticipantEditor.tsx`. If you're making changes anywhere else, make sure you're not reinventing the wheel for something there's already a helper for.

### I want to make more data from therun.gg accessible in the tool

This should be a four step process:

1. Add a field in the `DisplayRace` or `DisplayParticipant` interfaces
2. Add a builder for that field in `displayRaceFields.ts` or `displayParticipantFields.ts` (your change in step 1 will cause a type error in this file, so it'll be easy to find where to make the change)
3. (optional) Add or edit a frame to display your new field. If it's a simple text field, you can add it to the "kind" enum in the params of `raceText.tsx` or `participantText.tsx`, otherwise you can add a new frame and then add that to the mapping in `frames/index.ts`
4. (optional) Add an editor to `StageEditor.tsx` or `ParticipantEditor.tsx` for your new field. Follow the patterns in those files

And if you get stuck, please reach out either through this repo or to me (kylebyte) on Discord. I wouldn't call this code bad, but I definitely cut some corners here and there, so there's plenty of room for it to be improved and plenty of design decisions that you shouldn't be afraid to change. Just don't break anything plz.
