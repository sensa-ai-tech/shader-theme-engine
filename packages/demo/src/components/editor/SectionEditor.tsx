'use client';

import { useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SelectField } from './SelectField';
import { SectionParamsEditor } from './SectionParamsEditor';
import { useEditorContext } from '@/hooks/useThemeEditor';
import type { ShaderType } from '@/lib/editor-types';

const SHADER_OPTIONS = [
  { value: 'mesh-gradient', label: 'Mesh Gradient' },
  { value: 'noise-grain', label: 'Noise Grain' },
  { value: 'glow-orb', label: 'Glow Orb' },
  { value: 'none', label: 'None' },
];

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

interface SectionEditorProps {
  section: string;
}

export function SectionEditor({ section }: SectionEditorProps) {
  const { state, dispatch } = useEditorContext();
  const config = state.theme.sections[section];
  if (!config) return null;

  const setShader = useCallback(
    (value: string) =>
      dispatch({ type: 'SET_SECTION_SHADER', payload: { section, shader: value as ShaderType } }),
    [dispatch, section],
  );

  const setPriority = useCallback(
    (value: string) =>
      dispatch({
        type: 'SET_SECTION_PRIORITY',
        payload: { section, priority: value as 'high' | 'medium' | 'low' },
      }),
    [dispatch, section],
  );

  const removeSection = useCallback(
    () => dispatch({ type: 'REMOVE_SECTION', payload: { name: section } }),
    [dispatch, section],
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium capitalize">{section}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={removeSection}
          aria-label={`Remove ${section} section`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <SelectField label="Shader" value={config.shader} onChange={setShader} options={SHADER_OPTIONS} />
      <SelectField label="Priority" value={config.priority} onChange={setPriority} options={PRIORITY_OPTIONS} />
      <Separator className="my-2" />
      <SectionParamsEditor section={section} shader={config.shader} />
    </div>
  );
}
