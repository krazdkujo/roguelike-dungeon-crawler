# Asset Template Creation Guide
## Standardized SNES Graphics Templates

### Canvas Setup
**Recommended Software**: Aseprite, Pyxel Edit, or GIMP
**Settings**:
- Color Mode: Indexed Color
- Canvas Size: Varies by asset type (see specifications)
- Zoom: 400% minimum for pixel precision
- Grid: 1px grid enabled
- Pixel Perfect: Enabled (no anti-aliasing)

### Character Portrait Template (64×64px)
```
Canvas: 64×64 pixels
Color Limit: 16 colors
Grid: 8×8 pixel guides for major features
Layers:
1. Background
2. Character base
3. Facial features
4. Hair/helmet
5. Equipment/armor
6. Highlights
7. Outlines
```

### Character Sprite Template (32×32px)
```
Canvas: 32×32 pixels
Color Limit: 12 colors
Grid: 4×4 pixel guides
Layers:
1. Background/shadow
2. Body base
3. Equipment
4. Details
5. Highlights
6. Outlines
```

### UI Button Template (96×32px)
```
Canvas: 96×32 pixels
Color Limit: 8 colors
3D Effect Guidelines:
- Top highlight: 1-2px
- Main gradient: Center area
- Shadow: Bottom 2-3px
- Border: 1px all around
```

### Icon Template (16×16px and 32×32px)
```
Small Canvas: 16×16 pixels
Large Canvas: 32×32 pixels  
Color Limit: 6 colors
Design Guidelines:
- Bold, simple shapes
- 2px minimum line width
- Clear silhouette
- High contrast
```

### Quality Checklist Template
- [ ] No anti-aliasing applied
- [ ] Colors within specified palette limit
- [ ] Pixel-perfect alignment on grid
- [ ] Clear at 1x zoom level
- [ ] Consistent with established style
- [ ] Proper file naming convention used