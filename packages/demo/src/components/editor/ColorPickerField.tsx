'use client';

import { useState, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ColorPickerFieldProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}

export function ColorPickerField({ label, value, onChange }: ColorPickerFieldProps) {
  const [open, setOpen] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (/^#[0-9a-fA-F]{6}$/.test(v)) {
        onChange(v);
      }
    },
    [onChange],
  );

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              className="h-8 w-8 rounded border border-border shrink-0 cursor-pointer"
              style={{ backgroundColor: value }}
              aria-label={`Pick color for ${label}`}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="start">
            <HexColorPicker color={value} onChange={onChange} />
          </PopoverContent>
        </Popover>
        <Input
          value={value}
          onChange={handleInputChange}
          maxLength={7}
          className="h-8 text-xs font-mono"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
