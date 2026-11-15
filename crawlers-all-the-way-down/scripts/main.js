// Crawlers All The Way Down.
// The body runs once when the game loads mod scripts (Mods.loadScripts), after the Serpulo tech tree is built and
// before content initialization. It adds four unit types, Crawler II to Crawler V, which the four Serpulo
// reconstructors produce from the tier below. Callbacks: one on the client that gives the new tiers a scaled copy of the
// Crawler sprite, one on the client that moves Boost off the Command Mode key, and three that keep the per-sector
// statistics (see the end). Erekir is not touched.

const crawler = UnitTypes.crawler;

// --- Tiers ------------------------------------------------------------------------------------------------------

// size: drawing scale and hit size relative to Crawler (hit size 8). health and armor are those of the unit the
// same reconstructor makes from the shipped Crawler line (Atrax, Spiroct, Arkyid, Toxopid), so each tier is about as
// durable as the unit it replaces. speed drops by 0.1 per tier from Crawler's 1.
// Explosions: tier 1 is the shipped Crawler; tier 4 copies the thorium reactor's explosion and tier 5 the impact
// reactor's, read from those blocks. Tiers 2 and 3 sit on the geometric curve between tier 1 and tier 4, in both
// radius and damage, until real values are chosen.
// Building and mining: Crawler I to III are core starters, so each copies the native core unit of the core that
// spawns it (Alpha, Beta, Gamma). Crawler IV and V are never spawned by a core and get neither.
const tierSpecs = [
    null, // tier 1 is the shipped Crawler, set up below
    {size: 1.5, health: 600,   armor: 3,  speed: 0.9, radius: 66,  damage: 320,  buildingDamage: 0.68, builder: UnitTypes.beta},
    {size: 2,   health: 1000,  armor: 9,  speed: 0.8, radius: 100, damage: 1260, buildingDamage: 0.68, builder: UnitTypes.gamma},
    {size: 3,   health: 8000,  armor: 14, speed: 0.7, reactor: Blocks.thoriumReactor},
    {size: 4,   health: 22000, armor: 22, speed: 0.6, reactor: Blocks.impactReactor}
];

// Tier 1: the shipped Crawler gains boost (which is what lets a core-spawned Crawler rise off the core instead of
// being killed on a solid tile) and Alpha's building and mining. Health, weapon and walk stay as shipped.
crawler.canBoost = true;
copyBuilder(crawler, UnitTypes.alpha);

const tiers = [crawler];
for(let i = 1; i < tierSpecs.length; i++){
    tiers.push(createTier(i + 1, tierSpecs[i]));
}

function copyBuilder(type, from){
    type.buildSpeed = from.buildSpeed;
    type.mineTier = from.mineTier;
    type.mineSpeed = from.mineSpeed;
}

function createTier(tier, spec){
    // The name is prefixed with the mod name by the content loader: crawlers-all-the-way-down-crawler-2.
    const type = new UnitType("crawler-" + tier);
    // The constructor is looked up by name and the prefixed name has none, so the Crawler's own (MechUnit) is reused.
    type.constructor = crawler.constructor;
    type.aiController = crawler.aiController;
    // No sprite file ships with this mod; the client callback below scales the Crawler's.
    type.generateIcons = false;

    type.researchCostMultiplier = crawler.researchCostMultiplier;
    type.mechSideSway = crawler.mechSideSway;
    type.stepSound = crawler.stepSound;
    type.stepSoundVolume = crawler.stepSoundVolume;
    type.targetUnderBlocks = crawler.targetUnderBlocks;
    type.canBoost = true;

    type.hitSize = crawler.hitSize * spec.size;
    type.range = crawler.range * spec.size;
    type.health = spec.health;
    type.armor = spec.armor;
    type.speed = spec.speed;
    if(spec.builder != null) copyBuilder(type, spec.builder);

    const source = crawler.weapons.first();
    const weapon = new Weapon();
    weapon.shootOnDeath = source.shootOnDeath;
    weapon.reload = source.reload;
    weapon.shootCone = source.shootCone;
    weapon.ejectEffect = source.ejectEffect;
    weapon.shootSound = source.shootSound;
    weapon.shootSoundVolume = source.shootSoundVolume;
    weapon.x = 0;
    weapon.shootY = 0;
    weapon.mirror = false;

    const from = source.bullet;
    const bullet = new BulletType();
    bullet.collidesTiles = from.collidesTiles;
    bullet.collides = from.collides;
    bullet.collidesAir = from.collidesAir;
    bullet.hittable = from.hittable;
    bullet.killShooter = from.killShooter;
    bullet.instantDisappear = from.instantDisappear;
    bullet.speed = from.speed;
    bullet.rangeOverride = from.rangeOverride * spec.size;
    bullet.hitEffect = from.hitEffect;

    if(spec.reactor != null){
        // A reactor deals explosionDamage within explosionRadius tiles. The Crawler's splash keeps its own team
        // rules: it hurts enemies only, where a reactor hurts everything around it.
        const reactor = spec.reactor;
        bullet.splashDamageRadius = reactor.explosionRadius * Vars.tilesize;
        bullet.splashDamage = reactor.explosionDamage;
        bullet.buildingDamageMultiplier = 1;
        bullet.hitEffect = reactor.explodeEffect;
        bullet.hitShake = reactor.explosionShake;
        weapon.shootSound = reactor.explodeSound;
        weapon.shootSoundVolume = 1;
    }else{
        bullet.splashDamageRadius = spec.radius;
        bullet.splashDamage = spec.damage;
        bullet.buildingDamageMultiplier = spec.buildingDamage;
    }

    weapon.bullet = bullet;
    type.weapons.add(weapon);
    return type;
}

