import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FitLife AI | Age-Appropriate Fitness, Nutrition & Health Education',
  description:
    'Science-based fitness programs, personalized nutrition planning, allergen-aware eating schedules, calculators, and AI coaching for ages 5 to 60+.',
  keywords: 'fitness, nutrition, calorie calculator, bmi, healthy habits, diet plans, workout schedule, age groups fitness',
  openGraph: {
    title: 'FitLife AI | Health & Nutrition Platform',
    description: 'Personalized exercise guidance, nutrition planning, and health education across all stages of life.',
    type: 'website',
    locale: 'en_US',
    siteName: 'FitLife AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FitLife AI | Health & Nutrition Platform',
    description: 'Personalized exercise guidance, nutrition planning, and health education across all stages of life.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-brand-light text-foreground dark:bg-brand-dark transition-colors duration-300">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
