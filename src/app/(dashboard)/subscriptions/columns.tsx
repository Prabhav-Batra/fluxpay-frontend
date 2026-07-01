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

export type Subscription = {
  id: string;
  customer: string;
  email: string;
  status: "active" | "past_due" | "canceled";
  plan: string;
  amount: number;
};

export const columns: ColumnDef<Subscription>[] = [
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.getValue("customer")}</span>
          <span className="text-xs text-muted-foreground">{row.original.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue("plan")}</div>;
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
          status === "past_due" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
          "bg-muted text-muted-foreground"
        }`}>
          {status.replace("_", " ")}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
 
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const subscription = row.original;
 
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
              onClick={() => navigator.clipboard.writeText(subscription.id)}
            >
              Copy subscription ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Cancel subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