// --- Starters ---------------------------------------------------------------------------------------------------

Blocks.coreShard.unitType = tiers[0];
Blocks.coreFoundation.unitType = tiers[1];
Blocks.coreNucleus.unitType = tiers[2];

// --- Reconstructors ---------------------------------------------------------------------------------------------

// Each reconstructor turns tier n into tier n + 1. The Additive Reconstructor's shipped Crawler -> Atrax entry is
// rewritten in place, so a Crawler can only grow; every other shipped upgrade is left alone.
const reconstructors = [Blocks.additiveReconstructor, Blocks.multiplicativeReconstructor,
    Blocks.exponentialReconstructor, Blocks.tetrativeReconstructor];
for(let i = 0; i < reconstructors.length; i++){
    let rec = reconstructors[i];
    let existing = rec.upgrades.find(u => u[0] == tiers[i]);
    if(existing != null){
        existing[1] = tiers[i + 1];
    }else{
        rec.addUpgrade(tiers[i], tiers[i + 1]);
    }
}

// --- Tech tree --------------------------------------------------------------------------------------------------

// Every unit but the Crawler line leaves the tree, and so do the Air Factory and the Naval Factory. Crawler moves up
// under the Ground Factory when Dagger goes, then Crawler II to V hang below it in a line, with the research cost the
// engine derives from their reconstructor cost and the extra objectives of the shipped Atrax, Spiroct, Arkyid and
// Toxopid nodes (Toxopid needs Mycelial Bastion).
const shippedLine = [UnitTypes.atrax, UnitTypes.spiroct, UnitTypes.arkyid, UnitTypes.toxopid];
const shippedObjectives = shippedLine.map(u => u.techNode == null ? new Seq() :
    u.techNode.objectives.select(o => !(o instanceof Objectives.Research)));

const crawlerLine = new ObjectSet();
tiers.forEach(t => crawlerLine.add(t));

pruneTechTree(Planets.serpulo.techTree, c =>
    (c instanceof UnitType && !crawlerLine.contains(c)) || c == Blocks.airFactory || c == Blocks.navalFactory);

let parentNode = crawler.techNode;
for(let i = 1; i < tiers.length; i++){
    let node = new TechTree.TechNode(parentNode, tiers[i], tiers[i].researchRequirements());
    node.objectives.addAll(shippedObjectives[i - 1]);
    parentNode = node;
}

