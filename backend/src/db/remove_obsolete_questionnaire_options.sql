-- Remove mainElement and occasion options
-- These fields are being removed to simplify the questionnaire
DELETE FROM questionnaire_options WHERE type IN ('main_element', 'occasion');


