'use client';

import { Plus, X } from 'lucide-react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import type { ProductValues } from '../schemas/productSchema';

/** Editable key/value rows for product metadata (e.g. `coins = 100`). */
export function MetadataFields({ form }: { form: UseFormReturn<ProductValues> }) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'metadata' });
  const errors = form.formState.errors.metadata;

  return (
    <fieldset className="grid gap-2">
      <legend className="mb-1 text-sm font-medium">Metadata</legend>
      <p className="text-muted-foreground text-xs">
        Sent back in webhooks, e.g. <code>coins</code> = <code>100</code>.
      </p>
      {fields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] items-start gap-2">
          <div className="grid gap-1">
            <Label htmlFor={`metadata-${index}-key`} className="sr-only">Key {index + 1}</Label>
            <Input
              id={`metadata-${index}-key`}
              placeholder="key"
              aria-invalid={!!errors?.[index]?.key}
              {...form.register(`metadata.${index}.key`)}
            />
            {errors?.[index]?.key && (
              <p className="text-destructive text-xs">{errors[index]?.key?.message}</p>
            )}
          </div>
          <div className="grid gap-1">
            <Label htmlFor={`metadata-${index}-value`} className="sr-only">Value {index + 1}</Label>
            <Input
              id={`metadata-${index}-value`}
              placeholder="value"
              {...form.register(`metadata.${index}.value`)}
            />
            {errors?.[index]?.value && (
              <p className="text-destructive text-xs">{errors[index]?.value?.message}</p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
            aria-label={`Remove metadata row ${index + 1}`}
          >
            <X />
          </Button>
        </div>
      ))}
      {errors?.root?.message && <p className="text-destructive text-xs">{errors.root.message}</p>}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="justify-self-start"
        onClick={() => append({ key: '', value: '' })}
        disabled={fields.length >= 20}
      >
        <Plus /> Add metadata
      </Button>
    </fieldset>
  );
}
