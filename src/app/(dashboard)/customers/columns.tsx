"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Customer = {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  joined: string;
};

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const email = row.original.email;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{name}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "joined",
    header: "Joined",
    cell: ({ row }) => {
      return <div className="text-sm text-muted-foreground">{row.getValue("joined")}</div>;
    },
  },
  {
    accessorKey: "totalSpent",
    header: () => <div className="text-right">Total Spent</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalSpent"));
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
      const customer = row.original;
 
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
              onClick={() => navigator.clipboard.writeText(customer.id)}
            >
              Copy Customer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit customer</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Delete customer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
