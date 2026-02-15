'use client';

import { useCallback } from 'react';
import { builtInThemes } from '@shader-theme/core';
import { useEditorContext } from '@/hooks/useThemeEditor';

const PRESETS = Object.entries(builtInThemes).map(([name, config]) => ({
  name,
  config,
  emoji: name === 'nebula-tech' ? '🌌' : name === 'soft-glow' ? '🌟' : '🖤',
}));

export function PresetPicker() {
  const { state, dispatch } = useEditorContext();

  const loadPreset = useCallback(
    (name: string) => {
      const config = builtInThemes[name];
      if (config) dispatch({ type: 'LOAD_PRESET', payload: { name, config } });
    },
    [dispatch],
  );

  return (
    <div className="flex gap-1.5">
      {PRESETS.map(({ name, emoji }) => (
        <button
          key={name}
          onClick={() => loadPreset(name)}
          className={`
            px-2.5 py-1 rounded text-xs font-medium transition-colors
            ${state.presetName === name
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }
          `}
          title={name}
        >
          {emoji} {name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
        </button>
      ))}
    </div>
  );
}
