# Fixed Toxopid Starter

A minimal script mod for this Mindustry checkout: every Serpulo core tier (Shard, Foundation, Nucleus) spawns Toxopid, and Toxopid gains both building and mining, neither of which it has as shipped. Its eight-legged walk, hovering, weapons, leg splash, health and armor stay exactly as they are, and it is deliberately not made flying or boosting. `scripts/main.js` assigns seven fields on existing content while the game loads mod scripts, before content initialization. It adds no units, no UI, no update callbacks and no world processors.

## Behavior

- Shard, Foundation and Nucleus all spawn Toxopid on every new core and every respawn.
- Building is enabled at `buildSpeed` 0.5. Toxopid ships with `buildSpeed` -1, which is why it cannot construct anything without this mod.
- Mining is added at the shared starter baseline: `mineTier` 1 and `mineSpeed` 6.5. Toxopid ships with `mineTier` -1, so it cannot mine without this mod either. Tier 1 clears ore of hardness 1, which covers copper and lead; coal (2), titanium (3) and thorium (4) need a better tier.
- `itemCapacity` is normalized to 30. Toxopid leaves it unset and the engine derives 100 from its 26 hit size, so this is a reduction. Note what that capacity actually governs: a player-controlled unit inside `Vars.mineTransferRange` (220 pixels, about 27 tiles) of a core transfers each mined item straight to that core instead of storing it, so the held stack only fills when the unit mines farther from a core than that, or when the core cannot take the item. The 30 is a deliberate rule, but it is not observable in the ordinary start-next-to-your-core case.
- The movement model is untouched: eight legs of length 75, `hovering` true, `groundLayer` the leg-unit layer, movement speed 0.5, hit size 26, `flying` false and `canBoost` false. The integration test ticks a real player-controlled Toxopid standing on the core at all three tiers, because that is the case the leg collision rules have to survive on their own: a unit whose movement model does not accept the tile it stands on is killed inside `UnitComp.update`, and boost is not available here to mask it.
- Native damage is preserved: leg splash of 80 damage in a 60 range, the mirrored purple shotgun mount and the `toxopid-cannon` artillery with its sap status and frag bullets. Health 22000 and armor 22 are unchanged.
- `buildSpeed`, `mineTier`, `mineSpeed` and `itemCapacity` are properties of the shared Toxopid unit type, so ordinary factory-built and enemy Toxopids gain building and mining and the 30-item capacity too. That is intended and matches how vanilla unit stats work; isolating the change to core-spawned units would need dedicated unit variants.
- Core upgrades never transform the unit you control. Standard respawn and core-selection behavior is untouched, including possessing factory units. The unit you get after the next core spawn is Toxopid at any tier.
- Erekir cores (Bastion, Citadel, Acropolis) and their native builder units are not touched.

## Install

1. Download `fixed-toxopid-starter.zip` from the [Releases page](https://github.com/alfdupont/mindustry-starter-mods/releases/latest), or run `./package.sh` in this directory to rebuild it from these sources.
2. In Mindustry: Mods → Import Mod → select the ZIP.
3. Restart the game. Enabling, disabling or removing the mod also requires a restart.

Enable only ONE starter mod at a time. Disable Fixed Mono Starter, Fixed Poly Starter, Fixed Oct Starter and any other starter mod, then restart, before switching; several enabled starter mods would each remap the same cores and their effects could combine in load order. This mod never changes or disables another mod by itself.

Try it on a copied campaign save rather than a save you care about. Toxopid walks at 0.5 pixels per tick and turns at rotateSpeed 1.9, so this is the slowest starter of the set by a wide margin, and it is a large target with 22 armor. Removing the mod returns the core mappings and Toxopid's stats to default.

## Tested target

Verified only against this repository checkout (Mindustry source version 8, source base `7e6323c7a4` plus the starter-mod work on the `investigate/custom-starter` branch) through the integration test `tests/src/test/java/FixedToxopidStarterTests.java`, which loads the packaged ZIP through the normal mod/script loader in a headless profile. The manifest minimum build 146 is a loader admission setting, not a tested compatibility claim. No graphical, mobile, multiplayer or other-game-version testing has been performed.

## Test

Development checkout only - the Gradle harness is not part of the published archive. The test loads the packaged ZIP through the normal mod and script loader in a disposable headless profile, so it fails if the archive is absent, stale or inert. That headless profile bypasses the manifest version gate (`ModEntry.isSupported()` returns true when headless), so these checks do not exercise `minGameVersion`. From the repository root:

```sh
custom-mods/fixed-toxopid-starter/package.sh
JAVA_HOME=/usr/lib/jvm/java-17-openjdk ./gradlew :tests:test --tests FixedToxopidStarterTests --console=plain
```

See the [top-level README](../README.md) for the comparison of all six starter variants, install steps and what was verified. Source: [https://github.com/alfdupont/mindustry-starter-mods](https://github.com/alfdupont/mindustry-starter-mods).
