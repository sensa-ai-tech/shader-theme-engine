'use client';

import { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEditorContext } from '@/hooks/useThemeEditor';

export function ThemeMetaEditor() {
  const { state, dispatch } = useEditorContext();
  const { name, version, description } = state.theme;

  const setName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch({ type: 'SET_META', payload: { name: e.target.value } }),
    [dispatch],
  );

  const setVersion = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch({ type: 'SET_META', payload: { version: e.target.value } }),
    [dispatch],
  );

  const setDescription = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      dispatch({ type: 'SET_META', payload: { description: e.target.value } }),
    [dispatch],
  );

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Name</Label>
        <Input value={name} onChange={setName} className="h-8 text-xs" placeholder="my-theme" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Version</Label>
        <Input value={version} onChange={setVersion} className="h-8 text-xs" placeholder="1.0.0" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Description</Label>
        <Textarea
          value={description}
          onChange={setDescription}
          className="text-xs min-h-[60px] resize-none"
          placeholder="A beautiful shader theme..."
        />
      </div>
    </div>
  );
}
