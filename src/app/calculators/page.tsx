// FitLife AI - Multi-Tab Health & Fitness Calculators Suite
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, Flame, Droplet, Heart, ShieldAlert, Award, Info, RefreshCw 
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';

export default function Calculators() {
  const [activeTab, setActiveTab] = useState<'bmi' | 'body-fat' | 'calorie' | 'hydration'>('bmi');

  // Input states
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [weight, setWeight] = useState<number>(74); // kg
  const [height, setHeight] = useState<number>(175); // cm
  const [activity, setActivity] = useState<string>('Moderate');

  // Body Fat specific inputs
  const [neck, setNeck] = useState<number>(38); // cm
  const [waist, setWaist] = useState<number>(84); // cm
  const [hips, setHips] = useState<number>(96); // cm (used for females)

  // Hydration specific inputs
  const [exerciseTime, setExerciseTime] = useState<number>(45); // minutes

  // Calculations states
  const [bmi, setBmi] = useState<number>(0);
  const [bmiCategory, setBmiCategory] = useState<string>('');
  const [bodyFat, setBodyFat] = useState<number>(0);
  const [bmr, setBmr] = useState<number>(0);
  const [tdee, setTdee] = useState<number>(0);
  const [waterTarget, setWaterTarget] = useState<number>(0);

  useEffect(() => {
    runCalculations();
  }, [age, gender, weight, height, activity, neck, waist, hips, exerciseTime]);

  const runCalculations = () => {
    // 1. BMI Calculation
    const heightM = height / 100;
    const computedBmi = parseFloat((weight / (heightM * heightM)).toFixed(1));
    setBmi(computedBmi);

    let cat = 'Normal';
    if (computedBmi < 18.5) cat = 'Underweight';
    else if (computedBmi >= 18.5 && computedBmi < 25) cat = 'Normal weight';
    else if (computedBmi >= 25 && computedBmi < 30) cat = 'Overweight';
    else cat = 'Obese';
    setBmiCategory(cat);

    // 2. BMR & TDEE Calculations (Mifflin-St Jeor)
    let computedBmr = 0;
    if (gender === 'Male') {
      computedBmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      computedBmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    setBmr(Math.round(computedBmr));

    let multiplier = 1.2;
    if (activity === 'Light') multiplier = 1.375;
    if (activity === 'Moderate') multiplier = 1.55;
    if (activity === 'Active') multiplier = 1.725;
    setTdee(Math.round(computedBmr * multiplier));

    // 3. Body Fat (US Navy Circumference Method)
    try {
      let computedBf = 0;
      if (gender === 'Male') {
        // Male US Navy Formula: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
        const logWaistNeck = Math.log10(waist - neck);
        const logHeight = Math.log10(height);
        const density = 1.0324 - 0.19077 * logWaistNeck + 0.15456 * logHeight;
        computedBf = 495 / density - 450;
      } else {
        // Female US Navy Formula: 495 / (1.29579 - 0.35004 * log10(waist + hips - neck) + 0.22100 * log10(height)) - 450
        const logWaistHipsNeck = Math.log10(waist + hips - neck);
        const logHeight = Math.log10(height);
        const density = 1.29579 - 0.35004 * logWaistHipsNeck + 0.22100 * logHeight;
        computedBf = 495 / density - 450;
      }
      
      // Fallback/sanity boundaries check
      if (isNaN(computedBf) || computedBf < 2 || computedBf > 60) {
        // Simple fallback estimation based on BMI
        computedBf = 1.20 * computedBmi + 0.23 * age - (gender === 'Male' ? 16.2 : 5.4);
      }
      setBodyFat(parseFloat(computedBf.toFixed(1)));
    } catch {
      setBodyFat(0);
    }

    // 4. Hydration calculations
    // Base: 35ml per kg. Add: 12ml per min of workout
    const baseWater = weight * 35;
    const activeWater = exerciseTime * 12;
    setWaterTarget(Math.round(baseWater + activeWater));
  };

  return (
    <div className="flex flex-col gap-10 py-4">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Science-Backed <span className="gradient-text bg-gradient-to-r from-brand-emerald to-emerald-500">Calculators Suite</span>
        </h1>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Input your anthropometric measurements. Calculations adapt dynamically to display health risk classifications, daily metabolic totals, and physiological ranges.
        </p>
      </div>

      {/* Tabs list navigation */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 bg-gray-500/5 p-2 rounded-2xl border border-border-color">
        {[
          { id: 'bmi', label: 'BMI Index', Icon: Scale },
          { id: 'body-fat', label: 'Body Composition %', Icon: Heart },
          { id: 'calorie', label: 'Caloric Thresholds (TDEE)', Icon: Flame },
          { id: 'hydration', label: 'Hydration Target', Icon: Droplet }
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-brand-emerald text-white shadow-[0_4px_12px_rgba(16,185,129,0.25)]'
                  : 'text-foreground/85 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <tab.Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Unified Input Settings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Sidebar Shared Parameter Inputs */}
        <div className="lg:col-span-1">
          <GlassCard className="space-y-5 border-brand-emerald/15">
            <h3 className="font-bold text-sm border-b border-border-color pb-3 uppercase text-foreground/75 tracking-wider">
              Anatomical Measurements
            </h3>

            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Age</label>
                <input
                  type="number"
                  min={5}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 28)}
                  className="w-full p-2.5 rounded-xl border border-border-color bg-background/50 text-sm focus:border-brand-emerald outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border-color bg-background/50 text-sm focus:border-brand-emerald outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* Height & Weight */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Height (cm)</label>
                <input
                  type="number"
                  min={80}
                  max={250}
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value) || 175)}
                  className="w-full p-2.5 rounded-xl border border-border-color bg-background/50 text-sm focus:border-brand-emerald outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Weight (kg)</label>
                <input
                  type="number"
                  min={10}
                  max={300}
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 74)}
                  className="w-full p-2.5 rounded-xl border border-border-color bg-background/50 text-sm focus:border-brand-emerald outline-none"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Daily Activity Multiplier</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border-color bg-background/50 text-sm focus:border-brand-emerald outline-none"
              >
                <option value="Sedentary">Sedentary (Low movement)</option>
                <option value="Light">Lightly Active (Branded walks)</option>
                <option value="Moderate">Moderately Active (Workout 3-5x/week)</option>
                <option value="Active">Very Active (Heavy training)</option>
              </select>
            </div>

            {/* Dynamic fields based on selected tab */}
            {activeTab === 'body-fat' && (
              <motion.div 
                className="space-y-4 border-t border-border-color pt-4 animate-fade-in-up"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h4 className="text-xs font-bold text-brand-emerald uppercase">Navy Circumference Inputs</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Neck (cm)</label>
                    <input
                      type="number"
                      min={10}
                      max={80}
                      value={neck}
                      onChange={(e) => setNeck(parseFloat(e.target.value) || 38)}
                      className="w-full p-2.5 rounded-xl border border-border-color bg-background/50 text-sm focus:border-brand-emerald outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Waist (cm)</label>
                    <input
                      type="number"
                      min={30}
                      max={200}
                      value={waist}
                      onChange={(e) => setWaist(parseFloat(e.target.value) || 84)}
                      className="w-full p-2.5 rounded-xl border border-border-color bg-background/50 text-sm focus:border-brand-emerald outline-none"
                    />
                  </div>
                </div>
                {gender === 'Female' && (
                  <div>
                    <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Hips (cm)</label>
                    <input
                      type="number"
                      min={30}
                      max={200}
                      value={hips}
                      onChange={(e) => setHips(parseFloat(e.target.value) || 96)}
                      className="w-full p-2.5 rounded-xl border border-border-color bg-background/50 text-sm focus:border-brand-emerald outline-none"
                    />
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'hydration' && (
              <motion.div 
                className="space-y-4 border-t border-border-color pt-4 animate-fade-in-up"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h4 className="text-xs font-bold text-brand-emerald uppercase">Exercise Specifics</h4>
                <div>
                  <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Active Exercise (mins/day)</label>
                  <input
                    type="number"
                    min={0}
                    max={360}
                    value={exerciseTime}
                    onChange={(e) => setExerciseTime(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl border border-border-color bg-background/50 text-sm focus:border-brand-emerald outline-none"
                  />
                </div>
              </motion.div>
            )}
          </GlassCard>
        </div>

        {/* Dynamic Display Panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
            >
              {/* BMI TAB VIEW */}
              {activeTab === 'bmi' && (
                <GlassCard className="space-y-6">
                  <div className="border-b border-border-color pb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Scale className="w-5 h-5 text-brand-emerald" />
                      <span>Body Mass Index (BMI)</span>
                    </h2>
                    <span className="text-xs text-foreground/50">WHO Metric Standards</span>
                  </div>

                  <div className="text-center py-6">
                    <div className="text-sm font-extrabold uppercase text-foreground/50">Your BMI Score</div>
                    <div className="text-5xl sm:text-6xl font-black text-brand-emerald my-2">{bmi}</div>
                    <div className={`text-base font-extrabold uppercase ${
                      bmiCategory === 'Normal weight' ? 'text-emerald-500' : 'text-amber-500'
                    }`}>
                      {bmiCategory}
                    </div>
                  </div>

                  {/* Visual Range bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-foreground/50 uppercase">
                      <span>Underweight (&lt;18.5)</span>
                      <span>Normal (18.5-24.9)</span>
                      <span>Overweight (25-29.9)</span>
                      <span>Obese (&ge;30)</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-800 flex overflow-hidden relative">
                      {/* Sub Ranges */}
                      <div className="h-full bg-sky-300 w-[18.5%]" />
                      <div className="h-full bg-emerald-400 w-[26.5%]" />
                      <div className="h-full bg-amber-400 w-[20%]" />
                      <div className="h-full bg-rose-400 w-[35%]" />
                      
                      {/* Arrow indicator based on score */}
                      <div 
                        className="absolute h-6 w-1 bg-foreground dark:bg-white top-[-6px] transition-all duration-500"
                        style={{ left: `${Math.min(100, Math.max(0, (bmi / 40) * 100))}%` }}
                      />
                    </div>
                  </div>

                  {/* Advice/Warnings */}
                  <div className="p-4 rounded-xl bg-gray-500/5 border border-border-color space-y-3 text-xs leading-relaxed">
                    <h4 className="font-bold text-foreground flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-brand-emerald" />
                      <span>Health Risk Classifications</span>
                    </h4>
                    {bmiCategory === 'Normal weight' ? (
                      <p>Your BMI falls within the healthy physiological range. Maintaining consistent resistance training and whole food nutrition supports cardiovascular longevity.</p>
                    ) : (
                      <p>Your BMI falls outside the normal range. **Risk details**: Increased workload on heart chambers, higher risk of joint stress, and insulin resistance. Focus on safe progressive dietary pacing (e.g. 500 kcal daily deficit).</p>
                    )}
                  </div>
                </GlassCard>
              )}

              {/* BODY FAT TAB VIEW */}
              {activeTab === 'body-fat' && (
                <GlassCard className="space-y-6">
                  <div className="border-b border-border-color pb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Heart className="w-5 h-5 text-brand-emerald" />
                      <span>Body Composition & Fat %</span>
                    </h2>
                    <span className="text-xs text-foreground/50">US Navy Method</span>
                  </div>

                  <div className="text-center py-6">
                    <div className="text-sm font-extrabold uppercase text-foreground/50">Estimated Body Fat</div>
                    <div className="text-5xl sm:text-6xl font-black text-brand-emerald my-2">{bodyFat}%</div>
                    <p className="text-xs text-foreground/60 max-w-sm mx-auto leading-relaxed mt-2">
                      Estimates tissue density ratios. Muscle mass is denser than fat tissue, making direct measurements crucial.
                    </p>
                  </div>

                  {/* Ideal ranges comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-gray-500/5 border border-border-color space-y-2">
                      <h4 className="font-bold text-brand-emerald">Ideal Ranges (Gender Specific)</h4>
                      <ul className="space-y-1.5 text-foreground/80">
                        <li>• Athletes: {gender === 'Male' ? '6–13%' : '14–20%'}</li>
                        <li>• Fitness standard: {gender === 'Male' ? '14–17%' : '21–24%'}</li>
                        <li>• Acceptable base: {gender === 'Male' ? '18–24%' : '25–31%'}</li>
                        <li>• Obese threshold: {gender === 'Male' ? '&ge;25%' : '&ge;32%'}</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-500/5 border border-border-color space-y-2">
                      <h4 className="font-bold text-foreground/80">What does this mean?</h4>
                      <p className="text-[11px] text-foreground/70 leading-relaxed">
                        Body fat percentage tracks your tissue composition better than weight alone. If you lift weights, your weight may rise due to muscle gains while your body fat percentage drops (body recomposition).
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* CALORIE TAB VIEW */}
              {activeTab === 'calorie' && (
                <GlassCard className="space-y-6">
                  <div className="border-b border-border-color pb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Flame className="w-5 h-5 text-brand-emerald" />
                      <span>Caloric Thresholds (BMR & TDEE)</span>
                    </h2>
                    <span className="text-xs text-foreground/50">Mifflin-St Jeor Projections</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl bg-brand-emerald/5 border border-brand-emerald/10 text-center">
                      <div className="text-[10px] font-bold text-foreground/50 uppercase">Basal Metabolic Rate (BMR)</div>
                      <div className="text-3xl font-black text-brand-emerald my-1.5">{bmr} kcal</div>
                      <p className="text-[10px] text-foreground/60 leading-relaxed">Energy burned purely to sustain core organ functions at complete rest.</p>
                    </div>

                    <div className="p-4 rounded-xl bg-brand-emerald/5 border border-brand-emerald/10 text-center">
                      <div className="text-[10px] font-bold text-foreground/50 uppercase">Total Daily Energy Expenditure (TDEE)</div>
                      <div className="text-3xl font-black text-brand-emerald my-1.5">{tdee} kcal</div>
                      <p className="text-[10px] text-foreground/60 leading-relaxed">Energy burned daily adjusting BMR for your physical activity inputs.</p>
                    </div>
                  </div>

                  {/* Goal targets */}
                  <div className="space-y-3.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/75 border-t border-border-color pt-4">Caloric Targets for Fitness Pathways</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { title: 'Fat Loss (Cutting)', val: `${tdee - 500} kcal`, desc: 'TDEE - 500 kcal. Promotes ~0.5kg fat loss per week safely.' },
                        { title: 'Maintenance', val: `${tdee} kcal`, desc: 'TDEE. Stabilizes current weight and coordinates body composition.' },
                        { title: 'Muscle Gain (Bulking)', val: `${tdee + 350} kcal`, desc: 'TDEE + 350 kcal. Fuels muscle synthesis when paired with heavy training.' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-gray-500/5 border border-border-color text-center space-y-1">
                          <div className="text-[10px] font-bold text-brand-emerald">{item.title}</div>
                          <div className="text-lg font-black text-foreground">{item.val}</div>
                          <p className="text-[9px] text-foreground/50 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* HYDRATION TAB VIEW */}
              {activeTab === 'hydration' && (
                <GlassCard className="space-y-6">
                  <div className="border-b border-border-color pb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Droplet className="w-5 h-5 text-brand-emerald" />
                      <span>Hydration Target Calculator</span>
                    </h2>
                    <span className="text-xs text-foreground/50">Fluid Intake Balance</span>
                  </div>

                  <div className="text-center py-6">
                    <div className="text-sm font-extrabold uppercase text-foreground/50">Your Recommended Water Intake</div>
                    <div className="text-5xl sm:text-6xl font-black text-brand-emerald my-2">
                      {(waterTarget / 1000).toFixed(1)} <span className="text-xl font-bold text-foreground/80">Liters / day</span>
                    </div>
                    <div className="text-xs text-foreground/60">Estimated target: {waterTarget} ml daily.</div>
                  </div>

                  {/* Dehydration warning boxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-2">
                      <h4 className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <ShieldAlert className="w-4.5 h-4.5" />
                        <span>Dehydration Risk Signals</span>
                      </h4>
                      <ul className="space-y-1.5 text-foreground/75 text-[11px] leading-relaxed">
                        <li>• Dark amber urine color (aim for pale straw yellow).</li>
                        <li>• Dry mouth, headache, and sudden cognitive fatigue.</li>
                        <li>• Muscle cramps or sudden drops in lifting output.</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15 space-y-2 text-[11px] leading-relaxed">
                      <h4 className="font-bold text-blue-600 dark:text-blue-400">Electrolyte Replenishment</h4>
                      <p>
                        If workouts exceed 60 minutes or occur in heavy heat, pure water is insufficient. Replenish Sodium, Potassium, and Magnesium to avoid muscle cramps and maintain hydration pressures.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
