'use client';

import { useCallback } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

export function SliderField({ label, value, onChange, min, max, step }: SliderFieldProps) {
  const handleSliderChange = useCallback(
    (vals: number[]) => onChange(vals[0]),
    [onChange],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      if (!isNaN(v)) {
        onChange(Math.max(min, Math.min(max, v)));
      }
    },
    [onChange, min, max],
  );

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <Input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          className="h-6 w-16 text-xs px-1.5 text-right"
        />
      </div>
      <Slider
        value={[value]}
        onValueChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
}
