"use client";

import { Button } from "@/components/ui/button";
import { convertUTCtoIST } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { UpdateGame } from "./update-game";

// Dashboard Deposit History
export type gameListColumnsTypes = {
  id: string;
  created_at: string;
  updated_at: string;
  game_name: string;
  game_status: string;
};

export type gameListColumnsTableSetTypes = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  search: string;
};

type UpdateGameType = () => void;

export const gameListColumns = (
  setUserDataData: React.Dispatch<
    React.SetStateAction<gameListColumnsTableSetTypes>
  >,
  triggerUpdateGame: UpdateGameType
): ColumnDef<gameListColumnsTypes>[] => [
  {
    accessorKey: "game_name",
    header: "Game Name",
  },
  {
    accessorKey: "game_status",
    header: "Game Status",
    cell: ({ row }) => {
      const status = row.getValue("game_status") as boolean;

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
    accessorKey: "min_game_amount",
    header: "Min Game Amount",
  },
  {
    accessorKey: "max_game_amount",
    header: "Max Game Amount",
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
      const id = row.original.id;
      return <UpdateGame triggerUpdateGame={triggerUpdateGame} id={id} />;
    },
  },
];
