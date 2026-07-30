// FitLife AI - Interactive Premium Navigation Header
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, Dumbbell, User, Award, Bot } from 'lucide-react';
import { getProfile, UserProfile } from '../lib/db';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Sync dark mode state with DOM
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark') || 
                   localStorage.getItem('theme') === 'dark' ||
                   (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Get profile data
    setProfile(getProfile());
  }, []);

  // Handle page-load refresh profile trigger
  useEffect(() => {
    const handleProfileChange = () => {
      setProfile(getProfile());
    };
    window.addEventListener('storage', handleProfileChange);
    // Custom trigger for local changes
    window.addEventListener('profileUpdated', handleProfileChange);
    return () => {
      window.removeEventListener('storage', handleProfileChange);
      window.removeEventListener('profileUpdated', handleProfileChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Age Guides', href: '/age-groups' },
    { name: 'Exercises', href: '/exercises' },
    { name: 'Diet Planner', href: '/diet-planner' },
    { name: 'Calculators', href: '/calculators' },
    { name: 'Health Education', href: '/education' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-color bg-background/70 backdrop-blur-md transition-all duration-300 no-print">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-brand-emerald to-brand-emerald-dark text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-transform duration-300 group-hover:scale-110">
                <Dumbbell className="h-6 w-6" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-emerald to-emerald-600 dark:to-emerald-300 bg-clip-text text-transparent">
                FitLife AI
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors duration-200 relative py-1 hover:text-brand-emerald ${
                    isActive
                      ? 'text-brand-emerald font-bold'
                      : 'text-muted-foreground text-foreground/80'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-emerald rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Utility Buttons (Theme Toggle, Chatbot, Profile, Menu Toggle) */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
            </button>

            {/* AI Assistant Button */}
            <Link
              href="/chatbot"
              className={`p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1 cursor-pointer ${
                pathname === '/chatbot' ? 'text-brand-emerald bg-brand-emerald/10' : 'text-foreground'
              }`}
              title="AI Fitness Assistant"
            >
              <Bot className="h-5 w-5 text-brand-emerald animate-pulse" />
              <span className="text-xs font-bold hidden sm:inline text-brand-emerald">AI Coach</span>
            </Link>

            {/* Profile Avatar Widget */}
            <Link
              href="/dashboard"
              className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-border-color"
            >
              <div className="h-7 w-7 rounded-full bg-brand-emerald flex items-center justify-between text-white font-bold text-xs items-center justify-center">
                {profile?.gender === 'Female' ? 'F' : 'M'}
              </div>
              <span className="text-xs font-bold hidden md:inline max-w-[80px] truncate">
                {profile?.goal || 'Goal'}
              </span>
            </Link>

            {/* Admin link */}
            <Link
              href="/admin"
              className={`p-2 rounded-xl border border-dashed transition-all text-xs font-bold cursor-pointer hidden md:inline ${
                pathname === '/admin'
                  ? 'border-brand-emerald text-brand-emerald bg-brand-emerald/5'
                  : 'border-border-color hover:border-brand-emerald'
              }`}
            >
              Admin Panel
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-border-color bg-background/95 backdrop-blur-md px-4 py-4 space-y-2 flex flex-col shadow-lg animate-fade-in-up">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-base font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-emerald/10 text-brand-emerald font-bold'
                    : 'text-foreground/80 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className={`px-4 py-2.5 rounded-xl text-base font-semibold transition-all text-left flex items-center justify-between border-t border-border-color pt-4 ${
              pathname === '/admin' ? 'text-brand-emerald' : 'text-foreground/80'
            }`}
          >
            <span>Admin Control Panel</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-brand-emerald/20 text-brand-emerald font-mono">Mock</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
