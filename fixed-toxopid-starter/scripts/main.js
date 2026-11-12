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

// It cannot mine as shipped either (mineTier -1). Give it the shared starter mining baseline.
UnitTypes.toxopid.mineTier = 1;
UnitTypes.toxopid.mineSpeed = 6.5;

// Held-resource capacity, normalized to 30. The shipped value is derived from the 26 hit size and is 100.
UnitTypes.toxopid.itemCapacity = 30;
