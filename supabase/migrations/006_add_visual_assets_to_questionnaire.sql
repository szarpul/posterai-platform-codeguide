-- Add visual asset support to questionnaire_options table
-- This migration adds image_url for art style example images and color_swatch for color palette definitions

-- Add image_url column for storing example poster image URLs
ALTER TABLE questionnaire_options 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add color_swatch column for storing color palette definitions as JSON
ALTER TABLE questionnaire_options 
ADD COLUMN IF NOT EXISTS color_swatch JSONB;

-- Add index on image_url for efficient querying
CREATE INDEX IF NOT EXISTS idx_questionnaire_options_image_url 
ON questionnaire_options(image_url) 
WHERE image_url IS NOT NULL;

-- Add index on type for filtering
CREATE INDEX IF NOT EXISTS idx_questionnaire_options_type 
ON questionnaire_options(type);

-- Update existing options to new 3-step structure
-- Map existing types to new structure:
-- - style -> art_style
-- - palette -> color_palette  
-- - theme/subject -> subject (will be dynamic based on art_style)

-- Note: We'll migrate data in a separate step, but the schema is ready
