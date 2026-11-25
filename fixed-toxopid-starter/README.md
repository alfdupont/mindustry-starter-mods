# Fixed Toxopid Starter

Every Serpulo core tier spawns Toxopid. It can move faster with Boost, build at cannon range, and mine ore through thorium.

## Behavior

- Shard, Foundation and Nucleus all spawn Toxopid on every new core and every respawn.
- Building and mining speeds match Poly on the running game version. The build speed is 0.4 on the Mindustry 8 test checkout and 0.5 on build 146. The mining speed is 3.5 on both.
- Mining tier 4 covers copper, lead, coal, titanium and thorium. A player-controlled Toxopid transfers mined ore directly to a nearby core that can accept it. Its cargo hold fits 100 items.
- Build range covers the longest-range weapon once Mindustry initializes it. On both tested builds, Toxopid can build up to 30 tiles away, up from 27.5 tiles.
- Walking speed is 0.5 world units per tick. At full boost, forward speed reaches 2 world units per tick. Toxopid uses its legged movement rules during a boost, so chasms still block it.
- With default desktop controls, hold Left Alt to boost. Left Shift still opens Command Mode. The mod applies this for the current session when neither control has been customized.
- The mod applies these changes to every Toxopid, including factory-built, enemy, and previously saved units.
- Core upgrades never transform the unit you control. Standard respawn and core-selection behavior is untouched, including possessing factory units. The unit you get after the next core spawn is Toxopid at any tier.
- Erekir cores (Bastion, Citadel, Acropolis) and their native builder units are not touched.

## Install

1. Download `fixed-toxopid-starter.zip` from the [Releases page](https://github.com/alfdupont/mindustry-starter-mods/releases/latest), or run `./package.sh` in this directory to rebuild it from these sources.
2. In Mindustry: Mods → Import Mod → select the ZIP.
3. Restart the game. Enabling, disabling or removing the mod also requires a restart.

Enable only ONE starter mod at a time. Disable Fixed Mono Starter, Fixed Poly Starter, Fixed Oct Starter and any other starter mod, then restart, before switching; several enabled starter mods would each remap the same cores and their effects could combine in load order. This mod never changes or disables another mod by itself.

Removing the mod returns the core mappings and Toxopid's stats to default.

## Tested target

The packaged ZIP passed headless checks on the Mindustry 8 development checkout and build 146. Tests covered building beyond the old reach, mining thorium into the core, and boosting. A keyboard test on build 160.8 confirmed the speed increase and that Toxopid still stops at a chasm while boosting.

See the [top-level README](../README.md) for the comparison of all six starter variants, install steps and what was verified. Source: [https://github.com/alfdupont/mindustry-starter-mods](https://github.com/alfdupont/mindustry-starter-mods).
