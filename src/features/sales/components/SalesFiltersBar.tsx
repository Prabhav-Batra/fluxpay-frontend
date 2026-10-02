'use client';

import { Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ProductOption } from '@/lib/api/productOptions';

import type { SalesFilters } from '../api/salesApi';
import { SALE_STATUS_LABEL } from './saleLabels';

interface SalesFiltersBarProps {
  filters: SalesFilters;
  products: ProductOption[];
  onChange: (filters: SalesFilters) => void;
}

/** Status and product selects plus a customer-ref search box. */
export function SalesFiltersBar({ filters, products, onChange }: SalesFiltersBarProps) {
  const [ref, setRef] = useState(filters.customerRef);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onChange({ ...filters, customerRef: ref });
  };

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <Select
        value={filters.status}
        onValueChange={(status) => onChange({ ...filters, status: status as SalesFilters['status'] })}
      >
        <SelectTrigger className="w-44" aria-label="Status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {Object.entries(SALE_STATUS_LABEL).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.productId} onValueChange={(productId) => onChange({ ...filters, productId })}>
        <SelectTrigger className="w-48" aria-label="Product">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All products</SelectItem>
          {products.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <form onSubmit={submit} role="search" className="flex gap-2">
        <Input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="Customer ref"
          aria-label="Search by customer ref"
          className="w-48"
        />
        <Button type="submit" variant="outline" size="icon" aria-label="Search">
          <Search />
        </Button>
      </form>
    </div>
  );
}
