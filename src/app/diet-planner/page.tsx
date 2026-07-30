// FitLife AI - Interactive Personalized Diet Planner & Meal Calculator
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Apple, ShieldAlert, Printer, CheckCircle, Calculator, Info, RotateCcw, Download, Sparkles 
} from 'lucide-react';
import { 
  getProfile, saveProfile, SEEDED_DIETS, MealRecipe, UserProfile, isSubscribed, setSubscriptionStatus 
} from '@/lib/db';
import GlassCard from '@/components/GlassCard';

export default function DietPlanner() {
  const [subscribed, setSubscribed] = useState(false);

  // Setup local profile values
  const [profile, setProfile] = useState<UserProfile>({
    age: 28,
    gender: 'Male',
    height: 175,
    weight: 74,
    goal: 'General Wellness',
    activityLevel: 'Moderate',
    country: 'United States',
    dietPreference: 'Non-Veg',
    allergies: [],
    budget: 'medium',
    workoutTiming: 'Morning',
    mealFrequency: 4,
    waterIntakeGoal: 2500
  });

  const [isSaved, setIsSaved] = useState(false);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [macros, setMacros] = useState({ protein: 120, carbs: 220, fat: 60, fiber: 28 });
  const [suggestedMeals, setSuggestedMeals] = useState<MealRecipe[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const loaded = getProfile();
    setProfile(loaded);
    calculateTargets(loaded);
    setSubscribed(isSubscribed());
  }, []);

  const allergyOptions = [
    'milk', 'eggs', 'nuts', 'peanuts', 'soy', 'gluten', 'seafood', 'fish', 'shellfish', 'sesame', 'lactose', 'wheat'
  ];

  const goalOptions = [
    'Weight Loss', 'Fat Loss', 'Muscle Gain', 'Weight Gain', 'Body Recomposition', 'Athletic Performance', 'Senior Health', 'General Wellness'
  ];

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleAllergyToggle = (allergy: string) => {
    const nextAllergies = profile.allergies.includes(allergy)
      ? profile.allergies.filter((a) => a !== allergy)
      : [...profile.allergies, allergy];
    
    handleInputChange('allergies', nextAllergies);
  };

  const calculateTargets = (p: UserProfile) => {
    // 1. Calculate BMR (Mifflin-St Jeor)
    let bmr = 0;
    if (p.gender === 'Male') {
      bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + 5;
    } else {
      bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age - 161;
    }

    // 2. Activity Multiplier
    let multiplier = 1.2;
    if (p.activityLevel === 'Light') multiplier = 1.375;
    if (p.activityLevel === 'Moderate') multiplier = 1.55;
    if (p.activityLevel === 'Active') multiplier = 1.725;

    const tdee = Math.round(bmr * multiplier);

    // 3. Goal Adjustment
    let targetCal = tdee;
    if (p.goal === 'Weight Loss' || p.goal === 'Fat Loss') {
      targetCal = tdee - 500;
    } else if (p.goal === 'Muscle Gain' || p.goal === 'Weight Gain') {
      targetCal = tdee + 350;
    } else if (p.goal === 'Body Recomposition') {
      targetCal = tdee - 150;
    }

    // Cap at minimum safe calories (1200 for women, 1500 for men)
    const minSafe = p.gender === 'Female' ? 1200 : 1500;
    if (targetCal < minSafe) targetCal = minSafe;

    setTargetCalories(targetCal);

    // 4. Calculate Macronutrients
    // Protein: 2.0g per kg of bodyweight for muscle gain, 1.8g for recomposition/loss, 1.4g for others
    let proteinMultiplier = 1.4;
    if (p.goal.includes('Muscle') || p.goal.includes('Athletic')) {
      proteinMultiplier = 2.0;
    } else if (p.goal.includes('Loss') || p.goal.includes('Recomposition')) {
      proteinMultiplier = 1.8;
    }
    const proteinGrams = Math.round(p.weight * proteinMultiplier);
    const proteinCalories = proteinGrams * 4;

    // Fat: 25% of total calories
    const fatCalories = targetCal * 0.25;
    const fatGrams = Math.round(fatCalories / 9);

    // Carbs: Rest of the calories
    const carbCalories = targetCal - (proteinCalories + fatCalories);
    const carbGrams = Math.max(50, Math.round(carbCalories / 4)); // absolute floor of 50g carbs

    // Fiber: 14g per 1000kcal
    const fiberGrams = Math.round((targetCal / 1000) * 14);

    setMacros({
      protein: proteinGrams,
      carbs: carbGrams,
      fat: fatGrams,
      fiber: fiberGrams
    });

    // 5. Generate matching meal schedule
    generateMealsList(p);
  };

  const generateMealsList = (p: UserProfile) => {
    // Filter seeded recipes based on diet style preference and allergies
    const matched = SEEDED_DIETS.filter((meal) => {
      // Preference filter: e.g. Vegan can only eat vegan tagged items
      const matchesPref = meal.diets.includes(p.dietPreference);
      
      // Allergen filter: none of the meal allergens can be in user allergies
      const cleanAllergies = !meal.allergens.some((alg) => p.allergies.includes(alg));

      return matchesPref && cleanAllergies;
    });

    // Sort/group by meal type matching target meal frequency
    // Select up to mealFrequency slots
    const order: MealRecipe['type'][] = [
      'Breakfast',
      'Mid Morning Snack',
      'Lunch',
      'Evening Snack',
      'Dinner',
      'Bedtime Snack'
    ];

    const currentSchedule: MealRecipe[] = [];
    const neededSlots = Math.min(p.mealFrequency, order.length);

    for (let i = 0; i < neededSlots; i++) {
      const type = order[i];
      // Find a matching recipe for this slot
      const slotMeal = matched.find((m) => m.type === type) || 
                       // Fallback inside matching set if slot not specifically seeded
                       matched.find((m) => m.type.includes(type.split(' ')[0])) || 
                       // Global backup
                       SEEDED_DIETS.find((m) => m.type === type);

      if (slotMeal) {
        currentSchedule.push(slotMeal);
      }
    }

    setSuggestedMeals(currentSchedule);
  };

  const handleSave = () => {
    saveProfile(profile);
    calculateTargets(profile);
    setIsSaved(true);
    // Notify navbar of profile updates
    window.dispatchEvent(new Event('profileUpdated'));
  };

  const handlePrint = () => {
    window.print();
  };

  // Simulated PDF Downloader
  const downloadSummary = () => {
    const text = `FITLIFE AI - PERSONAL DIET AND NUTRITION SUMMARY
Generated at: 2026-07-23

--- Profile Metrics ---
Age: ${profile.age}
Gender: ${profile.gender}
Height: ${profile.height} cm
Weight: ${profile.weight} kg
Goal: ${profile.goal}
Activity Level: ${profile.activityLevel}
Preferences: ${profile.dietPreference}
Allergies: ${profile.allergies.join(', ') || 'None'}

--- Nutritional Target Goals ---
Daily Calories: ${targetCalories} kcal
Protein: ${macros.protein} g
Carbohydrates: ${macros.carbs} g
Fats: ${macros.fat} g
Fiber: ${macros.fiber} g
Water Intake Target: ${(profile.waterIntakeGoal / 1000).toFixed(1)} Liters

--- Generated Meal Schedule ---
${suggestedMeals.map((m, idx) => `
Meal ${idx + 1}: ${m.type}
Name: ${m.name}
Calories: ${m.calories} kcal | P: ${m.protein}g | C: ${m.carbs}g | F: ${m.fat}g | Fiber: ${m.fiber}g
Prep Time: ${m.prepTime}
Ingredients: \n${m.ingredients.map(i => `  - ${i}`).join('\n')}
Instructions: \n${m.instructions.map((ins, step) => `  ${step + 1}. ${ins}`).join('\n')}
`).join('\n')}
`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitlife-diet-plan.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!subscribed) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 max-w-xl mx-auto w-full text-center space-y-6">
        <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 shadow-md">
          <Calculator className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Diet Planner Locked</h1>
          <p className="text-sm text-foreground/80 leading-relaxed">
            Protecting proprietary clinical health structures and metabolic charts from unverified bulk extraction or redistribution.
          </p>
        </div>

        <GlassCard className="w-full border-emerald-500/25 p-6 space-y-6">
          <div className="border-b border-border-color pb-3">
            <h3 className="font-extrabold text-lg text-emerald-500">Premium Generation Pass</h3>
            <p className="text-[10px] text-foreground/50 mt-0.5">Instant unlimited custom diets and calculations</p>
          </div>

          <div className="space-y-3.5 text-left text-xs leading-relaxed">
            <div className="p-3.5 rounded-xl bg-gray-500/5 border border-border-color flex justify-between items-center">
              <div>
                <span className="font-extrabold block text-sm">Promo Rate (Month 1)</span>
                <span className="text-[10px] text-foreground/60">Renews at ₹600/month after 30 days (+₹500 adjustment)</span>
              </div>
              <span className="text-xl font-black text-emerald-500">₹100</span>
            </div>
            <div className="space-y-1.5 pl-2">
              <p>✓ All-inclusive 7-meal schedule planner (Veg, Vegan, Jain, Non-Veg)</p>
              <p>✓ Automated allergy filter exclusion lists</p>
              <p>✓ High-precision macronutrient metric dashboards</p>
            </div>
          </div>

          <button
            onClick={() => {
              setSubscriptionStatus(true);
              setSubscribed(true);
              window.dispatchEvent(new Event('profileUpdated'));
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-[0_4px_15px_rgba(217,70,83,0.25)] transition-all cursor-pointer"
          >
            Subscribe & Unlock Instantly
          </button>
        </GlassCard>
        <p className="text-[10px] text-foreground/50 italic">
          *Note: Secure payment is simulated. Tapping unlock establishes full lifetime pass cookies on this device.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 py-4">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 no-print">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Metabolic & <span className="gradient-text bg-gradient-to-r from-brand-emerald to-emerald-500">Diet Planner</span>
        </h1>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Input your details to calculate your personalized caloric targets, macronutrient goals, and build an allergy-filtered meal prep schedule.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Setup Wizard Form */}
        <div className="lg:col-span-1 space-y-6 no-print">
          <GlassCard className="space-y-5 border-brand-emerald/15">
            <h2 className="text-base font-bold flex items-center gap-2 border-b border-border-color pb-3">
              <Calculator className="w-5 h-5 text-brand-emerald" />
              <span>Metabolic Calculator Inputs</span>
            </h2>

            {/* Age, Weight, Height Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Age</label>
                <input
                  type="number"
                  value={profile.age}
                  min={5}
                  max={120}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 28)}
                  className="w-full p-2.5 rounded-xl border border-border-color bg-background/50 text-sm focus:border-brand-emerald outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Height (cm)</label>
                <input
                  type="number"
                  value={profile.height}
                  min={80}
                  max={250}
                  onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 175)}
                  className="w-full p-2.5 rounded-xl border border-border-color bg-background/50 text-sm focus:border-brand-emerald outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Weight (kg)</label>
                <input
                  type="number"
                  value={profile.weight}
                  min={10}
                  max={300}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 74)}
                  className="w-full p-2.5 rounded-xl border border-border-color bg-background/50 text-sm focus:border-brand-emerald outline-none"
                />
              </div>
            </div>

            {/* Gender & Diet Preferences */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Gender</label>
                <select
                  value={profile.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border-color bg-background/50 text-sm focus:border-brand-emerald outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Diet Style</label>
                <select
                  value={profile.dietPreference}
                  onChange={(e) => handleInputChange('dietPreference', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border-color bg-background/50 text-sm focus:border-brand-emerald outline-none"
                >
                  <option value="Non-Veg">Non-Vegetarian</option>
                  <option value="Veg">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Jain">Jain</option>
                </select>
              </div>
            </div>

            {/* Goal Selector */}
            <div>
              <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Primary Goal</label>
              <select
                value={profile.goal}
                onChange={(e) => handleInputChange('goal', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border-color bg-background/50 text-sm focus:border-brand-emerald outline-none"
              >
                {goalOptions.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Activity Level & Workout Timing */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Activity Level</label>
                <select
                  value={profile.activityLevel}
                  onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border-color bg-background/50 text-sm focus:border-brand-emerald outline-none"
                >
                  <option value="Sedentary">Sedentary (desk job)</option>
                  <option value="Light">Lightly Active</option>
                  <option value="Moderate">Moderately Active</option>
                  <option value="Active">Very Active</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Workout Timing</label>
                <select
                  value={profile.workoutTiming}
                  onChange={(e) => handleInputChange('workoutTiming', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border-color bg-background/50 text-sm focus:border-brand-emerald outline-none"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>
            </div>

            {/* Meal Frequency & Water Intake Goal */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Meal Frequency</label>
                <input
                  type="number"
                  min={3}
                  max={6}
                  value={profile.mealFrequency}
                  onChange={(e) => handleInputChange('mealFrequency', parseInt(e.target.value) || 4)}
                  className="w-full p-2.5 rounded-xl border border-border-color bg-background/50 text-sm focus:border-brand-emerald outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-foreground/60 block mb-1 uppercase">Water Goal (ml)</label>
                <input
                  type="number"
                  min={1000}
                  max={10000}
                  value={profile.waterIntakeGoal}
                  onChange={(e) => handleInputChange('waterIntakeGoal', parseInt(e.target.value) || 2500)}
                  className="w-full p-2.5 rounded-xl border border-border-color bg-background/50 text-sm focus:border-brand-emerald outline-none"
                />
              </div>
            </div>

            {/* Allergies Checklist */}
            <div>
              <label className="text-[10px] font-bold text-foreground/60 block mb-2 uppercase">Exclude Food Allergens</label>
              <div className="grid grid-cols-3 gap-2 border border-border-color p-3 rounded-xl bg-gray-500/5 max-h-[140px] overflow-y-auto">
                {allergyOptions.map((alg) => {
                  const isChecked = profile.allergies.includes(alg);
                  return (
                    <button
                      key={alg}
                      onClick={() => handleAllergyToggle(alg)}
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-bold text-center border capitalize transition-all cursor-pointer truncate ${
                        isChecked 
                          ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400' 
                          : 'bg-background hover:bg-gray-100 dark:hover:bg-gray-800 border-border-color'
                      }`}
                    >
                      {alg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                className="flex-1 py-3 px-4 rounded-xl bg-brand-emerald hover:bg-emerald-600 text-white font-bold text-sm shadow-[0_4px_12px_rgba(16,185,129,0.25)] transition-all cursor-pointer"
              >
                Calculate Targets
              </button>
              <button
                onClick={() => {
                  const def = getProfile();
                  setProfile(def);
                  calculateTargets(def);
                }}
                className="p-3 rounded-xl border border-border-color hover:border-brand-emerald/40 transition-colors cursor-pointer"
                title="Reset to Saved"
              >
                <RotateCcw className="w-4.5 h-4.5" />
              </button>
            </div>

            {isSaved && (
              <div className="flex items-center gap-1.5 justify-center text-xs text-brand-emerald font-bold p-1">
                <CheckCircle className="w-4 h-4" />
                <span>Caloric projections synchronized!</span>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Side: Projections & Meal Plans */}
        <div className="lg:col-span-2 space-y-6">
          {/* Caloric Metrics Projections Card */}
          <GlassCard className="border-brand-emerald/20">
            <div className="flex items-center justify-between border-b border-border-color pb-4 no-print">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-emerald" />
                <span>Daily Projections & Targets</span>
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-lg bg-gray-500/5 hover:bg-gray-500/10 border border-border-color transition-colors cursor-pointer"
                  title="Print Meal Plan"
                >
                  <Printer className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={downloadSummary}
                  className="p-2 rounded-lg bg-gray-500/5 hover:bg-gray-500/10 border border-border-color transition-colors cursor-pointer"
                  title="Download Summary File"
                >
                  <Download className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Display on Print Heading */}
            <div className="hidden print-only mb-6 text-center">
              <h1 className="text-3xl font-extrabold">FitLife AI Caloric & Diet Plan</h1>
              <p className="text-sm mt-1">Personalized layout based on clinical sports metabolic criteria</p>
            </div>

            {/* Target Circle Calorie */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-2">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="text-[10px] font-extrabold uppercase text-foreground/50 tracking-wider">Suggested Energy Intake</div>
                <div className="text-3xl sm:text-5xl font-black text-brand-emerald my-1">{targetCalories} <span className="text-sm font-semibold text-foreground/75">kcal / day</span></div>
                <p className="text-xs text-foreground/60 leading-relaxed max-w-sm">
                  This projected budget represents metabolic factors to support <strong>{profile.goal}</strong> for a {profile.gender.toLowerCase()} aging {profile.age}.
                </p>
              </div>

              {/* Macro Bars Layout */}
              <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Protein', g: `${macros.protein}g`, cal: `${macros.protein * 4} kcal`, col: 'from-emerald-400 to-emerald-600' },
                  { label: 'Carbs', g: `${macros.carbs}g`, cal: `${macros.carbs * 4} kcal`, col: 'from-blue-400 to-blue-600' },
                  { label: 'Fats', g: `${macros.fat}g`, cal: `${macros.fat * 9} kcal`, col: 'from-amber-400 to-amber-600' },
                  { label: 'Fiber', g: `${macros.fiber}g`, cal: 'Prebiotics', col: 'from-purple-400 to-purple-600' }
                ].map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-gray-500/5 text-center border border-border-color">
                    <div className="text-[10px] font-bold text-foreground/50 uppercase">{m.label}</div>
                    <div className="text-base font-extrabold text-foreground mt-0.5">{m.g}</div>
                    <div className="text-[10px] text-foreground/60 mt-0.5">{m.cal}</div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Generated Meal List Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b border-border-color pb-2 flex items-center justify-between">
              <span>Allergy-Aware Eating Schedule</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-emerald/10 text-brand-emerald font-mono uppercase">
                {profile.mealFrequency} Meals / Day
              </span>
            </h3>

            {suggestedMeals.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-border-color rounded-2xl">
                <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                <p className="text-sm text-foreground/80 font-bold">No meal plans matches your criteria</p>
                <p className="text-xs text-foreground/50 mt-1">Try toggling off some food allergy exclusions or modifying your diet preference settings.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {suggestedMeals.map((meal, index) => (
                  <div key={meal.id} className="p-5 rounded-xl border border-border-color bg-background/55 shadow-sm space-y-4 print:break-inside-avoid">
                    {/* Meal Title Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-color pb-3 gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-brand-emerald/15 text-brand-emerald text-xs font-extrabold">
                          {index + 1}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-500/10 text-foreground/80 uppercase">
                            {meal.type}
                          </span>
                          <h4 className="font-extrabold text-sm sm:text-base text-foreground mt-1">{meal.name}</h4>
                        </div>
                      </div>

                      <div className="flex gap-2 text-[10px] font-bold text-foreground/75 flex-wrap">
                        <span className="px-2 py-1 rounded bg-brand-emerald/10 text-brand-emerald">{meal.calories} kcal</span>
                        <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">P: {meal.protein}g</span>
                        <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">C: {meal.carbs}g</span>
                        <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">F: {meal.fat}g</span>
                        <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">Prep: {meal.prepTime}</span>
                      </div>
                    </div>

                    {/* Meal splits: recipe steps vs ingredients */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-xs leading-relaxed">
                      {/* Ingredients */}
                      <div className="md:col-span-2 space-y-2">
                        <h5 className="font-bold text-foreground uppercase tracking-wider text-[10px] text-foreground/60">Ingredients Required</h5>
                        <ul className="space-y-1.5">
                          {meal.ingredients.map((ing, i) => (
                            <li key={i} className="flex gap-2 items-start text-foreground/85">
                              <span className="text-brand-emerald mt-0.5">•</span>
                              <span>{ing}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Instructions */}
                      <div className="md:col-span-3 space-y-2">
                        <h5 className="font-bold text-foreground uppercase tracking-wider text-[10px] text-foreground/60">Preparation & Cooking</h5>
                        <ol className="space-y-2">
                          {meal.instructions.map((step, i) => (
                            <li key={i} className="flex gap-2 items-start text-foreground/80">
                              <span className="font-extrabold text-brand-emerald shrink-0">{i + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    {/* Substitutions & Allergens alerts */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-border-color text-[10px]">
                      <div className="flex items-center gap-1.5 text-foreground/60">
                        <Info className="w-3.5 h-3.5 text-brand-emerald" />
                        <span>Swap: {meal.alternatives.join(', ')}</span>
                      </div>
                      
                      {meal.allergens.length > 0 && (
                        <div className="flex gap-1 items-center font-bold text-rose-500 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10">
                          <span>Contains allergen hazards: {meal.allergens.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
