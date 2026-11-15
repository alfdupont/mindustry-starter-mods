// Boosting Crawler starter.
// This body runs once when the game loads mod scripts (Mods.loadScripts), before content initialization.
// It assigns fields on existing game content, plus one ClientLoadEvent callback for the command mode key (see the end).
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

// Command mode. DesktopInput.update switches command mode off on every frame in which the player's unit can boost and
// the Command Mode key is the Boost key, and both ship as Left Shift, so with canBoost above, shift + drag never
// selects units and the command buttons never appear. When both bindings are still at their shipped default, Boost
// moves to Left Alt for this session, so shift keeps its usual meaning. Left Alt is otherwise only read together with
// the select-all keys in command mode. Nothing is written to settings: removing the mod puts Boost back on shift, and
// a binding the player has changed in Settings > Controls is never touched.
Events.on(ClientLoadEvent, e => {
    if(Binding.boost.isDefault() && Binding.commandMode.isDefault() && Binding.boost.value.key == Binding.commandMode.value.key){
        Binding.boost.value = new KeyBind.Axis(KeyCode.altLeft);
        Log.info("[boosting-crawler-starter] Boost moved to Left Alt for this session so that Left Shift stays Command Mode.");
    }
});
