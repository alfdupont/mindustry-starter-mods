// Fixed Mono starter.
// This body runs once when the game loads mod scripts (Mods.loadScripts), before content initialization.
// It only assigns fields on existing game content; no callbacks, no new content.
// buildSpeed lives on the shared Mono unit type, so ordinary factory-built Monos can build too.

// Serpulo cores (Shard, Foundation, Nucleus) all spawn Mono. Erekir cores are not touched.
Blocks.coreShard.unitType = UnitTypes.mono;
Blocks.coreFoundation.unitType = UnitTypes.mono;
Blocks.coreNucleus.unitType = UnitTypes.mono;

// Mono builds at 0.5, matching Alpha's base building speed. Mining, movement, health, capacity and weapons stay native.
UnitTypes.mono.buildSpeed = 0.5;
