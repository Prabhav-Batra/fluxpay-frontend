"use client";

import { Download, Filter } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/lib/api/hooks";

export default function OrdersPage() {
  const { data = [], isLoading } = useOrders();

  return (
    <div className="flex flex-col gap-6 p-2 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your recent orders, fulfillments, and cancellations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
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
