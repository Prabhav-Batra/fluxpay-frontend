"use client";

import { Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useApiKeys } from "@/lib/api/hooks";

export default function ApiKeysPage() {
  const { data = [], isLoading } = useApiKeys();

  return (
    <div className="flex flex-col gap-6 p-2 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">API Keys</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your secret and public API keys to authenticate requests.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create secret key
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
