import '@/styles/globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/features/theme-engine/ThemeContext';

export const metadata: Metadata = {
  title: 'THE O.P.T. COLLECTIVE | Optimal Performance Tools',
  description: 'Ergonomic WFH Desk & Car Interior Upgrades — Engineered for India.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="opt-parent">
      <body className="min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}