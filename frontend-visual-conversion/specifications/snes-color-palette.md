# SNES Color Palette Specifications
## 16-bit Color Standards for Web Implementation

### Master Color Palette
Based on authentic SNES hardware limitations and existing project color scheme.

#### Primary Game Colors
```css
/* SNES Primary Blues */
--snes-blue-light: #5a9df2;
--snes-blue-main: #4a90e2;
--snes-blue-dark: #357abd;
--snes-blue-shadow: #2a5a8a;

/* SNES Grays and UI */
--snes-gray-light: #6a6aaa;
--snes-gray-main: #5a5a8a;
--snes-gray-dark: #4a4a7a;
--snes-gray-shadow: #3a3a5a;

/* Character Class Colors */
--snes-warrior-red: #ff6b6b;
--snes-mage-teal: #4ecdc4;
--snes-rogue-blue: #45b7d1;

/* Status and UI Colors */
--snes-success-green: #4caf50;
--snes-warning-orange: #ff9800;
--snes-error-red: #ff6b6b;
--snes-info-blue: #2196f3;

/* Rarity System */
--snes-common-gray: #9e9e9e;
--snes-uncommon-green: #4caf50;
--snes-rare-blue: #2196f3;
--snes-epic-purple: #9c27b0;
--snes-legendary-gold: #ff9800;
```

#### 16-Color Character Palette Template
For character portraits (64×64px):
1. Skin tone base
2. Skin tone shadow
3. Hair color base
4. Hair color shadow
5. Eye color
6. Clothing base
7. Clothing shadow
8. Clothing highlight
9. Equipment metal
10. Equipment shadow
11. Background base
12. Background shadow
13. White highlight
14. Black outline
15. Accent color 1
16. Accent color 2

#### 12-Color Sprite Palette Template
For character sprites (32×32px):
1. Skin tone
2. Hair color
3. Clothing base
4. Clothing shadow
5. Equipment color
6. Equipment shadow
7. White highlight
8. Black outline
9. Ground shadow
10. Accent color 1
11. Accent color 2
12. Transparency (if needed)

### Authentic SNES Color Limitations
- **Total Colors**: 256 simultaneous from 32,768 possible (15-bit RGB)
- **Per Sprite**: 16 colors maximum (including transparency)
- **Per Background**: 256 colors total across all layers
- **Palette Restriction**: Colors grouped in 16-color sub-palettes

### Web Implementation Notes
- Use indexed PNG format for authentic color control
- Implement CSS custom properties for consistent theming
- Test contrast ratios for accessibility compliance
- Provide high-contrast alternatives where needed