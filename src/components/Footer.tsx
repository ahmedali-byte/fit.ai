// FitLife AI - Footer Component with Medical Disclaimers and SEO Breadcrumbs
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell, ShieldAlert, HeartHandshake } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Create breadcrumb items based on the current URL path
  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const crumbs = [{ name: 'Home', href: '/' }];
    
    let currentHref = '';
    paths.forEach((p) => {
      currentHref += `/${p}`;
      // Capitalize and format path segment name
      const name = p
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      crumbs.push({ name, href: currentHref });
    });
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <footer className="border-t border-border-color bg-gray-50 dark:bg-gray-950 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 mt-auto no-print">
      <div className="mx-auto max-w-7xl">
        {/* SEO Breadcrumbs Section */}
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-muted-foreground flex items-center flex-wrap gap-1 border-b border-border-color pb-4">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.href}>
                {idx > 0 && <span className="text-gray-400">/</span>}
                {isLast ? (
                  <span className="font-semibold text-foreground/80">{crumb.name}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-brand-emerald hover:underline">
                    {crumb.name}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Intro */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand-emerald text-white">
                <Dumbbell className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-brand-emerald to-emerald-500 bg-clip-text text-transparent">
                FitLife AI
              </span>
            </div>
            <p className="text-sm text-foreground/75 leading-relaxed max-w-md">
              FitLife AI is a scientific, age-specific fitness and nutrition platform. We provide evidence-based guidance for children, teens, adults, and seniors, matching high-tech AI chat modules with personalized, allergen-aware eating and exercise options.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">Platform Pages</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/age-groups" className="text-foreground/80 hover:text-brand-emerald transition-colors">Age Guides</Link>
              </li>
              <li>
                <Link href="/exercises" className="text-foreground/80 hover:text-brand-emerald transition-colors">Exercise Library</Link>
              </li>
              <li>
                <Link href="/diet-planner" className="text-foreground/80 hover:text-brand-emerald transition-colors">Diet Planner</Link>
              </li>
              <li>
                <Link href="/calculators" className="text-foreground/80 hover:text-brand-emerald transition-colors">Calculators</Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-foreground/80 hover:text-brand-emerald transition-colors">Progress Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Support / Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">About & Support</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/chatbot" className="text-foreground/80 hover:text-brand-emerald transition-colors">AI Assistant Chat</Link>
              </li>
              <li>
                <Link href="/education" className="text-foreground/80 hover:text-brand-emerald transition-colors">Education Resources</Link>
              </li>
              <li>
                <Link href="/admin" className="text-foreground/80 hover:text-brand-emerald transition-colors font-semibold">Admin Panel</Link>
              </li>
              <li className="text-xs text-foreground/60 italic pt-2">
                Version 1.2.0 (Stable)<br />
                Responsive | Accessibility-Compliant
              </li>
            </ul>
          </div>
        </div>

        {/* Medical Responsibility Disclaimer Box */}
        <div className="mt-10 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-foreground/80 leading-relaxed space-y-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold mb-1">
            <ShieldAlert className="h-4.5 w-4.5" />
            <span>MEDICAL RESPONSIBILITY & SAFETY DISCLAIMER</span>
          </div>
          <p>
            The content, exercises, diet recommendations, macronutrient configurations, and chatbot responses provided by FitLife AI are for <strong>educational and informational purposes only</strong>. They are not intended as a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <p>
            Always consult a qualified primary care physician or healthcare specialist before starting any new exercise routine, dietary protocol, or supplement schedule. This is especially critical for individuals who are pregnant, elderly, or have pre-existing cardiovascular conditions, joint problems (knee, back, shoulder), high blood pressure, or food-related allergies. Do not ignore professional advice or delay seeking it due to materials read on this website.
          </p>
        </div>

        {/* Bottom Line */}
        <div className="mt-8 border-t border-border-color pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-foreground/60 gap-4">
          <p>&copy; {new Date().getFullYear()} FitLife AI. Built for wellness across every stage of life.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><HeartHandshake className="h-4 w-4 text-brand-emerald" /> Science & Safety First</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
