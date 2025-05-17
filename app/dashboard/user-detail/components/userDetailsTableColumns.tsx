"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { convertUTCtoIST } from "@/lib/utils";

// Dashboard Deposit History
export type UserDetailsTableColumnsColumnsTypes = {
  uid: string;
  full_name: string;
  mobile_number: string;
  email: string;
  wallet_balance: number;
  betting: boolean;
  transfer: boolean;
  active: boolean;
  bank_name: string;
  account_holder_name: string;
  account_number: number;
  ifsc_code: string;
  phone_pay_no: string;
  google_pay_no: string;
  paytm_pay_no: string;
  created_at: string;
  updated_at: string;
};

export type UserDetailsTableSetTypes = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  search: string;
  full_name: string;
  mobile_number: string | null;
};

type UpdateUserStatusType = (
  uid: string,
  key: "betting" | "transfer" | "active",
  value: boolean
) => void;

export const userDetailsTableColumns = (
  setUserDataData: React.Dispatch<React.SetStateAction<UserDetailsTableSetTypes>>,
  updateUserStatus: UpdateUserStatusType
): ColumnDef<UserDetailsTableColumnsColumnsTypes>[] => [
  {
    accessorKey: "full_name",
    header: () => (
      <Button
        className="p-0 m-0"
        variant="ghost"
        onClick={() => {
          setUserDataData((prev) => ({
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
    accessorKey: "mobile_number",
    header: "Mobile No",
  },
  {
    accessorKey: "betting",
    header: "Betting",
    enableHiding: false,
    cell: ({ row }) => {
      const bettingStatus = row.getValue("betting") as boolean;

      return (
        <Switch
          checked={bettingStatus}
          onCheckedChange={(newValue) =>
            updateUserStatus(row.original.uid, "betting", newValue)
          }
        />
      );
    },
  },
  {
    accessorKey: "transfer",
    header: "Transfer",
    enableHiding: false,
    cell: ({ row }) => {
      const bettingStatus = row.getValue("transfer") as boolean;
      return (
        <Switch
          checked={bettingStatus}
          onCheckedChange={(newValue) =>
            updateUserStatus(row.original.uid, "transfer", newValue)
          }
        />
      );
    },
  },
  {
    accessorKey: "active",
    header: "Active",
    enableHiding: false,
    cell: ({ row }) => {
      const bettingStatus = row.getValue("active") as boolean;

      return (
        <Switch
          checked={bettingStatus}
          onCheckedChange={(newValue) =>
            updateUserStatus(row.original.uid, "active", newValue)
          }
        />
      );
    },
  },
  {
    accessorKey: "user_created_at",
    header: () => (
      <Button
        variant="ghost"
        onClick={() => {
          setUserDataData((prev) => ({
            ...prev,
            sortBy: "user_created_at",
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
    accessorKey: "user_updated_at",
    header: () => (
      <Button
        variant="ghost"
        onClick={() => {
          setUserDataData((prev) => ({
            ...prev,
            sortBy: "user_updated_at",
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
      const uidRow = row.original.uid;
      return (
        <Link href={`/dashboard/user-detail/${uidRow}`}>
          <Eye className="cursor-pointer" />
        </Link>
      );
    },
  },
];
