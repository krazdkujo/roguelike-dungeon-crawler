# LLM Art Generation Prompt Templates
## SNES-Style Asset Creation for Roguelike Dungeon Crawler

---

## 🔴 PROMPTS TO PROCESS
*Sequential list - Always take the FIRST prompt below and delete it after processing*

### Workflow
1. **Human**: Take first prompt from list below
2. **Human**: Generate image with exact filename specified
3. **Human**: Upload to `inbox/` and notify: "Uploaded [filename] to inbox"
4. **UI/UX Designer**: Process from inbox
5. **UI/UX Designer**: Move completed prompt to ARCHIVE and add new prompt to maintain 10 active prompts

### COMPLETED PROMPTS ARCHIVE
*Completed prompts moved here for reference*

**COMPLETED:**
- warrior-portrait-main-1x.png ✅
- button-primary-normal-1x.png ✅
- button-secondary-normal-1x.png ✅
- icon-sword-32-1x.png ✅
- icon-magic-32-1x.png ✅
- mage-portrait-main-1x.png ✅
- rogue-portrait-main-1x.png ✅
- icon-chest-32-1x.png ✅
- nav-home-icon-1x.png ✅ 
- icon-potion-healing-32-1x.png ✅
- icon-shield-32-1x.png ✅
- icon-experience-gem-32-1x.png ✅

**CRITICAL MVP BATCH COMPLETED 2025-08-08:**
- icon-settings-24-1x.png ✅ **[CRITICAL MVP]**
- icon-logout-24-1x.png ✅ **[CRITICAL MVP]**
- bg-town-512-1x.png ✅ **[CRITICAL MVP]**
- bg-dungeon-corridor-512-1x.png ✅ **[CRITICAL MVP]**
- bg-combat-arena-512-1x.png ✅ **[CRITICAL MVP]**
- warrior-sprite-idle-32-1x.png ✅ **[CRITICAL MVP]**
- mage-sprite-idle-32-1x.png ✅ **[CRITICAL MVP]**
- rogue-sprite-idle-32-1x.png ✅ **[CRITICAL MVP]**
- item-sword-iron-32-1x.png ✅ **[CRITICAL MVP]**
- item-armor-leather-32-1x.png ✅ **[CRITICAL MVP]**

**POST-MVP ENHANCEMENT BATCH COMPLETED 2025-08-08:**
- button-danger-normal-1x.png ✅ **[ENHANCEMENT]**
- button-success-normal-1x.png ✅ **[ENHANCEMENT]**
- loading-spinner-32-1x.png ✅ **[ENHANCEMENT]**
- icon-health-heart-16-1x.png ✅ **[ENHANCEMENT]**

**VALIDATION ERROR FIX - MOVED DUPLICATES TO ARCHIVE 2025-08-08:**
- warrior-sprite-walk-32-1x.png ✅ **[EXISTS - INCORRECTLY QUEUED]**
- mage-sprite-cast-32-1x.png ✅ **[EXISTS - INCORRECTLY QUEUED]**
- rogue-sprite-attack-32-1x.png ✅ **[EXISTS - INCORRECTLY QUEUED]**
- item-sword-steel-32-1x.png ✅ **[EXISTS - INCORRECTLY QUEUED]**
- item-staff-wood-32-1x.png ✅ **[EXISTS - INCORRECTLY QUEUED]**
- bg-town-market-512-1x.png ✅ **[EXISTS - INCORRECTLY QUEUED]**

### NEXT PROMPTS TO PROCESS:
*Post-MVP Enhancement Assets - 10 prompts for expanded functionality and polish*
*VALIDATION FIXED: Removed 6 duplicate existing assets, added 6 new genuine prompts*

