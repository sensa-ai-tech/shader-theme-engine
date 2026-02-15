'use client';

import { useCallback } from 'react';
import { ColorPickerField } from './ColorPickerField';
import { useEditorContext } from '@/hooks/useThemeEditor';
import type { ThemeColors } from '@/lib/editor-types';

const COLOR_FIELDS: { key: keyof ThemeColors; label: string }[] = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'accent', label: 'Accent' },
  { key: 'background', label: 'Background' },
  { key: 'foreground', label: 'Foreground' },
];

export function ColorsEditor() {
  const { state, dispatch } = useEditorContext();
  const { colors } = state.theme;

  const handleChange = useCallback(
    (key: keyof ThemeColors) => (value: string) => {
      dispatch({ type: 'SET_COLOR', payload: { key, value } });
    },
    [dispatch],
  );

  return (
    <div className="space-y-3">
      {COLOR_FIELDS.map(({ key, label }) => (
        <ColorPickerField
          key={key}
          label={label}
          value={colors[key]}
          onChange={handleChange(key)}
        />
      ))}
    </div>
  );
}
