'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { FormError } from '@/components/FormError';
import { FormField } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { applyApiErrors } from '@/lib/forms/applyApiErrors';

import type { Merchant } from '../api/settingsApi';
import { useUpdateMerchant } from '../hooks/useUpdateMerchant';
import { updateSettingsSchema, type UpdateSettingsInput } from '../schemas/settingsSchema';

interface SettingsFormProps {
  merchant: Merchant;
}

export function SettingsForm({ merchant }: SettingsFormProps) {
  const form = useForm<UpdateSettingsInput>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      business_name: merchant.business_name,
      logo_url: merchant.logo_url ?? '',
      brand_color: merchant.brand_color ?? '',
    },
  });

  const updateMerchantMutation = useUpdateMerchant();
  const { errors, isSubmitting, isDirty, dirtyFields } = form.formState;

  useEffect(() => {
    form.reset({
      business_name: merchant.business_name,
      logo_url: merchant.logo_url ?? '',
      brand_color: merchant.brand_color ?? '',
    });
  }, [merchant, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const payload: Partial<UpdateSettingsInput> = {};
      
      if (dirtyFields.business_name) payload.business_name = values.business_name;
      if (dirtyFields.logo_url) payload.logo_url = values.logo_url;
      if (dirtyFields.brand_color) payload.brand_color = values.brand_color;
      
      if (Object.keys(payload).length > 0) {
        await updateMerchantMutation.mutateAsync(payload);
      }
    } catch (error) {
      applyApiErrors(error, form.setError, ['business_name', 'logo_url', 'brand_color']);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 max-w-xl">
      <FormError message={errors.root?.message} />
      
      <div className="grid gap-4">
        <FormField id="business_name" label="Business name" error={errors.business_name?.message}>
          <Input
            id="business_name"
            type="text"
            aria-invalid={!!errors.business_name}
            {...form.register('business_name')}
          />
        </FormField>
        
        <FormField id="logo_url" label="Logo URL" error={errors.logo_url?.message}>
          <Input
            id="logo_url"
            type="url"
            placeholder="https://..."
            aria-invalid={!!errors.logo_url}
            {...form.register('logo_url')}
          />
        </FormField>
        
        <div className="grid gap-2">
          <Label htmlFor="brand_color">Brand colour</Label>
          <div className="flex gap-4 items-center">
            <Input
              id="brand_color"
              type="text"
              placeholder="#FF3366"
              className="w-32"
              aria-invalid={!!errors.brand_color}
              {...form.register('brand_color')}
            />
            <div 
              className="h-10 w-10 rounded-md border" 
              style={{ backgroundColor: form.watch('brand_color') || 'transparent' }}
              aria-hidden="true"
            />
          </div>
          {errors.brand_color && (
            <p className="text-sm font-medium text-destructive">{errors.brand_color.message}</p>
          )}
        </div>
        
        <div className="grid gap-4 mt-4">
          <div className="grid gap-2">
            <Label>Slug</Label>
            <Input value={merchant.slug} readOnly disabled />
            <p className="text-sm text-muted-foreground">The unique identifier for your business.</p>
          </div>
          
          <div className="grid gap-2">
            <Label>Platform fee</Label>
            <Input value={`${merchant.platform_fee_bps / 100}%`} readOnly disabled />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={!isDirty || isSubmitting} className="w-fit">
        {isSubmitting ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  );
}
