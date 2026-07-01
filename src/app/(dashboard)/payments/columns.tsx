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

export type Payment = {
  id: string;
  amount: number;
  status: "succeeded" | "pending" | "failed" | "refunded";
  customerEmail: string;
  method: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "Payment ID",
    cell: ({ row }) => {
      return <div className="font-mono text-xs text-muted-foreground">{row.getValue("id")}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
 
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className={`capitalize text-xs px-2 py-1 rounded-md inline-flex items-center justify-center font-medium ${
          status === "succeeded" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
          status === "pending" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
          status === "failed" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
          "bg-muted text-muted-foreground"
        }`}>
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "customerEmail",
    header: "Customer",
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue("customerEmail")}</div>;
    },
  },
  {
    accessorKey: "method",
    header: () => <div className="text-right">Method</div>,
    cell: ({ row }) => {
      return <div className="text-right text-sm text-muted-foreground uppercase">{row.getValue("method")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
 
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
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy Payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Refund payment</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
