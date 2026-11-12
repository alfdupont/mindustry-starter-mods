// Fixed Poly starter.
// This body runs once when the game loads mod scripts (Mods.loadScripts), before content initialization.
// It only assigns fields on existing game content; no callbacks, no new content.
// No unit-type property is touched: Poly keeps its native buildSpeed 0.4, mineTier 2 and mineSpeed 3.5.

// Serpulo cores (Shard, Foundation, Nucleus) all spawn Poly. Erekir cores are not touched.
Blocks.coreShard.unitType = UnitTypes.poly;
Blocks.coreFoundation.unitType = UnitTypes.poly;
Blocks.coreNucleus.unitType = UnitTypes.poly;
