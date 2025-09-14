-- Migration script to update questionnaire options to new structure
-- Run this after the initial schema is created

-- First, let's see what we currently have
-- SELECT * FROM questionnaire_options ORDER BY type, value;

-- Remove old/conflicting options that are no longer needed
-- Remove old style options
DELETE FROM questionnaire_options WHERE type = 'style' AND value IN ('modern', 'vintage', 'abstract', 'minimalist');

-- Remove old mood options  
DELETE FROM questionnaire_options WHERE type = 'mood' AND value IN ('calm', 'energetic', 'mysterious', 'joyful');

-- Remove old color palette options
DELETE FROM questionnaire_options WHERE type = 'color' AND value IN ('warm', 'cool', 'monochrome', 'vibrant');

-- Remove old subject options
DELETE FROM questionnaire_options WHERE type = 'subject' AND value IN ('landscapes', 'portraits', 'animals', 'architecture');

-- Now insert the new options (using ON CONFLICT to avoid duplicates)

-- Insert theme options (keep existing)
INSERT INTO questionnaire_options (type, value) VALUES
    ('theme', 'nature'),
    ('theme', 'urban'),
    ('theme', 'fantasy'),
    ('theme', 'futuristic')
ON CONFLICT (type, value) DO NOTHING;

-- Insert palette options (updated from color)
INSERT INTO questionnaire_options (type, value) VALUES
    ('palette', 'bright'),
    ('palette', 'dark'),
    ('palette', 'pastel'),
    ('palette', 'neutral')
ON CONFLICT (type, value) DO NOTHING;

-- Insert style options (updated)
INSERT INTO questionnaire_options (type, value) VALUES
    ('style', 'realistic'),
    ('style', 'cartoon'),
    ('style', 'surreal'),
    ('style', 'minimalist'),
    ('style', 'flat_vector'),
    ('style', 'vintage_retro')
ON CONFLICT (type, value) DO NOTHING;

-- Insert main element options (new)
INSERT INTO questionnaire_options (type, value) VALUES
    ('main_element', 'photo_realistic'),
    ('main_element', 'illustration_drawing'),
    ('main_element', 'abstract_shapes')
ON CONFLICT (type, value) DO NOTHING;

-- Insert occasion options (new)
INSERT INTO questionnaire_options (type, value) VALUES
    ('occasion', 'home_decoration'),
    ('occasion', 'office_workspace'),
    ('occasion', 'kids_room'),
    ('occasion', 'gift_special_event')
ON CONFLICT (type, value) DO NOTHING;

-- Insert emotion options (updated from mood)
INSERT INTO questionnaire_options (type, value) VALUES
    ('emotion', 'calm'),
    ('emotion', 'energetic'),
    ('emotion', 'nostalgic'),
    ('emotion', 'inspirational')
ON CONFLICT (type, value) DO NOTHING;

-- Note: inspirationKeyword is a free text field, so no options needed in the database

-- Verify the final state
-- SELECT type, array_agg(value ORDER BY value) as values FROM questionnaire_options GROUP BY type ORDER BY type;