**PROMPT 1:** (UI - Warning Icon)
```
FILENAME TO SAVE AS: icon-warning-24-1x.png

Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a warning icon showing an exclamation point or alert symbol typical of JRPG warning indicators. The icon should have clear definition with classic game styling, using yellow/orange coloring with subtle highlights to suggest caution or attention needed. Include a subtle border or background shape to make it stand out.

Technical requirements: 24×24 pixels, indexed color palette limited to 6 colors, pixel art style with sharp edges, icon should be clear and recognizable at 1x scale, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

**PROMPT 2:** (UI - Error Icon)
```
FILENAME TO SAVE AS: icon-error-24-1x.png

Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design an error icon showing an X symbol or stop sign typical of JRPG error indicators. The icon should have clear definition with classic game styling, using red coloring with subtle highlights to suggest error or failure state. Include a subtle border or background shape for visibility.

Technical requirements: 24×24 pixels, indexed color palette limited to 6 colors, pixel art style with sharp edges, icon should be clear and recognizable at 1x scale, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

**PROMPT 3:** (Equipment - Chain Mail Armor)
```
FILENAME TO SAVE AS: item-armor-chain-32-1x.png

Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a chain mail armor item icon showing an improved chest piece with interlocked metal links. The armor should show better craftsmanship than basic leather armor, indicating higher quality protection. Use metallic silver-gray coloring with subtle blue steel highlights to show it's an uncommon-tier armor upgrade.

Technical requirements: 32×32 pixels, indexed color palette limited to 8 colors, pixel art style with sharp edges, should be recognizable as inventory item, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

**PROMPT 4:** (Environment - Forest Path Background)
```
FILENAME TO SAVE AS: bg-forest-path-512-1x.png

Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a forest path background showing a winding trail through dense woodland with tall trees, dappled sunlight, and natural atmosphere typical of JRPG outdoor environments. Include elements like tree trunks, foliage canopy, forest undergrowth, and a clear path forward. Use natural green and brown tones with warm sunlight filtering through leaves.

Technical requirements: 512×240 pixels, indexed color palette limited to 32 colors, pixel art style with sharp edges, should tile horizontally if needed, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

**PROMPT 5:** (Character - Warrior Death Sprite)
```
FILENAME TO SAVE AS: warrior-sprite-death-32-1x.png

Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a warrior character sprite in defeat/death pose, showing the character fallen or kneeling in battle aftermath. The character should match the existing warrior sprite style with armor and weapons, but display clear defeat positioning. Use the established warrior color palette but with slightly darker/grayed tones to suggest incapacitation.

Technical requirements: 32×32 pixels, indexed color palette limited to 12 colors, pixel art style with sharp edges, should match existing warrior sprite style, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

**PROMPT 6:** (Character - Mage Death Sprite)
```
FILENAME TO SAVE AS: mage-sprite-death-32-1x.png

Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a mage character sprite in defeat/death pose, showing the character fallen with staff dropped or slumped forward in exhaustion. The character should match the existing mage sprite style but display clear defeat positioning. Use the established mage color palette but with darker/grayed tones to suggest magical energy depletion.

Technical requirements: 32×32 pixels, indexed color palette limited to 12 colors, pixel art style with sharp edges, should match existing mage sprite style, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

**PROMPT 7:** (Character - Rogue Death Sprite)
```
FILENAME TO SAVE AS: rogue-sprite-death-32-1x.png

Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a rogue character sprite in defeat/death pose, showing the character fallen with weapons dropped or collapsed from stealth to defeat. The character should match the existing rogue sprite style but display clear defeat positioning. Use the established rogue color palette with darker/grayed tones to suggest life force fading.

Technical requirements: 32×32 pixels, indexed color palette limited to 12 colors, pixel art style with sharp edges, should match existing rogue sprite style, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

**PROMPT 8:** (Environment - Cave Entrance Background)
```
FILENAME TO SAVE AS: bg-cave-entrance-512-1x.png

Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a cave entrance background showing the mouth of a cavern with rocky formations, shadowed interior, and natural stone archway typical of JRPG outdoor-to-dungeon transitions. Include elements like weathered stone, moss growth, mysterious darkness within, and outdoor vegetation around the entrance. Use earth tones with shadowy depths.

Technical requirements: 512×240 pixels, indexed color palette limited to 32 colors, pixel art style with sharp edges, should tile horizontally if needed, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

