import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Geist_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'InterviewIQ AI — Master Interviews With AI Precision',
  description:
    'Practice realistic AI mock interviews, get ATS resume scoring, track DSA progress, and receive personalized career roadmaps. The future of interview preparation.',
  keywords: [
    'AI interview preparation', 'mock interview', 'resume ATS scorer',
    'DSA tracker', 'interview coaching', 'career intelligence',
  ],
  openGraph: {
    title: 'InterviewIQ AI — Master Interviews With AI Precision',
    description: 'Your AI-powered career intelligence platform.',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