/**
 * Removes every node whose content matches `doomed` from the tree under `root`. A kept node under a removed one moves up
 * to the nearest kept ancestor, so nothing else disappears with it. Research objectives that name removed content are
 * dropped everywhere in the tree, because several sectors require researching a unit or a factory (Salt Flats the
 * Air Factory, Coastline the Naval Factory, Naval Fortress Minke and Bryde, Planetary Terminal Omura, ...) and would
 * otherwise become impossible to unlock. Returns the removed content.
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

// --- Sprites (client only) --------------------------------------------------------------------------------------

// Each tier draws the Crawler's own regions at its size. The world icon (fullIcon, used for payloads and the
// reconstructor preview) is scaled too; the UI icon stays at the shipped size so menus keep their layout.
Events.on(ClientLoadEvent, e => {
    for(let i = 1; i < tiers.length; i++){
        let type = tiers[i];
        let s = tierSpecs[i].size;
        type.region = scaled(crawler.region, s);
        type.previewRegion = scaled(crawler.previewRegion, s);
        type.shadowRegion = scaled(crawler.shadowRegion, s);
        type.outlineRegion = scaled(crawler.outlineRegion, s);
        type.cellRegion = scaled(crawler.cellRegion, s);
        type.baseRegion = scaled(crawler.baseRegion, s);
        type.legRegion = scaled(crawler.legRegion, s);
        type.fullIcon = scaled(crawler.fullIcon, s);
        type.uiIcon = crawler.uiIcon;
        if(crawler.wreckRegions != null && type.wreckRegions != null){
            for(let w = 0; w < type.wreckRegions.length && w < crawler.wreckRegions.length; w++){
                type.wreckRegions[w] = scaled(crawler.wreckRegions[w], s);
            }
        }
    }
});

function scaled(region, s){
    if(region == null) return null;
    const copy = new TextureRegion(region);
    copy.scale = region.scale * s;
    return copy;
}

// --- Command mode (client only) ---------------------------------------------------------------------------------

// DesktopInput.update switches command mode off on every frame in which the player's unit can boost and the Command
// Mode key is the Boost key, and both ship as Left Shift. Every Crawler boosts here, so shift + drag would never
// select units. When both bindings are still at their shipped default, Boost moves to Left Alt for this session, so
// shift keeps its usual meaning. Left Alt is otherwise only read together with the select-all keys in command mode.
// Nothing is written to settings: removing the mod puts Boost back on shift, and a binding the player has changed in
// Settings > Controls is never touched.
Events.on(ClientLoadEvent, e => {
    if(Binding.boost.isDefault() && Binding.commandMode.isDefault() && Binding.boost.value.key == Binding.commandMode.value.key){
        Binding.boost.value = new KeyBind.Axis(KeyCode.altLeft);
        Log.info("[crawlers-all-the-way-down] Boost moved to Left Alt for this session so that Left Shift stays Command Mode.");
    }
});

// --- Sector statistics ------------------------------------------------------------------------------------------

// Two figures are added to each sector's statistics page (planet map > sector > Statistics):
// - Crawler factories: Ground Factories the player's team owns. Live for the sector being played; for any other
//   sector, the count when its save was last written.
// - Crawlers built: Crawlers that came out of a unit factory on that sector since this mod was enabled, alive or not.
//   A reconstruction grows an existing Crawler, so it does not count as a new one.
// Both live in the sector's own save, as rule tags, so they follow the save and need no file of their own.
const createdTag = "crawlers-all-the-way-down-crawlers-built";
const factoriesTag = "crawlers-all-the-way-down-crawler-factories";

function liveFactories(){
    return Vars.state.rules.defaultTeam.data().getBuildings(Blocks.groundFactory).size;
}

Events.on(UnitCreateEvent, e => {
    if(e.unit.team != Vars.state.rules.defaultTeam || !crawlerLine.contains(e.unit.type)) return;
    if(e.spawner == null || !(e.spawner.block instanceof UnitFactory)) return;
    const tags = Vars.state.rules.tags;
    tags.put(createdTag, String(tags.getInt(createdTag, 0) + 1));
});

Events.on(SaveWriteEvent, e => {
    Vars.state.rules.tags.put(factoriesTag, String(liveFactories()));
});

// The statistics page is a dialog PlanetDialog builds on each click, with no hook, so the rows are appended when it
// shows up: the topmost dialog, while the planet map is open, titled with the selected sector's name.
let lastStatsDialog = null;
Events.run(Trigger.update, () => {
    if(Vars.headless || Vars.ui == null || Vars.ui.planet == null || !Vars.ui.planet.isShown()) return;
    const dialog = Core.scene.getDialog();
    const sector = Vars.ui.planet.selected;
    if(dialog == null || dialog == lastStatsDialog || dialog == Vars.ui.planet || sector == null) return;
    if(!(dialog instanceof BaseDialog) || String(dialog.title.getText()) != String(sector.name())) return;
    lastStatsDialog = dialog;

    const stats = sectorStats(sector);
    if(stats == null) return;
    const pane = dialog.cont.getChildren().find(c => c instanceof ScrollPane);
    if(pane == null || !(pane.getWidget() instanceof Table)) return;
    const table = pane.getWidget();
    table.add(Core.bundle.get("crawlers-all-the-way-down.stats.factories") + " [accent]" + stats.factories).left().row();
    table.add(Core.bundle.get("crawlers-all-the-way-down.stats.built") + " [accent]" + stats.built).left().row();
});

function sectorStats(sector){
    if(Vars.state.isCampaign() && Vars.state.getSector() == sector){
        return {factories: liveFactories(), built: Vars.state.rules.tags.getInt(createdTag, 0)};
    }
    if(sector.save == null || sector.save.meta == null || sector.save.meta.rules == null) return null;
    const tags = sector.save.meta.rules.tags;
    return {factories: tags.getInt(factoriesTag, 0), built: tags.getInt(createdTag, 0)};
}
