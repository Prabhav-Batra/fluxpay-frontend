'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

interface CopyButtonProps {
  value: string;
  label: string;
}

/** Icon button that copies `value` to the clipboard and briefly shows a tick. */
export function CopyButton({ value, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Button type="button" variant="ghost" size="icon" onClick={copy} aria-label={label}>
      {copied ? <Check className="text-emerald-600" /> : <Copy />}
    </Button>
  );
}
