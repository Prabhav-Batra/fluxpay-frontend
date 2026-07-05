"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ApiKey = {
  id: string;
  mode: string;
  keyPrefix: string;
  createdAt: string;
  active: boolean;
};

export const columns: ColumnDef<ApiKey>[] = [
  {
    accessorKey: "mode",
    header: "Mode",
    cell: ({ row }) => {
      const mode = row.getValue("mode") as string;
      return <div className="font-medium">{mode === "LIVE" ? "Live Key" : "Test Key"}</div>;
    },
  },
  {
    accessorKey: "keyPrefix",
    header: "Token Prefix",
    cell: ({ row }) => {
      return <div className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded w-fit">{row.getValue("keyPrefix")}***</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return <div className="text-sm text-muted-foreground">{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("active") as boolean;
      return (
        <div className="capitalize text-xs px-2 py-1 bg-muted rounded-md inline-flex items-center justify-center font-medium">
          {isActive ? "Active" : "Revoked"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const keyId = row.original.id;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          } />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup><DropdownMenuLabel>Actions</DropdownMenuLabel></DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(keyId)}>
              Copy Key ID
            </DropdownMenuItem>
            <DropdownMenuItem>Roll key</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Revoke key</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
