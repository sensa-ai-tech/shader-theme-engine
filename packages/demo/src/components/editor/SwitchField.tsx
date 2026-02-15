'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface SwitchFieldProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function SwitchField({ label, checked, onCheckedChange }: SwitchFieldProps) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
