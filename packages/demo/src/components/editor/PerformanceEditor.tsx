'use client';

import { useCallback } from 'react';
import { SliderField } from './SliderField';
import { SelectField } from './SelectField';
import { useEditorContext } from '@/hooks/useThemeEditor';

const MOBILE_OPTIONS = [
  { value: 'simplify', label: 'Simplify' },
  { value: 'css-only', label: 'CSS Only' },
  { value: 'disable', label: 'Disable' },
];

export function PerformanceEditor() {
  const { state, dispatch } = useEditorContext();
  const { maxShaderInstances, mobileStrategy } = state.theme.performance;

  const setMaxShaders = useCallback(
    (value: number) =>
      dispatch({ type: 'SET_PERFORMANCE', payload: { maxShaderInstances: Math.round(value) } }),
    [dispatch],
  );

  const setMobileStrategy = useCallback(
    (value: string) =>
      dispatch({
        type: 'SET_PERFORMANCE',
        payload: { mobileStrategy: value as 'simplify' | 'css-only' | 'disable' },
      }),
    [dispatch],
  );

  return (
    <div className="space-y-3">
      <SliderField
        label="Max Shader Instances"
        value={maxShaderInstances}
        onChange={setMaxShaders}
        min={0}
        max={8}
        step={1}
      />
      <SelectField
        label="Mobile Strategy"
        value={mobileStrategy}
        onChange={setMobileStrategy}
        options={MOBILE_OPTIONS}
      />
    </div>
  );
}
