"use client";

import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useProducts } from "@/lib/api/hooks";

import { CreateSubscriptionDialog } from "@/components/dialogs/create-subscription-dialog";
import { CreateCreditPackDialog } from "@/components/dialogs/create-credit-pack-dialog";
import { CreateOneTimeDialog } from "@/components/dialogs/create-one-time-dialog";
import { useState } from "react";

export default function ProductsPage() {
  const { data = [], isLoading } = useProducts();
  const [isSubscriptionOpen, setSubscriptionOpen] = useState(false);
  const [isCreditPackOpen, setCreditPackOpen] = useState(false);
  const [isOneTimeOpen, setOneTimeOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-2 md:p-6">
      <CreateSubscriptionDialog open={isSubscriptionOpen} onOpenChange={setSubscriptionOpen} />
      <CreateCreditPackDialog open={isCreditPackOpen} onOpenChange={setCreditPackOpen} />
      <CreateOneTimeDialog open={isOneTimeOpen} onOpenChange={setOneTimeOpen} />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your digital and physical products, pricing, and availability.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setSubscriptionOpen(true)} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Subscription
          </Button>
          <Button onClick={() => setCreditPackOpen(true)} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Credit Pack
          </Button>
          <Button onClick={() => setOneTimeOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            One-Time Product
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="w-full h-48 border rounded-md flex items-center justify-center bg-card">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
}
