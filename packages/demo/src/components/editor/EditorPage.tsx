'use client';

import { useThemeEditor, EditorContext } from '@/hooks/useThemeEditor';
import { SidebarPanel } from './SidebarPanel';
import { PreviewPanel } from './PreviewPanel';
import { PresetPicker } from './PresetPicker';
import { ExportPanel } from './ExportPanel';
import { ImportDialog } from './ImportDialog';
import { Badge } from '@/components/ui/badge';

export function EditorPage() {
  const { state, dispatch } = useThemeEditor();

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      <div className="h-screen flex flex-col bg-background text-foreground">
        {/* Header */}
        <header className="shrink-0 border-b px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold whitespace-nowrap">
              ShaderTheme Editor
            </h1>
            {state.isDirty && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                Unsaved
              </Badge>
            )}
          </div>
          <PresetPicker />
          <div className="flex items-center gap-2">
            <ImportDialog />
            <ExportPanel />
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <aside className="w-[380px] shrink-0 border-r overflow-hidden">
            <SidebarPanel />
          </aside>

          {/* Preview */}
          <main className="flex-1 overflow-hidden">
            <PreviewPanel />
          </main>
        </div>
      </div>
    </EditorContext.Provider>
  );
}
