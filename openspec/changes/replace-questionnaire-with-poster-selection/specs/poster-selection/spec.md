# poster-selection Specification

## Purpose

Defines the visual-first poster selection capability where users complete a redesigned 3-step visual questionnaire focused on art posters for home decor. Users select from visual examples (art style images, color swatches) and dynamic subject options, then generate AI images on-demand with options to regenerate, save as draft, or proceed to checkout.

## ADDED Requirements

### Requirement: Visual Art Style Selection

The system SHALL provide a visual grid interface for Step 1 where users select an art style by clicking on example poster images. The grid MUST display 7 art style categories, each showing high-quality example poster images.

**Art Style Categories:**

1. Abstract Geometric
2. Minimalist
3. Botanical
4. Landscape
5. Surreal
6. Retro/Vintage
7. Cosmic/Space

#### Scenario: User selects art style visually

- **WHEN** user navigates to Step 1 of the questionnaire
- **THEN** a gallery-like grid displays 7 art style categories
- **AND** each category shows large example poster images
- **AND** style names are displayed subtly underneath or overlaid on images
- **AND** user clicks directly on the image to select that style
- **AND** selected style is visually highlighted

### Requirement: Visual Color Palette Selection

The system SHALL provide visual color swatches for Step 2 where users select their preferred color palette from actual color combinations displayed as visual swatches, not text labels.

**Color Palette Options:**

- Monochrome
- Earth Tones
- Ocean Blues
- Warm Sunset
- Forest Greens
- Vibrant/Bold
- Pastels

#### Scenario: User selects color palette visually

- **WHEN** user completes Step 1 and proceeds to Step 2
- **THEN** 5-8 visual color swatches are displayed showing actual color combinations
- **AND** each swatch shows the color palette visually (not just text labels)
- **AND** user clicks on a swatch to select that color palette
- **AND** selected palette is visually highlighted

### Requirement: Dynamic Subject/Elements Selection

The system SHALL provide Step 3 with subject/element options that change dynamically based on the art style selected in Step 1.

**Subject Options by Style:**

- **Abstract Geometric:** Organic shapes, Geometric patterns, Fluid forms
- **Minimalist:** Lines, Shapes, Negative space, Simple forms
- **Botanical:** Flowers, Leaves, Trees, Abstract plants
- **Landscape:** Mountains, Ocean, Forest, Desert
- **Surreal:** Dreamscapes, Abstract forms, Unexpected combinations
- **Retro/Vintage:** Travel poster, Mid-century modern, Psychedelic
- **Cosmic/Space:** Planets, Nebulas, Stars, Galaxies

#### Scenario: User selects subject based on art style

- **WHEN** user completes Step 2 and proceeds to Step 3
- **THEN** 3-5 subject/element options relevant to the selected art style are displayed
- **AND** options change dynamically based on Step 1 selection
- **AND** user selects one subject/element option
- **AND** selected option is visually highlighted

### Requirement: Visual Asset Management (Admin)

Administrators SHALL be able to manage visual assets for questionnaire options, including uploading example poster images for art styles and defining color swatches for color palettes.

#### Scenario: Admin uploads art style example images

- **WHEN** admin navigates to questionnaire template management
- **THEN** admin can upload example poster images for each art style category
- **AND** admin can set which images display in the Step 1 visual grid
- **AND** uploaded images are stored and associated with questionnaire options
- **AND** changes are immediately reflected in the user-facing questionnaire

#### Scenario: Admin defines color palette swatches

- **WHEN** admin manages color palette options
- **THEN** admin can define visual color swatches showing actual color combinations
- **AND** admin can upload or create color swatch images
- **AND** color swatches are displayed in Step 2 instead of text labels
- **AND** changes are immediately reflected in the user-facing questionnaire

## MODIFIED Requirements

### Requirement: User Poster Creation Flow

The system SHALL provide a visual-first 3-step questionnaire focused on art posters for home decor. Users MUST complete Step 1 (Art Style Selection with visual example images), Step 2 (Color Palette Selection with visual swatches), and Step 3 (Subject/Elements Selection with dynamic options based on art style). After completing the questionnaire, users SHALL generate AI images on-demand. The post-generation view (regenerate, save as draft, proceed to checkout) remains unchanged from the current implementation.