**PROMPT 9:** (UI - Info/Help Icon)
```
FILENAME TO SAVE AS: icon-info-24-1x.png

Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design an information/help icon showing a question mark or info symbol typical of JRPG help indicators. The icon should have clear definition with classic game styling, using blue coloring with white highlights to suggest helpful information availability. Include a subtle border or background shape for visibility.

Technical requirements: 24×24 pixels, indexed color palette limited to 6 colors, pixel art style with sharp edges, icon should be clear and recognizable at 1x scale, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

**PROMPT 10:** (Equipment - Magic Ring)
```
FILENAME TO SAVE AS: item-ring-magic-32-1x.png

Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a magic ring item icon showing an enchanted band with mystical properties. The ring should have elegant metallic construction with a prominent gem or magical stone, indicating rare-tier equipment. Use gold band coloring with a deep purple or blue gem that subtly glows, representing magical enhancement accessory.

Technical requirements: 32×32 pixels, indexed color palette limited to 8 colors, pixel art style with sharp edges, should be recognizable as inventory item, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

---

### Base Prompt Framework

**Universal Style Descriptors** (Include in all prompts):
```
Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.
```

**Technical Specifications Template**:
```
Technical requirements: [DIMENSIONS] pixels, indexed color palette limited to [COLOR_COUNT] colors, pixel art style with sharp edges, no gradients except through dithering, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

## Character Graphics Prompts

### Character Portraits

**Warrior Portrait**:
```
FILENAME TO SAVE AS: warrior-portrait-main-1x.png

Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a warrior character portrait showing a heroic fighter with strong, determined features. The character should have armor plating, possibly chainmail or plate elements, and convey strength and nobility. Use a warm color palette with earth tones, metallic silvers and golds, and deep reds. The expression should be confident and brave.

Technical requirements: 64×64 pixels, indexed color palette limited to 16 colors, pixel art style with sharp edges, no gradients except through dithering, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

**Mage Portrait**:
```
FILENAME TO SAVE AS: mage-portrait-main-1x.png

Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a mage character portrait showing a wise spellcaster with intelligent, mysterious features. The character should wear robes or magical garments, possibly with mystical symbols or arcane accessories. Use a cool color palette with deep blues, purples, and teal accents. The expression should be wise and contemplative.

Technical requirements: 64×64 pixels, indexed color palette limited to 16 colors, pixel art style with sharp edges, no gradients except through dithering, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

**Rogue Portrait**:
```
FILENAME TO SAVE AS: rogue-portrait-main-1x.png

Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a rogue character portrait showing a cunning, agile character with sharp, alert features. The character should wear leather or cloth armor, possibly with a hood or cloak, and convey stealth and dexterity. Use a balanced color palette with dark blues, grays, and subtle green accents. The expression should be clever and alert.

Technical requirements: 64×64 pixels, indexed color palette limited to 16 colors, pixel art style with sharp edges, no gradients except through dithering, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

### Character Sprites

**Base Character Sprite Template**:
```
FILENAME TO SAVE AS: [class]-sprite-[pose]-1x.png

Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a [CLASS] character sprite in [POSE] pose. The character should be recognizable as a [CLASS] with appropriate equipment and clothing. Use the established [CLASS] color palette. The sprite should be suitable for game use with clear silhouette and recognizable features at small scale.

Technical requirements: 32×32 pixels, indexed color palette limited to 12 colors, pixel art style with sharp edges, no gradients except through dithering, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

**Pose Variations**:
- `idle stance` - Standing ready position
- `walking` - Mid-step walking animation frame
- `attacking` - Combat action with weapon raised
- `spellcasting` - Magical gesture with hands positioned for casting
- `defending` - Defensive posture with shield or guard position
- `victory` - Triumphant pose after successful combat

## User Interface Elements

### Buttons and Controls

**Primary Action Button**:
```
FILENAME TO SAVE AS: button-primary-normal-1x.png

Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a primary action button with a raised, 3D appearance typical of SNES game interfaces. The button should have a prominent blue gradient background with lighter blue highlights and darker blue shadows to create depth. Include a subtle border and corner details that suggest classic game UI design.

