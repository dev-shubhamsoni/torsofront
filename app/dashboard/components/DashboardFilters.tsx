"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";

interface TransactionHistoryData {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  search: string;
  status?: string;
  full_name?: string;
  mobile_number?: string;
  txn_type?: string;
}

const FormSchema = z.object({
  status: z.string().optional(),
  full_name: z.string().optional(),
  mobile_number: z.string().optional(),
  txn_type: z.string().optional(),
});

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
  { label: "Pending", value: "Pending" },
];

const txnTypeOptions = [
  { label: "All", value: "all" },
  { label: "Money add request", value: "Money add request" },
  { label: "Money withdraw request", value: "Money withdraw request" },
  { label: "Bid Placed", value: "Bid Placed" },
  { label: "Winnings", value: "Winnings" },
];

interface DashboardFiltersProps {
  setTransactionHistoryData: React.Dispatch<React.SetStateAction<TransactionHistoryData>>;
  trigger: (params: TransactionHistoryData) => void;
}

const DashboardFilters = ({ setTransactionHistoryData, trigger }: DashboardFiltersProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const newData = {
      status: data.status === "all" ? undefined : data.status,
      full_name: data.full_name || undefined,
      mobile_number: data.mobile_number || undefined,
      txn_type: data.txn_type === "all" ? undefined : data.txn_type,
    };

    setTransactionHistoryData((prevData) => ({
      ...prevData,
      page: 1, // Reset to first page when filters change
      ...newData
    }));
    
    trigger({
      page: 1,
      limit: 10,
      sortBy: "",
      sortOrder: "desc",
      search: "",
      ...newData
    });
  }

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onSubmit)} onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="grid grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end h-[80px]">
                <FormLabel>Status</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? statusOptions.find(
                              (option) => option.value === field.value
                            )?.label
                          : "Select status"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search status..." />
                      <CommandList>
                        <CommandEmpty>No status found.</CommandEmpty>
                        <CommandGroup>
                          {statusOptions.map((option) => (
                            <CommandItem
                              key={option.value}
                              value={option.label}
                              onSelect={() => {
                                form.setValue("status", option.value);
                                form.handleSubmit(onSubmit)();
                              }}
                            >
                              {option.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  option.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end h-[80px]">
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter full name" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      form.handleSubmit(onSubmit)();
                    }}
                    className="bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobile_number"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end h-[80px]">
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter mobile number" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      form.handleSubmit(onSubmit)();
                    }}
                    className="bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="txn_type"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end h-[80px]">
                <FormLabel>Transaction Type</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? txnTypeOptions.find(
                              (option) => option.value === field.value
                            )?.label
                          : "Select transaction type"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search transaction type..." />
                      <CommandList>
                        <CommandEmpty>No transaction type found.</CommandEmpty>
                        <CommandGroup>
                          {txnTypeOptions.map((option) => (
                            <CommandItem
                              key={option.value}
                              value={option.label}
                              onSelect={() => {
                                form.setValue("txn_type", option.value);
                                form.handleSubmit(onSubmit)();
                              }}
                            >
                              {option.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  option.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default DashboardFilters;