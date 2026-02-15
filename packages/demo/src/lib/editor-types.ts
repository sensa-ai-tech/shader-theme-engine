import type {
  ThemeConfig,
  ThemeColors,
  ThemePerformance,
  SectionConfig,
  SectionFallback,
  ShaderType,
  Vec3,
} from '@shader-theme/core';

// ─── Editor State ────────────────────────────────────────────────────

export interface EditorState {
  theme: ThemeConfig;
  selectedSection: string | null;
  isDirty: boolean;
  presetName: string | null;
}

// ─── Editor Actions ──────────────────────────────────────────────────

export type EditorAction =
  | { type: 'LOAD_PRESET'; payload: { name: string; config: ThemeConfig } }
  | { type: 'IMPORT_JSON'; payload: ThemeConfig }
  | { type: 'SET_META'; payload: Partial<Pick<ThemeConfig, 'name' | 'version' | 'description'>> }
  | { type: 'SET_COLOR'; payload: { key: keyof ThemeColors; value: string } }
  | { type: 'SET_PERFORMANCE'; payload: Partial<ThemePerformance> }
  | { type: 'SET_SECTION_SHADER'; payload: { section: string; shader: ShaderType } }
  | { type: 'SET_SECTION_PRIORITY'; payload: { section: string; priority: SectionConfig['priority'] } }
  | { type: 'SET_SECTION_PARAM'; payload: { section: string; key: string; value: number | boolean | Vec3 } }
  | { type: 'SET_SECTION_FALLBACK'; payload: { section: string; fallback: SectionFallback } }
  | { type: 'ADD_SECTION'; payload: { name: string } }
  | { type: 'REMOVE_SECTION'; payload: { name: string } }
  | { type: 'SELECT_SECTION'; payload: string | null }
  | { type: 'MARK_CLEAN' };

// ─── Editor Context ──────────────────────────────────────────────────

export interface EditorContextValue {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

// ─── Re-exports for convenience ──────────────────────────────────────

export type {
  ThemeConfig,
  ThemeColors,
  ThemePerformance,
  SectionConfig,
  SectionFallback,
  ShaderType,
  Vec3,
};
