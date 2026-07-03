"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Invoice = {
  id: string;
  merchantId: string;
  customerEmail: string;
  orderId: string;
  invoiceNumber: string;
  totalAmount: number;
  currency: string;
  status: "DRAFT" | "OPEN" | "PAID" | "VOID" | "UNCOLLECTIBLE";
  createdAt: string;
};

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">{row.getValue("invoiceNumber")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "customerEmail",
    header: "Customer",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("customerEmail")}</div>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      const currency = row.original.currency || "USD";
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
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
          status === "PAID" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
          status === "OPEN" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
          status === "VOID" || status === "DRAFT" ? "bg-muted text-muted-foreground" :
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" // uncollectible
        }`}>
          {status.toLowerCase()}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-right">Issue Date</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div className="text-right text-sm text-muted-foreground">{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;
 
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
            <DropdownMenuItem>Download PDF</DropdownMenuItem>
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Send reminder</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Mark uncollectible</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
