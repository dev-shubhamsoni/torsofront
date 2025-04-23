"use client";

import { Button } from "@/components/ui/button";
import { convertUTCtoIST } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

// Dashboard Deposit History
export type bidListColumnsTypes = {
  bid_id: string;
  market_name: string;
  game_name: string;
  bid_number: number;
  bid_amount: number;
  bid_type: string;
  created_at: string;
  updated_at: string;
};

export type bidListColumnsTableSetTypes = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  search: string;
  dateToSort: string;
  marketToSortId: string;
};

export const bidListColumns = (
  setUserDataData: React.Dispatch<
    React.SetStateAction<bidListColumnsTableSetTypes>
  >
): ColumnDef<bidListColumnsTypes>[] => [
  {
    accessorKey: "full_name",
    header: "Full Name",
  },
  {
    accessorKey: "market_name",
    header: "Market Name",
  },
  {
    accessorKey: "game_name",
    header: "Game Name",
  },
  {
    accessorKey: "bid_number",
    header: "Bid Number",
  },
  {
    accessorKey: "bid_amount",
    header: "Bid Amount",
  },
  {
    accessorKey: "bid_type",
    header: "Bid Type",
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
  }
];
