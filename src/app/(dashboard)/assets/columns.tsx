"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type Asset = {
  id: string;
  name: string;
  internalKey: string;
  assetType: string;
  defaultValue?: string;
  maxValue?: string;
  displayIcon?: string;
  displayColor?: string;
  metadata?: Record<string, unknown>;
  active: boolean;
  createdAt: string;
};

export const columns: ColumnDef<Asset>[] = [
  {
    accessorKey: "name",
    header: "Asset Name",
  },
  {
    accessorKey: "internalKey",
    header: "Internal Key",
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-mono">
        {row.getValue("internalKey")}
      </Badge>
    ),
  },
  {
    accessorKey: "assetType",
    header: "Type",
  },
  {
    accessorKey: "defaultValue",
    header: "Default Value",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const metadata = row.original.metadata;
      if (metadata?.price && metadata?.currency) {
        const amount = parseFloat(metadata.price as string);
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: metadata.currency as string,
        }).format(amount);
      }
      return <span className="text-muted-foreground">-</span>;
    }
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const active = row.getValue("active") as boolean;
      return (
        <Badge variant={active ? "default" : "secondary"}>
          {active ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
];
