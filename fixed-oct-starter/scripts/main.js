// Fixed Oct starter.
// This body runs once when the game loads mod scripts (Mods.loadScripts), before content initialization.
// It only assigns fields on existing game content; no callbacks, no new content.
// Oct's native buildSpeed 4.0 is deliberately left alone; only mining is added.

// Serpulo cores (Shard, Foundation, Nucleus) all spawn Oct. Erekir cores are not touched.
Blocks.coreShard.unitType = UnitTypes.oct;
Blocks.coreFoundation.unitType = UnitTypes.oct;
Blocks.coreNucleus.unitType = UnitTypes.oct;

// Oct cannot mine as shipped (mineTier -1). Give it the shared starter mining baseline: tier 1, speed 6.5.
UnitTypes.oct.mineTier = 1;
UnitTypes.oct.mineSpeed = 6.5;

// Held-resource capacity, normalized to 30 like the other starter variants. Oct's shipped value is derived from
// its 66 hit size and is 260, so this is a deliberate reduction. payloadCapacity is a separate field and stays native.
UnitTypes.oct.itemCapacity = 30;
