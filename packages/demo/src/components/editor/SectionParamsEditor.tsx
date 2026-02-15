'use client';

import type { ShaderType } from '@/lib/editor-types';
import { MeshGradientParamsEditor } from './MeshGradientParamsEditor';
import { NoiseGrainParamsEditor } from './NoiseGrainParamsEditor';
import { GlowOrbParamsEditor } from './GlowOrbParamsEditor';

interface SectionParamsEditorProps {
  section: string;
  shader: ShaderType;
}

export function SectionParamsEditor({ section, shader }: SectionParamsEditorProps) {
  switch (shader) {
    case 'mesh-gradient':
      return <MeshGradientParamsEditor section={section} />;
    case 'noise-grain':
      return <NoiseGrainParamsEditor section={section} />;
    case 'glow-orb':
      return <GlowOrbParamsEditor section={section} />;
    case 'none':
      return (
        <p className="text-xs text-muted-foreground italic">
          No shader — this section uses CSS fallback only.
        </p>
      );
  }
}
