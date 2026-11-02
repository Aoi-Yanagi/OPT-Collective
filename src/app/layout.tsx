import '@/styles/globals.css';
import '@/styles/opt-brand-theme.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/features/theme-engine/ThemeContext';

export const metadata: Metadata = {
  title: 'THE O.P.T. COLLECTIVE | Objects for better everyday rituals',
  description: 'A considered edit of useful objects for your workspace, your drive and everything between.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="opt-parent" data-theme-mode="night">
      <body className="min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