Technical requirements: 96×32 pixels, indexed color palette limited to 8 colors, pixel art style with sharp edges, button should tile/scale well, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

**Secondary Button**:
```
FILENAME TO SAVE AS: button-secondary-normal-1x.png

Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a secondary action button with a raised, 3D appearance typical of SNES game interfaces. The button should have a gray gradient background with lighter gray highlights and darker gray shadows to create depth. Include a subtle border and corner details that suggest classic game UI design.

Technical requirements: 96×32 pixels, indexed color palette limited to 8 colors, pixel art style with sharp edges, button should tile/scale well, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

### Icons and Symbols

**Action Icons Template**:
```
Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a [ACTION] icon that clearly represents [DESCRIPTION] in the classic JRPG style. The icon should be simple, recognizable, and work well at small sizes. Use [COLOR_SCHEME] and ensure good contrast for visibility.

Technical requirements: 16×16 pixels, indexed color palette limited to 6 colors, pixel art style with sharp edges, icon should be clear and recognizable at 1x scale, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

**Icon Variations**:
- `sword attack` → `a crossed sword representing physical combat` → `red and silver colors`
- `magic spell` → `mystical sparkles or energy orb representing magic` → `blue and white colors`  
- `healing potion` → `a bottle with healing liquid` → `green and white colors`
- `treasure chest` → `a wooden chest with metal fittings` → `brown and gold colors`
- `armor shield` → `a protective shield representing defense` → `gray and blue colors`
- `experience gem` → `a glowing gem representing character growth` → `purple and yellow colors`

## Game World Assets

### Environment Backgrounds

**Town Environment**:
```
Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a medieval fantasy town background showing buildings, streets, and architectural details typical of JRPG towns. Include elements like stone buildings, wooden structures, market stalls, and atmospheric details. Use warm, inviting colors with earth tones, stone grays, and wooden browns. The scene should feel lived-in and welcoming.

Technical requirements: 512×240 pixels, indexed color palette limited to 64 colors, pixel art style with sharp edges, should tile horizontally if needed, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

**Dungeon Environment**:
```
Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a dungeon corridor background showing stone walls, arched doorways, and mysterious atmosphere typical of JRPG dungeons. Include elements like torch lighting, ancient stonework, moss or age effects, and atmospheric shadows. Use cool, mysterious colors with stone grays, dark blues, and warm torch-light yellows. The scene should feel dangerous and ancient.

Technical requirements: 512×240 pixels, indexed color palette limited to 64 colors, pixel art style with sharp edges, should tile horizontally if needed, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

### Objects and Items

**Equipment Items Template**:
```
Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a [ITEM_TYPE] item icon showing [DESCRIPTION]. The item should look valuable and functional, with appropriate details and coloring to indicate its [RARITY] quality level. Use [COLOR_SCHEME] to match the rarity system.

Technical requirements: 32×32 pixels, indexed color palette limited to 8 colors, pixel art style with sharp edges, should be recognizable and attractive as an inventory item, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

**Equipment Categories**:
- `sword weapon` → `a medieval sword with ornate hilt` → `common/steel gray colors`
- `magic staff` → `a wooden staff with magical crystal` → `rare/blue and white colors`
- `leather armor` → `protective chest piece with leather texture` → `common/brown colors`
- `healing potion` → `a glass bottle with red healing liquid` → `common/red and clear colors`
- `magic ring` → `an enchanted ring with mystical glow` → `epic/purple and gold colors`
- `treasure gem` → `a valuable gemstone with inner light` → `legendary/gold and multiple gem colors`

## Effects and Polish

### Visual Effects

**Combat Effects Template**:
```
Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a [EFFECT_TYPE] visual effect for combat showing [DESCRIPTION]. The effect should be dynamic and impactful while maintaining the authentic 16-bit aesthetic. Use [COLOR_SCHEME] and ensure the effect reads clearly against various backgrounds.

Technical requirements: 64×64 pixels, indexed color palette limited to 12 colors, pixel art style with sharp edges, should animate well across multiple frames, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

