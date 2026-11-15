# Crawlers All The Way Down

Crawler is the only unit left to research on Serpulo, and each reconstructor grows it into a bigger, tougher Crawler with a bigger bang, up to Crawler V, whose explosion is an impact reactor's. Each core spawns the Crawler of its tier. Unlike the other mods here, this one adds content: four unit types, Crawler II to Crawler V. `scripts/main.js` creates them and changes existing content while the game loads mod scripts. It also registers callbacks for the sprites, the Boost key and the sector statistics.

## Tiers

| Tier | Made by | Hit size | Health | Armor | Speed | Explosion radius | Explosion damage | vs. buildings |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Crawler (I) | Ground Factory | 8 | 150 | 0 | 1.0 | 44 (5.5 tiles) | 80 | ×0.68 |
| Crawler II | Additive Reconstructor | 12 | 600 | 3 | 0.9 | 66 (8.3 tiles) | 320 | ×0.68 |
| Crawler III | Multiplicative Reconstructor | 16 | 1000 | 9 | 0.8 | 100 (12.5 tiles) | 1260 | ×0.68 |
| Crawler IV | Exponential Reconstructor | 24 | 8000 | 14 | 0.7 | 152 (19 tiles) | 5000 | ×1 |
| Crawler V | Tetrative Reconstructor | 32 | 22000 | 22 | 0.6 | 96 (12 tiles) | 7600 | ×1 |

- Crawler I is the shipped Crawler; its health, weapon and walk stay as shipped.
- Size scales the sprite, hit size, AI range and trigger range by 1.5, 2, 3 and 4. Health and armor are those of the unit the same reconstructor makes from the shipped Crawler line (Atrax, Spiroct, Arkyid, Toxopid).
- Crawler IV copies the thorium reactor's explosion and Crawler V the impact reactor's: radius, damage, effect, sound and screen shake are read from those blocks. The impact reactor's radius is 12 tiles, smaller than the thorium reactor's 19, so Crawler V hits much harder over a smaller area than Crawler IV.
- Crawler II and III are not specified yet. Until they are, they sit on the geometric curve from Crawler I to Crawler IV (×1.51 radius and ×3.97 damage per tier).
- Like the shipped Crawler, every blast hurts enemies only, while a real reactor hurts everything around it.
- Each new tier is a Crawler underneath: the same entity class (mech), the same suicide AI, a single weapon that fires on death and kills the shooter.

## Behavior

- **Starters.** Shard spawns Crawler, Foundation Crawler II, Nucleus Crawler III.
  - Every tier can boost. That is what lets a Crawler spawned on a core rise off it instead of being killed on a solid tile.
  - Each starter copies the building and mining of the shipped core unit of the core that spawns it: Crawler takes Alpha's (build 0.5, mining tier 1 at 6.5), Crawler II takes Beta's (0.75, tier 1 at 7), Crawler III takes Gamma's (1, tier 2 at 8).
  - Crawler IV and V are never spawned by a core and can neither build nor mine.
- **Reconstructors.** The Additive Reconstructor's shipped Crawler → Atrax upgrade now gives Crawler II. The three others gain Crawler II → III, III → IV and IV → V. Their other upgrades (Dagger → Mace and so on) and their costs are unchanged.
- **Tech tree (Serpulo).**
  - Every unit except the Crawler line is removed, and so are the Air Factory and the Naval Factory. The Ground Factory and all four reconstructors stay.
  - Crawler moves up under the Ground Factory, and Crawler II to V follow it in a line. Their research cost is the one the engine derives from their reconstructor cost, and their extra objectives are those of Atrax, Spiroct, Arkyid and Toxopid; Crawler V needs Mycelial Bastion.
  - Sector requirements that named removed content are dropped, because they could no longer be met. Examples: Salt Flats the Air Factory, Coastline the Naval Factory, Naval Fortress Minke and Bryde.
  - Nothing already researched in an existing save is locked again.
- **Sector statistics.** Each sector's statistics page (planet map → sector → Statistics) gains two lines:
  - *Crawler factories*: the Ground Factories your team owns. Live for the sector being played; for any other sector, the count when its save was last written.
  - *Crawlers built*: Crawlers that came out of a unit factory on that sector since the mod was enabled, alive or not. A reconstruction grows an existing Crawler, so it does not count as a new one, and enemy production does not count.
  - Both figures are stored in the sector's own save, as rule tags.
  - The page has no extension point, so the mod appends the two lines when it sees that dialog open.
- **Sprites.** No image ships with the mod. Once the client has loaded, each new tier draws the Crawler's own body, legs, outline, team colour cell and wrecks, scaled to its size. Menus show the Crawler icon at its normal size.
- **Command mode.** Left Shift is both Command Mode and Boost in the shipped game, and `DesktopInput.update` switches command mode off while the player's unit can boost and those two keys are the same. Every Crawler boosts here, so when neither binding has been changed from its default the mod moves Boost to Left Alt for the session. Nothing is written to settings, and a binding changed in Settings → Controls is left alone.
- Names and descriptions of the new tiers, and the two statistics labels, are in English and French.
- Erekir is not touched.

## Install

1. Download `crawlers-all-the-way-down.zip` from the [Releases page](https://github.com/alfdupont/mindustry-starter-mods/releases/latest), or run `./package.sh` in this directory to rebuild it from these sources.
2. In Mindustry: Mods → Import Mod → select the ZIP.
3. Restart the game. Enabling, disabling or removing the mod also requires a restart.

Do not combine it with another mod from this repository: they all remap the same cores. Try it on a copied campaign save. Because the mod adds unit types, a save that contains Crawler II to V loses those units if the mod is later removed.

## Tested target

Verified headless against a Mindustry source checkout (version 8, source base `7e6323c7a4`) through `tests/src/test/java/CrawlersAllTheWayDownTests.java`, which loads the packaged ZIP through the normal mod and script loader and checks:

- the tier stats and localized names, and the explosion values against both reactors;
- a real Crawler IV blast that kills an enemy Fortress 12.5 tiles away, leaves one 25 tiles away untouched and spares a friendly Dagger;
- the three starters surviving their core and building a copper wall;
- the reconstructor chain, the tech tree, and that no objective names removed content;
- the counters, from a real Ground Factory producing a Crawler through a save written to disk.

The sprite and Boost-key callbacks were driven by firing the client-load event on a stand-in atlas, which checks what they assign but not how it looks. The statistics dialog itself was not opened. Not tested: the graphics client, mobile, multiplayer, a campaign playthrough. The manifest minimum build 146 is a loader admission setting, not a tested compatibility claim.

## Test

Development checkout only - the Gradle harness is not part of the published archive. From the repository root:

```sh
custom-mods/crawlers-all-the-way-down/package.sh
JAVA_HOME=/usr/lib/jvm/java-17-openjdk ./gradlew :tests:test --tests CrawlersAllTheWayDownTests --console=plain
```

See the [top-level README](../README.md) for the other mods. Source: [https://github.com/alfdupont/mindustry-starter-mods](https://github.com/alfdupont/mindustry-starter-mods).
