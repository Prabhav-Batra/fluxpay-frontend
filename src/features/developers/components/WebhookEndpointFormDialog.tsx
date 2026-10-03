'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { FormError } from '@/components/FormError';
import { FormField } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { applyApiErrors } from '@/lib/forms/applyApiErrors';

import { webhookEndpointSchema, type WebhookEndpointValues } from '../schemas/webhookEndpointSchema';

interface WebhookEndpointFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Current URL when editing; omit to add a new endpoint. */
  initialUrl?: string;
  onSubmit: (url: string) => Promise<unknown>;
}

/** Add or edit a webhook endpoint URL; server errors show on the field. */
export function WebhookEndpointFormDialog({
  open,
  onOpenChange,
  initialUrl,
  onSubmit,
}: WebhookEndpointFormDialogProps) {
  const form = useForm<WebhookEndpointValues>({
    resolver: zodResolver(webhookEndpointSchema),
    defaultValues: { url: initialUrl ?? '' },
  });
  const { errors, isSubmitting } = form.formState;

  useEffect(() => {
    if (open) form.reset({ url: initialUrl ?? '' });
  }, [open, initialUrl, form]);

  const submit = form.handleSubmit(async ({ url }) => {
    try {
      await onSubmit(url);
      onOpenChange(false);
    } catch (error) {
      applyApiErrors(error, form.setError, ['url']);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialUrl ? 'Edit endpoint' : 'Add endpoint'}</DialogTitle>
          <DialogDescription>
            FluxPay POSTs signed events here. Live mode needs a public https:// URL.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate className="grid gap-4">
          <FormError message={errors.root?.message} />
          <FormField id="endpoint-url" label="Endpoint URL" error={errors.url?.message}>
            <Input
              id="endpoint-url"
              type="url"
              placeholder="https://example.com/webhooks/fluxpay"
              aria-invalid={!!errors.url}
              {...form.register('url')}
            />
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {initialUrl ? 'Save' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
