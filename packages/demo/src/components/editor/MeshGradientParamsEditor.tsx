'use client';

import { useCallback } from 'react';
import { SliderField } from './SliderField';
import { ColorPickerField } from './ColorPickerField';
import { useEditorContext } from '@/hooks/useThemeEditor';
import { vec3ToHex } from '@/lib/editor-utils';
import { hexToVec3 } from '@shader-theme/core';
import type { Vec3 } from '@/lib/editor-types';

interface MeshGradientParamsEditorProps {
  section: string;
}

const COLOR_PARAMS: { key: string; label: string }[] = [
  { key: 'color1', label: 'Color 1' },
  { key: 'color2', label: 'Color 2' },
  { key: 'color3', label: 'Color 3' },
];

export function MeshGradientParamsEditor({ section }: MeshGradientParamsEditorProps) {
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
      {COLOR_PARAMS.map(({ key, label }) => (
        <ColorPickerField
          key={key}
          label={label}
          value={vec3ToHex((params[key] as Vec3) ?? [0, 0, 0])}
          onChange={(hex) => setParam(key, hexToVec3(hex))}
        />
      ))}
      <SliderField
        label="Speed"
        value={(params.speed as number) ?? 1.0}
        onChange={(v) => setParam('speed', v)}
        min={0} max={5} step={0.1}
      />
      <SliderField
        label="Distortion"
        value={(params.distortion as number) ?? 1.2}
        onChange={(v) => setParam('distortion', v)}
        min={0} max={5} step={0.1}
      />
      <SliderField
        label="Seed"
        value={(params.seed as number) ?? 0}
        onChange={(v) => setParam('seed', Math.round(v))}
        min={0} max={100} step={1}
      />
    </div>
  );
}
