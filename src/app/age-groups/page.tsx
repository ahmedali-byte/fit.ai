// FitLife AI - Age Group Navigator Page
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CheckCircle2, AlertOctagon, Flame, ArrowUpRight, Bed, Droplet, Activity, HelpCircle 
} from 'lucide-react';
import { SEEDED_AGE_GROUPS, AgeGroupData } from '@/lib/db';
import GlassCard from '@/components/GlassCard';

export default function AgeGroups() {
  const [selectedGroup, setSelectedGroup] = useState<string>(SEEDED_AGE_GROUPS[2].id); // Defaults to Young Adults

  const currentData = SEEDED_AGE_GROUPS.find(g => g.id === selectedGroup) || SEEDED_AGE_GROUPS[2];

  return (
    <div className="flex flex-col gap-10 py-4">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Age-Specific <span className="gradient-text bg-gradient-to-r from-brand-emerald to-emerald-500">Wellness Guides</span>
        </h1>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Your body changes at every milestone. Discover what exercises to prioritize, what routines to avoid, and the physiological guidelines necessary for long-term health.
        </p>
      </div>

      {/* Tabs Navigator List */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 bg-gray-500/5 p-2 rounded-2xl border border-border-color">
        {SEEDED_AGE_GROUPS.map((group) => {
          const isSelected = group.id === selectedGroup;
          return (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-brand-emerald text-white shadow-[0_4px_12px_rgba(16,185,129,0.25)]'
                  : 'text-foreground/80 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {group.title} <span className="text-[10px] opacity-75 font-normal">({group.range.replace(' years', '')})</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Data Content Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedGroup}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main Info Box */}
          <div className="lg:col-span-2 space-y-6">
            {/* physiological Summary */}
            <GlassCard className="border-brand-emerald/15">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-brand-emerald" />
                <span>Development & Body Changes</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="space-y-1.5 p-4 rounded-xl bg-gray-500/5 border border-border-color">
                  <h4 className="font-bold text-brand-emerald">Physical Development</h4>
                  <p className="text-foreground/80 text-xs leading-relaxed">{currentData.development}</p>
                </div>
                <div className="space-y-1.5 p-4 rounded-xl bg-gray-500/5 border border-border-color">
                  <h4 className="font-bold text-brand-emerald">Cellular & Body Changes</h4>
                  <p className="text-foreground/80 text-xs leading-relaxed">{currentData.bodyChanges}</p>
                </div>
              </div>
            </GlassCard>

            {/* Exercise Guidance Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Recommend */}
              <GlassCard className="border-emerald-500/10">
                <h3 className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Recommended Exercise Types</span>
                </h3>
                <ul className="space-y-3">
                  {currentData.exercisesRecommend.map((ex, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-xs text-foreground/80 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Avoid */}
              <GlassCard className="border-rose-500/10">
                <h3 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2 mb-4">
                  <AlertOctagon className="w-5 h-5" />
                  <span>Exercises to Avoid / Regress</span>
                </h3>
                <ul className="space-y-3">
                  {currentData.exercisesAvoid.map((ex, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-xs text-foreground/80 leading-relaxed">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            {/* Warmup & Stretching routines */}
            <GlassCard>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-amber-500" />
                <span>Routines: Warm-up & Flexibility</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-bold text-foreground mb-2 flex items-center gap-1 text-xs uppercase tracking-wider text-foreground/70">
                    Warm-Up Routine
                  </h4>
                  <ul className="space-y-2">
                    {currentData.warmup.map((w, idx) => (
                      <li key={idx} className="text-xs bg-gray-500/5 p-2.5 rounded-lg border border-border-color">
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2 flex items-center gap-1 text-xs uppercase tracking-wider text-foreground/70">
                    Stretching & Mobility
                  </h4>
                  <ul className="space-y-2">
                    {currentData.stretches.map((s, idx) => (
                      <li key={idx} className="text-xs bg-gray-500/5 p-2.5 rounded-lg border border-border-color">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlassCard>

            {/* Weekly Workout Calendar Schedule */}
            <GlassCard>
              <h3 className="text-base font-bold flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-brand-emerald" />
                <span>Sample Weekly Workout Schedule</span>
              </h3>
              <div className="flex flex-col gap-2.5">
                {currentData.weeklyWorkout.map((sch, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-gray-500/5 border border-border-color gap-1 sm:gap-4 text-xs">
                    <span className="font-extrabold text-brand-emerald min-w-[120px]">{sch.day}</span>
                    <span className="text-foreground/80 leading-relaxed flex-1">{sch.routine}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Sidebar recommendations / stats card */}
          <div className="flex flex-col gap-6">
            <GlassCard className="bg-brand-emerald/[0.02] border-brand-emerald/15">
              <h3 className="text-base font-bold mb-4 uppercase text-foreground/75 tracking-wider text-xs">Lifestyle Metrics</h3>
              
              <div className="space-y-6">
                {/* Sleep recommendations */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground/80 uppercase">Recommended Sleep</h4>
                    <p className="text-base font-extrabold text-foreground">{currentData.sleep}</p>
                    <p className="text-[10px] text-foreground/50 mt-0.5">Crucial for cognitive and cell recovery.</p>
                  </div>
                </div>

                {/* Water intake targets */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <Droplet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground/80 uppercase">Water Intake Goal</h4>
                    <p className="text-base font-extrabold text-foreground">{currentData.water}</p>
                    <p className="text-[10px] text-foreground/50 mt-0.5">Base fluid intake before workout additions.</p>
                  </div>
                </div>

                {/* Recovery instructions */}
                <div className="flex items-start gap-3 border-t border-border-color pt-4">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-brand-emerald">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground/80 uppercase">Recovery Guidance</h4>
                    <p className="text-xs text-foreground/80 leading-relaxed mt-1">{currentData.recovery}</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Health concerns alerts */}
            <GlassCard className="border-amber-500/15">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground/60 mb-3 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>Common Health Concerns</span>
              </h3>
              <ul className="space-y-3">
                {currentData.concerns.map((con, idx) => (
                  <li key={idx} className="p-3.5 rounded-xl bg-amber-500/5 text-xs text-foreground/80 border border-amber-500/10 leading-relaxed">
                    {con}
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* Callout action button */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-emerald to-emerald-800 text-white shadow-lg space-y-4">
              <h4 className="font-bold text-sm">Need a Custom Exercise Plan?</h4>
              <p className="text-xs text-white/80 leading-relaxed">
                Configure your current measurements, goal weights, and food allergies to establish a dynamic diet plan immediately.
              </p>
              <Link
                href="/diet-planner"
                className="w-full inline-flex items-center justify-center gap-1 py-3 px-4 rounded-xl bg-white hover:bg-gray-100 text-brand-emerald font-bold text-xs transition-colors cursor-pointer"
              >
                <span>Setup My Custom Profile</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
