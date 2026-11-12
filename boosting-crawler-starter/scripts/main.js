// Boosting Crawler starter.
// This body runs once when the game loads mod scripts (Mods.loadScripts), before content initialization.
// It only assigns fields on existing game content; no callbacks, no new content.
// flying is deliberately not set: Crawler stays a ground unit and uses the existing boost to clear solid tiles.

// Serpulo cores (Shard, Foundation, Nucleus) all spawn Crawler. Erekir cores are not touched.
Blocks.coreShard.unitType = UnitTypes.crawler;
Blocks.coreFoundation.unitType = UnitTypes.crawler;
Blocks.coreNucleus.unitType = UnitTypes.crawler;

// Crawler cannot build or mine as shipped (buildSpeed -1, mineTier -1). Mining copies Mono, the starter it stands in
// for: tier 1 at speed 2.5. Building has no native value to copy, since Mono cannot build either, so it stays at 0.5.
UnitTypes.crawler.buildSpeed = 0.5;
UnitTypes.crawler.mineTier = 1;
UnitTypes.crawler.mineSpeed = 2.5;

// itemCapacity is deliberately not assigned: the engine already derives 30 from the 8 pixel hit size.

// The whole trick: with canBoost, the existing recovery in UnitComp.update lifts a unit that is standing on a tile
// solid to it instead of killing it, so a core-spawned Crawler rises above the core and can fly clear. Nothing here
// teleports the unit or touches the spawn method, and the suicide weapon with killShooter stays as shipped.
UnitTypes.crawler.canBoost = true;
