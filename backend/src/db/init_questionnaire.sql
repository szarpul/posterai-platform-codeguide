-- Create questionnaire_options table
CREATE TABLE IF NOT EXISTS questionnaire_options (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    value VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(type, value)
);

-- Insert style options
INSERT INTO questionnaire_options (type, value) VALUES
    ('style', 'modern'),
    ('style', 'vintage'),
    ('style', 'abstract'),
    ('style', 'minimalist')
ON CONFLICT (type, value) DO NOTHING;

-- Insert theme options
INSERT INTO questionnaire_options (type, value) VALUES
    ('theme', 'nature'),
    ('theme', 'urban'),
    ('theme', 'fantasy'),
    ('theme', 'futuristic')
ON CONFLICT (type, value) DO NOTHING;

-- Insert mood options
INSERT INTO questionnaire_options (type, value) VALUES
    ('mood', 'calm'),
    ('mood', 'energetic'),
    ('mood', 'mysterious'),
    ('mood', 'joyful')
ON CONFLICT (type, value) DO NOTHING;

-- Insert color palette options
INSERT INTO questionnaire_options (type, value) VALUES
    ('color', 'warm'),
    ('color', 'cool'),
    ('color', 'monochrome'),
    ('color', 'vibrant')
ON CONFLICT (type, value) DO NOTHING;

-- Insert subject options
INSERT INTO questionnaire_options (type, value) VALUES
    ('subject', 'landscapes'),
    ('subject', 'portraits'),
    ('subject', 'animals'),
    ('subject', 'architecture')
ON CONFLICT (type, value) DO NOTHING; 