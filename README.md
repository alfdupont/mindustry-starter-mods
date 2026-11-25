# Mindustry starter mods

Eight script mods for the Serpulo campaign.

The six **starter mods** set which unit your core spawns and, in some cases, adjust that unit's stats. They use the existing units and blocks. Boosting Crawler and Fixed Toxopid adjust the default desktop boost key once when the client finishes loading. Fixed Toxopid sets its build reach once weapon ranges are initialized.

The two **challenge mods** go further:

- [Router Hell](router-hell/README.md) reshapes the unit game around the router.
- [Crawlers All The Way Down](crawlers-all-the-way-down/README.md) adds four bigger Crawlers that the reconstructors grow one into the next.

Both change the Serpulo tech tree and use client callbacks. Their READMEs list exactly what they change.

Pick one. They all write the same three core spawn mappings, so if two are enabled they overwrite each other in script load order.

Each starter keeps its native cargo hold. Oct carries 260 items, Toxopid 100 and Crawler 30.

## Which one

| Mod | Spawned by Shard / Foundation / Nucleus | Unit stats assigned | Watch out for |
| --- | --- | --- | --- |
| [fixed-mono-starter](fixed-mono-starter/README.md) | Mono / Mono / Mono | build speed 0.5 | Mono is unarmed; every Mono in the game now builds at 0.5 |
| [fixed-poly-starter](fixed-poly-starter/README.md) | Poly / Poly / Poly | nothing | The only one with no side effect beyond the core mappings |
| [fixed-oct-starter](fixed-oct-starter/README.md) | Oct / Oct / Oct | mining tier 3 at speed 4.5 | Every Oct in the game mines at tier 3, just above Mega |
| [fixed-toxopid-starter](fixed-toxopid-starter/README.md) | Toxopid / Toxopid / Toxopid | Poly's building and mining speeds, thorium mining, 30-tile build reach, 4× forward speed on Boost | Changes every Toxopid. Default desktop Boost moves to Left Alt |
| [boosting-crawler-starter](boosting-crawler-starter/README.md) | Crawler / Crawler / Crawler | build speed 0.5, mining tier 1 at speed 2.5, copied from Mono, plus boost | Crawler keeps its suicide weapon; every Crawler in the game gains all of this; Boost moves to Left Alt |
| [support-progression-starter](support-progression-starter/README.md) | Mono / Poly / Mega | build speed 0.5 on Mono | Progression by core tier instead of one unit throughout |

| Challenge mod | Spawned by Shard / Foundation / Nucleus | What else changes | Watch out for |
| --- | --- | --- | --- |
| [router-hell](router-hell/README.md) | Alpha / Spiroct / Vela | Every unit drawn as a router; factory units cost 3 copper and take 10π s; unit cap 40 / 70 / 100; only T1 units and no reconstructors in the tech tree | Spiroct builds and mines like Poly, Vela like Mega, everywhere; Boost moves to Left Alt |
| [crawlers-all-the-way-down](crawlers-all-the-way-down/README.md) | Crawler / Crawler II / Crawler III | Adds Crawler II to V, grown by the four reconstructors, up to an impact-reactor blast; only the Crawler line, the Ground Factory and the reconstructors in the unit tech tree; crawler factories and Crawlers built on each sector's statistics page | Adds unit types; Crawler II and III explosion values are placeholders; Boost moves to Left Alt |

### Command mode and boosting starters

Mindustry defaults to Left Shift for both Command Mode and Boost. On desktop, that shared binding disables command mode while you control a unit that can boost.

Fixed Toxopid Starter, Boosting Crawler Starter, Crawlers All The Way Down and Router Hell move Boost to Left Alt for the session when both bindings use their defaults. Custom bindings remain in effect.

## Install

1. Download the ZIP of the one mod you want from the latest release.
2. Put it in the game's mods folder, or open Mods, choose Import Mod and select the file.
3. Enable it in the mods list and restart the game.
4. Before switching to a different starter mod, disable the current one and restart again.

The mods folder is `mods` inside the game's data directory, which on a default desktop install is `%APPDATA%\Mindustry` on Windows, `~/.local/share/Mindustry` on Linux and `~/Library/Application Support/Mindustry` on macOS. Import Mod avoids having to find it.

Install by file rather than by the in-game GitHub import: that path expects a single mod at the root of a repository, and this repository holds eight.

## Check the download

Put `sha256sums.txt` next to the downloaded ZIPs and run `sha256sum -c sha256sums.txt`. On Windows, compare a single file with `certutil -hashfile fixed-mono-starter.zip SHA256`.

## What these mods do not do

- They leave the Erekir cores and their native builder units alone, so nothing changes on Erekir, except that Router Hell draws every unit, Erekir's included, as a router.
- They never transform the unit you are controlling when you upgrade a core. The new mapping is used by the next core spawn, which means a respawn or selecting the core again.
- They never enable, disable or modify another mod.
- Apart from Crawlers All The Way Down, they do not add content, so removing one returns the core mappings to their defaults on the next core spawn. Removing Crawlers All The Way Down also removes Crawler II to V from any save that has them.

The stats a mod does assign are properties of a shared unit type, so factory-built, reconstructed and enemy units of that type change too. That is intentional and it is the main reason the variants are separate mods rather than one configurable mod.

## Compatibility

Verified headless against a Mindustry source checkout (version 8, source base `7e6323c7a4`). The starter mods are covered by integration tests that load the packaged ZIP through the normal mod and script loader, then check the core mappings and player control, a real copper wall paid for out of core resources, real copper ore mined into the core, upgrades and respawn at both later tiers, save and load, and that the properties the mod does not assign keep their shipped values.

`minGameVersion: 146` sets the minimum build accepted by the loader. Fixed Toxopid Starter also passed headless checks on build 146 and a desktop Boost key test on build 160.8.

The challenge mods are covered by tests of the same kind, listed in their READMEs. Their client-side parts (router and Crawler sprites, the Boost key, the sector statistics page) were checked by firing the client-load event on a stand-in atlas, not in a running game.

Multiplayer, mobile devices and a full campaign playthrough are untested. Try a mod on a copied save before committing a sector to it, and expect sectors already captured to keep whatever core tier they have.

## Layout and rebuilding

Each directory is one mod: `mod.hjson`, `scripts/main.js`, `package.sh` and a README with its exact numbers; Crawlers All The Way Down also has `bundles/` for its English and French text. Running `./package.sh` inside a mod directory writes `build/<mod>.zip` with sorted entries and fixed timestamps, so a rebuild reproduces the released bytes and its SHA-256.

## License

GPL-3.0-or-later, matching Mindustry itself. See [LICENSE](LICENSE).
