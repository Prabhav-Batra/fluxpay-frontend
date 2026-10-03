'use client';

import { TriangleAlert } from 'lucide-react';

import { CopyButton } from '@/components/CopyButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/** A secret to show exactly once. */
export interface RevealedSecret {
  title: string;
  description: string;
  secret: string;
}

interface SecretRevealDialogProps {
  revealed: RevealedSecret | null;
  onDone: () => void;
}

/** Shows a just-issued secret with copy; closing it discards the secret for good. */
export function SecretRevealDialog({ revealed, onDone }: SecretRevealDialogProps) {
  return (
    <Dialog open={revealed !== null} onOpenChange={(open) => !open && onDone()}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{revealed?.title}</DialogTitle>
          <DialogDescription>{revealed?.description}</DialogDescription>
        </DialogHeader>
        <Alert>
          <TriangleAlert aria-hidden />
          <AlertDescription>
            Copy it now. For your security, FluxPay will not show it again.
          </AlertDescription>
        </Alert>
        <div className="bg-muted flex items-center gap-2 rounded-md p-3">
          <code className="flex-1 font-mono text-sm break-all">{revealed?.secret}</code>
          {revealed && <CopyButton value={revealed.secret} label="Copy secret" />}
        </div>
        <DialogFooter>
          <Button onClick={onDone}>I&apos;ve saved it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
