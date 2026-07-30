// FitLife AI - Filterable Exercise Library & Pain Adaptation Panel
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Star, AlertTriangle, ShieldCheck, Heart, Info, Play, Dumbbell, UserCheck, RefreshCcw, Smile, Sparkles 
} from 'lucide-react';
import { 
  Exercise, getStats, toggleFavorite, getProfile, getExercises 
} from '@/lib/db';
import GlassCard from '@/components/GlassCard';

const exerciseVideos: Record<string, string> = {
  'push-up': 'IODxDxX7oi4',       // Correct push up form under 3 mins
  'bodyweight-squat': '8uoaYwS6iFM', // Bodyweight squat form guide
  'romanian-deadlift': '5rIqP63yWFg', // RDL form guide under 2 mins
  'overhead-press': 'osEKVtXBLlU',    // Seated dumbbell shoulder press setup
  'bird-dog': 'wiFNA3sqjCA'         // Bird dog core stability under 2 mins
};

function getYouTubeId(urlOrId: string | undefined): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  // Check for YouTube Shorts pattern
  const shortsMatch = trimmed.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) {
    return shortsMatch[1];
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

const getExerciseVideoId = (ex: Exercise, isKid: boolean) => {
  if (isKid && ex.kidVideoId) {
    const id = getYouTubeId(ex.kidVideoId);
    if (id) return id;
  }
  if (ex.videoUrl) {
    const id = getYouTubeId(ex.videoUrl);
    if (id) return id;
  }
  return exerciseVideos[ex.id] || null;
};

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  
  // Favorites mapping state
  const [favorites, setFavorites] = useState<string[]>([]);
  // Injury filter state
  const [activePainFilter, setActivePainFilter] = useState<string>('None');
  // Kid Friendly Mode
  const [isKidFriendly, setIsKidFriendly] = useState(false);
  // Expanded alternative index
  const [expandedAltIdx, setExpandedAltIdx] = useState<number | null>(null);

  useEffect(() => {
    setExercises(getExercises());
    setFavorites(getStats().favorites);
    // Auto-enable Kid-Friendly Demos if profile age is <= 12
    const profile = getProfile();
    if (profile && profile.age <= 12) {
      setIsKidFriendly(true);
    }
  }, []);

  useEffect(() => {
    setExpandedAltIdx(null);
  }, [selectedExerciseId]);

  const handleFavoriteToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening details
    const isAdded = toggleFavorite(id);
    setFavorites(prev => 
      isAdded ? [...prev, id] : prev.filter(fId => fId !== id)
    );
  };

  // Collect all muscles for filter listing
  const allMuscles = ['All', 'Chest', 'Quadriceps', 'Glutes', 'Hamstrings', 'Shoulders', 'Core'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const equipments = ['All', 'Bodyweight', 'Dumbbells'];
  const painConditions = [
    { label: 'No Pain / Restrictions', val: 'None' },
    { label: 'Knee Pain / Arthritis', val: 'Knee pain' },
    { label: 'Lower Back Pain', val: 'Back pain' },
    { label: 'Wrist Pain / Stiffness', val: 'Wrist pain' },
    { label: 'Shoulder Impingement', val: 'Shoulder injury' },
    { label: 'Limited Balance / Dizziness', val: 'Balance issues' },
    { label: 'Limited Mobility', val: 'Limited mobility' }
  ];

  // Filtering Logic
  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ex.targetMuscles.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMuscle = selectedMuscle === 'All' || 
                          ex.targetMuscles.some(m => m.toLowerCase().includes(selectedMuscle.toLowerCase()));
    
    const matchesDiff = selectedDifficulty === 'All' || ex.difficulty === selectedDifficulty;
    const matchesEquip = selectedEquipment === 'All' || ex.equipment.toLowerCase().includes(selectedEquipment.toLowerCase());
    
    return matchesSearch && matchesMuscle && matchesDiff && matchesEquip;
  });

  const selectedExercise = exercises.find(e => e.id === selectedExerciseId) || null;
  const activeVideoId = selectedExercise ? getExerciseVideoId(selectedExercise, isKidFriendly) : null;

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Clinical <span className="gradient-text bg-gradient-to-r from-brand-emerald to-emerald-500">Exercise Library</span>
        </h1>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Search form-correct routines. If you have joints that hurt, use our pain selectors to view medical regressions, alternative workouts, and safety guidelines.
        </p>
      </div>

      {/* Pain Adaptation Global Selector */}
      <div className="p-4 sm:p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
          <AlertTriangle className="w-5 h-5 animate-bounce" />
          <span>Joint Pain & Injury Adaptor Active</span>
        </div>
        <p className="text-xs text-foreground/80 leading-relaxed">
          Do you currently suffer from joint limitations, structural back spasms, or balance issues? Select a condition below. We will highlight exercise warnings and safer alternative replacements automatically inside the exercise detail panels.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {painConditions.map((cond) => (
            <button
              key={cond.val}
              onClick={() => setActivePainFilter(cond.val)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                activePainFilter === cond.val
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                  : 'bg-background hover:bg-gray-100 dark:hover:bg-gray-800 border-border-color'
              }`}
            >
              {cond.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters & Search Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-500/5 p-4 rounded-2xl border border-border-color">
        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-foreground/50">
            <Search className="w-4.5 h-4.5" />
          </span>
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-color bg-background/50 focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald text-sm outline-none transition-all"
          />
        </div>

        {/* Muscle Selector */}
        <select
          value={selectedMuscle}
          onChange={(e) => setSelectedMuscle(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-background/50 text-sm outline-none focus:border-brand-emerald transition-all"
        >
          <option value="All">All Muscle Groups</option>
          {allMuscles.filter(m => m !== 'All').map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {/* Difficulty Selector */}
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-background/50 text-sm outline-none focus:border-brand-emerald transition-all"
        >
          <option value="All">All Difficulties</option>
          {difficulties.filter(d => d !== 'All').map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Equipment Selector */}
        <select
          value={selectedEquipment}
          onChange={(e) => setSelectedEquipment(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-background/50 text-sm outline-none focus:border-brand-emerald transition-all"
        >
          <option value="All">All Equipment</option>
          {equipments.filter(eq => eq !== 'All').map(eq => (
            <option key={eq} value={eq}>{eq}</option>
          ))}
        </select>
      </div>

      {/* Main Splits: List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Exercises Cards Grid */}
        <div className="lg:col-span-1 flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-1">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border-color rounded-2xl">
              <p className="text-sm text-foreground/50">No exercises matches your search.</p>
            </div>
          ) : (
            filteredExercises.map((ex) => {
              const isSelected = selectedExerciseId === ex.id;
              const isFav = favorites.includes(ex.id);
              
              // Highlight card if active pain filter matches avoid list
              const matchesPainWarning = activePainFilter !== 'None' && ex.avoidIf.toLowerCase().includes(activePainFilter.toLowerCase());

              return (
                <div
                  key={ex.id}
                  onClick={() => setSelectedExerciseId(ex.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-brand-emerald/10 border-brand-emerald shadow-sm'
                      : matchesPainWarning 
                        ? 'bg-amber-500/5 border-amber-500/30'
                        : 'bg-background hover:bg-gray-500/5 border-border-color'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{ex.name}</h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gray-500/10 text-foreground/75 font-semibold">
                          {ex.difficulty}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-brand-emerald/10 text-brand-emerald font-semibold">
                          {ex.equipment}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {matchesPainWarning && (
                        <span title="Safety Alert: Avoid this movement">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        </span>
                      )}
                      <button
                        onClick={(e) => handleFavoriteToggle(ex.id, e)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Star className={`w-4.5 h-4.5 ${isFav ? 'fill-amber-400 text-amber-400' : 'text-foreground/40'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Exercise Detail Panels */}
        <div className="lg:col-span-2">
          {selectedExercise ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedExercise.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* General Card Details */}
                <GlassCard className="space-y-6">
                  {/* Title & Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-color pb-5 gap-3">
                    <div>
                      <h2 className="text-2xl font-extrabold">{selectedExercise.name}</h2>
                      <p className="text-xs text-foreground/60 mt-1">Target Muscle groups: {selectedExercise.targetMuscles.join(', ')}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-emerald/20 text-brand-emerald">
                        {selectedExercise.difficulty}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500/10 text-foreground/80">
                        {selectedExercise.equipment}
                      </span>
                    </div>
                  </div>

                  {/* Kid-Friendly Mode Toggle */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 shadow-sm transition-all duration-300">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                        <Smile className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <span>Kid-Friendly Demo Mode</span>
                          {getProfile().age <= 12 && (
                            <span className="text-[9px] bg-purple-500 text-white font-extrabold px-1.5 py-0.25 rounded-full uppercase tracking-wider animate-bounce">
                              Auto-Active
                            </span>
                          )}
                        </h4>
                        <p className="text-[10px] text-foreground/60">Playful instructions and fun videos for kids!</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setIsKidFriendly(!isKidFriendly)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isKidFriendly ? 'bg-purple-500' : 'bg-gray-200 dark:bg-gray-800'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isKidFriendly ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Posture & Video Box mockup */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="md:col-span-3 space-y-4">
                      <div className="flex gap-2 items-start text-sm">
                        <UserCheck className="w-5 h-5 text-brand-emerald shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-xs uppercase tracking-wider text-foreground/60">
                            {isKidFriendly ? '🌟 Kid-Friendly Guide' : 'Correct Posture / Alignment'}
                          </h4>
                          <p className="text-xs text-foreground/80 mt-1 leading-relaxed">
                            {(isKidFriendly && selectedExercise.kidPosture) ? selectedExercise.kidPosture : selectedExercise.posture}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-border-color pt-4">
                        <div>
                          <h4 className="text-[10px] font-bold text-foreground/50 uppercase">Calories Burned</h4>
                          <p className="text-sm font-extrabold text-foreground">{selectedExercise.caloriesPerMin} kcal / min</p>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold text-foreground/50 uppercase">Target Recovery Window</h4>
                          <p className="text-sm font-extrabold text-foreground">{selectedExercise.recoveryTime}</p>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Video Frame Player */}
                    <div className="md:col-span-2 flex flex-col gap-2">
                      <div className="relative aspect-video md:aspect-square bg-black rounded-xl border border-border-color overflow-hidden">
                        {activeVideoId ? (
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${activeVideoId}?rel=0&modestbranding=1`}
                            title={`${selectedExercise.name} video tutorial`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-4 text-center h-full">
                            <Play className="w-8 h-8 text-brand-emerald mb-2" />
                            <h5 className="text-xs font-bold text-white">No video demo configured</h5>
                          </div>
                        )}
                      </div>
                      {activeVideoId && (
                        <div className="flex justify-end px-1">
                          <a
                            href={`https://www.youtube.com/watch?v=${activeVideoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-brand-emerald hover:text-emerald-400 hover:underline"
                          >
                            <span>Can't play? Open video directly on YouTube ↗</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step-by-Step Instructions */}
                  <div className="border-t border-border-color pt-5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70 mb-3">
                      {isKidFriendly ? '🚀 Play-Along Steps' : 'Step-by-Step Execution'}
                    </h3>
                    <ol className="space-y-3">
                      {((isKidFriendly && selectedExercise.kidSteps) ? selectedExercise.kidSteps : selectedExercise.steps).map((step, index) => (
                        <li key={index} className="flex gap-3 text-xs leading-relaxed text-foreground/80">
                          <span className={`flex items-center justify-center h-5 w-5 rounded-full font-extrabold shrink-0 ${
                            isKidFriendly ? 'bg-purple-500/10 text-purple-500' : 'bg-brand-emerald/10 text-brand-emerald'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="mt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Benefits & Safety Lists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border-color pt-5 text-xs leading-relaxed">
                    <div>
                      <h4 className="font-bold text-brand-emerald mb-2.5 flex items-center gap-1">
                        <Heart className="w-4 h-4" /> Benefits
                      </h4>
                      <ul className="space-y-2">
                        {selectedExercise.benefits.map((b, idx) => (
                          <li key={idx} className="flex gap-1.5 items-start">
                            <span className="text-brand-emerald font-bold">✓</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-foreground/75 mb-2.5 flex items-center gap-1">
                        <Info className="w-4 h-4" /> Safety Precautions
                      </h4>
                      <ul className="space-y-2">
                        {selectedExercise.safetyTips.map((tip, idx) => (
                          <li key={idx} className="flex gap-1.5 items-start">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </GlassCard>

                {/* Adaptive Alterations Panel */}
                <GlassCard className="border-amber-500/15">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground/80 mb-3 flex items-center gap-2">
                    <RefreshCcw className="w-4.5 h-4.5 text-amber-500 animate-spin" />
                    <span>Dynamic Injury & Pain Alternatives</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs text-foreground/80 leading-relaxed">
                      <strong>Medical Precaution:</strong> If you experience sharp joint pressure or back stiffness during this exercise, stop immediately. Verify alternatives below or filter the list for customized regressions.
                    </div>

                    <div className="space-y-3.5">
                      {selectedExercise.alternatives.map((alt, idx) => {
                        const isHighlight = activePainFilter.toLowerCase().includes(alt.condition.toLowerCase()) || 
                                            alt.condition.toLowerCase().includes(activePainFilter.toLowerCase()) && activePainFilter !== 'None';
                        return (
                          <div 
                            key={idx} 
                            className={`p-4 rounded-xl border transition-all ${
                              isHighlight 
                                ? 'bg-amber-500/10 border-amber-500 shadow-sm'
                                : 'bg-gray-500/5 border-border-color'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                isHighlight ? 'bg-amber-500 text-white' : 'bg-gray-500/10 text-foreground/80'
                              }`}>
                                If experiencing: {alt.condition}
                              </span>
                              {isHighlight && <span className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold uppercase">Selected Match</span>}
                            </div>
                            <h4 className="font-bold text-sm text-foreground mt-2">Recommended Swap: {alt.alternativeName}</h4>
                            <p className="text-xs text-foreground/75 leading-relaxed mt-1">{alt.description}</p>
                            
                            {alt.videoUrl && (
                              <div className="mt-3 border-t border-border-color/50 pt-2.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedAltIdx(expandedAltIdx === idx ? null : idx);
                                  }}
                                  className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-emerald hover:text-emerald-400 hover:underline cursor-pointer"
                                >
                                  <Play className="w-3 h-3" />
                                  <span>{expandedAltIdx === idx ? 'Hide Alternative Video' : 'Watch Alternative Video'}</span>
                                </button>
                                
                                {expandedAltIdx === idx && (
                                  <div className="mt-2.5 flex flex-col gap-1.5 animate-fade-in">
                                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-border-color">
                                      <iframe
                                        className="w-full h-full"
                                        src={`https://www.youtube.com/embed/${getYouTubeId(alt.videoUrl)}?rel=0&modestbranding=1`}
                                        title={`${alt.alternativeName} video tutorial`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                      />
                                    </div>
                                    <div className="flex justify-end px-0.5">
                                      <a
                                        href={alt.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[9px] text-brand-emerald hover:text-emerald-400 hover:underline"
                                      >
                                        <span>Can't play? Open video directly on YouTube ↗</span>
                                      </a>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 border border-dashed border-border-color rounded-2xl text-center min-h-[300px]">
              <Dumbbell className="w-12 h-12 text-foreground/30 mb-3 animate-bounce" />
              <h3 className="font-bold text-foreground">No Exercise Selected</h3>
              <p className="text-xs text-foreground/50 max-w-xs mt-1">Select any exercise from the left list to view step-by-step videos, posture guides, and dynamic modifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
