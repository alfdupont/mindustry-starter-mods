# Fixed Mono Starter

A minimal script mod for this Mindustry checkout: every Serpulo core tier (Shard, Foundation, Nucleus) spawns Mono instead of its native Alpha/Beta/Gamma, and Mono gets a build speed of exactly 0.5 so the starter can construct blocks from the first minute. The mod is data-only at load time: `scripts/main.js` assigns four fields on existing content while the game loads mod scripts, before content initialization. It adds no units, no UI, no update callbacks and no world processors.

## Behavior

- Shard, Foundation and Nucleus all spawn Mono on every new core and every respawn.
- Mono's other native properties are unchanged: mining tier 1 at speed 2.5, flight speed, health, item capacity and its unarmed state all stay as shipped.
- Because `buildSpeed` is a property of the shared unit type, ordinary factory-built Monos can also build at speed 0.5. This is intended and matches how vanilla unit stats work.
- Core upgrades never transform the unit you control. Standard respawn and core-selection behavior is untouched, including possessing factory units. The unit you get after the next core spawn is Mono at any tier.
- Erekir cores (Bastion, Citadel, Acropolis) and their native builder units are not touched.

## Install

1. Download `fixed-mono-starter.zip` from the [Releases page](https://github.com/alfdupont/mindustry-starter-mods/releases/latest), or run `./package.sh` in this directory to rebuild it from these sources.
2. In Mindustry: Mods → Import Mod → select the ZIP.
3. Restart the game. Enabling, disabling or removing the mod also requires a restart.

Try it on a copied campaign save rather than a save you care about. The mod changes shared content, so a sector you play with it on will behave differently; removing it returns things to default.

## Tested target

Verified only against this repository checkout (Mindustry source version 8, source base `7e6323c7a4` plus the starter-mod work on the `investigate/custom-starter` branch) through the integration test `tests/src/test/java/FixedMonoStarterTests.java`, which loads the packaged ZIP through the normal mod/script loader in a headless profile. The manifest minimum build 146 is a loader admission setting, not a tested compatibility claim. No graphical, mobile, multiplayer or other-game-version testing has been performed.

## Test

Development checkout only - the Gradle harness is not part of the published archive. The test loads the packaged ZIP through the normal mod and script loader in a disposable headless profile, so it fails if the archive is absent, stale or inert. That headless profile bypasses the manifest version gate (`ModEntry.isSupported()` returns true when headless), so these checks do not exercise `minGameVersion`. From the repository root:

```sh
custom-mods/fixed-mono-starter/package.sh
JAVA_HOME=/usr/lib/jvm/java-17-openjdk ./gradlew :tests:test --tests FixedMonoStarterTests --console=plain
```

See the [top-level README](../README.md) for the comparison of all six starter variants, install steps and what was verified. Source: [https://github.com/alfdupont/mindustry-starter-mods](https://github.com/alfdupont/mindustry-starter-mods).
