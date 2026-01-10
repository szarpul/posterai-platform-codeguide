// Mood Mapping Configuration
// Maps emotional moods to style, palette, and subject combinations

export const MOODS = {
  calm: {
    label: 'Calm',
    description: 'Peaceful and serene',
    position: { x: 20, y: 50 }, // Percentage positions in constellation
    color: '#60A5FA', // Blue
    styles: ['minimalist', 'botanical', 'landscape'],
    palettes: ['ocean_blues', 'pastels', 'monochrome'],
    subjects: ['ocean', 'leaves', 'simple_forms', 'mountains'],
    gradient: 'from-blue-400 via-cyan-300 to-teal-200',
  },
  bold: {
    label: 'Bold',
    description: 'Strong and striking',
    position: { x: 80, y: 50 },
    color: '#F59E0B', // Orange
    styles: ['abstract_geometric', 'surreal'],
    palettes: ['vibrant_bold', 'warm_sunset'],
    subjects: ['geometric_patterns', 'fluid_forms', 'dreamscapes'],
    gradient: 'from-orange-500 via-red-500 to-pink-500',
  },
  playful: {
    label: 'Playful',
    description: 'Fun and whimsical',
    position: { x: 35, y: 15 },
    color: '#EC4899', // Pink
    styles: ['retro_vintage', 'surreal', 'botanical'],
    palettes: ['pastels', 'vibrant_bold', 'warm_sunset'],
    subjects: ['psychedelic', 'flowers', 'abstract_forms'],
    gradient: 'from-pink-400 via-fuchsia-400 to-purple-400',
  },
  elegant: {
    label: 'Elegant',
    description: 'Refined and sophisticated',
    position: { x: 65, y: 15 },
    color: '#8B5CF6', // Purple
    styles: ['minimalist', 'abstract_geometric'],
    palettes: ['monochrome', 'earth_tones'],
    subjects: ['simple_forms', 'geometric_patterns', 'lines'],
    gradient: 'from-purple-500 via-indigo-500 to-slate-700',
  },
  minimal: {
    label: 'Minimal',
    description: 'Simple and clean',
    position: { x: 15, y: 80 },
    color: '#6B7280', // Gray
    styles: ['minimalist'],
    palettes: ['monochrome', 'pastels'],
    subjects: ['simple_forms', 'lines', 'shapes', 'negative_space'],
    gradient: 'from-gray-400 via-slate-400 to-zinc-400',
  },
  dramatic: {
    label: 'Dramatic',
    description: 'Intense and powerful',
    position: { x: 85, y: 80 },
    color: '#DC2626', // Red
    styles: ['surreal', 'abstract_geometric', 'cosmic_space'],
    palettes: ['vibrant_bold', 'monochrome'],
    subjects: ['dreamscapes', 'unexpected_combinations', 'nebulas'],
    gradient: 'from-red-600 via-purple-700 to-black',
  },
  retro: {
    label: 'Retro',
    description: 'Nostalgic and vintage',
    position: { x: 50, y: 30 },
    color: '#F97316', // Orange-Red
    styles: ['retro_vintage'],
    palettes: ['warm_sunset', 'earth_tones'],
    subjects: ['travel_poster', 'mid_century_modern', 'psychedelic'],
    gradient: 'from-amber-400 via-orange-500 to-red-500',
  },
  cosmic: {
    label: 'Cosmic',
    description: 'Otherworldly and infinite',
    position: { x: 50, y: 70 },
    color: '#6366F1', // Indigo
    styles: ['cosmic_space', 'surreal'],
    palettes: ['vibrant_bold', 'monochrome'],
    subjects: ['planets', 'nebulas', 'stars', 'galaxies'],
    gradient: 'from-indigo-600 via-purple-700 to-slate-900',
  },
};

// Calculate mood influence based on distance from point
export const calculateMoodInfluence = (position, moods) => {
  const influences = {};
  let totalWeight = 0;

  Object.entries(moods).forEach(([key, mood]) => {
    const dx = position.x - mood.position.x;
    const dy = position.y - mood.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Inverse square falloff for influence
    const influence = 1 / (1 + distance * distance / 400);
    influences[key] = influence;
    totalWeight += influence;
  });

  // Normalize influences
  Object.keys(influences).forEach((key) => {
    influences[key] /= totalWeight;
  });

  return influences;
};

// Get the dominant mood based on position
export const getDominantMood = (position, moods) => {
  const influences = calculateMoodInfluence(position, moods);
  let maxInfluence = 0;
  let dominantMood = null;

  Object.entries(influences).forEach(([key, influence]) => {
    if (influence > maxInfluence) {
      maxInfluence = influence;
      dominantMood = key;
    }
  });

  return dominantMood;
};

// Select best style/palette/subject based on mood influences
export const selectFromMoodInfluence = (influences, moods) => {
  // Weight each option by mood influence
  const styleScores = {};
  const paletteScores = {};
  const subjectScores = {};

  Object.entries(influences).forEach(([moodKey, influence]) => {
    const mood = moods[moodKey];

    mood.styles.forEach((style) => {
      styleScores[style] = (styleScores[style] || 0) + influence;
    });

    mood.palettes.forEach((palette) => {
      paletteScores[palette] = (paletteScores[palette] || 0) + influence;
    });

    mood.subjects.forEach((subject) => {
      subjectScores[subject] = (subjectScores[subject] || 0) + influence;
    });
  });

  // Pick highest scoring options
  const bestStyle = Object.keys(styleScores).reduce((a, b) =>
    styleScores[a] > styleScores[b] ? a : b
  );
  const bestPalette = Object.keys(paletteScores).reduce((a, b) =>
    paletteScores[a] > paletteScores[b] ? a : b
  );
  const bestSubject = Object.keys(subjectScores).reduce((a, b) =>
    subjectScores[a] > subjectScores[b] ? a : b
  );

  return {
    style: bestStyle,
    palette: bestPalette,
    subject: bestSubject,
  };
};

// Get variation suggestions (alternative palettes/subjects for current style)
export const getVariations = (currentSelection, moods, dominantMood) => {
  const mood = moods[dominantMood];

  return {
    alternativePalettes: mood.palettes.filter((p) => p !== currentSelection.palette),
    alternativeSubjects: mood.subjects.filter((s) => s !== currentSelection.subject),
    alternativeStyles: mood.styles.filter((s) => s !== currentSelection.style),
  };
};

// Get a random curated combination
export const getRandomCombination = (moods) => {
  const moodKeys = Object.keys(moods);
  const randomMood = moods[moodKeys[Math.floor(Math.random() * moodKeys.length)]];

  return {
    style: randomMood.styles[Math.floor(Math.random() * randomMood.styles.length)],
    palette: randomMood.palettes[Math.floor(Math.random() * randomMood.palettes.length)],
    subject: randomMood.subjects[Math.floor(Math.random() * randomMood.subjects.length)],
    moodPosition: randomMood.position,
  };
};
