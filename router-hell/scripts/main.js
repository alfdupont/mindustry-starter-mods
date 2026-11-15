// Router Hell.
// The body runs once when the game loads mod scripts (Mods.loadScripts), after the Serpulo tech tree is built and
// before content initialization. Two callbacks run later, on the client only: one replaces every unit sprite with the
// router once the atlas is loaded, the other moves Boost off the Command Mode key (see the end).
// No content is added. Erekir cores, fabricators and its tech tree are not touched; the router sprite is applied to
// every unit type, Erekir's included, because the sprite change is meant to be global.

// --- Starters ---------------------------------------------------------------------------------------------------

// Shard keeps Alpha, as shipped. Foundation spawns Spiroct and Nucleus spawns Vela.
Blocks.coreFoundation.unitType = UnitTypes.spiroct;
Blocks.coreNucleus.unitType = UnitTypes.vela;

// Mining and building are copied from the support unit each one stands in for, read from that unit rather than
// typed in: Spiroct takes Poly's (build 0.4, mining tier 2 at 3.5), Vela takes Mega's (build 2.6, tier 3 at 4).
// Vela ships with build speed 3, so copying Mega lowers it. itemCapacity is not assigned: both keep the hold the
// engine derives from their size. Spiroct survives on the core through its native leg collision rules, Vela
// through its native boost.
UnitTypes.spiroct.buildSpeed = UnitTypes.poly.buildSpeed;
UnitTypes.spiroct.mineTier = UnitTypes.poly.mineTier;
UnitTypes.spiroct.mineSpeed = UnitTypes.poly.mineSpeed;

UnitTypes.vela.buildSpeed = UnitTypes.mega.buildSpeed;
UnitTypes.vela.mineTier = UnitTypes.mega.mineTier;
UnitTypes.vela.mineSpeed = UnitTypes.mega.mineSpeed;

// --- Unit cap ---------------------------------------------------------------------------------------------------

// The unit cap is the rules' base cap plus the unitCapModifier of every core the team owns. Shipped: 8, 16, 24.
Blocks.coreShard.unitCapModifier = 40;
Blocks.coreFoundation.unitCapModifier = 70;
Blocks.coreNucleus.unitCapModifier = 100;

// --- Unit cost and build time -----------------------------------------------------------------------------------

// Every plan of the three Serpulo factories costs what a router costs (3 copper) and takes 10 * pi seconds.
// UnitFactory reads plan.requirements every time it consumes, and sizes its item buffer from the plans in init(),
// which runs after this script, so both follow. Research costs were computed when the tech tree was built, from
// the shipped plans, and are left as they are.
const routerCost = Blocks.router.requirements;
const productionTicks = 10 * Math.PI * 60;
[Blocks.groundFactory, Blocks.airFactory, Blocks.navalFactory].forEach(factory => {
    factory.plans.each(plan => {
        plan.requirements = ItemStack.copy(routerCost);
        plan.time = productionTicks;
    });
});

// --- Tech tree --------------------------------------------------------------------------------------------------

// T1 means "built directly by a Serpulo unit factory": Dagger, Crawler, Nova, Flare, Mono, Risso, Retusa.
const tier1 = new ObjectSet();
[Blocks.groundFactory, Blocks.airFactory, Blocks.navalFactory].forEach(factory => factory.plans.each(plan => tier1.add(plan.unit)));

const removedContent = pruneTechTree(Planets.serpulo.techTree,
    c => (c instanceof UnitType && !tier1.contains(c)) || c instanceof Reconstructor);

/**
 * Removes every node whose content matches `doomed` from the tree under `root`. A kept node under a removed one moves up
 * to the nearest kept ancestor, so nothing else disappears with it. Research objectives that name removed content are
 * dropped everywhere in the tree, because several sectors require researching a unit or a reconstructor (Salt Flats
 * the Additive Reconstructor, Naval Fortress Minke and Bryde, Planetary Terminal Omura and the Tetrative
 * Reconstructor, ...) and would otherwise become impossible to unlock. Returns the removed content.
 */
