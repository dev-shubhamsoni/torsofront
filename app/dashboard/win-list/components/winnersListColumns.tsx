"use client";

import { ColumnDef } from "@tanstack/react-table";

// Dashboard Deposit History
export type winnersListColumnsTypes = {
  bid_id: string;
  market_name: string;
  game_name: string;
  bid_number: number;
  bid_amount: number;
  bid_type: string;
  created_at: string;
  updated_at: string;
  id:string
  market_id:string
  game_id:string
};

export type winnersListColumnsTableSetTypes = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  search: string;
  dateToSort: string;
  marketToSortId: string;
};

export const winnersListColumns = (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUserDataData: React.Dispatch<
    React.SetStateAction<winnersListColumnsTableSetTypes>
  >,
): ColumnDef<winnersListColumnsTypes>[] => [
  {
    accessorKey: "full_name",
    header: "Full Name",
  },
  {
    accessorKey: "bid_id",
    header: "Bid Id",
  },
  {
    accessorKey: "game_name",
    header: "Game Name",
  },
  {
    accessorKey: "market_name",
    header: "Market Name",
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
 

  
];
