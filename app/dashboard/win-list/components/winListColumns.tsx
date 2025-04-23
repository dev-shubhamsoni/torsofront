"use client";

import { Button } from "@/components/ui/button";
import { convertUTCtoIST } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

// Dashboard Deposit History
export type winListColumnsTypes = {
  bid_id: string;
  market_name: string;
  game_name: string;
  bid_number: number;
  bid_amount: number;
  bid_type: string;
  created_at: string;
  updated_at: string;
  id: string;
  market_id: string;
  game_id: string;
};

export type winListColumnsTableSetTypes = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  search: string;
  dateToSort: string;
  marketToSortId: string;
};

export const winListColumns = (
  setUserDataData: React.Dispatch<
    React.SetStateAction<winListColumnsTableSetTypes>
  >,
  delWinData,
  winnersListFunc,
  decWinner
): ColumnDef<winListColumnsTypes>[] => [
  {
    accessorKey: "market_name",
    header: "Market Name",
  },
  {
    accessorKey: "game_name",
    header: "Game Name",
  },
  {
    accessorKey: "bid_type",
    header: "Bid Type",
  },
  {
    accessorKey: "win_number",
    header: "Win Number",
  },
  {
    accessorKey: "result_date",
    header: "Result Date",
  },
  {
    accessorKey: "money_settled",
    header: "Money Settled",
    cell: ({ row }) => {
      const status = row.getValue("money_settled") as boolean;

      let statusColor = "text-gray-600 bg-gray-200";
      if (status === true) statusColor = "text-black bg-green-200";
      if (status === false) statusColor = "text-black bg-red-400";

      return (
        <span
          className={`px-4 py-1 rounded-full text-sm font-medium ${statusColor}`}
        >
          {status ? "Yes" : "No"}
        </span>
      );
    },
  },

  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
      const marketId = row.original.market_id;
      const gameId = row.original.game_id;
      const bid_type = row.getValue("bid_type") as string;
      const win_number = row.getValue("win_number") as number;
      const resultDate = row.getValue("result_date") as Date;
      return (
        <div className="w-full flex flex-col gap-2">
          <Button
            onClick={() =>
              winnersListFunc(
                marketId,
                gameId,
                bid_type,
                win_number,
                resultDate
              )
            }
          >
            Show Results
          </Button>
          <Button onClick={() => decWinner(marketId, gameId, win_number, bid_type, resultDate)} className=" bg-green-600">Declare Results</Button>
          <Button onClick={() => delWinData(id)} className=" bg-red-600">
            Delete Data
          </Button>
        </div>
      );
    },
  },
];