function pruneTechTree(root, doomed){
    const nodes = new Seq();
    root.each(node => {
        if(node != root && doomed(node.content)) nodes.add(node);
    });

    const removed = new ObjectSet();
    nodes.each(node => removed.add(node.content));

    // root.each is pre-order, so a parent is always handled before its children.
    nodes.each(node => {
        let keeper = node.parent;
        while(keeper != null && removed.contains(keeper.content)) keeper = keeper.parent;

        node.children.copy().each(child => {
            if(!removed.contains(child.content)) reparent(child, keeper);
        });

        node.remove();
        node.content.techNodes.remove(node);
        if(node.content.techNode == node) node.content.techNode = null;
    });

    root.each(node => node.objectives.removeAll(o => o instanceof Objectives.Research && removed.contains(o.content)));
    return removed;
}

function reparent(node, parent){
    node.parent.children.remove(node);
    parent.children.add(node);
    node.parent = parent;
    node.each(n => n.depth = n.parent.depth + 1);
}

// --- Router sprites (client only) -------------------------------------------------------------------------------

// Every unit is drawn as a router. The router region is copied and scaled so that it covers the same footprint as
// the unit's own sprite, which keeps big units big. Everything else a unit draws from the atlas (outline, team
// colour cell, legs, treads, joints, weapons, weapon and unit parts, wrecks) is replaced by the empty "clear"
// region. Engines, shields, mining lasers and other effects drawn from shapes stay as shipped.
Events.on(ClientLoadEvent, e => {
    const router = Blocks.router.region;
    const clear = Core.atlas.find("clear");

    Vars.content.units().each(type => {
        const side = Math.max(type.region.width, type.region.height);
        const sprite = new TextureRegion(router);
        sprite.scale = side > 0 ? side / Math.max(router.width, router.height) : type.hitSize / Vars.tilesize;

        type.region = sprite;
        type.previewRegion = sprite;
        type.shadowRegion = sprite;
        type.fullIcon = Blocks.router.fullIcon;
        type.uiIcon = Blocks.router.uiIcon;

        type.outlineRegion = clear;
        type.cellRegion = clear;
        type.baseRegion = clear;
        type.legRegion = clear;
        type.jointRegion = clear;
        type.footRegion = clear;
        type.legBaseRegion = clear;
        type.baseJointRegion = clear;
        type.treadRegion = clear;
        clearArray(type.wreckRegions, clear);
        clearArray(type.segmentRegions, clear);
        clearArray(type.segmentCellRegions, clear);
        clearArray(type.segmentOutlineRegions, clear);
        if(type.treadRegions != null){
            for(let i = 0; i < type.treadRegions.length; i++) clearArray(type.treadRegions[i], clear);
        }

        clearParts(type.parts, clear);
        type.weapons.each(weapon => {
            weapon.region = clear;
            weapon.heatRegion = clear;
            weapon.cellRegion = clear;
            weapon.outlineRegion = clear;
            clearParts(weapon.parts, clear);
        });
    });
});

function clearArray(regions, clear){
    if(regions == null) return;
    for(let i = 0; i < regions.length; i++) regions[i] = clear;
}

function clearParts(parts, clear){
    parts.each(part => {
        if(part instanceof RegionPart){
            clearArray(part.regions, clear);
            clearArray(part.outlines, clear);
            part.heat = clear;
            part.light = clear;
        }
        if(part.children != null) clearParts(part.children, clear);
    });
}

// --- Command mode (client only) ---------------------------------------------------------------------------------

// DesktopInput.update switches command mode off on every frame in which the player's unit can boost and the Command
// Mode key is the Boost key, and both ship as Left Shift. Vela boosts natively, so on a Nucleus shift + drag would
// never select units. When both bindings are still at their shipped default, Boost moves to Left Alt for this
// session, so shift keeps its usual meaning. Left Alt is otherwise only read together with the select-all keys in
// command mode. Nothing is written to settings: removing the mod puts Boost back on shift, and a binding the player
// has changed in Settings > Controls is never touched.
Events.on(ClientLoadEvent, e => {
    if(Binding.boost.isDefault() && Binding.commandMode.isDefault() && Binding.boost.value.key == Binding.commandMode.value.key){
        Binding.boost.value = new KeyBind.Axis(KeyCode.altLeft);
        Log.info("[router-hell] Boost moved to Left Alt for this session so that Left Shift stays Command Mode.");
    }
});