#### Scenario: User completes visual questionnaire and generates poster

- **WHEN** user navigates to the questionnaire page
- **THEN** Step 1 displays visual grid of 7 art style categories with example images
- **AND** user clicks on an art style image to select it
- **AND** Step 2 displays visual color swatches (5-8 options)
- **AND** user clicks on a color swatch to select it
- **AND** Step 3 displays dynamic subject/element options based on selected art style
- **AND** user selects a subject/element option
- **AND** after completing all 3 steps, user clicks "Generate Poster Preview"
- **AND** system generates AI image using the selected options
- **AND** generated poster is displayed with the same post-generation actions as currently implemented (regenerate, save as draft, proceed to checkout)

### Requirement: Questionnaire Options Structure

The system SHALL store questionnaire options with support for visual assets. Questionnaire options MUST include example poster images for art styles and color swatch definitions for color palettes. The database schema MUST include `image_url` field for art style example images and `color_swatch` field (JSON) for color palette definitions. Text labels SHALL remain as fallback but visual assets are primary.

#### Scenario: System retrieves visual questionnaire options

- **WHEN** frontend requests questionnaire options from API
- **THEN** API returns options with visual assets (image URLs for art styles, color swatch data for palettes)
- **AND** frontend displays visual grid for Step 1 with example images
- **AND** frontend displays visual swatches for Step 2
- **AND** frontend displays dynamic options for Step 3 based on selected art style

### Requirement: AI Prompt Generation from Visual Questionnaire

The system SHALL construct AI image generation prompts from the 3-step visual questionnaire selections. The prompt MUST map art style, color palette, and subject selections to descriptive text suitable for AI image generation APIs (OpenAI, Leonardo AI).

**Prompt Template Structure:**

- Art Style selection maps to style description
- Color Palette selection maps to color description
- Subject/Elements selection maps to subject description
- Prompt focuses on creating art posters for home decor

#### Scenario: System generates prompt from visual questionnaire selections

- **WHEN** user completes all 3 questionnaire steps (art style, color palette, subject)
- **AND** user clicks "Generate Poster Preview"
- **THEN** system constructs prompt using new 3-step structure:
  - Art Style → style description (e.g., "abstract geometric", "minimalist", "botanical")
  - Color Palette → color description (e.g., "monochrome", "earth tones", "ocean blues")
  - Subject/Elements → subject description (e.g., "organic shapes", "flowers", "mountains")
- **AND** prompt is formatted for AI image generation API
- **AND** prompt emphasizes art poster for home decor context
- **AND** generated prompt includes technical requirements (high quality, sharp details, print-ready)

#### Scenario: Prompt mapping for different art styles

- **WHEN** user selects "Abstract Geometric" art style
- **AND** user selects "Monochrome" color palette
- **AND** user selects "Geometric patterns" subject
- **THEN** prompt includes: abstract geometric style, monochrome color palette, geometric patterns subject
- **AND** prompt emphasizes clean lines, geometric forms, high contrast

- **WHEN** user selects "Botanical" art style
- **AND** user selects "Forest Greens" color palette
- **AND** user selects "Leaves" subject
- **THEN** prompt includes: botanical style, forest green color palette, leaves subject
- **AND** prompt emphasizes organic forms, natural elements, plant-based imagery

## REMOVED Requirements

### Requirement: Text-Based Questionnaire Options

**Reason**: Replaced with visual-first approach. Art styles now show example images, color palettes show visual swatches instead of text labels.

**Migration**:

- Existing questionnaire options data can be enhanced with visual assets
- Admin can upload example images and define color swatches for existing options
- Text labels remain as fallback but visual assets are primary

### Requirement: 5-Step Questionnaire Flow

**Reason**: Simplified to 3 visual steps focused on art posters for home decor. Removed abstract "theme" and "mood" steps, replaced with visual art style and color palette selection.

**Migration**:

- Existing questionnaire data can be mapped to new 3-step structure
- Theme and mood options can be incorporated into art style categories
- Existing drafts with 5-step responses can be migrated or marked as legacy
