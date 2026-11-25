// Fixed Toxopid starter.
const toxopid = UnitTypes.toxopid;

Blocks.coreShard.unitType = toxopid;
Blocks.coreFoundation.unitType = toxopid;
Blocks.coreNucleus.unitType = toxopid;

toxopid.buildSpeed = UnitTypes.poly.buildSpeed;
toxopid.mineSpeed = UnitTypes.poly.mineSpeed;
toxopid.mineTier = Items.thorium.hardness;
toxopid.canBoost = true;
toxopid.boostMultiplier = 4;

// Weapon ranges are available after content initialization.
Events.on(ContentInitEvent, () => {
    for (let i = 0; i < toxopid.weapons.size; i++) {
        toxopid.buildRange = Math.max(toxopid.buildRange, toxopid.weapons.get(i).range());
    }
});

// Desktop command mode is disabled for boost-capable units when the two bindings match.
Events.on(ClientLoadEvent, () => {
    if (Vars.mobile) return;

    if ("commandMode" in Binding) {
        if (Binding.boost.isDefault() && Binding.commandMode.isDefault() && Binding.boost.value.key === Binding.commandMode.value.key) {
            Binding.boost.value = new KeyBind.Axis(KeyCode.altLeft);
        }
    } else {
        // Older builds store the effective bindings in Core.keybinds.
        const keybinds = Core.keybinds;
        const section = keybinds.getSections()[0];
        const overrides = section.binds.get(section.device.type());
        const boost = keybinds.get(Binding.boost);
        const commandMode = keybinds.get(Binding.command_mode);
        if ((overrides == null || (!overrides.containsKey(Binding.boost) && !overrides.containsKey(Binding.command_mode))) &&
            boost.key === KeyCode.shiftLeft && commandMode.key === KeyCode.shiftLeft) {
            boost.key = KeyCode.altLeft;
        }
    }
});
