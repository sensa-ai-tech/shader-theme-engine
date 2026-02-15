'use client';

import { useCallback } from 'react';
import { SliderField } from './SliderField';
import { SwitchField } from './SwitchField';
import { ColorPickerField } from './ColorPickerField';
import { useEditorContext } from '@/hooks/useThemeEditor';
import { vec3ToHex } from '@/lib/editor-utils';
import { hexToVec3 } from '@shader-theme/core';
import type { Vec3 } from '@/lib/editor-types';

interface GlowOrbParamsEditorProps {
  section: string;
}

export function GlowOrbParamsEditor({ section }: GlowOrbParamsEditorProps) {
  const { state, dispatch } = useEditorContext();
  const params = state.theme.sections[section]?.params ?? {};

  const setParam = useCallback(
    (key: string, value: number | boolean | Vec3) => {
      dispatch({ type: 'SET_SECTION_PARAM', payload: { section, key, value } });
    },
    [dispatch, section],
  );

  return (
    <div className="space-y-3">
      <ColorPickerField
        label="Glow Color"
        value={vec3ToHex((params.glowColor as Vec3) ?? [0.318, 0, 1])}
        onChange={(hex) => setParam('glowColor', hexToVec3(hex))}
      />
      <SliderField
        label="Intensity"
        value={(params.intensity as number) ?? 0.8}
        onChange={(v) => setParam('intensity', v)}
        min={0} max={3} step={0.05}
      />
      <SliderField
        label="Radius"
        value={(params.radius as number) ?? 300}
        onChange={(v) => setParam('radius', v)}
        min={50} max={1000} step={10}
      />
      <SliderField
        label="Speed"
        value={(params.speed as number) ?? 0.5}
        onChange={(v) => setParam('speed', v)}
        min={0} max={5} step={0.05}
      />
      <SwitchField
        label="Track Mouse"
        checked={(params.trackMouse as boolean) ?? true}
        onCheckedChange={(v) => setParam('trackMouse', v)}
      />
    </div>
  );
}
