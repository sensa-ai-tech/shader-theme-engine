'use client';

import { useState } from 'react';
import {
  nebulaTech,
  softGlow,
  minimalPulse,
  type ThemeConfig,
} from '@shader-theme/core';
import { ThemeSelector } from '../components/ThemeSelector';
import { NebulaTechPage } from '../components/themes/NebulaTechPage';
import { SoftGlowPage } from '../components/themes/SoftGlowPage';
import { MinimalPulsePage } from '../components/themes/MinimalPulsePage';

const THEMES: Record<string, ThemeConfig> = {
  'nebula-tech': nebulaTech,
  'soft-glow': softGlow,
  'minimal-pulse': minimalPulse,
};

const THEME_NAMES = Object.keys(THEMES);

function renderThemePage(name: string, theme: ThemeConfig) {
  switch (name) {
    case 'nebula-tech':
      return <NebulaTechPage theme={theme} />;
    case 'soft-glow':
      return <SoftGlowPage theme={theme} />;
    case 'minimal-pulse':
      return <MinimalPulsePage theme={theme} />;
    default:
      return null;
  }
}

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState('nebula-tech');
  const theme = THEMES[currentTheme];

  return (
    <>
      <ThemeSelector
        themes={THEME_NAMES}
        current={currentTheme}
        onChange={setCurrentTheme}
      />
      {renderThemePage(currentTheme, theme)}
    </>
  );
}