**Effect Types**:
- `sword slash` → `motion lines and impact sparkles from melee attack` → `white and yellow colors`
- `magic missile` → `glowing energy projectile with trailing particles` → `blue and white colors`
- `healing aura` → `gentle light emanating from character` → `green and white colors`
- `fire spell` → `flames with heat distortion and embers` → `red, orange, and yellow colors`
- `ice spell` → `crystalline shards with frost effects` → `light blue and white colors`
- `lightning bolt` → `electrical discharge with branching patterns` → `bright yellow and white colors`

### UI Polish Elements

**Decorative Borders Template**:
```
Create a 16-bit Super Nintendo style graphic in the aesthetic of classic 1990s JRPGs like Final Fantasy VI, Secret of Mana, and Chrono Trigger. Use authentic SNES color limitations (256 colors maximum), pixel-perfect art with no anti-aliasing, appropriate dithering patterns for shading, and maintain the characteristic 16-bit visual quality.

Design a decorative UI border or frame element suitable for [PURPOSE]. The border should have classic JRPG styling with ornate details, corner flourishes, and appropriate depth. Use [COLOR_SCHEME] and ensure it frames content well without overwhelming it.

Technical requirements: [DIMENSIONS] pixels, indexed color palette limited to 8 colors, pixel art style with sharp edges, should tile or scale appropriately for UI use, appropriate for web display at multiple scales (1x, 2x, 3x, 4x zoom).
```

**Border Purposes**:
- `dialog boxes` → `conversational text containers` → `stone gray and gold accent colors` → `variable width, 32px height minimum`
- `character panels` → `player information displays` → `dark blue and silver accent colors` → `200×150 pixel frames`
- `inventory slots` → `item container backgrounds` → `brown leather and brass accent colors` → `48×48 pixel squares`
- `menu headers` → `navigation section titles` → `deep blue and gold accent colors` → `300×48 pixel headers`

## Color Palette References

### Master SNES Palette
```
Primary Blues: #4a90e2, #357abd, #5a9df2, #2a5a8a
Secondary Grays: #6a6aaa, #5a5a8a, #4a4a7a, #3a3a5a
Character Classes: #ff6b6b (warrior), #4ecdc4 (mage), #45b7d1 (rogue)
Rarity System: #9e9e9e (common), #4caf50 (uncommon), #2196f3 (rare), #9c27b0 (epic), #ff9800 (legendary)
Status Colors: #4caf50 (success), #ff9800 (warning), #ff6b6b (error), #2196f3 (info)
Background Tones: #1a1a2e, #16213e, #0f1419, #2a2a4e
Text Colors: #ffffff, #e0e0f0, #c0c0d0, #888899
```

### Usage Guidelines
- **Limit each asset to appropriate color count** (specified in technical requirements)
- **Use dithering for smooth gradients** rather than true gradients
- **Maintain contrast** for accessibility while staying authentic to SNES aesthetics
- **Test at 1x scale** to ensure readability at original pixel size
- **Create indexed color palettes** for each major asset category

## Asset Delivery Requirements

### File Specifications
1. **Original Assets**: PNG format, indexed color mode
2. **Scaled Versions**: Provide 1x, 2x, 3x, 4x scales using nearest-neighbor interpolation
3. **Sprite Sheets**: Combine related assets when beneficial for loading performance
4. **Palette Files**: Include .ase or .gpl palette files for color reference

### Naming Convention
```
[category]-[item]-[variant]-[scale].png
```
Examples:
- `character-warrior-portrait-1x.png`
- `ui-button-primary-2x.png`
- `effect-fireball-frame01-3x.png`
- `environment-town-background-1x.png`

### Quality Checklist
- [ ] Colors limited to specified palette size
- [ ] No anti-aliasing or smoothing applied
- [ ] Pixel-perfect alignment on pixel grid
- [ ] Appropriate dithering patterns for shading
- [ ] Clear silhouette and recognizable at small scale
- [ ] Consistent style with other assets in category
- [ ] Optimized file size while maintaining quality