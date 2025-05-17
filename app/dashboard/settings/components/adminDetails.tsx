"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FormSchema = z.object({
  mobile_number: z.string().optional(),
  email: z.string().email(),
  whatsapp_number: z.string().optional(),
  min_withdrwal_rate: z.string().optional(),
  max_withdrwal_rate: z.string().optional(),
  max_transfer: z.string().optional(),
  min_transfer: z.string().optional(),
  account_holder_name: z.string().optional(),
  account_number: z.string().optional(),
  ifsc_code: z.string().optional(),
  txn_upi_id: z.string().optional(),
});

interface AdminDetailsProps {
  adminData: {
    mobile_number: string | null;
    email: string;
    whatsapp_number: string | null;
    min_withdrwal_rate: number | null;
    max_withdrwal_rate: number | null;
    max_transfer: number | null;
    min_transfer: number | null;
    account_holder_name: string | null;
    account_number: string | null;
    ifsc_code: string | null;
    txn_upi_id: string | null;
  };
  onSubmit: (data: z.infer<typeof FormSchema>) => void;
}

const AdminDetails = ({ adminData, onSubmit }: AdminDetailsProps) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mobile_number: "",
      email: "",
      whatsapp_number: "",
      min_withdrwal_rate: "",
      max_withdrwal_rate: "",
      max_transfer: "",
      min_transfer: "",
      account_holder_name: "",
      account_number: "",
      ifsc_code: "",
      txn_upi_id: "",
    },
  });

  useEffect(() => {
    if (adminData) {
      form.reset({
        mobile_number: adminData.mobile_number || "",
        email: adminData.email || "",
        whatsapp_number: adminData.whatsapp_number || "",
        min_withdrwal_rate: adminData.min_withdrwal_rate?.toString() || "",
        max_withdrwal_rate: adminData.max_withdrwal_rate?.toString() || "",
        max_transfer: adminData.max_transfer?.toString() || "",
        min_transfer: adminData.min_transfer?.toString() || "",
        account_holder_name: adminData.account_holder_name || "",
        account_number: adminData.account_number || "",
        ifsc_code: adminData.ifsc_code || "",
        txn_upi_id: adminData.txn_upi_id || "",
      });
    }
  }, [adminData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-4 gap-6">
          <FormField
            control={form.control}
            name="mobile_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter mobile number" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsapp_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter WhatsApp number" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="min_withdrwal_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Withdrawal Rate</FormLabel>
                <FormControl>
                  <Input placeholder="Enter minimum withdrawal rate" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_withdrwal_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Withdrawal Rate</FormLabel>
                <FormControl>
                  <Input placeholder="Enter maximum withdrawal rate" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_transfer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Transfer</FormLabel>
                <FormControl>
                  <Input placeholder="Enter maximum transfer" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="min_transfer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Transfer</FormLabel>
                <FormControl>
                  <Input placeholder="Enter minimum transfer" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="account_holder_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Holder Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter account holder name" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="account_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter account number" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ifsc_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IFSC Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter IFSC code" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="txn_upi_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UPI ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter UPI ID" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="bg-primary">Save Changes</Button>
      </form>
    </Form>
  );
};

export default AdminDetails;