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

export type Webhook = {
  id: string;
  url: string;
  status: "active" | "disabled" | "failing";
  events: number;
};

export const columns: ColumnDef<Webhook>[] = [
  {
    accessorKey: "url",
    header: "Endpoint URL",
    cell: ({ row }) => {
      return <div className="font-mono text-sm">{row.getValue("url")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className={`capitalize text-xs px-2 py-1 rounded-md inline-flex items-center justify-center font-medium ${
          status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
          status === "failing" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
          "bg-muted text-muted-foreground"
        }`}>
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "events",
    header: "Events Subscribed",
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue("events")} events</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const webhook = row.original;
 
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(webhook.id)}
            >
              Copy Endpoint ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Update endpoint</DropdownMenuItem>
            <DropdownMenuItem>View recent deliveries</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Delete endpoint</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
