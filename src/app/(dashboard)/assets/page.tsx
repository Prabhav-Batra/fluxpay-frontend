"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { CreateAssetDialog } from "@/components/dialogs/create-asset-dialog";
import { useAssets } from "@/lib/api/hooks";
import { Loader2 } from "lucide-react";

export default function AssetsPage() {
  const { data: assets, isLoading, error } = useAssets();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Digital Assets</h2>
        <div className="flex items-center space-x-2">
          <CreateAssetDialog />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex h-[400px] items-center justify-center">
          <p className="text-destructive">Failed to load assets</p>
        </div>
      ) : (
        <DataTable columns={columns} data={assets || []} />
      )}
    </div>
  );
}
