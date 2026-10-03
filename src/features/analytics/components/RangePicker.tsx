'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { addDays, isoDay } from '@/lib/dates';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type DateRange = {
  from: string;
  to: string;
  label: string;
};

interface RangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export function RangePicker({ value, onChange }: RangePickerProps) {
  const [open, setOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState(value.from);
  const [customTo, setCustomTo] = useState(value.to);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { label: 'Today', getRange: () => ({ from: isoDay(new Date()), to: isoDay(new Date()) }) },
    { label: '7d', getRange: () => ({ from: isoDay(addDays(new Date(), -6)), to: isoDay(new Date()) }) },
    { label: '30d', getRange: () => ({ from: isoDay(addDays(new Date(), -29)), to: isoDay(new Date()) }) },
  ];

  const handleApplyCustom = () => {
    if (customFrom > customTo) {
      setError('Start date must be before or equal to end date');
      return;
    }
    
    const fromDate = new Date(customFrom);
    const toDate = new Date(customTo);
    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays > 366) {
      setError('Date range cannot exceed 366 days');
      return;
    }

    setError(null);
    onChange({ from: customFrom, to: customTo, label: 'Custom' });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
          {value.label === 'Custom' 
            ? `${value.from} — ${value.to}` 
            : `${value.label} (${value.from} — ${value.to})`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {presets.map(preset => (
              <Button
                key={preset.label}
                variant={value.label === preset.label ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  const range = preset.getRange();
                  onChange({ ...range, label: preset.label });
                  setCustomFrom(range.from);
                  setCustomTo(range.to);
                  setOpen(false);
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          <div className="grid gap-2 border-t pt-4">
            <h4 className="font-medium text-sm">Custom range</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1.5">
                <Label htmlFor="custom-from">From</Label>
                <Input 
                  id="custom-from" 
                  type="date" 
                  value={customFrom} 
                  onChange={(e) => setCustomFrom(e.target.value)} 
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="custom-to">To</Label>
                <Input 
                  id="custom-to" 
                  type="date" 
                  value={customTo} 
                  onChange={(e) => setCustomTo(e.target.value)} 
                />
              </div>
            </div>
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
            <Button size="sm" onClick={handleApplyCustom} className="mt-2">
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
