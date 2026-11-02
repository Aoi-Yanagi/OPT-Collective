import React from 'react';
import { StorefrontShell } from '@/features/catalog/StorefrontShell';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return <StorefrontShell>{children}</StorefrontShell>;
}