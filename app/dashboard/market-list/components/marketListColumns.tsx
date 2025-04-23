"use client";

import { Button } from "@/components/ui/button";
import { convertUTCtoIST } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { EditMarket } from "./edit-market";

// Dashboard Deposit History
export type marketListColumnsTypes = {
  id: string;
  created_at: string;
  updated_at: string;
  market_status: boolean;
};

export type marketListColumnsTableSetTypes = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  search: string;
};

export const marketListColumns = (
  setUserDataData: React.Dispatch<
    React.SetStateAction<marketListColumnsTableSetTypes>
  >
): ColumnDef<marketListColumnsTypes>[] => [
  {
    accessorKey: "market_name",
    header: "Market Name",
  },
  {
    accessorKey: "market_status",
    header: "Market Status",
    cell: ({ row }) => {
      const status = row.getValue("market_status") as boolean;

      let statusColor = "text-gray-600 bg-gray-200";
      if (status === true) statusColor = "text-black bg-green-200";
      if (status === false) statusColor = "text-black bg-red-400";

      return (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${statusColor}`}
        >
          {status ? "Active" : "Inactive"}
        </span>
      );
    },
  },

  {
    accessorKey: "created_at",
    header: () => (
      <Button
        variant="ghost"
        onClick={() => {
          setUserDataData((prev) => ({
            ...prev,
            sortBy: "created_at",
            sortOrder: prev?.sortOrder === "asc" ? "desc" : "asc",
          }));
        }}
        className="p-0 m-0"
      >
        Created At
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const formattedDate = convertUTCtoIST(row.original.created_at);
      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "updated_at",
    header: () => (
      <Button
        variant="ghost"
        onClick={() => {
          setUserDataData((prev) => ({
            ...prev,
            sortBy: "updated_at",
            sortOrder: prev?.sortOrder === "asc" ? "desc" : "asc",
          }));
        }}
        className="p-0 m-0"
      >
        Updated At
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const formattedDate = convertUTCtoIST(row.original.updated_at);
      return <span>{formattedDate}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const marketId = row.original.id;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return <EditMarket marketId={marketId} />;
    },
  },
];
