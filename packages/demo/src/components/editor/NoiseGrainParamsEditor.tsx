'use client';

import { useCallback } from 'react';
import { SliderField } from './SliderField';
import { ColorPickerField } from './ColorPickerField';
import { useEditorContext } from '@/hooks/useThemeEditor';
import { vec3ToHex } from '@/lib/editor-utils';
import { hexToVec3 } from '@shader-theme/core';
import type { Vec3 } from '@/lib/editor-types';

interface NoiseGrainParamsEditorProps {
  section: string;
}

export function NoiseGrainParamsEditor({ section }: NoiseGrainParamsEditorProps) {
  const { state, dispatch } = useEditorContext();
  const params = state.theme.sections[section]?.params ?? {};

  const setParam = useCallback(
    (key: string, value: number | Vec3) => {
      dispatch({ type: 'SET_SECTION_PARAM', payload: { section, key, value } });
    },
    [dispatch, section],
  );

  return (
    <div className="space-y-3">
      <ColorPickerField
        label="Color"
        value={vec3ToHex((params.color as Vec3) ?? [1, 1, 1])}
        onChange={(hex) => setParam('color', hexToVec3(hex))}
      />
      <SliderField
        label="Density"
        value={(params.density as number) ?? 0.05}
        onChange={(v) => setParam('density', v)}
        min={0} max={1} step={0.01}
      />
      <SliderField
        label="Speed"
        value={(params.speed as number) ?? 0}
        onChange={(v) => setParam('speed', v)}
        min={0} max={5} step={0.1}
      />
      <SliderField
        label="Opacity"
        value={(params.opacity as number) ?? 0.15}
        onChange={(v) => setParam('opacity', v)}
        min={0} max={1} step={0.01}
      />
    </div>
  );
}
