// FitLife AI - Interactive Progress Dashboard
'use client';

import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { 
  Activity, Droplet, User, Award, Camera, Plus, Save, Sparkles, Scale, Compass 
} from 'lucide-react';
import { 
  getStats, saveStats, logWater, logSteps, getProfile, saveProfile, UserStats, UserProfile 
} from '@/lib/db';
import GlassCard from '@/components/GlassCard';

// Helper to get local date in standard YYYY-MM-DD
const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Dashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Form states
  const [logWeightInput, setLogWeightInput] = useState('');
  const [logStepsInput, setLogStepsInput] = useState('');
  const [chestInput, setChestInput] = useState('');
  const [waistInput, setWaistInput] = useState('');
  const [hipsInput, setHipsInput] = useState('');
  const [armsInput, setArmsInput] = useState('');

  // Simulated photo upload gallery state
  const [photos, setPhotos] = useState<{ id: string; date: string; url: string }[]>([
    { id: '1', date: '2026-07-17', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80' }
  ]);

  useEffect(() => {
    setIsMounted(true);
    const currentProfile = getProfile();
    setProfile(currentProfile);
    
    const currentStats = getStats();
    
    // Synchronize latest weight log with profile weight if profile has a different/newer weight
    const today = getLocalDateString();
    const lastWeightLog = currentStats.weightLogs[currentStats.weightLogs.length - 1];
    
    if (lastWeightLog && lastWeightLog.value !== currentProfile.weight) {
      const existingIndex = currentStats.weightLogs.findIndex(l => l.date === today);
      if (existingIndex > -1) {
        currentStats.weightLogs[existingIndex].value = currentProfile.weight;
      } else {
        currentStats.weightLogs.push({ date: today, value: currentProfile.weight });
      }
      saveStats(currentStats);
    }
    
    setStats(currentStats);
  }, []);

  if (!isMounted || !stats || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-emerald"></div>
      </div>
    );
  }

  // Handle Water Logging
  const handleLogWater = (amount: number) => {
    const nextStats = logWater(amount);
    setStats(nextStats);
  };

  // Handle Steps Logging
  const handleLogSteps = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(logStepsInput);
    if (isNaN(count) || count < 0) return;
    const nextStats = logSteps(count);
    setStats(nextStats);
    setLogStepsInput('');
  };

  // Handle Weight Logging
  const handleLogWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const wt = parseFloat(logWeightInput);
    if (isNaN(wt) || wt < 10) return;
    
    const today = getLocalDateString();
    const nextStats = { ...stats };
    const existingIndex = nextStats.weightLogs.findIndex(l => l.date === today);
    if (existingIndex > -1) {
      nextStats.weightLogs[existingIndex].value = wt;
    } else {
      nextStats.weightLogs.push({ date: today, value: wt });
    }
    
    saveStats(nextStats);
    setStats({ ...nextStats });
    setLogWeightInput('');

    // Update weight in profile too
    const nextProfile = { ...profile, weight: wt };
    saveProfile(nextProfile);
    setProfile(nextProfile);
  };

  // Handle Measurements
  const handleSaveMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    const chest = parseFloat(chestInput) || (stats.measurements[stats.measurements.length - 1]?.chest || 0);
    const waist = parseFloat(waistInput) || (stats.measurements[stats.measurements.length - 1]?.waist || 0);
    const hips = parseFloat(hipsInput) || (stats.measurements[stats.measurements.length - 1]?.hips || 0);
    const arms = parseFloat(armsInput) || (stats.measurements[stats.measurements.length - 1]?.arms || 0);

    const today = getLocalDateString();
    const nextStats = { ...stats };
    nextStats.measurements.push({
      chest, waist, hips, arms, date: today
    });

    saveStats(nextStats);
    setStats({ ...nextStats });
    
    // Clear inputs
    setChestInput('');
    setWaistInput('');
    setHipsInput('');
    setArmsInput('');
  };

  // Simulated Photo Upload handler
  const triggerMockPhotoUpload = () => {
    // Generate a beautiful placeholder from Unsplash
    const nextPhotos = [
      ...photos,
      {
        id: Date.now().toString(),
        date: getLocalDateString(),
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80'
      }
    ];
    setPhotos(nextPhotos);
  };

  const getTodayWater = () => {
    const today = getLocalDateString();
    return stats.waterLogs.find(l => l.date === today)?.value || 0;
  };

  const getTodaySteps = () => {
    const today = getLocalDateString();
    return stats.stepLogs.find(l => l.date === today)?.value || 0;
  };

  const currentWeight = stats.weightLogs[stats.weightLogs.length - 1]?.value || profile.weight;

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border-color pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <span>Progress Dashboard</span>
            <Sparkles className="w-5 h-5 text-brand-emerald animate-pulse" />
          </h1>
          <p className="text-xs text-foreground/60 mt-1">Track body weight variables, active dehydration levels, and fitness challenge targets.</p>
        </div>

        <div className="flex gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl border border-border-color bg-gray-500/5">
            Active Goal: <strong className="text-brand-emerald">{profile.goal}</strong>
          </span>
        </div>
      </div>

      {/* Row 1: Water Tracker, Steps, Weight Log Quick Forms */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hydration Tracker Card */}
        <GlassCard className="flex flex-col gap-4 border-blue-500/15">
          <h3 className="font-extrabold text-sm flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Droplet className="w-5 h-5 text-blue-500" />
            <span>Water Hydration Tracker</span>
          </h3>
          <div className="text-center py-2">
            <div className="text-3xl font-black text-blue-500">{getTodayWater()} / {profile.waterIntakeGoal} <span className="text-xs font-semibold text-foreground/60">ml</span></div>
            <div className="text-xs text-foreground/50 mt-1">Goal completion: {Math.round((getTodayWater() / profile.waterIntakeGoal) * 100)}%</div>
          </div>
          <div className="flex flex-col gap-2.5 mt-auto pt-2">
            <div className="flex gap-2.5">
              <button
                onClick={() => handleLogWater(250)}
                className="flex-1 py-2 px-3 rounded-xl border border-blue-500/20 hover:bg-blue-500/10 text-xs font-bold text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
              >
                + 250ml
              </button>
              <button
                onClick={() => handleLogWater(500)}
                className="flex-1 py-2 px-3 rounded-xl border border-blue-500/20 hover:bg-blue-500/10 text-xs font-bold text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
              >
                + 500ml
              </button>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => handleLogWater(-250)}
                className="flex-1 py-1.5 px-3 rounded-xl border border-rose-500/20 hover:bg-rose-500/10 text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
              >
                - 250ml
              </button>
              <button
                onClick={() => handleLogWater(-500)}
                className="flex-1 py-1.5 px-3 rounded-xl border border-rose-500/20 hover:bg-rose-500/10 text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
              >
                - 500ml
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Steps Tracker Card */}
        <GlassCard className="flex flex-col gap-4 border-emerald-500/15">
          <h3 className="font-extrabold text-sm flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Activity className="w-5 h-5 text-brand-emerald" />
            <span>Daily Active Steps</span>
          </h3>
          <div className="text-center py-2">
            <div className="text-3xl font-black text-brand-emerald">{getTodaySteps()} / 10,000 <span className="text-xs font-semibold text-foreground/60">steps</span></div>
            <div className="text-xs text-foreground/50 mt-1">Estimated Calories: {Math.round(getTodaySteps() * 0.04)} kcal</div>
          </div>
          <form onSubmit={handleLogSteps} className="flex gap-2 mt-auto pt-2">
            <input
              type="number"
              placeholder="Add step count..."
              value={logStepsInput}
              onChange={(e) => setLogStepsInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-border-color bg-background/50 text-xs outline-none focus:border-brand-emerald"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-brand-emerald hover:bg-emerald-600 text-white transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </GlassCard>

        {/* Weight Tracker Card */}
        <GlassCard className="flex flex-col gap-4 border-purple-500/15">
          <h3 className="font-extrabold text-sm flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Scale className="w-5 h-5 text-purple-500" />
            <span>Weight Tracking Logger</span>
          </h3>
          <div className="text-center py-2">
            <div className="text-3xl font-black text-purple-500">{currentWeight} <span className="text-xs font-semibold text-foreground/60">kg</span></div>
            <div className="text-xs text-foreground/50 mt-1">Starting point: {stats.weightLogs[0]?.value || profile.weight} kg</div>
          </div>
          <form onSubmit={handleLogWeight} className="flex gap-2 mt-auto pt-2">
            <input
              type="number"
              step="0.1"
              placeholder="Log weight (kg)..."
              value={logWeightInput}
              onChange={(e) => setLogWeightInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-border-color bg-background/50 text-xs outline-none focus:border-brand-emerald"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-brand-emerald hover:bg-emerald-600 text-white transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </GlassCard>
      </div>

      {/* Row 2: Graph Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weight History Graph */}
        <GlassCard className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-sm border-b border-border-color pb-3 uppercase text-foreground/75 tracking-wider">
            Weight Projections Historical
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.weightLogs} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="currentColor" opacity={0.5} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 9 }} stroke="currentColor" opacity={0.5} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(3, 7, 18, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  labelStyle={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}
                  itemStyle={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 1 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Weekly Challenges achievements & photo logs */}
        <div className="flex flex-col gap-6">
          <GlassCard className="border-amber-500/15 flex-1">
            <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-amber-600 dark:text-amber-400 mb-4">
              <Award className="w-5 h-5" />
              <span>Weekly Fitness Challenges</span>
            </h3>

            <div className="space-y-3.5">
              {[
                { id: 'water-hydration-streak', label: '7-Day Hydration Target', desc: 'Drink target water daily for 7 days.', done: stats.completedChallenges.includes('water-hydration-streak') },
                { id: 'steps-target', label: '10,000 Step Milestone', desc: 'Reach 10,000 steps in a single day.', done: getTodaySteps() >= 10000 },
                { id: 'calculate-diet', label: 'Caloric Setup Complete', desc: 'Projections setup finished.', done: true }
              ].map((chal) => (
                <div 
                  key={chal.id} 
                  className={`p-3.5 rounded-xl border transition-all ${
                    chal.done 
                      ? 'bg-emerald-500/10 border-emerald-500/30' 
                      : 'bg-gray-500/5 border-border-color'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs">{chal.label}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase ${
                      chal.done ? 'bg-brand-emerald/20 text-brand-emerald' : 'bg-gray-500/20 text-foreground/50'
                    }`}>
                      {chal.done ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-[10px] text-foreground/60 mt-1">{chal.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Row 3: Body Circumference Logger & Progress Photos splits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Circumference Measurements form */}
        <GlassCard className="space-y-4">
          <h3 className="font-bold text-sm border-b border-border-color pb-3 uppercase text-foreground/75 tracking-wider flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-emerald" />
            <span>Circumference Measurements</span>
          </h3>

          <form onSubmit={handleSaveMeasurements} className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Chest (cm)</label>
              <input
                type="number"
                placeholder={stats.measurements[stats.measurements.length - 1]?.chest.toString() || '98'}
                value={chestInput}
                onChange={(e) => setChestInput(e.target.value)}
                className="w-full p-2 rounded-xl border border-border-color bg-background/50 text-xs focus:border-brand-emerald outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Waist (cm)</label>
              <input
                type="number"
                placeholder={stats.measurements[stats.measurements.length - 1]?.waist.toString() || '83'}
                value={waistInput}
                onChange={(e) => setWaistInput(e.target.value)}
                className="w-full p-2 rounded-xl border border-border-color bg-background/50 text-xs focus:border-brand-emerald outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Hips (cm)</label>
              <input
                type="number"
                placeholder={stats.measurements[stats.measurements.length - 1]?.hips.toString() || '95'}
                value={hipsInput}
                onChange={(e) => setHipsInput(e.target.value)}
                className="w-full p-2 rounded-xl border border-border-color bg-background/50 text-xs focus:border-brand-emerald outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Arms (cm)</label>
              <input
                type="number"
                placeholder={stats.measurements[stats.measurements.length - 1]?.arms.toString() || '34.2'}
                value={armsInput}
                onChange={(e) => setArmsInput(e.target.value)}
                className="w-full p-2 rounded-xl border border-border-color bg-background/50 text-xs focus:border-brand-emerald outline-none"
              />
            </div>
            <button
              type="submit"
              className="col-span-2 py-2 px-4 rounded-xl bg-brand-emerald hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Measurements Log</span>
            </button>
          </form>
        </GlassCard>

        {/* Progress Photo upload gallery */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between border-b border-border-color pb-3">
            <h3 className="font-bold text-sm uppercase text-foreground/75 tracking-wider flex items-center gap-2">
              <Camera className="w-5 h-5 text-brand-emerald" />
              <span>Progress Photos Gallery</span>
            </h3>
            <button
              onClick={triggerMockPhotoUpload}
              className="py-1 px-3 rounded-lg bg-brand-emerald/15 hover:bg-brand-emerald/25 text-brand-emerald font-bold text-[10px] uppercase flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Photo
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 max-h-[160px] overflow-y-auto pr-1">
            {photos.map((ph) => (
              <div key={ph.id} className="relative aspect-square rounded-lg border border-border-color overflow-hidden group">
                <img 
                  src={ph.url} 
                  alt={`Progress ${ph.date}`} 
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-[8px] text-white text-center font-semibold">
                  {ph.date}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
