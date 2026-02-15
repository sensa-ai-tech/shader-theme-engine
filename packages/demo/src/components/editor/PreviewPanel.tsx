'use client';

import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import { useEditorContext } from '@/hooks/useThemeEditor';

const ThemeSection = dynamic(
  () => import('@shader-theme/core').then((m) => m.ThemeSection),
  { ssr: false },
);

const SECTION_HEIGHT: Record<string, string> = {
  hero: '400px',
  features: '300px',
  cta: '250px',
  footer: '200px',
};

const DEFAULT_SECTION_HEIGHT = '250px';

export function PreviewPanel() {
  const { state, dispatch } = useEditorContext();
  const { theme, selectedSection } = state;
  const sectionNames = Object.keys(theme.sections);

  const handleSectionClick = useCallback(
    (name: string) => dispatch({ type: 'SELECT_SECTION', payload: name }),
    [dispatch],
  );

  if (sectionNames.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        No sections yet. Add one from the sidebar.
      </div>
    );
  }

  return (
    <div
      className="overflow-y-auto h-full"
      style={{ backgroundColor: theme.colors.background, color: theme.colors.foreground }}
    >
      {sectionNames.map((name) => {
        const config = theme.sections[name];
        const isSelected = selectedSection === name;
        const height = SECTION_HEIGHT[name] ?? DEFAULT_SECTION_HEIGHT;

        return (
          <div
            key={name}
            className="relative cursor-pointer transition-all"
            style={{
              height,
              outline: isSelected ? `2px solid ${theme.colors.primary}` : 'none',
              outlineOffset: '-2px',
            }}
            onClick={() => handleSectionClick(name)}
          >
            <ThemeSection config={config} style={{ height: '100%' }}>
              <div className="relative z-10 flex items-center justify-center h-full">
                <span
                  className="text-xs font-mono px-2 py-1 rounded"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                  }}
                >
                  {name}
                </span>
              </div>
            </ThemeSection>
          </div>
        );
      })}
    </div>
  );
}
