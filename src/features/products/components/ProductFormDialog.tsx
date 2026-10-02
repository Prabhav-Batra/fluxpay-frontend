'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import { applyApiErrors } from '@/lib/forms/applyApiErrors';

import type { Product } from '../api/productsApi';
import { useCreateProduct, useUpdateProduct } from '../hooks/useProducts';
import {
  emptyProductValues,
  productChanges,
  productSchema,
  toCreateBody,
  valuesFromProduct,
  type ProductValues,
} from '../schemas/productSchema';
import { MetadataFields } from './MetadataFields';

const FIELDS = ['name', 'description', 'image_url', 'metadata'] as const;

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Product to edit; omit to create a new one. */
  product?: Product;
}

/** Create or edit a product. Price is typed in rupees and sent as paise. */
export function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const form = useForm<ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? valuesFromProduct(product) : emptyProductValues,
  });
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const { errors, isSubmitting } = form.formState;

  useEffect(() => {
    if (open) form.reset(product ? valuesFromProduct(product) : emptyProductValues);
  }, [open, product, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (product) {
        const body = productChanges(product, values);
        if (Object.keys(body).length > 0) await update.mutateAsync({ id: product.id, body });
      } else {
        await create.mutateAsync(toCreateBody(values));
      }
      toast.success(product ? 'Product updated' : 'Product created');
      onOpenChange(false);
    } catch (error) {
      applyApiErrors(error, form.setError, FIELDS);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit product' : 'New product'}</DialogTitle>
          <DialogDescription>
            A one-time item customers pay for, such as a coin pack.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} noValidate className="grid gap-4">
          <FormError message={errors.root?.message} />
          <FormField id="product-name" label="Name" error={errors.name?.message}>
            <Input id="product-name" aria-invalid={!!errors.name} {...form.register('name')} />
          </FormField>
          <FormField id="product-price" label="Price (₹)" error={errors.price?.message}>
            <Input
              id="product-price"
              inputMode="decimal"
              placeholder="499.00"
              aria-invalid={!!errors.price}
              {...form.register('price')}
            />
          </FormField>
          <FormField id="product-description" label="Description" error={errors.description?.message}>
            <Textarea id="product-description" rows={3} {...form.register('description')} />
          </FormField>
          <FormField
            id="product-image"
            label="Image URL"
            hint="Optional https:// link shown on the checkout page"
            error={errors.image_url?.message}
          >
            <Input
              id="product-image"
              type="url"
              aria-invalid={!!errors.image_url}
              {...form.register('image_url')}
            />
          </FormField>
          <MetadataFields form={form} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {product ? 'Save changes' : 'Create product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
