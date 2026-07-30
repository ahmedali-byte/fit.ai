// FitLife AI - Admin Control Panel
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, Bot, Terminal, Users, Plus, Trash2, Save, Play, CheckCircle, RefreshCw 
} from 'lucide-react';
import { 
  Exercise, getProfile, UserProfile, getExercises, saveCustomExercises 
} from '@/lib/db';
import GlassCard from '@/components/GlassCard';

export default function AdminPanel() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [systemPrompt, setSystemPrompt] = useState(
    'You are an expert sports scientist and dietitian assistant. Focus on evidence-based advice and safety disclaimers.'
  );
  const [suffixText, setSuffixText] = useState('*Consult a clinical physician.*');
  
  // Custom new exercise form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [newEquipment, setNewEquipment] = useState('Bodyweight');
  const [newMuscles, setNewMuscles] = useState('');
  
  // Custom video & kid-friendly states
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newKidVideoId, setNewKidVideoId] = useState('');
  const [newKidPosture, setNewKidPosture] = useState('');
  const [newKidSteps, setNewKidSteps] = useState('');

  const [logs, setLogs] = useState<{ id: string; event: string; status: string; time: string }[]>([
    { id: '1', event: 'Database connection established', status: 'SUCCESS', time: '15:42:01' },
    { id: '2', event: 'Loaded 5 pre-seeded exercises successfully', status: 'SUCCESS', time: '15:42:02' },
    { id: '3', event: 'Simulated AI local engine initialized', status: 'ACTIVE', time: '15:42:05' }
  ]);

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setExercises(getExercises());
    
    // Load config if available
    const prompt = localStorage.getItem('fitlife_admin_prompt');
    const suffix = localStorage.getItem('fitlife_admin_suffix');
    if (prompt) setSystemPrompt(prompt);
    if (suffix) setSuffixText(suffix);
  }, []);

  const handleSaveAIConfig = () => {
    localStorage.setItem('fitlife_admin_prompt', systemPrompt);
    localStorage.setItem('fitlife_admin_suffix', suffixText);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    
    // Log event
    logAdminEvent('AI Chatbot fine-tuning parameters updated');
  };

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newEx: Exercise = {
      id: newName.toLowerCase().replace(/\s+/g, '-'),
      name: newName,
      difficulty: newDifficulty,
      targetMuscles: newMuscles.split(',').map(m => m.trim()).filter(Boolean),
      equipment: newEquipment,
      caloriesPerMin: 6,
      posture: 'Maintain neutral posture spine alignment.',
      steps: ['Perform action with controlled pacing.'],
      benefits: ['Supports general strength and conditioning.'],
      avoidIf: 'Severe active pain.',
      alternatives: [],
      safetyTips: ['Do not rush reps.'],
      recoveryTime: '24 hours',
      videoUrl: newVideoUrl || '',
      kidVideoId: newKidVideoId || undefined,
      kidPosture: newKidPosture || undefined,
      kidSteps: newKidSteps ? newKidSteps.split(',').map(s => s.trim()).filter(Boolean) : undefined
    };

    const updated = [newEx, ...exercises];
    setExercises(updated);
    saveCustomExercises(updated);

    setNewName('');
    setNewMuscles('');
    setNewVideoUrl('');
    setNewKidVideoId('');
    setNewKidPosture('');
    setNewKidSteps('');
    setShowAddForm(false);
    
    logAdminEvent(`Created exercise: "${newName}"`);
  };

  const handleDeleteExercise = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const updated = exercises.filter(ex => ex.id !== id);
      setExercises(updated);
      saveCustomExercises(updated);
      logAdminEvent(`Deleted exercise: "${name}"`);
    }
  };

  const logAdminEvent = (event: string) => {
    const today = new Date();
    const timeStr = today.toTimeString().split(' ')[0];
    setLogs((prev) => [
      {
        id: Date.now().toString(),
        event,
        status: 'INFO',
        time: timeStr
      },
      ...prev
    ]);
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border-color pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Control Panel</h1>
          <p className="text-xs text-foreground/60 mt-1">Configure prompt directives, audit exercises, and observe simulated logs.</p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-brand-emerald/20 text-brand-emerald font-bold">
            Simulated Server Status: Online
          </span>
        </div>
      </div>

      {/* Analytics widgets row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Exercises', value: exercises.length, desc: 'Database seeded row items', Icon: Database },
          { label: 'Active Users (Mock)', value: '1,420', desc: 'Simulated user profiles', Icon: Users },
          { label: 'AI Latency', value: '750 ms', desc: 'Local processing speed', Icon: Bot },
          { label: 'System Logs', value: logs.length, desc: 'Audited session event flags', Icon: Terminal }
        ].map((item, idx) => (
          <GlassCard key={idx} className="p-4 flex gap-4 items-center">
            <div className="p-2.5 rounded-xl bg-brand-emerald/10 text-brand-emerald">
              <item.Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-foreground/50 uppercase">{item.label}</div>
              <div className="text-lg font-black text-foreground mt-0.5">{item.value}</div>
              <div className="text-[9px] text-foreground/50">{item.desc}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main splits: AI Configuration vs Exercise Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Chatbot Directive Settings */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2 border-b border-border-color pb-3">
              <Bot className="w-5 h-5 text-brand-emerald" />
              <span>AI Prompt Directive Customizer</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">System Instructions</label>
                <textarea
                  rows={4}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border-color bg-background/50 focus:border-brand-emerald outline-none text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Suffix Warning Text</label>
                <input
                  type="text"
                  value={suffixText}
                  onChange={(e) => setSuffixText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border-color bg-background/50 focus:border-brand-emerald outline-none text-xs"
                />
              </div>

              <button
                onClick={handleSaveAIConfig}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-emerald hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Prompt Changes</span>
              </button>

              {isSaved && (
                <div className="flex items-center gap-1 justify-center text-xs text-brand-emerald font-bold p-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Prompt settings synced!</span>
                </div>
              )}
            </div>
          </GlassCard>

          {/* System Terminal Console logs */}
          <GlassCard className="space-y-4 border-b-2 border-b-transparent hover:border-b-brand-emerald">
            <h2 className="text-base font-bold flex items-center gap-2 border-b border-border-color pb-3">
              <Terminal className="w-5 h-5 text-brand-emerald" />
              <span>System Event Terminal</span>
            </h2>
            <div className="h-44 overflow-y-auto bg-black/95 dark:bg-black/80 rounded-xl p-3.5 font-mono text-[9px] text-zinc-400 space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-2">
                  <span className="text-foreground/50">[{log.time}]</span>
                  <span className={log.status === 'SUCCESS' ? 'text-emerald-500' : log.status === 'ACTIVE' ? 'text-blue-400' : 'text-amber-500'}>
                    {log.status}:
                  </span>
                  <span className="text-zinc-200">{log.event}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Manage Exercise lists */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-border-color pb-3">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Database className="w-5 h-5 text-brand-emerald" />
                <span>Exercise Database Manager</span>
              </h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="py-1 px-3 rounded-lg bg-brand-emerald/15 hover:bg-brand-emerald/25 text-brand-emerald font-bold text-[10px] uppercase flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> New Item
              </button>
            </div>

            {/* Expandable Creation Form */}
            {showAddForm && (
              <form onSubmit={handleAddExercise} className="p-4 rounded-xl border border-dashed border-brand-emerald/40 bg-brand-emerald/5 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-foreground/60 block mb-1 uppercase">Exercise Name</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Incline Bench Press"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-border-color bg-background text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-foreground/60 block mb-1 uppercase">Difficulty</label>
                    <select
                      value={newDifficulty}
                      onChange={(e) => setNewDifficulty(e.target.value as any)}
                      className="w-full p-2 rounded-lg border border-border-color bg-background text-xs outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-foreground/60 block mb-1 uppercase">Equipment</label>
                    <input
                      type="text"
                      placeholder="E.g. Barbell, Bodyweight"
                      value={newEquipment}
                      onChange={(e) => setNewEquipment(e.target.value)}
                      className="w-full p-2 rounded-lg border border-border-color bg-background text-xs outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-foreground/60 block mb-1 uppercase">Target Muscles (comma separated)</label>
                  <input
                    type="text"
                    placeholder="E.g. Chest, Triceps, Shoulders"
                    value={newMuscles}
                    onChange={(e) => setNewMuscles(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border-color bg-background text-xs outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-foreground/60 block mb-1 uppercase">Video URL or YouTube ID</label>
                    <input
                      type="text"
                      placeholder="E.g. https://www.youtube.com/watch?v=..."
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      className="w-full p-2 rounded-lg border border-border-color bg-background text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-foreground/60 block mb-1 uppercase">Kid-Friendly Video URL/ID</label>
                    <input
                      type="text"
                      placeholder="E.g. G35bK_s4XQc"
                      value={newKidVideoId}
                      onChange={(e) => setNewKidVideoId(e.target.value)}
                      className="w-full p-2 rounded-lg border border-border-color bg-background text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-foreground/60 block mb-1 uppercase">Kid-Friendly Posture Guide</label>
                    <input
                      type="text"
                      placeholder="E.g. Stand like a proud king..."
                      value={newKidPosture}
                      onChange={(e) => setNewKidPosture(e.target.value)}
                      className="w-full p-2 rounded-lg border border-border-color bg-background text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-foreground/60 block mb-1 uppercase">Kid-Friendly Steps (comma separated)</label>
                    <input
                      type="text"
                      placeholder="E.g. Step 1, Step 2, Step 3"
                      value={newKidSteps}
                      onChange={(e) => setNewKidSteps(e.target.value)}
                      className="w-full p-2 rounded-lg border border-border-color bg-background text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-lg bg-brand-emerald hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                  >
                    Save to Database
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="py-2 px-4 rounded-lg border border-border-color hover:bg-gray-100 dark:hover:bg-gray-800 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* List of items */}
            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              {exercises.map((ex) => (
                <div key={ex.id} className="flex items-center justify-between p-3.5 rounded-xl border border-border-color bg-gray-500/5 text-xs">
                  <div>
                    <span className="font-extrabold text-foreground">{ex.name}</span>
                    <div className="flex gap-2 mt-1.5 text-[9px] text-foreground/60 font-semibold">
                      <span>Diff: {ex.difficulty}</span>
                      <span>•</span>
                      <span>Equip: {ex.equipment}</span>
                      <span>•</span>
                      <span className="text-brand-emerald">Muscles: {ex.targetMuscles.join(', ')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteExercise(ex.id, ex.name)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-foreground/40 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Delete item from database"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
