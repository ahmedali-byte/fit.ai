// FitLife AI - Interactive Premium Landing Page
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, ShieldCheck, Heart, Sparkles, Activity, Apple, Zap, Scale, Clock, Users 
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';

export default function Home() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' as any } }
  };

  const floatingIcons = [
    { Icon: Activity, color: 'text-emerald-500', top: '15%', left: '10%', delay: 0 },
    { Icon: Apple, color: 'text-rose-500', top: '25%', right: '12%', delay: 2 },
    { Icon: Zap, color: 'text-amber-500', bottom: '20%', left: '15%', delay: 4 },
    { Icon: Scale, color: 'text-sky-500', bottom: '30%', right: '10%', delay: 1 }
  ];

  return (
    <div className="flex flex-col gap-16 relative overflow-hidden py-4">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 opacity-30 dark:opacity-20 transition-opacity duration-1000"
        >
          <source src="https://res.cloudinary.com/t238r9me/video/upload/v1784977573/kling_20260725_VIDEO_generate_m_4871_0_pww1wd.mp4" type="video/mp4" />
        </video>
        {/* Soft gradient overlay to blend video with background and make text pop */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none" />
      </div>

      {/* Background Glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-emerald/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/5 blur-[150px] pointer-events-none z-0" />

      {/* Floating animations */}
      {floatingIcons.map(({ Icon, color, top, left, right, bottom, delay }, i) => (
        <motion.div
          key={i}
          className={`absolute pointer-events-none opacity-40 dark:opacity-20 hidden md:block ${color}`}
          style={{ top, left, right, bottom }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay,
            ease: 'easeInOut'
          }}
        >
          <Icon className="w-12 h-12" />
        </motion.div>
      ))}

      {/* Hero Section */}
      <section 
        className="text-center flex flex-col items-center max-w-4xl mx-auto gap-6 relative z-10 pt-8"
      >
        <motion.div 
          initial={mounted ? { opacity: 0, y: 15 } : false}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-emerald/10 text-brand-emerald text-xs font-bold uppercase tracking-wider border border-brand-emerald/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Health Platform</span>
        </motion.div>

        <motion.h1 
          initial={mounted ? { opacity: 0, y: 15 } : false}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight"
        >
          Build a Healthier Body at <br className="hidden sm:inline" />
          <span className="gradient-text bg-gradient-to-r from-brand-emerald to-emerald-500">Every Stage of Life</span>
        </motion.h1>

        <motion.p 
          initial={mounted ? { opacity: 0, y: 15 } : false}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-2xl"
        >
          Personalized exercise guidance, nutrition planning, allergy-aware meal recommendations, and science-based health education.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={mounted ? { opacity: 0, y: 15 } : false}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto"
        >
          <Link
            href="/age-groups"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-brand-emerald hover:bg-emerald-600 text-white font-bold text-base shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.4)] transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/diet-planner"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl border border-border-color hover:border-brand-emerald/50 bg-background/50 backdrop-blur-sm text-foreground hover:bg-gray-100 dark:hover:bg-gray-800/50 font-bold text-base transition-all duration-300 cursor-pointer"
          >
            Calculate My Diet
          </Link>
        </motion.div>
      </section>

      {/* Interactive Statistics Grid */}
      <motion.section
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {[
          { label: 'Tailored Lifespans', value: '7 Stages', desc: 'Ages 5 to 60+' },
          { label: 'Clinically Designed', value: '100% Safe', desc: 'Allergy-aware choices' },
          { label: 'Smart Assistant', value: '24/7 Coach', desc: 'Instant AI answers' },
          { label: 'Hydration Trackers', value: 'Interactive', desc: 'Realtime progress logs' }
        ].map((stat, idx) => (
          <GlassCard 
            key={idx} 
            className="text-center border-b-2 border-b-transparent hover:border-b-brand-emerald"
            glowOnHover
          >
            <div className="text-2xl sm:text-3xl font-extrabold text-brand-emerald mb-1">{stat.value}</div>
            <div className="text-sm font-bold text-foreground mb-1">{stat.label}</div>
            <div className="text-xs text-foreground/60">{stat.desc}</div>
          </GlassCard>
        ))}
      </motion.section>

      {/* Feature Split Showcase */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-emerald/10 text-brand-emerald text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Medically Responsible Design</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Scientific Wellness Built <br />
            For Your Whole Family
          </h2>
          <p className="text-foreground/80 leading-relaxed">
            Our platform splits body requirements into developmental milestones. From pediatric growth guidelines (ages 5–12) to resistance training adaptations for bone density in seniors (ages 60+), we have designed each segment using sports science and clinical recommendations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              { title: 'Allergy Screening', desc: 'Exclude Gluten, Lactose, Nuts, Soy, Eggs, and 7 other allergens.' },
              { title: 'Pain Modification', desc: 'Provides safe workout swaps for knee pain, back pain, or balance issues.' }
            ].map((feature, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="mt-1 p-1 rounded-lg bg-brand-emerald/10 text-brand-emerald">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{feature.title}</h4>
                  <p className="text-xs text-foreground/60 leading-relaxed mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link
              href="/age-groups"
              className="inline-flex items-center gap-2 text-brand-emerald hover:text-emerald-400 font-bold transition-all group"
            >
              <span>Explore Age Group Navigation</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* Dashboard Visual Mockup card */}
        <motion.div
          className="relative lg:ml-4"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-emerald to-emerald-600 rounded-3xl blur-2xl opacity-20 dark:opacity-10 pointer-events-none" />
          <GlassCard className="relative z-10 p-6 md:p-8 flex flex-col gap-6 border-brand-emerald/20">
            {/* Visual Header */}
            <div className="flex items-center justify-between border-b border-border-color pb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand-emerald" />
                <span className="font-bold text-sm">Dashboard Preview</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-brand-emerald font-mono text-[10px] font-bold uppercase">Live Logs</span>
            </div>

            {/* Simulated Water Tracker Card */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-500/5 border border-border-color">
              <div className="flex gap-3 items-center">
                <div className="h-10 w-10 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center font-bold">
                  H₂O
                </div>
                <div>
                  <h4 className="text-sm font-bold">Hydration Level</h4>
                  <p className="text-xs text-foreground/50">Daily progress target</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-extrabold text-brand-emerald">1,500 / 2,500 ml</div>
                <div className="text-[10px] text-foreground/60">60% completed</div>
              </div>
            </div>

            {/* Simulated Activity Chart Visuals */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>Muscle Recovery Rate</span>
                <span className="text-brand-emerald">84%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-brand-emerald to-emerald-400"
                  initial={{ width: 0 }}
                  whileInView={{ width: '84%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { title: 'TDEE Target', val: '2,450 kcal' },
                { title: 'Active Steps', val: '8,400 steps' },
                { title: 'Weight', val: '74.0 kg' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-gray-500/5 text-center border border-border-color">
                  <div className="text-[10px] text-foreground/60 font-semibold mb-0.5">{item.title}</div>
                  <div className="text-xs font-bold text-foreground">{item.val}</div>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard"
              className="text-center block py-3 rounded-xl bg-brand-emerald/10 hover:bg-brand-emerald/20 text-brand-emerald font-bold text-sm transition-all"
            >
              Go To Personal Dashboard
            </Link>
          </GlassCard>
        </motion.div>
      </section>

      {/* Generational Showcase Section */}
      <section className="space-y-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">Designed for Every Generation</h2>
          <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed">
            Explore dedicated exercise and nutrition libraries designed specifically for developmental milestones and recovery capacities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Kids & Teens', age: 'Ages 5–17', img: '/images/kid.png', desc: 'Focusing on motor skills, coordination games, and safe bodyweight movement patterns.' },
            { title: 'Adults', age: 'Ages 18–60', img: '/images/adult.png', desc: 'Optimizing metabolic balance, muscle building, high intensity cardio, and posture offsets.' },
            { title: 'Seniors', age: 'Ages 60+', img: '/images/senior.png', desc: 'Preserving functional mobility, balance, bone density maintenance, and joint safety.' }
          ].map((card, i) => (
            <GlassCard key={i} className="flex flex-col gap-4 overflow-hidden border-brand-emerald/10 p-0 group">
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={card.img}
                  alt={card.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-brand-emerald text-white text-[10px] font-bold uppercase tracking-wider shadow">
                  {card.age}
                </div>
              </div>
              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-foreground">{card.title}</h3>
                  <p className="text-xs text-foreground/75 leading-relaxed mt-1">{card.desc}</p>
                </div>
                <Link
                  href="/age-groups"
                  className="text-xs font-bold text-brand-emerald hover:text-emerald-600 inline-flex items-center gap-1 mt-4"
                >
                  <span>Explore age guides</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Champions Inspiration Section */}
      <section className="space-y-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">Champions & Legacy Inspiration</h2>
          <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed">
            Drawing discipline and aesthetic inspiration from legends who shaped physical culture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              name: 'Arnold Schwarzenegger',
              title: '7x Mr. Olympia / Golden Era Legend',
              img: '/images/arnold.png',
              quote: '"Strength does not come from winning. Your struggles develop your strengths. When you go through hardships and decide not to surrender, that is strength."',
              tip: 'Arnold favored high-volume compound lifts, focusing heavily on the mind-muscle connection and complete extension sweeps.'
            },
            {
              name: 'Chris Bumstead (Cbum)',
              title: '5x Classic Physique Olympia Champion',
              img: '/images/cbum.png',
              quote: '"To be a champion, you have to do what other people are not willing to do. Discipline is doing things when you do not want to do them."',
              tip: 'Chris prioritizes controlled negatives, heavy basic squats, and strict biomechanical lines to prevent injury and shape symmetry.'
            }
          ].map((champ, i) => (
            <GlassCard key={i} className="flex flex-col md:flex-row gap-6 p-0 overflow-hidden border-brand-emerald/10 group">
              <div className="relative w-full md:w-2/5 aspect-[4/5] overflow-hidden shrink-0">
                <img
                  src={champ.img}
                  alt={champ.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div>
                  <h3 className="font-black text-lg text-foreground">{champ.name}</h3>
                  <div className="text-[10px] text-brand-emerald font-extrabold uppercase tracking-wide">{champ.title}</div>
                  <p className="text-xs italic text-foreground/70 leading-relaxed mt-3 relative pl-3 border-l border-brand-emerald">
                    {champ.quote}
                  </p>
                </div>
                
                <div className="p-3.5 rounded-xl bg-gray-500/5 border border-border-color">
                  <h4 className="text-[9px] font-bold text-foreground/50 uppercase tracking-wider mb-1">Coaching Form Takeaway</h4>
                  <p className="text-[11px] text-foreground/75 leading-relaxed">{champ.tip}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Disclaimer reminder */}
      <section className="text-center max-w-xl mx-auto py-8">
        <p className="text-xs text-foreground/60 leading-relaxed italic">
          *Note: Consult with a medical doctor or dietitian before starting a new physical program or consuming custom macronutrient calculations. Safety is our primary health driver.
        </p>
      </section>
    </div>
  );
}
