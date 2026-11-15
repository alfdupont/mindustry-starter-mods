# Router Hell

Every unit is a router. Every unit a Serpulo factory makes costs what a router costs and takes 10π seconds. Only T1 units remain to research, the reconstructors are gone, and the starters past the Shard are a Spiroct and a Vela that build and mine like the support units they replace. `scripts/main.js` changes existing content while the game loads mod scripts, before content initialization, and registers two callbacks that run once when the client has finished loading. It adds no content, no per-frame callbacks and no world processors.

## Behavior

- **Starters.** Shard keeps Alpha. Foundation spawns Spiroct, Nucleus spawns Vela.
  - Spiroct copies Poly's building and mining: `buildSpeed` 0.4, `mineTier` 2, `mineSpeed` 3.5 (shipped: cannot build or mine).
  - Vela copies Mega's: `buildSpeed` 2.6, `mineTier` 3, `mineSpeed` 4 (shipped: build 3, no mining). Copying Mega lowers Vela's own build speed from 3 to 2.6.
  - The values are read from Poly and Mega when the script runs, not typed in. Neither unit's `itemCapacity` is assigned, so each keeps the hold the engine derives from its size.
  - Spiroct survives on the core through its native leg collision rules, Vela through its native boost.
- **Unit cap.** `unitCapModifier` is 40 on Shard, 70 on Foundation and 100 on Nucleus (shipped: 8, 16, 24). The game adds the modifier of every core a team owns to the map's base cap, so two Shards give 80.
- **Cost and build time.** Every plan of the Ground, Air and Naval Factory costs 3 copper (the router's cost) and takes 10π seconds (1885 ticks, 31.4 s). The factory's item buffer and the unit's build-cost stat follow. Research costs in the tech tree were computed from the shipped plans before the script runs, and stay as shipped.
- **Tech tree (Serpulo).** Only units a factory builds directly stay: Dagger, Nova, Crawler, Flare, Mono, Risso, Retusa. Every T2 to T5 unit and the four reconstructors are removed.
  - Several sectors required researching one of those (Salt Flats the Additive Reconstructor, Naval Fortress Minke and Bryde, Planetary Terminal Omura and the Tetrative Reconstructor, and others). Those requirements are dropped, because they could no longer be met; the sector's other requirements stay.
  - Removing a node does not lock anything already researched in an existing save. In a sector that already has reconstructors unlocked, they can still be built.
- **Router sprites.** Once the client has loaded, every unit type (Erekir and other mods included) is drawn with the router sprite, scaled to cover the unit's own sprite footprint so big units stay big. Its outline, team colour cell, legs, treads, joints, weapons, unit and weapon parts and wrecks are replaced by an empty region. Engines, shields, mining lasers and other effects drawn from shapes are unchanged, as are hitboxes and stats. Menus and the database show the router icon.
- **Command mode.** Vela can boost, and in the shipped game Left Shift is both Command Mode and Boost. `DesktopInput.update` switches command mode off on every frame in which the player's unit can boost and those two keys are the same, so on a Nucleus shift + drag would select nothing. When the client has loaded and neither binding has been changed from its default, the mod moves Boost to Left Alt for the session. Nothing is written to settings, and a binding changed in Settings → Controls is left alone.
- These are properties of shared types, so factory-built, wave and map units of the same type change too: every Spiroct builds and mines like a Poly, every Vela like a Mega, every unit looks like a router.
- Erekir cores, their fabricators and the Erekir tech tree are not touched; only the router sprite reaches Erekir units.

## Install

1. Download `router-hell.zip` from the [Releases page](https://github.com/alfdupont/mindustry-starter-mods/releases/latest), or run `./package.sh` in this directory to rebuild it from these sources.
2. In Mindustry: Mods → Import Mod → select the ZIP.
3. Restart the game. Enabling, disabling or removing the mod also requires a restart.

Do not combine it with another mod from this repository: they all remap the same cores. Try it on a copied campaign save first.

## Tested target

Verified headless against a Mindustry source checkout (version 8, source base `7e6323c7a4`) through `tests/src/test/java/RouterHellTests.java`, which loads the packaged ZIP through the normal mod and script loader and checks:

- the three starters and the copied abilities; each starter survives its core and builds a real copper wall;
- the unit cap of a lone Shard, Foundation and Nucleus;
- every factory plan's cost and time, and a real Ground Factory turning 3 copper into a Dagger in 10π seconds;
- which nodes left the tree, that the tree stays consistent, and that no objective names removed content.

The two client callbacks were driven by firing the client-load event on a stand-in atlas. That checks what they assign, not how the result looks on screen. Not tested: the graphics client, mobile, multiplayer, a campaign playthrough. The manifest minimum build 146 is a loader admission setting, not a tested compatibility claim.

## Test

Development checkout only - the Gradle harness is not part of the published archive. From the repository root:

```sh
custom-mods/router-hell/package.sh
JAVA_HOME=/usr/lib/jvm/java-17-openjdk ./gradlew :tests:test --tests RouterHellTests --console=plain
```

See the [top-level README](../README.md) for the other mods. Source: [https://github.com/alfdupont/mindustry-starter-mods](https://github.com/alfdupont/mindustry-starter-mods).
