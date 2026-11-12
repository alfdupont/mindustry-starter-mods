// Fixed Toxopid starter.
// This body runs once when the game loads mod scripts (Mods.loadScripts), before content initialization.
// It only assigns fields on existing game content; no callbacks, no new content.
// canBoost and flying are deliberately not set: Toxopid stands on the core with its native leg collision rules.

// Serpulo cores (Shard, Foundation, Nucleus) all spawn Toxopid. Erekir cores are not touched.
Blocks.coreShard.unitType = UnitTypes.toxopid;
Blocks.coreFoundation.unitType = UnitTypes.toxopid;
Blocks.coreNucleus.unitType = UnitTypes.toxopid;

// Toxopid cannot build as shipped (buildSpeed -1), so enable it at the shared 0.5 baseline.
UnitTypes.toxopid.buildSpeed = 0.5;

// It cannot mine as shipped either (mineTier -1), so it copies Mega's mining outright: tier 3 at speed 4.
UnitTypes.toxopid.mineTier = 3;
UnitTypes.toxopid.mineSpeed = 4;

// itemCapacity is deliberately not assigned: unset means the engine keeps the 100 it derives from the 26 hit size.
