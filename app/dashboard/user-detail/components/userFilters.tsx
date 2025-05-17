"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCallback, useEffect, useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  full_name: z.string().optional(),
  mobile_number: z.string().optional(),
});

interface UserDataState {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  search: string;
  full_name: string;
  mobile_number: string | null;
}

interface UserFiltersProps {
  setUserDataData: React.Dispatch<React.SetStateAction<UserDataState>>;
  trigger: (params: UserDataState) => void;
}

const UserFilters = ({ setUserDataData, trigger }: UserFiltersProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [hasFilters, setHasFilters] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Function to check if any filters are active
  const checkActiveFilters = useCallback(() => {
    const values = form.getValues();
    const activeFilters = !!(values.full_name || values.mobile_number);
    setHasFilters(activeFilters);
    return activeFilters;
  }, [form]);

  const handleSubmit = useCallback((data: z.infer<typeof FormSchema>) => {
    const newData = {
      full_name: data.full_name || "",
      mobile_number: data.mobile_number || null,
    };

    setUserDataData((prevData) => ({
      ...prevData,
      page: 1,
      ...newData
    }));
    
    trigger({
      page: 1,
      limit: 10,
      sortBy: "",
      sortOrder: "asc",
      search: "",
      ...newData
    });

    checkActiveFilters();
  }, [setUserDataData, trigger, checkActiveFilters]);

  const handleReset = useCallback(() => {
    form.reset({
      full_name: "",
      mobile_number: "",
    });
    
    setUserDataData((prevData) => ({
      ...prevData,
      page: 1,
      full_name: "",
      mobile_number: null,
    }));

    trigger({
      page: 1,
      limit: 10,
      sortBy: "",
      sortOrder: "asc",
      search: "",
      full_name: "",
      mobile_number: null,
    });

    setHasFilters(false);
  }, [form, setUserDataData, trigger]);

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

export default UserFilters;