// Support progression starter: the starter unit gets better as the core does.
// This body runs once when the game loads mod scripts (Mods.loadScripts), before content initialization.
// It only assigns fields on existing game content; no callbacks, no new content, no selectors.
// Nothing replaces the unit you are controlling: a new mapping is used by the next core spawn, so an
// upgraded core yields the better unit when you re-enter it from the core or respawn after death.

// Serpulo cores only. Unmodded, these three spawn Alpha, Beta and Gamma. Erekir cores are not touched.
Blocks.coreShard.unitType = UnitTypes.mono;
Blocks.coreFoundation.unitType = UnitTypes.poly;
Blocks.coreNucleus.unitType = UnitTypes.mega;

// Mono ships with buildSpeed -1, which means it cannot build at all, so building is enabled here at 0.5.
// Poly (0.4) and Mega (2.6) already build natively and are deliberately left alone, as is every unit's
// native mining (Mono tier 1 at 2.5, Poly tier 2 at 3.5, Mega tier 3 at 4) and native carry capacity.
UnitTypes.mono.buildSpeed = 0.5;
