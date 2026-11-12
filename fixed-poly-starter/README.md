# Fixed Poly Starter

A minimal script mod for this Mindustry checkout: every Serpulo core tier (Shard, Foundation, Nucleus) spawns Poly instead of its native Alpha/Beta/Gamma. Poly already builds and mines in this checkout, so nothing else is changed — no speed is normalized, no unit property is assigned. `scripts/main.js` assigns three fields on existing content while the game loads mod scripts, before content initialization. It adds no units, no UI, no update callbacks and no world processors.

## Behavior

- Shard, Foundation and Nucleus all spawn Poly on every new core and every respawn.
- Poly's shipped properties are untouched: build speed 0.4, mining tier 2 at mining speed 3.5, movement speed 2.6, health 400, flight, its healing-missile weapon and its repair field ability all stay exactly as this checkout defines them.
- Its item capacity stays at the shipped 30. Poly leaves `itemCapacity` unset, so `UnitType` derives it from hit size: `(int)(9 * 4)` is 36 and the integer division in `Mathf.round(36, 10)` truncates to 30. That coincidentally equals the capacity the other starter variants are given by rule, so no normalization would be visible either way.
- Because this mod assigns no shared unit-type property, ordinary factory-built and enemy Polys keep behaving exactly as in the unmodded game. Only the three Serpulo core spawn mappings differ, and those are per-core settings rather than unit stats. This is the one variant of the set that has no type-wide side effect.
- Core upgrades never transform the unit you control. Standard respawn and core-selection behavior is untouched, including possessing factory units. The unit you get after the next core spawn is Poly at any tier.
- Erekir cores (Bastion, Citadel, Acropolis) and their native builder units are not touched.

## Install

1. Download `fixed-poly-starter.zip` from the [Releases page](https://github.com/alfdupont/mindustry-starter-mods/releases/latest), or run `./package.sh` in this directory to rebuild it from these sources.
2. In Mindustry: Mods → Import Mod → select the ZIP.
3. Restart the game. Enabling, disabling or removing the mod also requires a restart.

Enable only ONE starter mod at a time. Disable Fixed Mono Starter and any other starter mod, then restart, before switching; several enabled starter mods would each remap the same cores and their effects could combine in load order. This mod never changes or disables another mod by itself.

Try it on a copied campaign save rather than a save you care about. Removing the mod returns the core mappings to default.

## Tested target

Verified only against this repository checkout (Mindustry source version 8, source base `7e6323c7a4` plus the starter-mod work on the `investigate/custom-starter` branch) through the integration test `tests/src/test/java/FixedPolyStarterTests.java`, which loads the packaged ZIP through the normal mod/script loader in a headless profile. The manifest minimum build 146 is a loader admission setting, not a tested compatibility claim. No graphical, mobile, multiplayer or other-game-version testing has been performed.

## Test

Development checkout only - the Gradle harness is not part of the published archive. The test loads the packaged ZIP through the normal mod and script loader in a disposable headless profile, so it fails if the archive is absent, stale or inert. That headless profile bypasses the manifest version gate (`ModEntry.isSupported()` returns true when headless), so these checks do not exercise `minGameVersion`. From the repository root:

```sh
custom-mods/fixed-poly-starter/package.sh
JAVA_HOME=/usr/lib/jvm/java-17-openjdk ./gradlew :tests:test --tests FixedPolyStarterTests --console=plain
```

See the [top-level README](../README.md) for the comparison of all six starter variants, install steps and what was verified. Source: [https://github.com/alfdupont/mindustry-starter-mods](https://github.com/alfdupont/mindustry-starter-mods).
