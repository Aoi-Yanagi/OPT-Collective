'use client';

import { useEffect, useState } from 'react';
import { DevicePlatform } from '@/types/theme.types';

export interface DeviceConfig {
  platform: DevicePlatform;
  isTouchDevice: boolean;
  hasFinePointer: boolean;
  prefersReducedMotion: boolean;
  isDesktopViewport: boolean;
  enableGpu3D: boolean;
  paymentMode: 'QR_DESKTOP_PANEL' | 'QR_MOBILE_SAVE_SCAN';
  osAttr: 'windows' | 'macos' | 'android' | 'ios';
  label: string;
}

export function useDeviceProfile(manualOverride?: DevicePlatform | null): DeviceConfig {
  const [detected, setDetected] = useState<DevicePlatform>('windows-desktop');
  const [hasFinePointer, setHasFinePointer] = useState<boolean>(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ua = navigator.userAgent || '';
    const maxTouch = navigator.maxTouchPoints || 0;
    const width = window.innerWidth;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setHasFinePointer(finePointer);
    setPrefersReducedMotion(reducedMotion);

    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isMac = /Macintosh|Mac OS X/i.test(ua);

    // Detect iOS "Request Desktop Website" or iPadOS (Macintosh UA + multi-touch)
    if (isMac && maxTouch > 1) {
      setDetected('ios-desktop-override');
    } else if (isAndroid && width >= 980) {
      setDetected('android-desktop-override');
    } else if (isIOS) {
      setDetected('ios-mobile');
    } else if (isAndroid) {
      setDetected('android-mobile');
    } else if (isMac) {
      setDetected('macos-desktop');
    } else {
      setDetected('windows-desktop');
    }
  }, []);

  const active = manualOverride || detected;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const osMap: Record<DevicePlatform, string> = {
      'windows-desktop': 'windows',
      'android-desktop-override': 'windows',
      'macos-desktop': 'macos',
      'ios-desktop-override': 'macos',
      'android-mobile': 'android',
      'ios-mobile': 'ios',
    };
    document.documentElement.setAttribute('data-os', osMap[active]);
  }, [active]);

  switch (active) {
    case 'macos-desktop':
      return {
        platform: active,
        isTouchDevice: false,
        hasFinePointer,
        prefersReducedMotion,
        isDesktopViewport: true,
        enableGpu3D: !prefersReducedMotion,
        paymentMode: 'QR_DESKTOP_PANEL',
        osAttr: 'macos',
        label: 'macOS Desktop (Frosted Glass + QR Panel)',
      };
    case 'ios-desktop-override':
      return {
        platform: active,
        isTouchDevice: true,
        hasFinePointer: false,
        prefersReducedMotion,
        isDesktopViewport: true,
        enableGpu3D: false,
        paymentMode: 'QR_MOBILE_SAVE_SCAN',
        osAttr: 'macos',
        label: 'iOS → macOS Desktop View (Touch Safe)',
      };
    case 'android-desktop-override':
      return {
        platform: active,
        isTouchDevice: true,
        hasFinePointer: false,
        prefersReducedMotion,
        isDesktopViewport: true,
        enableGpu3D: false,
        paymentMode: 'QR_MOBILE_SAVE_SCAN',
        osAttr: 'windows',
        label: 'Android → Windows Desktop View (Touch Safe)',
      };
    case 'ios-mobile':
      return {
        platform: active,
        isTouchDevice: true,
        hasFinePointer: false,
        prefersReducedMotion,
        isDesktopViewport: false,
        enableGpu3D: false,
        paymentMode: 'QR_MOBILE_SAVE_SCAN',
        osAttr: 'ios',
        label: 'iPhone iOS (60fps Touch + Save/Scan QR)',
      };
    case 'android-mobile':
      return {
        platform: active,
        isTouchDevice: true,
        hasFinePointer: false,
        prefersReducedMotion,
        isDesktopViewport: false,
        enableGpu3D: false,
        paymentMode: 'QR_MOBILE_SAVE_SCAN',
        osAttr: 'android',
        label: 'Android Mobile (60fps Touch + Save/Scan QR)',
      };
    case 'windows-desktop':
    default:
      return {
        platform: 'windows-desktop',
        isTouchDevice: false,
        hasFinePointer,
        prefersReducedMotion,
        isDesktopViewport: true,
        enableGpu3D: !prefersReducedMotion,
        paymentMode: 'QR_DESKTOP_PANEL',
        osAttr: 'windows',
        label: 'Windows Desktop (Fluent + QR Panel)',
      };
  }
}