"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useCallback, useEffect, useState, useRef } from "react";

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

  const [hasFilters, setHasFilters] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Function to check if any filters are active
  const checkActiveFilters = useCallback(() => {
    const values = form.getValues();
    const activeFilters = !!(values.status || values.full_name || values.mobile_number || values.txn_type);
    setHasFilters(activeFilters);
    return activeFilters;
  }, [form]);

  const handleSubmit = useCallback((data: z.infer<typeof FormSchema>) => {
    const newData = {
      status: data.status === "all" ? undefined : data.status,
      full_name: data.full_name || undefined,
      mobile_number: data.mobile_number || undefined,
      txn_type: data.txn_type === "all" ? undefined : data.txn_type,
    };

    setTransactionHistoryData((prevData) => ({
      ...prevData,
      page: 1,
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

    checkActiveFilters();
  }, [setTransactionHistoryData, trigger, checkActiveFilters]);

  const handleReset = useCallback(() => {
    form.reset({
      status: undefined,
      full_name: "",
      mobile_number: "",
      txn_type: undefined
    });
    
    setTransactionHistoryData((prevData) => ({
      ...prevData,
      page: 1,
      status: undefined,
      full_name: undefined,
      mobile_number: undefined,
      txn_type: undefined
    }));

    trigger({
      page: 1,
      limit: 10,
      sortBy: "",
      sortOrder: "desc",
      search: "",
    });

    setHasFilters(false);
  }, [form, setTransactionHistoryData, trigger]);

  // Effect to check filters on mount
  useEffect(() => {
    checkActiveFilters();
  }, [checkActiveFilters]);

  const debouncedSubmit = useCallback(
    (name: string, value: string) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        const formData = form.getValues();
        handleSubmit({
          ...formData,
          [name]: value
        });
      }, 1000);
    },
    [form, handleSubmit]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Form {...form}>
      <form className="">
        <div className="flex flex-col gap-4">
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
                                  handleSubmit(form.getValues());
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
                        debouncedSubmit('full_name', e.target.value);
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
                        debouncedSubmit('mobile_number', e.target.value);
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
                                  handleSubmit(form.getValues());
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
          {hasFilters && (
            <div className="flex justify-start">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleReset}
                className="w-[100px] bg-red-500 text-white"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
};

export default DashboardFilters;