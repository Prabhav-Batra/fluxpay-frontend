"use client";

import { Download } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useSubscriptions } from "@/lib/api/hooks";

export default function SubscriptionsPage() {
  const { data = [], isLoading } = useSubscriptions();

  return (
    <div className="flex flex-col gap-6 p-2 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Subscriptions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage recurring billing for your customers.
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
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
