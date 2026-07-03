"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Coupon = {
  id: string;
  merchantId: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  maxUses?: number;
  timesUsed: number;
  validUntil?: string;
  active: boolean;
  createdAt: string;
};

export const columns: ColumnDef<Coupon>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      return <div className="font-mono text-sm font-medium">{row.getValue("code")}</div>;
    },
  },
  {
    accessorKey: "discount",
    header: "Discount",
    cell: ({ row }) => {
      const type = row.original.discountType;
      const value = row.original.discountValue;
      if (type === "PERCENTAGE") {
        return <div className="font-medium">{value}% off</div>;
      } else {
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
        return <div className="font-medium">{formatted} off</div>;
      }
    },
  },
  {
    accessorKey: "usage",
    header: "Usage",
    cell: ({ row }) => {
      const timesUsed = row.original.timesUsed;
      const maxUses = row.original.maxUses;
      return (
        <div className="text-sm text-muted-foreground">
          {timesUsed} {maxUses ? `/ ${maxUses}` : "uses"}
        </div>
      );
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("active") as boolean;
      return (
        <div className="capitalize text-xs px-2 py-1 bg-muted rounded-md inline-flex items-center justify-center font-medium">
          {isActive ? "Active" : "Inactive"}
        </div>
      );
    },
  },
  {
    accessorKey: "validUntil",
    header: "Valid Until",
    cell: ({ row }) => {
      const validUntil = row.getValue("validUntil") as string | undefined;
      if (!validUntil) return <div className="text-sm text-muted-foreground">Forever</div>;
      const date = new Date(validUntil);
      return <div className="text-sm text-muted-foreground">{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const coupon = row.original;
 
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
              onClick={() => navigator.clipboard.writeText(coupon.code)}
            >
              Copy Code
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit coupon</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
