## Why

The current questionnaire-based approach requires users to make multiple abstract selections (style, theme, mood, color palette, subject) without visual context, which can be confusing and may not produce desired results. By redesigning the questionnaire into a visual-first, 3-step experience focused on art posters for home decor, users can see example images and color swatches, making selections more intuitive and improving conversion rates. The redesign also refocuses the platform on curated art posters rather than generic poster creation.

## What Changes

- **BREAKING**: Redesign questionnaire from 5 abstract steps to 3 visual steps (Art Style, Color Palette, Subject/Elements)
- Replace text-based questionnaire options with visual-first selection (image grids, color swatches)
- Refocus platform on "art posters for home decor" with curated style categories
- Update Step 1: Art Style Selection - visual grid with 7 categories showing example poster images
- Update Step 2: Color Palette Selection - visual color swatches instead of text labels
- Update Step 3: Subject/Elements Selection - dynamic options based on selected art style
- Post-generation view remains unchanged (regenerate, save as draft, proceed to checkout functionality already exists)
- Update database schema: modify `questionnaire_options` to support visual assets (image URLs, color swatches)
- Update admin dashboard: add visual asset management for questionnaire options (upload example images, define color swatches)
- Modify API endpoints: update `/api/questionnaire-options` to return visual assets, keep `/api/generate-image` for on-demand generation
- Regenerate functionality already exists and remains unchanged

## Impact

- Affected specs: `poster-selection` capability (modified questionnaire flow with visual-first approach)
- Affected code:
  - Frontend: `frontend/src/pages/QuestionnairePage.jsx` - redesign to visual 3-step flow
  - Backend: `backend/src/routes/questionnaire.js` - add visual asset support, `backend/src/routes/generateImage.js` - add regenerate endpoint
  - Database: Update `questionnaire_options` table to include `image_url`, `color_swatch` fields
  - Admin: Update admin dashboard to manage visual assets for questionnaire options
  - Context: Update `QuestionnaireContext` to handle visual selections and regenerate functionality
