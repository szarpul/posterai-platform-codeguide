-- Create questionnaire_options table
CREATE TABLE IF NOT EXISTS questionnaire_options (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    value VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(type, value)
);

-- Insert theme options (keep existing)
INSERT INTO questionnaire_options (type, value) VALUES
    ('theme', 'nature'),
    ('theme', 'urban'),
    ('theme', 'fantasy'),
    ('theme', 'futuristic')
ON CONFLICT (type, value) DO NOTHING;

-- Insert palette options (keep existing)
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

-- Insert emotion options (updated)
INSERT INTO questionnaire_options (type, value) VALUES
    ('emotion', 'calm'),
    ('emotion', 'energetic'),
    ('emotion', 'nostalgic'),
    ('emotion', 'inspirational')
ON CONFLICT (type, value) DO NOTHING; 