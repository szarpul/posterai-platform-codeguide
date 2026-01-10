import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MOODS, getDominantMood, calculateMoodInfluence } from '../../config/moodMapping';

export default function MoodConstellation({ position, onPositionChange, currentMood }) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleDrag = (event, info) => {
    if (!containerRef.current) return;

    const { width, height } = containerSize;
    const rect = containerRef.current.getBoundingClientRect();

    // Calculate position as percentage
    let x = ((info.point.x - rect.left) / width) * 100;
    let y = ((info.point.y - rect.top) / height) * 100;

    // Clamp to bounds
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

    onPositionChange({ x, y });
  };

  const handleMoodClick = (mood) => {
    onPositionChange(mood.position);
  };

  // Convert percentage to pixels for rendering
  const toPixels = (percent, dimension) => {
    return (percent / 100) * (dimension === 'x' ? containerSize.width : containerSize.height);
  };

  // Calculate connections between nearby moods
  const getMoodConnections = () => {
    const connections = [];
    const moodEntries = Object.entries(MOODS);

    for (let i = 0; i < moodEntries.length; i++) {
      for (let j = i + 1; j < moodEntries.length; j++) {
        const [, mood1] = moodEntries[i];
        const [, mood2] = moodEntries[j];

        const dx = mood1.position.x - mood2.position.x;
        const dy = mood1.position.y - mood2.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Only connect if within threshold
        if (distance < 45) {
          connections.push({
            from: mood1.position,
            to: mood2.position,
            distance,
          });
        }
      }
    }

    return connections;
  };

  const connections = getMoodConnections();
  const influences = calculateMoodInfluence(position, MOODS);

  return (
    <div className="relative w-full h-full min-h-[500px]" ref={containerRef}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 rounded-3xl overflow-hidden">
        {/* Ambient glow effect */}
        <div className="absolute inset-0 opacity-30">
          {Object.entries(MOODS).map(([key, mood]) => (
            <div
              key={key}
              className="absolute w-64 h-64 rounded-full blur-3xl transition-opacity duration-500"
              style={{
                left: `${mood.position.x}%`,
                top: `${mood.position.y}%`,
                transform: 'translate(-50%, -50%)',
                backgroundColor: mood.color,
                opacity: influences[key] || 0.1,
              }}
            />
          ))}
        </div>

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((conn, i) => (
            <motion.line
              key={i}
              x1={`${conn.from.x}%`}
              y1={`${conn.from.y}%`}
              x2={`${conn.to.x}%`}
              y2={`${conn.to.y}%`}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: i * 0.05 }}
            />
          ))}

          {/* Lines from selector to nearby moods */}
          {Object.entries(influences).map(([key, influence]) => {
            if (influence < 0.15) return null;
            const mood = MOODS[key];
            return (
              <line
                key={key}
                x1={`${position.x}%`}
                y1={`${position.y}%`}
                x2={`${mood.position.x}%`}
                y2={`${mood.position.y}%`}
                stroke={mood.color}
                strokeWidth="2"
                opacity={influence}
                className="pointer-events-none transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* Mood Points */}
        {Object.entries(MOODS).map(([key, mood]) => {
          const isActive = influences[key] > 0.2;
          const isDominant = currentMood === key;

          return (
            <motion.button
              key={key}
              onClick={() => handleMoodClick(mood)}
              className="absolute group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              style={{
                left: `${mood.position.x}%`,
                top: `${mood.position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Outer ring - shows influence */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  width: '60px',
                  height: '60px',
                  left: '-30px',
                  top: '-30px',
                  border: `2px solid ${mood.color}`,
                }}
                animate={{
                  scale: isDominant ? 1.3 : isActive ? 1.2 : 1,
                  opacity: isDominant ? 1 : isActive ? 0.6 : 0.3,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Inner dot */}
              <div
                className="w-3 h-3 rounded-full shadow-large transition-all duration-300"
                style={{
                  backgroundColor: mood.color,
                  boxShadow: `0 0 20px ${mood.color}`,
                }}
              />

              {/* Label */}
              <motion.div
                className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap pointer-events-none"
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: isDominant ? 1 : isActive ? 0.9 : 0.6,
                  y: 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`text-xs font-semibold transition-all duration-300 ${
                    isDominant ? 'text-white text-sm' : 'text-white/80'
                  }`}
                >
                  {mood.label}
                </div>
                {isDominant && (
                  <div className="text-xs text-white/60 text-center">{mood.description}</div>
                )}
              </motion.div>
            </motion.button>
          );
        })}

        {/* Draggable Selector */}
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={containerRef}
          onDrag={handleDrag}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          className="absolute cursor-move touch-none"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            x: '-50%',
            y: '-50%',
          }}
          animate={{
            scale: isDragging ? 1.2 : 1,
          }}
        >
          {/* Selector glow */}
          <div className="absolute inset-0 w-20 h-20 -left-10 -top-10">
            <motion.div
              className="w-full h-full rounded-full bg-white/30 blur-xl"
              animate={{
                scale: isDragging ? 1.5 : [1, 1.2, 1],
              }}
              transition={{
                scale: isDragging ? { duration: 0.2 } : { duration: 2, repeat: Infinity },
              }}
            />
          </div>

          {/* Selector ring */}
          <div className="relative w-16 h-16 -left-8 -top-8">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="white"
                strokeWidth="2"
                opacity="0.5"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="176"
                initial={{ strokeDashoffset: 176 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>

            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-white shadow-large" />
            </div>

            {/* Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-px bg-white/50" />
              <div className="absolute w-px h-8 bg-white/50" />
            </div>
          </div>

          {/* Drag hint */}
          {!isDragging && (
            <motion.div
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-white/60 text-xs font-medium whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Drag to explore
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Instructions overlay (shows on first load) */}
      <motion.div
        className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-center pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <div className="text-sm font-medium mb-1">Explore Your Mood</div>
        <div className="text-xs text-white/60">Drag the selector or click any mood</div>
      </motion.div>
    </div>
  );
}
