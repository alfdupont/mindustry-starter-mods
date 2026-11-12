# Boosting Crawler Starter

A minimal script mod for this Mindustry checkout: every Serpulo core tier (Shard, Foundation, Nucleus) spawns Crawler, and that Crawler gains building at speed 0.5, mining at tier 1 speed 6.5 with a 30-item held capacity, and boost. Its suicide weapon, health, armor and walk are untouched, and it is not made flying. `scripts/main.js` assigns eight fields on existing content while the game loads mod scripts, before content initialization. It adds no units, no UI, no update callbacks and no world processors.

## Behavior

- Shard, Foundation and Nucleus all spawn Crawler on every new core and every respawn.
- `canBoost` is set to true, and that alone is what keeps the starter alive. The spawn path still puts the unit at the center of the core, and a unit standing on a tile that is solid to its movement model is normally killed inside `UnitComp.update`. That same branch lifts a boosting unit to full elevation instead, so the Crawler rises above the core and can then fly clear. Nothing teleports it, the core spawn method is unchanged, and there is no periodic correction callback.
- `flying` stays false. Once the Crawler is over ground it can occupy and boost is released, the existing descent logic (`descentSpeed` 0.08) lowers it back down. Note the flip side of the recovery above: for as long as the tile underneath cannot be passed on, including the core itself, that branch keeps pushing the elevation back to maximum, so the unit hovers and will not settle there. It comes down on open ground, and the tests release boost five tiles away from the core to observe exactly that.
- Building is enabled at `buildSpeed` 0.5 and mining at `mineTier` 1 / `mineSpeed` 6.5; Crawler ships with `buildSpeed` -1 and `mineTier` -1, so neither works without this mod. Tier 1 clears ore of hardness 1 (copper, lead); coal (2), titanium (3) and thorium (4) need a better tier.
- `itemCapacity` is 30, which happens to be the value the engine already derives for Crawler from its 8 pixel hit size, so this normalization is invisible on this unit. It also governs less than it looks: a player-controlled unit within `Vars.mineTransferRange` (220 pixels, about 27 tiles) of a core hands each mined item straight to that core instead of storing it, so the held stack only fills farther out or when the core cannot take the item.
- The suicide weapon is preserved exactly: one weapon, `shootOnDeath` true, bullet `killShooter` true with 80 splash damage in a 44 radius and a 0.68 building damage multiplier. Dying still detonates the Crawler, so suicide attacks and the respawn that follows are part of the run - including next to your own buildings, since the blast damages them. Health 150, armor 0, movement speed 1, hit size 8 and range 40 are unchanged, as are the native rise and descent speeds of 0.08 and the 1.0 boost multiplier.
- These are properties of the shared Crawler unit type, so every other Crawler in the game - factory-built, reconstructed, or placed by a map or wave - also gets boost, building, mining and the 30-item capacity. That is intended and matches how vanilla unit stats work; isolating the change to core-spawned units would need dedicated unit variants.
- Core upgrades never transform the unit you control. Standard respawn and core-selection behavior is untouched, including possessing factory units. The unit you get after the next core spawn is Crawler at any tier, and death returns you to another Crawler through the normal respawn path.
- Erekir cores (Bastion, Citadel, Acropolis) and their native builder units are not touched.

## Install

1. Download `boosting-crawler-starter.zip` from the [Releases page](https://github.com/alfdupont/mindustry-starter-mods/releases/latest), or run `./package.sh` in this directory to rebuild it from these sources.
2. In Mindustry: Mods → Import Mod → select the ZIP.
3. Restart the game. Enabling, disabling or removing the mod also requires a restart.

Enable only ONE starter mod at a time. Disable the other starter mods, then restart, before switching; several enabled starter mods would each remap the same cores and their effects could combine in load order. This mod never changes or disables another mod by itself.

Try it on a copied campaign save rather than a save you care about, for two reasons: the shared type changes above, and the fact that a Crawler that dies detonates 80 damage in a 44 radius with a 0.68 multiplier against buildings. Removing the mod returns the core mappings and Crawler's stats to default.

## Tested target

Verified only against this repository checkout (Mindustry source version 8, source base `7e6323c7a4` plus the starter-mod work on the `investigate/custom-starter` branch) through the integration test `tests/src/test/java/BoostingCrawlerStarterTests.java`, which loads the packaged ZIP through the normal mod/script loader in a headless profile. The manifest minimum build 146 is a loader admission setting, not a tested compatibility claim. No graphical, mobile, multiplayer or other-game-version testing has been performed.

## Test

Development checkout only - the Gradle harness is not part of the published archive. The test loads the packaged ZIP through the normal mod and script loader in a disposable headless profile, so it fails if the archive is absent, stale or inert. That headless profile bypasses the manifest version gate (`ModEntry.isSupported()` returns true when headless), so these checks do not exercise `minGameVersion`. From the repository root:

```sh
custom-mods/boosting-crawler-starter/package.sh
JAVA_HOME=/usr/lib/jvm/java-17-openjdk ./gradlew :tests:test --tests BoostingCrawlerStarterTests --console=plain
```

See the [top-level README](../README.md) for the comparison of all six starter variants, install steps and what was verified. Source: [https://github.com/alfdupont/mindustry-starter-mods](https://github.com/alfdupont/mindustry-starter-mods).
