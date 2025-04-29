"use client";

import { Button } from "@/components/ui/button";
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
import { convertUTCtoIST } from "@/lib/utils";
import { ChangePaymentStatusType } from "../user-detail/[id]/components/userDetailsTableColumnsSingleTransactions";

// Dashboard Deposit History
export type TransactionHistoryTableColumnsTypes = {
  id: string;
  txn_id: string;
  txn_type: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  userId: string;
};

export type TransactionHistorySetTypes = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  search: string;
};

// ✅ Convert to a function that accepts `setTransactionHistoryData`
export const transactionHistoryTableColumns = (
  setTransactionHistoryData: React.Dispatch<
    React.SetStateAction<TransactionHistorySetTypes>
  >,
   changePaymentStatus: ChangePaymentStatusType
): ColumnDef<TransactionHistoryTableColumnsTypes>[] => [
  {
    accessorKey: "full_name",
    header: () => (
      <Button
        className="p-0 m-0"
        variant="ghost"
        onClick={() => {
          setTransactionHistoryData((prev) => ({
            ...prev,
            sortBy: "full_name",
            sortOrder: prev?.sortOrder === "asc" ? "desc" : "asc",
          }));
        }}
      >
        Full Name
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
  },
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
    header: () => (
      <Button
        variant="ghost"
        onClick={() => {
          setTransactionHistoryData((prev) => ({
            ...prev,
            sortBy: "amount",
            sortOrder: prev?.sortOrder === "asc" ? "desc" : "asc",
          }));
        }}
        className="p-0 m-0"
      >
        Amount
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <Button
        className="p-0 m-0"
        variant="ghost"
        onClick={() => {
          setTransactionHistoryData((prev) => ({
            ...prev,
            sortBy: "status",
            sortOrder: prev?.sortOrder === "asc" ? "desc" : "asc",
          }));
        }}
      >
        Status
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
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
          setTransactionHistoryData((prev) => ({
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
          setTransactionHistoryData((prev) => ({
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
