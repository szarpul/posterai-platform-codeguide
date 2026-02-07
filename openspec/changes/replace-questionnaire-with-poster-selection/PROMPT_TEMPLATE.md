# Prompt Template Design

## Current Prompt Structure (5-step)

**Input Fields:**

- `theme` (nature, urban, fantasy, futuristic)
- `palette` (bright, dark, pastel, neutral)
- `style` (realistic, cartoon, surreal, minimalist, flat_vector, vintage_retro)
- `emotion` (calm, energetic, nostalgic, inspirational)
- `inspirationKeyword` (optional)

**Current Prompt Template:**

```
Create [subjectFragment][inspirationFragment].

Style: [styleFragment]
Mood: [emotionData.mood]
Colors: [paletteFragment]
Lighting: [emotionData.lighting]

Technical requirements: high quality, sharp details, well-balanced composition, full-frame artwork, clean edges.
```

## New Prompt Structure (3-step visual questionnaire)

**Input Fields:**

- `artStyle` (Abstract Geometric, Minimalist, Botanical, Landscape, Surreal, Retro/Vintage, Cosmic/Space)
- `colorPalette` (Monochrome, Earth Tones, Ocean Blues, Warm Sunset, Forest Greens, Vibrant/Bold, Pastels)
- `subject` (dynamic based on art style)

## New Prompt Template

### Art Style Mappings

```javascript
const artStyleMappings = {
  abstract_geometric:
    'abstract geometric composition, clean lines, geometric patterns, modern design',
  minimalist: 'minimalist design, simple forms, strong use of negative space, clean aesthetic',
  botanical: 'botanical art, organic forms, plant-based imagery, natural elements',
  landscape: 'landscape art, scenic views, natural environments, atmospheric perspective',
  surreal: 'surreal art, dreamlike imagery, unexpected combinations, ethereal atmosphere',
  retro_vintage:
    'retro vintage style, mid-century modern aesthetic, nostalgic design, classic poster art',
  cosmic_space: 'cosmic space art, celestial imagery, nebulas, galaxies, astronomical themes',
};
```

### Color Palette Mappings

```javascript
const colorPaletteMappings = {
  monochrome: 'monochrome palette — black, white, shades of grey',
  earth_tones: 'earth tones — warm browns, terracotta, ochre, sage green',
  ocean_blues: 'ocean blues — deep blue, turquoise, aqua, seafoam',
  warm_sunset: 'warm sunset colors — coral, peach, golden yellow, warm orange',
  forest_greens: 'forest greens — deep green, emerald, moss, olive',
  vibrant_bold: 'vibrant bold colors — bright red, electric blue, vivid purple, high saturation',
  pastels: 'pastel colors — soft pink, lavender, mint, peach, light blue',
};
```

### Subject Mappings (by Art Style)

```javascript
const subjectMappings = {
  abstract_geometric: {
    organic_shapes: 'organic shapes, flowing forms, natural curves',
    geometric_patterns: 'geometric patterns, repeating shapes, structured design',
    fluid_forms: 'fluid forms, dynamic movement, abstract composition',
  },
  minimalist: {
    lines: 'simple lines, linear elements, geometric lines',
    shapes: 'basic shapes, geometric forms, simple compositions',
    negative_space: 'strong negative space, balanced composition, clean design',
    simple_forms: 'simple forms, reduced elements, essential shapes',
  },
  botanical: {
    flowers: 'flowers, floral elements, botanical illustrations',
    leaves: 'leaves, foliage, plant details, natural textures',
    trees: 'trees, branches, natural growth patterns',
    abstract_plants: 'abstract plant forms, stylized botanical elements',
  },
  landscape: {
    mountains: 'mountain landscapes, peaks, scenic vistas',
    ocean: 'ocean scenes, seascapes, coastal views',
    forest: 'forest scenes, woodland, natural environments',
    desert: 'desert landscapes, arid scenes, vast horizons',
  },
  surreal: {
    dreamscapes: 'dreamlike landscapes, surreal environments, fantastical scenes',
    abstract_forms: 'abstract forms, non-representational elements, conceptual imagery',
    unexpected_combinations: 'unexpected combinations, juxtaposed elements, surreal compositions',
  },
  retro_vintage: {
    travel_poster: 'travel poster style, vintage tourism, classic destinations',
    mid_century_modern: 'mid-century modern design, retro aesthetic, 1950s-60s style',
    psychedelic: 'psychedelic art, vibrant patterns, 1960s-70s aesthetic',
  },
  cosmic_space: {
    planets: 'planets, celestial bodies, astronomical objects',
    nebulas: 'nebulas, cosmic clouds, stellar formations',
    stars: 'stars, starfields, celestial patterns',
    galaxies: 'galaxies, spiral formations, cosmic structures',
  },
};
```

### New Prompt Template Format

```javascript
const prompt = `
Create an art poster for home decor featuring ${subjectDescription}.

Art Style: ${artStyleDescription}
Color Palette: ${colorPaletteDescription}

Technical requirements: high quality, sharp details, well-balanced composition, full-frame artwork, clean edges, print-ready, suitable for home decoration.
`.trim();
```

### Example Prompts

**Example 1: Abstract Geometric + Monochrome + Geometric Patterns**

```
Create an art poster for home decor featuring geometric patterns, repeating shapes, structured design.

Art Style: abstract geometric composition, clean lines, geometric patterns, modern design
Color Palette: monochrome palette — black, white, shades of grey

Technical requirements: high quality, sharp details, well-balanced composition, full-frame artwork, clean edges, print-ready, suitable for home decoration.
```

**Example 2: Botanical + Forest Greens + Leaves**

```
Create an art poster for home decor featuring leaves, foliage, plant details, natural textures.

Art Style: botanical art, organic forms, plant-based imagery, natural elements
Color Palette: forest greens — deep green, emerald, moss, olive

Technical requirements: high quality, sharp details, well-balanced composition, full-frame artwork, clean edges, print-ready, suitable for home decoration.
```

**Example 3: Cosmic/Space + Ocean Blues + Nebulas**

```
Create an art poster for home decor featuring nebulas, cosmic clouds, stellar formations.

Art Style: cosmic space art, celestial imagery, nebulas, galaxies, astronomical themes
Color Palette: ocean blues — deep blue, turquoise, aqua, seafoam

Technical requirements: high quality, sharp details, well-balanced composition, full-frame artwork, clean edges, print-ready, suitable for home decoration.
```

## Implementation Notes

1. **Backward Compatibility**: The new prompt structure replaces the old 5-step structure. Existing drafts with old format should be handled gracefully (either migrated or marked as legacy).

2. **Prompt Quality**: The new structure focuses on "art poster for home decor" context, which helps AI models generate more appropriate imagery.

3. **Dynamic Subjects**: Subject options change based on art style selection, ensuring more relevant and coherent prompts.

4. **Visual-First Approach**: While the prompt is text-based for AI APIs, the user experience is visual-first, making selection more intuitive.
