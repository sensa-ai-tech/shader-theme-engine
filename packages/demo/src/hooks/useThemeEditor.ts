'use client';

import { useReducer, createContext, useContext } from 'react';
import type { EditorState, EditorAction, EditorContextValue } from '@/lib/editor-types';
import { deepClone, defaultParamsForShader, defaultSectionConfig } from '@/lib/editor-utils';
import { nebulaTech } from '@shader-theme/core';

// ─── Reducer ─────────────────────────────────────────────────────────

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'LOAD_PRESET':
      return {
        theme: deepClone(action.payload.config),
        selectedSection: null,
        isDirty: false,
        presetName: action.payload.name,
      };

    case 'IMPORT_JSON':
      return {
        theme: deepClone(action.payload),
        selectedSection: null,
        isDirty: false,
        presetName: null,
      };

    case 'SET_META':
      return {
        ...state,
        isDirty: true,
        theme: { ...state.theme, ...action.payload },
      };

    case 'SET_COLOR':
      return {
        ...state,
        isDirty: true,
        theme: {
          ...state.theme,
          colors: { ...state.theme.colors, [action.payload.key]: action.payload.value },
        },
      };

    case 'SET_PERFORMANCE':
      return {
        ...state,
        isDirty: true,
        theme: {
          ...state.theme,
          performance: { ...state.theme.performance, ...action.payload },
        },
      };

    case 'SET_SECTION_SHADER': {
      const { section, shader } = action.payload;
      const existing = state.theme.sections[section];
      if (!existing) return state;
      // Reset params when shader type changes
      const params = existing.shader === shader
        ? existing.params
        : defaultParamsForShader(shader);
      return {
        ...state,
        isDirty: true,
        theme: {
          ...state.theme,
          sections: {
            ...state.theme.sections,
            [section]: { ...existing, shader, params },
          },
        },
      };
    }

    case 'SET_SECTION_PRIORITY': {
      const { section, priority } = action.payload;
      const existing = state.theme.sections[section];
      if (!existing) return state;
      return {
        ...state,
        isDirty: true,
        theme: {
          ...state.theme,
          sections: {
            ...state.theme.sections,
            [section]: { ...existing, priority },
          },
        },
      };
    }

    case 'SET_SECTION_PARAM': {
      const { section, key, value } = action.payload;
      const existing = state.theme.sections[section];
      if (!existing) return state;
      return {
        ...state,
        isDirty: true,
        theme: {
          ...state.theme,
          sections: {
            ...state.theme.sections,
            [section]: {
              ...existing,
              params: { ...existing.params, [key]: value },
            },
          },
        },
      };
    }

    case 'SET_SECTION_FALLBACK': {
      const { section, fallback } = action.payload;
      const existing = state.theme.sections[section];
      if (!existing) return state;
      return {
        ...state,
        isDirty: true,
        theme: {
          ...state.theme,
          sections: {
            ...state.theme.sections,
            [section]: { ...existing, fallback },
          },
        },
      };
    }

    case 'ADD_SECTION': {
      const { name } = action.payload;
      if (state.theme.sections[name]) return state;
      return {
        ...state,
        isDirty: true,
        selectedSection: name,
        theme: {
          ...state.theme,
          sections: {
            ...state.theme.sections,
            [name]: defaultSectionConfig(),
          },
        },
      };
    }

    case 'REMOVE_SECTION': {
      const { name } = action.payload;
      const { [name]: _removed, ...rest } = state.theme.sections;
      return {
        ...state,
        isDirty: true,
        selectedSection: state.selectedSection === name ? null : state.selectedSection,
        theme: { ...state.theme, sections: rest },
      };
    }

    case 'SELECT_SECTION':
      return { ...state, selectedSection: action.payload };

    case 'MARK_CLEAN':
      return { ...state, isDirty: false };

    default:
      return state;
  }
}

// ─── Initial State ───────────────────────────────────────────────────

function createInitialState(): EditorState {
  return {
    theme: deepClone(nebulaTech),
    selectedSection: null,
    isDirty: false,
    presetName: 'nebula-tech',
  };
}

// ─── Hook ────────────────────────────────────────────────────────────

export function useThemeEditor() {
  const [state, dispatch] = useReducer(editorReducer, undefined, createInitialState);
  return { state, dispatch };
}

// ─── Context ─────────────────────────────────────────────────────────

export const EditorContext = createContext<EditorContextValue | null>(null);

export function useEditorContext(): EditorContextValue {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error('useEditorContext must be used within an EditorContext.Provider');
  }
  return ctx;
}
