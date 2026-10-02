'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { applyApiErrors } from '@/lib/forms/applyApiErrors';
import { formatPaise } from '@/lib/money';

import type { ProductOption } from '../api/paymentLinksApi';
import { useCreatePaymentLink } from '../hooks/usePaymentLinks';
import {
  paymentLinkSchema,
  toPaymentLinkBody,
  type PaymentLinkValues,
} from '../schemas/paymentLinkSchema';

const FIELDS = ['product_id', 'success_url', 'cancel_url'] as const;

interface PaymentLinkFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: ProductOption[];
  defaultProductId?: string;
}

/** Creates a payment link for an active product with optional redirect URLs. */
export function PaymentLinkFormDialog({
  open,
  onOpenChange,
  products,
  defaultProductId = '',
}: PaymentLinkFormDialogProps) {
  const defaults = { product_id: defaultProductId, success_url: '', cancel_url: '' };
  const form = useForm<PaymentLinkValues>({
    resolver: zodResolver(paymentLinkSchema),
    defaultValues: defaults,
  });
  const create = useCreatePaymentLink();
  const { errors, isSubmitting } = form.formState;
  const activeProducts = products.filter((p) => p.active);

  useEffect(() => {
    if (open) form.reset({ product_id: defaultProductId, success_url: '', cancel_url: '' });
  }, [open, defaultProductId, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await create.mutateAsync(toPaymentLinkBody(values));
      toast.success('Payment link created');
      onOpenChange(false);
    } catch (error) {
      applyApiErrors(error, form.setError, FIELDS);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New payment link</DialogTitle>
          <DialogDescription>Share one URL; each visit opens a fresh checkout.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} noValidate className="grid gap-4">
          <FormError message={errors.root?.message} />
          <FormField id="link-product" label="Product" error={errors.product_id?.message}>
            <Controller
              control={form.control}
              name="product_id"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="link-product" className="w-full" aria-invalid={!!errors.product_id}>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeProducts.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} · {formatPaise(p.amount)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
          <FormField
            id="link-success"
            label="Success URL"
            hint="Optional. Where customers go after paying."
            error={errors.success_url?.message}
          >
            <Input id="link-success" type="url" {...form.register('success_url')} />
          </FormField>
          <FormField
            id="link-cancel"
            label="Cancel URL"
            hint="Optional. Where customers go if they cancel."
            error={errors.cancel_url?.message}
          >
            <Input id="link-cancel" type="url" {...form.register('cancel_url')} />
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Create link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
