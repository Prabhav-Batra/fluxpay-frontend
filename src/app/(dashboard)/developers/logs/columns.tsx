"use client";

import { ColumnDef } from "@tanstack/react-table";

export type ApiLog = {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  status: number;
  ip: string;
  timestamp: string;
};

export const columns: ColumnDef<ApiLog>[] = [
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => {
      const method = row.getValue("method") as string;
      return (
        <div className={`font-mono text-xs font-semibold ${
          method === "GET" ? "text-blue-500" :
          method === "POST" ? "text-green-500" :
          method === "DELETE" ? "text-red-500" :
          "text-amber-500"
        }`}>
          {method}
        </div>
      );
    },
  },
  {
    accessorKey: "path",
    header: "Path",
    cell: ({ row }) => {
      return <div className="font-mono text-sm">{row.getValue("path")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = parseInt(row.getValue("status"));
      return (
        <div className={`text-xs px-2 py-1 rounded-md inline-flex items-center justify-center font-medium ${
          status >= 200 && status < 300 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
          status >= 400 && status < 500 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
          status >= 500 ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
          "bg-muted text-muted-foreground"
        }`}>
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "ip",
    header: "Source IP",
    cell: ({ row }) => {
      return <div className="text-sm font-mono text-muted-foreground">{row.getValue("ip")}</div>;
    },
  },
  {
    accessorKey: "timestamp",
    header: () => <div className="text-right">Timestamp</div>,
    cell: ({ row }) => {
      return <div className="text-right text-sm text-muted-foreground">{row.getValue("timestamp")}</div>;
    },
  },
];
