# Fixed Oct Starter

A minimal script mod for this Mindustry checkout: every Serpulo core tier (Shard, Foundation, Nucleus) spawns Oct instead of its native Alpha/Beta/Gamma, and Oct gains mining at the highest tier in the game, which it does not have as shipped. Its native build speed 4.0, already faster than Mega's 2.6, is left exactly as it is. `scripts/main.js` assigns five fields on existing content while the game loads mod scripts, before content initialization. It adds no units, no UI, no update callbacks and no world processors.

## Behavior

- Shard, Foundation and Nucleus all spawn Oct on every new core and every respawn.
- Mining is added at `mineTier` 3 and `mineSpeed` 4.5. Oct ships with `mineTier` -1, which is why it cannot mine at all without this mod. Tier 3 is the highest `mineTier` any unit in this content ships with, and 4.5 sits just above Mega's native 4: Oct is where the Mega's support role grows into, so it should not be the weakest miner in the game.
- Held capacity is not assigned at all. Oct leaves `itemCapacity` unset, so `UnitType.init()` keeps deriving 260 from its 66 hit size and the starter carries the full vanilla hold. `payloadCapacity` is a separate field and stays native at 1936 (30.25 blocks of payload), so Oct still lifts the same structures and units it always could.
- What a tier unlocks comes from `MinerComp.canMine`, which is `type.mineTier >= item.hardness`: tier 3 covers copper and lead (hardness 1), coal (2) and titanium (3). Thorium (4) and tungsten (5) need a higher tier than any unit in this content has. Harder ore is also slower to break, because the timer is `50 + hardness * 15` ticks of contact divided across `mineSpeed`.
- Build speed stays 4.0, which is eight times Alpha's 0.5. Movement speed 0.8, health 24000, armor 20, hit size 66, flight, the force-field ability (radius 140, 7000 shield, 8 sides) and the repair field (130 per pulse, range 140) are all untouched. Oct has no weapons, before or after this mod.
- These two mining fields are properties of the shared Oct unit type, so ordinary factory-built and enemy Octs gain the same tier 3 mining at speed 4.5. That is intended and matches how vanilla unit stats work; isolating the change to core-spawned units would need dedicated unit variants.
- Core upgrades never transform the unit you control. Standard respawn and core-selection behavior is untouched, including possessing factory units. The unit you get after the next core spawn is Oct at any tier.
- Erekir cores (Bastion, Citadel, Acropolis) and their native builder units are not touched.

## Install

1. Download `fixed-oct-starter.zip` from the [Releases page](https://github.com/alfdupont/mindustry-starter-mods/releases/latest), or run `./package.sh` in this directory to rebuild it from these sources.
2. In Mindustry: Mods → Import Mod → select the ZIP.
3. Restart the game. Enabling, disabling or removing the mod also requires a restart.

Enable only ONE starter mod at a time. Disable Fixed Mono Starter, Fixed Poly Starter and any other starter mod, then restart, before switching; several enabled starter mods would each remap the same cores and their effects could combine in load order. This mod never changes or disables another mod by itself.

Try it on a copied campaign save rather than a save you care about. Oct is a slow, 66-pixel unit that turns at rotateSpeed 1, so expect a very different first minute from the Mono or Poly variants. Removing the mod returns the core mappings and Oct's stats to default.

## Tested target

Verified only against this repository checkout (Mindustry source version 8, source base `7e6323c7a4` plus the starter-mod work on the `investigate/custom-starter` branch) through the integration test `tests/src/test/java/FixedOctStarterTests.java`, which loads the packaged ZIP through the normal mod/script loader in a headless profile. The manifest minimum build 146 is a loader admission setting, not a tested compatibility claim. No graphical, mobile, multiplayer or other-game-version testing has been performed.

## Test

Development checkout only - the Gradle harness is not part of the published archive. The test loads the packaged ZIP through the normal mod and script loader in a disposable headless profile, so it fails if the archive is absent, stale or inert. That headless profile bypasses the manifest version gate (`ModEntry.isSupported()` returns true when headless), so these checks do not exercise `minGameVersion`. From the repository root:

```sh
custom-mods/fixed-oct-starter/package.sh
JAVA_HOME=/usr/lib/jvm/java-17-openjdk ./gradlew :tests:test --tests FixedOctStarterTests --console=plain
```

See the [top-level README](../README.md) for the comparison of all six starter variants, install steps and what was verified. Source: [https://github.com/alfdupont/mindustry-starter-mods](https://github.com/alfdupont/mindustry-starter-mods).
