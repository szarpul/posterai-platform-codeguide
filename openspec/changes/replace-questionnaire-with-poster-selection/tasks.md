## 1. Database Schema Changes

- [ ] 1.1 Update `questionnaire_options` table to add columns: `image_url` (for art style example images), `color_swatch` (JSON field for color palette definitions)
- [ ] 1.2 Migrate existing questionnaire options to new 3-step structure:
  - Map existing style options to 7 art style categories (Abstract Geometric, Minimalist, Botanical, Landscape, Surreal, Retro/Vintage, Cosmic/Space)
  - Map existing color options to visual color palettes (Monochrome, Earth Tones, Ocean Blues, Warm Sunset, Forest Greens, Vibrant/Bold, Pastels)
  - Map existing subject options to dynamic subject/element options based on art style
- [ ] 1.3 Add database indexes on `type` and `image_url` for efficient querying
- [ ] 1.4 Update Supabase migrations to include schema changes

## 2. Backend API Changes

- [ ] 2.1 Update `backend/src/routes/questionnaire.js`:
  - Modify `GET /api/questionnaire-options` to return visual assets (image URLs, color swatches)
  - Add support for filtering options by type (art_style, color_palette, subject)
  - Add endpoint to get dynamic subject options based on selected art style
- [ ] 2.2 Update `backend/src/services/imageGenerator.js`:
  - Update `buildPrompt()` method to accept new 3-step structure: `artStyle`, `colorPalette`, `subject`
  - Create new prompt template mapping:
    - Map 7 art styles to style descriptions (Abstract Geometric → "abstract geometric composition", Minimalist → "minimalist design", etc.)
    - Map 7 color palettes to color descriptions (Monochrome → "monochrome palette", Earth Tones → "earth tones", etc.)
    - Map dynamic subjects to subject descriptions based on art style
  - Update prompt format to focus on "art poster for home decor" context
  - Ensure prompt includes technical requirements (high quality, sharp details, print-ready)
- [ ] 2.3 Update `backend/src/routes/images.js`:
  - Update validation to accept `artStyle`, `colorPalette`, `subject` instead of `theme`, `palette`, `style`, `emotion`
  - Ensure regenerate endpoint works with new questionnaire format
- [ ] 2.3 Update draft creation endpoint to work with new questionnaire structure (3 steps instead of 5)
- [ ] 2.4 Ensure order creation flow works with generated images from new questionnaire

## 3. Frontend Component Changes

- [ ] 3.1 Redesign `frontend/src/pages/QuestionnairePage.jsx`:
  - Implement Step 1: Visual art style grid with 7 categories showing example poster images
  - Implement Step 2: Visual color palette swatches (5-8 visual swatches)
  - Implement Step 3: Dynamic subject/element selection based on selected art style
  - Add step indicator showing progress (1/3, 2/3, 3/3)
  - Add visual feedback for selected options
- [ ] 3.2 Update poster preview/generation page:
  - Keep existing "Regenerate", "Save as Draft", and "Proceed to Checkout" functionality unchanged
  - Ensure generated poster image displays correctly with new 3-step questionnaire structure
- [ ] 3.3 Update `QuestionnaireContext` to handle:
  - Visual selections (art style images, color swatches)
  - Dynamic subject options based on art style
  - Ensure compatibility with existing regenerate functionality
- [ ] 3.4 Update routing: keep `/questionnaire` route but update component behavior
- [ ] 3.5 Ensure `PosterDetailPage.jsx` works with generated images from new questionnaire

## 4. Admin Dashboard Updates

- [ ] 4.1 Update questionnaire template management UI:
  - Add image upload functionality for art style example images
  - Add color swatch definition interface (upload swatch images or define color values)
  - Update form to support visual assets alongside text labels
- [ ] 4.2 Add visual asset management:
  - Upload example poster images for each art style category
  - Define color swatches for each color palette option
  - Preview how visual assets appear in user-facing questionnaire
- [ ] 4.3 Update admin interface to reflect new 3-step structure:
  - Organize options by step (Art Style, Color Palette, Subject/Elements)
  - Show which subject options are available for each art style
- [ ] 4.4 Update admin routes and navigation to reflect visual asset management

## 5. Visual Asset Preparation

- [ ] 5.1 Create or source example poster images for 7 art style categories:
  - Abstract Geometric: example poster image
  - Minimalist: example poster image
  - Botanical: example poster image
  - Landscape: example poster image
  - Surreal: example poster image
  - Retro/Vintage: example poster image
  - Cosmic/Space: example poster image
- [ ] 5.2 Create visual color swatches for 7 color palette options:
  - Monochrome swatch
  - Earth Tones swatch
  - Ocean Blues swatch
  - Warm Sunset swatch
  - Forest Greens swatch
  - Vibrant/Bold swatch
  - Pastels swatch
- [ ] 5.3 Upload visual assets to Supabase Storage and associate with questionnaire options

## 6. Data Migration & Cleanup

- [ ] 6.1 Create migration script to:
  - Map existing 5-step questionnaire data to new 3-step structure
  - Associate visual assets with questionnaire options
  - Update existing drafts to work with new structure (if migration path exists)
- [ ] 6.2 Archive or update old questionnaire options that don't fit new structure
- [ ] 6.3 Update documentation to reflect new visual questionnaire flow

## 7. Testing

- [ ] 7.1 Write backend tests for updated `/api/questionnaire-options` endpoint with visual assets
- [ ] 7.2 Write backend tests for `/api/generate-image/regenerate` endpoint
- [ ] 7.3 Write frontend tests for redesigned `QuestionnairePage` component:
  - Test Step 1 visual art style selection
  - Test Step 2 visual color palette selection
  - Test Step 3 dynamic subject selection based on art style
  - Test regenerate functionality
- [ ] 7.4 Update E2E tests to use new 3-step visual questionnaire
- [ ] 7.5 Test admin visual asset management workflows
- [ ] 7.6 Verify draft and order creation still works with new questionnaire structure

## 8. Documentation Updates

- [ ] 8.1 Update user-facing documentation/help text to reflect visual questionnaire
- [ ] 8.2 Update API documentation for new endpoints and visual asset support
- [ ] 8.3 Update deployment guides if needed
- [ ] 8.4 Update project.md to reflect visual-first questionnaire approach focused on art posters for home decor
