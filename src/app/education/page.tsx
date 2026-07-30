// FitLife AI - Health Education Portal (Supplements, PED Risks, Sedentary Hazards)
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, AlertTriangle, ShieldCheck, Heart, Info, Award, Brain, Activity, Compass, ShieldAlert 
} from 'lucide-react';
import { SEEDED_SUPPLEMENTS, isSubscribed, setSubscriptionStatus } from '@/lib/db';
import GlassCard from '@/components/GlassCard';

export default function Education() {
  const [subscribed, setSubscribed] = useState(false);
  const [subSection, setSubSection] = useState<'benefits' | 'risks' | 'supplements' | 'peds' | 'medications'>('benefits');

  useEffect(() => {
    setSubscribed(isSubscribed());
  }, []);

  if (!subscribed) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 max-w-xl mx-auto w-full text-center space-y-6">
        <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 shadow-md">
          <BookOpen className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Health Education Locked</h1>
          <p className="text-sm text-foreground/80 leading-relaxed">
            Protecting proprietary medical science studies and pediatric growth materials from unverified redistribution.
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
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Science-Based <span className="gradient-text bg-gradient-to-r from-brand-emerald to-emerald-500">Health Education</span>
        </h1>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          Access clinical resources on exercise physiology, metabolic pathways, supplement redundancy checks, and the biological hazards of performance-enhancing drugs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 bg-gray-500/5 p-2 rounded-2xl border border-border-color">
        {[
          { id: 'benefits', label: 'Exercise Benefits', Icon: Heart },
          { id: 'risks', label: 'Risks of Inactivity', Icon: AlertTriangle },
          { id: 'supplements', label: 'Supplement Guide', Icon: Info },
          { id: 'peds', label: 'Steroids & PEDs', Icon: ShieldCheck },
          { id: 'medications', label: 'Medication Safety', Icon: ShieldAlert }
        ].map((tab) => {
          const isSelected = subSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubSection(tab.id as any)}
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

      {/* Content Area */}
      <div className="max-w-5xl mx-auto w-full">
        {/* SECTION 1: BENEFITS OF EXERCISE */}
        {subSection === 'benefits' && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="border-brand-emerald/15">
                <h3 className="text-lg font-bold text-brand-emerald flex items-center gap-2 mb-3">
                  <Activity className="w-5 h-5" />
                  <span>Resistance Training & Bone Density</span>
                </h3>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  Lifting weights or performing bodyweight resistance patterns exerts mechanical tension on skeleton structures. 
                  This stimulates osteoblasts—cells responsible for building bone mineral density. 
                  It is the primary defense against sarcopenia (muscle loss) and osteopenia/osteoporosis as we age.
                </p>
                <div className="mt-4 p-3 rounded-xl bg-gray-500/5 border border-border-color text-xs">
                  <strong>Key adaptation:</strong> Sarcopenia mitigation starts after age 30. Strength training preserves the motor units required for lifelong balance and coordinate movement.
                </div>
              </GlassCard>

              <GlassCard className="border-brand-emerald/15">
                <h3 className="text-lg font-bold text-blue-500 flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5" />
                  <span>Cardiovascular Base & Heart Health</span>
                </h3>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  Zone 2 continuous cardio (brisk walks, rowing, swimming) strengthens the left ventricle chamber of the heart. 
                  This increases stroke volume, lowering resting heart rate and arterial blood pressure. 
                  It also enhances mitochondria density, boosting cell energy production.
                </p>
                <div className="mt-4 p-3 rounded-xl bg-gray-500/5 border border-border-color text-xs">
                  <strong>Key adaptation:</strong> Zone 2 cardio improves blood capillary networks, aiding nutrient and oxygen transport to fatigued muscle tissues.
                </div>
              </GlassCard>

              <GlassCard className="border-brand-emerald/15">
                <h3 className="text-lg font-bold text-amber-500 flex items-center gap-2 mb-3">
                  <Compass className="w-5 h-5" />
                  <span>Flexibility, Mobility & Recovery</span>
                </h3>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  Flexibility refers to muscle length limits, while mobility is the ability to actively coordinate movement through a joint's full range of motion. 
                  Active mobility prevents tendon friction patterns, preserves joint synovial lubrication, and reduces lower back strain.
                </p>
                <div className="mt-4 p-3 rounded-xl bg-gray-500/5 border border-border-color text-xs">
                  <strong>Key adaptation:</strong> Moving through full ranges of motion offsets patterns of career-based desk sitting, protecting knee caps and lower lumbar disks.
                </div>
              </GlassCard>

              <GlassCard className="border-brand-emerald/15">
                <h3 className="text-lg font-bold text-purple-500 flex items-center gap-2 mb-3">
                  <Brain className="w-5 h-5" />
                  <span>Mental Health & Stress Reduction</span>
                </h3>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  Exercise releases Brain-Derived Neurotrophic Factor (BDNF), triggering neurogenesis (new brain cell growth) in the hippocampus. 
                  It acts as a buffer against anxiety and depression by regulating dopamine, serotonin, and cortisol.
                </p>
                <div className="mt-4 p-3 rounded-xl bg-gray-500/5 border border-border-color text-xs">
                  <strong>Key adaptation:</strong> Resistance exercise has been clinically linked with major declines in systemic brain fog and chronic fatigue symptoms.
                </div>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {/* SECTION 2: RISKS OF INACTIVITY */}
        {subSection === 'risks' && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="border-rose-500/15">
              <h3 className="text-lg font-bold text-rose-500 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5" />
                <span>The Physiology of Physical Inactivity</span>
              </h3>
              <p className="text-xs text-foreground/80 leading-relaxed mb-4">
                A sedentary lifestyle changes cellular pathways. Understanding these risks helps us make informed daily movement decisions. Here are the factual physiological consequences of a consistently inactive lifestyle:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {[
                  { title: 'Sarcopenia & Muscle Wasting', text: 'Without resistive loads, the body breaks down muscle tissue to save energy. This lowers your basal metabolic rate and burns fewer calories.' },
                  { title: 'Bone Density Loss', text: 'Low mechanical stress signals bone osteoclasts to resorb calcium minerals, leading to brittle bone structures and osteopenia.' },
                  { title: 'Cardiovascular Deconditioning', text: 'The heart wall thins and loses stroke efficiency. Blood vessels lose elasticity, which increases systemic blood pressure.' },
                  { title: 'Type 2 Diabetes Risk', text: 'Muscle contraction is the primary pathway to pull glucose from blood without insulin. Sitting increases insulin resistance.' },
                  { title: 'Fatty Liver Disease', text: 'Sedentary cells accumulate excess energy as visceral fat surrounding internal organs, causing liver inflammation.' },
                  { title: 'Poor Joint Mechanics', text: 'Inactivity shortens tendons (especially hip flexors and chest), causing poor spinal posture and joint pain.' }
                ].map((risk, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 space-y-1">
                    <h4 className="font-bold text-rose-600 dark:text-rose-400">{risk.title}</h4>
                    <p className="text-foreground/75 leading-relaxed text-[11px]">{risk.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-brand-emerald/10 text-xs text-center text-foreground/80 font-semibold">
                ✨ **The Solution is Simple:** Just 150 minutes of brisk walking weekly or two 25-minute strength sessions can reverse most inactivity markers!
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* SECTION 3: SUPPLEMENT EDUCATION */}
        {subSection === 'supplements' && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 gap-6">
              {SEEDED_SUPPLEMENTS.map((sup, idx) => (
                <GlassCard key={idx} className="space-y-4 border-brand-emerald/10">
                  <div className="border-b border-border-color pb-3 flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-brand-emerald">{sup.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-500/10 text-foreground/80 uppercase">Clinical Grade Guide</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                    <div>
                      <p className="text-foreground/90 font-medium mb-3">{sup.summary}</p>
                      <h4 className="font-bold text-foreground/60 uppercase text-[10px]">How it works biologically</h4>
                      <p className="text-foreground/75 mt-0.5 text-[11px]">{sup.mechanism}</p>
                      
                      <h4 className="font-bold text-foreground/60 uppercase text-[10px] mt-3">Target Dosage</h4>
                      <p className="text-foreground/75 mt-0.5 text-[11px]">{sup.dosage}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-gray-500/5 border border-border-color">
                        <h4 className="font-bold text-foreground/60 uppercase text-[10px]">When it is redundant / not needed</h4>
                        <p className="text-[11px] text-foreground/75 mt-1">{sup.notNecessaryWhen}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                        <h4 className="font-bold text-amber-600 dark:text-amber-400 uppercase text-[10px]">Possible side effects</h4>
                        <ul className="list-disc pl-4 mt-1 text-[11px] text-foreground/75 space-y-0.5">
                          {sup.sideEffects.map((se, i) => <li key={i}>{se}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* SECTION 4: PEDS & STEROIDS EDUCATION */}
        {subSection === 'peds' && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="border-amber-500/15 space-y-5">
              <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <span>Performance-Enhancing Drugs (PEDs) & Anabolic Steroids</span>
              </h3>
              
              <p className="text-xs text-foreground/80 leading-relaxed">
                Anabolic-androgenic steroids (AAS) are synthetic derivatives of the male hormone testosterone. While widely sensationalized, understanding their medical functions versus the severe risks of self-medication is essential for modern fitness safety.
              </p>

              {/* Splits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed border-t border-border-color pt-4">
                <div className="space-y-3">
                  <h4 className="font-extrabold text-brand-emerald text-sm">Legitimate Clinical Medical Uses</h4>
                  <p className="text-[11px] text-foreground/85">
                    When prescribed and monitored by a qualified medical endocrinologist, synthetic testosterone is clinically indicated for specific pathologies:
                  </p>
                  <ul className="space-y-2 text-[11px] text-foreground/75 pl-4 list-disc">
                    <li>• **Male Hypogonadism**: When the testicles fail to produce physiological baselines of testosterone naturally.</li>
                    <li>• **Muscle-Wasting Pathologies**: Halting muscle mass loss in advanced HIV/AIDS or cancer cachexia.</li>
                    <li>• **Delayed Puberty**: Prescribed under pediatric supervision to kickstart growth spurts when medically indicated.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-extrabold text-rose-500 text-sm">The Hazards of Unsupervised Cycles</h4>
                  <p className="text-[11px] text-foreground/85">
                    Self-medicating with black-market steroids to build muscle artificially causes deep structural organ damage. Because hormones regulate the entire body, the side effects are systemic:
                  </p>
                  <ul className="space-y-1.5 text-[11px] text-foreground/75 pl-4 list-disc">
                    <li>• **Cardiovascular Blockages**: Thickens heart muscle walls (cardiomegaly), crashes HDL (good cholesterol), and causes arterial clotting risks.</li>
                    <li>• **Hormonal Shutdown**: Squeezes out natural testosterone production. When you stop, the body has no baseline, causing severe muscle loss and infertility.</li>
                    <li>• **Liver Stress**: Oral compounds must pass the liver (17-alpha alkylation), leading to cysts or failure.</li>
                  </ul>
                </div>
              </div>

              {/* Medical callout alert */}
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs text-foreground/85 leading-relaxed">
                <strong>Medical Advice:</strong> Buying black-market anabolic agents is illegal, chemically unverified, and highly dangerous. Consult a clinical endocrinologist or physician if you suspect low hormone production. Avoid self-medicating to protect your kidneys, liver, and mental health.
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* SECTION 5: MEDICATION SAFETY & AWARENESS */}
        {subSection === 'medications' && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="border-rose-500/15 space-y-5">
              <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2 mb-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <span>Medication Safety & Influence Prevention</span>
              </h3>
              
              <p className="text-xs text-foreground/80 leading-relaxed">
                Medications are chemical formulations engineered to treat medical conditions under strict professional guidance. However, children and teenagers are frequently exposed to peer pressure or social media influencers who promote unverified pills, fat burners, thyroid drugs, or focus aids as "quick fixes" or "fitness shortcuts." 
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed border-t border-border-color pt-4">
                <div className="space-y-3">
                  <h4 className="font-extrabold text-rose-500 text-sm">Biological Hazards of Unprescribed Meds</h4>
                  <p className="text-[11px] text-foreground/85">
                    Taking any pharmaceutical pills or weight-loss formulas without direct prescription causes heavy systemic disruptions:
                  </p>
                  <ul className="space-y-2 text-[11px] text-foreground/75 pl-4 list-disc">
                    <li>• **Severe Kidneys & Liver Toxicity**: The filtration systems of growing bodies are placed under extreme chemical stress, which can lead to rapid organ inflammation.</li>
                    <li>• **Growth & Endocrine Disruption**: Self-medicating with thyroid stimulants, fat burners, or growth agents damages natural developmental growth plates, potentially locking bone elongation permanently.</li>
                    <li>• **Heart & Blood Pressure Risks**: Many diet pills contain high-stimulant compounds that cause heart palpitations, severe spikes in blood pressure, and sleep disturbances.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-extrabold text-brand-emerald text-sm">Resisting Influencer & Peer Pressures</h4>
                  <p className="text-[11px] text-foreground/85">
                    It is crucial for kids and teens to build strong boundaries against shortcuts. Follow these safety checkpoints:
                  </p>
                  <ul className="space-y-2 text-[11px] text-foreground/75 pl-4 list-disc">
                    <li>• **Never Take Unlabeled Pills**: If a peer or gym contact offers you a pill, capsule, or powder claiming it is a "magic fat burner" or "focus booster," say no immediately.</li>
                    <li>• **Verify With Trusted Adults**: Always tell your parents, sports coach, or school nurse if someone is encouraging you to try fitness pills or supplements.</li>
                    <li>• **Verify Clinical Labels**: Real performance comes from consistent eating, sleep, and progressive workout resistance, not chemical modifications.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/15 text-xs text-foreground/85 leading-relaxed">
                <strong>Safety Rule for Kids & Teens:</strong> NEVER ingest any pill, tablet, capsule, or drug unless it is directly handed to you by your parent, guardian, or a licensed primary care doctor. Protect your body and focus on natural health habits!
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
