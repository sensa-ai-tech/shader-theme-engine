'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEditorContext } from '@/hooks/useThemeEditor';
import { validateThemeConfig } from '@shader-theme/core';

export function ImportDialog() {
  const { dispatch } = useEditorContext();
  const [open, setOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = useCallback(() => {
    setErrors([]);
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setErrors(['Invalid JSON syntax']);
      return;
    }

    const result = validateThemeConfig(parsed);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    dispatch({ type: 'IMPORT_JSON', payload: result.data });
    setJsonText('');
    setOpen(false);
  }, [jsonText, dispatch]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setJsonText(reader.result);
          setErrors([]);
        }
      };
      reader.readAsText(file);
    },
    [],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          <Upload className="h-3.5 w-3.5 mr-1" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Theme JSON</DialogTitle>
        </DialogHeader>
        <Textarea
          value={jsonText}
          onChange={(e) => { setJsonText(e.target.value); setErrors([]); }}
          placeholder="Paste your ThemeConfig JSON here..."
          className="font-mono text-xs min-h-[300px] resize-none"
        />
        {errors.length > 0 && (
          <div className="rounded border border-destructive/50 bg-destructive/10 p-3 space-y-1">
            {errors.map((err, i) => (
              <p key={i} className="text-xs text-destructive">{err}</p>
            ))}
          </div>
        )}
        <div className="flex gap-2 justify-end">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            Upload .json
          </Button>
          <Button size="sm" onClick={handleImport} disabled={!jsonText.trim()}>
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
