'use client';

import { useState, useCallback, useMemo } from 'react';
import { Copy, Download, Check } from 'lucide-react';
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

export function ExportPanel() {
  const { state } = useEditorContext();
  const [copied, setCopied] = useState(false);

  const json = useMemo(
    () => JSON.stringify(state.theme, null, 2),
    [state.theme],
  );

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [json]);

  const downloadJson = useCallback(() => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.theme.name || 'theme'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [json, state.theme.name]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs">
          <Download className="h-3.5 w-3.5 mr-1" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Theme JSON</DialogTitle>
        </DialogHeader>
        <Textarea
          value={json}
          readOnly
          className="font-mono text-xs min-h-[400px] resize-none"
        />
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button size="sm" onClick={downloadJson}>
            <Download className="h-3.5 w-3.5 mr-1" />
            Download .json
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
