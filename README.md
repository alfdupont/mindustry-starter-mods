# Mindustry starter mods

Six small alternative starter mods for the Serpulo campaign. Each one decides which unit your core builds you into, and next to nothing else. No new units, no blocks, no sprites, no UI, no per-frame logic: every mod is a handful of assignments applied to stock content while the game loads mod scripts, before content initialization.

Pick one. They all write the same three core spawn mappings, so if two are enabled they overwrite each other in script load order.

Nothing here assigns an item capacity, so each unit keeps the cargo hold the game derives from its size: Oct 260, Toxopid 100, Crawler 30. Where a unit gains building or mining, the rate is copied from a unit that already has that ability rather than invented: Mega's mining for Toxopid, a shade above Mega for Oct, Mono's for Crawler.

## Which one

| Mod | Spawned by Shard / Foundation / Nucleus | Unit stats assigned | Watch out for |
| --- | --- | --- | --- |
| [fixed-mono-starter](fixed-mono-starter/README.md) | Mono / Mono / Mono | build speed 0.5 | Mono is unarmed; every Mono in the game now builds at 0.5 |
| [fixed-poly-starter](fixed-poly-starter/README.md) | Poly / Poly / Poly | nothing | The only one with no side effect beyond the core mappings |
| [fixed-oct-starter](fixed-oct-starter/README.md) | Oct / Oct / Oct | mining tier 3 at speed 4.5 | Every Oct in the game mines at tier 3, just above Mega |
| [fixed-toxopid-starter](fixed-toxopid-starter/README.md) | Toxopid / Toxopid / Toxopid | build speed 0.5, mining tier 3 at speed 4, copied from Mega | Every Toxopid in the game builds and mines like a Mega |
| [boosting-crawler-starter](boosting-crawler-starter/README.md) | Crawler / Crawler / Crawler | build speed 0.5, mining tier 1 at speed 2.5, copied from Mono, plus boost | Crawler keeps its suicide weapon; every Crawler in the game gains all of this |
| [support-progression-starter](support-progression-starter/README.md) | Mono / Poly / Mega | build speed 0.5 on Mono | Progression by core tier instead of one unit throughout |

## Install

1. Download the ZIP of the one mod you want from the latest release.
2. Put it in the game's mods folder, or open Mods, choose Import Mod and select the file.
3. Enable it in the mods list and restart the game.
4. Before switching to a different starter mod, disable the current one and restart again.

The mods folder is `mods` inside the game's data directory, which on a default desktop install is `%APPDATA%\Mindustry` on Windows, `~/.local/share/Mindustry` on Linux and `~/Library/Application Support/Mindustry` on macOS. Import Mod avoids having to find it.

Install by file rather than by the in-game GitHub import: that path expects a single mod at the root of a repository, and this repository holds six.

## Check the download

Put `sha256sums.txt` next to the downloaded ZIPs and run `sha256sum -c sha256sums.txt`. On Windows, compare a single file with `certutil -hashfile fixed-mono-starter.zip SHA256`.

## What these mods do not do

- They leave the Erekir cores and their native builder units alone, so nothing changes on Erekir.
- They never transform the unit you are controlling when you upgrade a core. The new mapping is used by the next core spawn, which means a respawn or selecting the core again.
- They never enable, disable or modify another mod.
- They do not add content, so removing one returns the core mappings to their defaults on the next core spawn.

The stats a mod does assign are properties of a shared unit type, so factory-built, reconstructed and enemy units of that type change too. That is intentional and it is the main reason the variants are separate mods rather than one configurable mod.

## Compatibility

Verified headless against a Mindustry source checkout (version 8, source base `7e6323c7a4`) with integration tests that load the packaged ZIP through the normal mod and script loader, then check the core mappings and player control, a real copper wall paid for out of core resources, real copper ore mined into the core, upgrades and respawn at both later tiers, save and load, and that the properties the mod does not assign keep their shipped values.

`minGameVersion: 146` in each manifest is a loader admission setting, not a tested compatibility claim. The scripts only assign fields that exist in that source, so they should load on build 146 and later, but that combination was not run.

Not tested: multiplayer, mobile devices, the graphics client, a full campaign playthrough. Try a mod on a copied save before committing a sector to it, and expect sectors already captured to keep whatever core tier they have.

## Layout and rebuilding

Each directory is one mod: `mod.hjson`, `scripts/main.js`, `package.sh` and a README with its exact numbers. Running `./package.sh` inside a mod directory writes `build/<mod>.zip` with sorted entries and fixed timestamps, so a rebuild reproduces the released bytes and its SHA-256.

## License

GPL-3.0-or-later, matching Mindustry itself. See [LICENSE](LICENSE).
