import React from 'react';
import { StorefrontShell } from '@/features/catalog/StorefrontShell';
import { WelcomeScreen } from '@/components/ui/WelcomeCurtain';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StorefrontShell>
      <WelcomeScreen />
      {children}
    </StorefrontShell>
  );
}