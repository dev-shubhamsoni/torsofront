"use client";

import { Button } from "@/components/ui/button";
import { convertUTCtoIST } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dashboard Deposit History
export type UserDetailsTableColumnsSingleTransactionsTypes = {
  id: string;
  userId: string;
  txn_id: string;
  created_at: string;
  updated_at: string;
  txn_type: string;
  status: string;
  amount: number;
};

export type UserDetailsSingleTransactionsTableSetTypes = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  search: string;
  uid: string | string[] | undefined;
};

export type ChangePaymentStatusType = (
  status: "Approved" | "Rejected",
  txnId: string,
  txnType: string,
  userId: string,
  amount: number
) => void;

export const userDetailsTableColumnsSingleTransactions = (
  setUserDataData: React.Dispatch<
    React.SetStateAction<UserDetailsSingleTransactionsTableSetTypes>
  >,
  changePaymentStatus: ChangePaymentStatusType
): ColumnDef<UserDetailsTableColumnsSingleTransactionsTypes>[] => [
  {
    accessorKey: "txn_id",
    header: "Txn Id",
  },
  {
    accessorKey: "txn_type",
    header: "Txn Type",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      let statusColor = "text-gray-600 bg-gray-200";
      if (status === "Approved") statusColor = "text-black bg-green-200";
      if (status === "Pending") statusColor = "text-black bg-yellow-200";
      if (status === "Rejected") statusColor = "text-black bg-red-400";

      return (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${statusColor}`}
        >
          {status}
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
      const txnId = row.original.id;
      const status = row.getValue("status") as string;
      const txnType = row.getValue("txn_type") as string;
      const userId = row.original.userId
      const amount = row.getValue("amount") as number;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              disabled={status === "Approved" || status === "Rejected"}
              variant="ghost"
              className="h-8 w-8 p-0"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                changePaymentStatus("Approved", txnId, txnType, userId, amount)
              }
            >
              Accept
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                changePaymentStatus("Rejected", txnId, txnType, userId, amount)
              }
            >
              Reject
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
