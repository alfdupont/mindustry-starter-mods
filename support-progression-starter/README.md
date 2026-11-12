# Support Progression Starter

A script mod for this Mindustry checkout that makes the starter unit follow the core tier: Mono at the Shard, Poly at the Foundation and Mega at the Nucleus, with Mono given a build speed of exactly 0.5 so it can construct from the first minute. Only four fields are assigned. `scripts/main.js` does that while the game loads mod scripts, before content initialization, and adds no units, no UI, no update callbacks and no world processors.

## Exact changes

| Core | Unmodded spawn | With this mod |
| --- | --- | --- |
| Shard | Alpha | Mono, buildSpeed 0.5 (native -1, which means it cannot build at all) |
| Foundation | Beta | Poly, native buildSpeed 0.4 retained |
| Nucleus | Gamma | Mega, native buildSpeed 2.6 retained |

Nothing else is assigned. All three units keep the mining, carry capacity, movement, weapons and abilities this checkout gives them: Mono mines at tier 1 / speed 2.5 and is unarmed, Poly at tier 2 / speed 3.5 with its repair-field ability (5 health, every 480 ticks, range 50) and its mirrored weapon, Mega at tier 3 / speed 4 with armor 3, a 2x2 payload capacity of 256 and its two healing weapons. Native carry capacities also stay as shipped - Mono 20, Poly 30, Mega 60, all derived by the engine from hit size - and no mining or capacity value is assigned to any of them, because all three already mine.

## Behavior

- Upgrading a core does not evolve the unit you control. The controlled Mono stays a Mono through a Shard-to-Foundation upgrade; the new mapping is used by the next core spawn, which means re-entering the core (core selection drops the current unit) or dying and respawning. There is no animation, teleport or replacement at the moment of the upgrade, and no periodic correction callback.
- Respawn keeps using the ordinary path, including the usual delay of 60 ticks before the core sends the next unit.
- The unit types are shared content, so Mono's new build speed applies to every Mono in the game - factory-built, reconstructed or placed by a map - for every team. Poly and Mega are not modified by this mod at all, so their factory and enemy versions behave exactly as vanilla.
- Upgrading the core is still paid from the core's own stock, and the stock carried into the new core is the previous stock minus that upgrade cost (a Foundation costs 3000 copper in this checkout). This mod does not change that; it only decides which unit the upgraded core then spawns.
- Erekir cores (Bastion, Citadel, Acropolis) and their native builder units are not touched.

## Install

1. Download `support-progression-starter.zip` from the [Releases page](https://github.com/alfdupont/mindustry-starter-mods/releases/latest), or run `./package.sh` in this directory to rebuild it from these sources.
2. In Mindustry: Mods → Import Mod → select the ZIP.
3. Restart the game. Enabling, disabling or removing the mod also requires a restart.

Enable only one starter mod at a time. Disable `fixed-mono-starter`, `fixed-poly-starter`, `fixed-oct-starter`, `fixed-toxopid-starter` and `boosting-crawler-starter` before enabling this one, and restart after switching, otherwise their core mappings overwrite one another in script load order, which this mod neither controls nor detects. This mod never changes or disables another mod programmatically.

Try it on a copied campaign save rather than a save you care about. The mod changes shared content, so sectors played with it on behave differently and cores already captured keep whatever tier they have. Removing the mod returns the mappings to default on the next core spawn.

## Tested target

Verified only against this repository checkout (Mindustry source version 8, source base `7e6323c7a4` plus the starter-mod work on the `investigate/custom-starter` branch) through the integration test `tests/src/test/java/SupportProgressionStarterTests.java`, which loads the packaged ZIP through the normal mod/script loader in a headless profile. The manifest minimum build 146 is a loader admission setting, not a tested compatibility claim. No graphical, mobile, multiplayer or full-campaign testing has been performed.

## Test

Development checkout only - the Gradle harness is not part of the published archive. The test loads the packaged ZIP through the normal mod and script loader in a disposable headless profile, so it fails if the archive is absent, stale or inert. That headless profile bypasses the manifest version gate (`ModEntry.isSupported()` returns true when headless), so these checks do not exercise `minGameVersion`. From the repository root:

```sh
custom-mods/support-progression-starter/package.sh
JAVA_HOME=/usr/lib/jvm/java-17-openjdk ./gradlew :tests:test --tests SupportProgressionStarterTests --console=plain
```

See the [top-level README](../README.md) for the comparison of all six starter variants, install steps and what was verified. Source: [https://github.com/alfdupont/mindustry-starter-mods](https://github.com/alfdupont/mindustry-starter-mods).
