// Fixed Oct starter.
// This body runs once when the game loads mod scripts (Mods.loadScripts), before content initialization.
// It only assigns fields on existing game content; no callbacks, no new content.
// Oct's native buildSpeed 4.0 is deliberately left alone; only mining is added.

// Serpulo cores (Shard, Foundation, Nucleus) all spawn Oct. Erekir cores are not touched.
Blocks.coreShard.unitType = UnitTypes.oct;
Blocks.coreFoundation.unitType = UnitTypes.oct;
Blocks.coreNucleus.unitType = UnitTypes.oct;

// Oct cannot mine as shipped (mineTier -1), so it gets mining at tier 3, the highest tier any unit in this content
// ships with, at a rate just above Mega's native 4 - Oct is what the Mega's support role grows into, and its native
// buildSpeed 4.0 already beats Mega's 2.6, so building is left exactly as shipped.
UnitTypes.oct.mineTier = 3;
UnitTypes.oct.mineSpeed = 4.5;

// itemCapacity is deliberately not assigned: unset means the engine keeps the 260 it derives from the 66 hit size.
// payloadCapacity is a separate field and was never touched.
