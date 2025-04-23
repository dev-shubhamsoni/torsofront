"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  useLazyGetSingleMarketListQuery,
  usePatchUpdateMarketMutation,
} from "@/redux/marketManagementApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { APIError } from "@/lib/types";

const MarketTimeSchema = z.object({
  open: z.string().regex(/^\d{1,2}:\s?\d{2}\s?(am|pm)$/, "Invalid time format"),
  close: z
    .string()
    .regex(/^\d{1,2}:\s?\d{2}\s?(am|pm)$/, "Invalid time format"),
  status: z.boolean(),
});

const FormSchema = z.object({
  market_name: z.string().min(2, "Market name must be at least 2 characters."),
  market_status: z.boolean(),
  market_time: z.object({
    Monday: MarketTimeSchema,
    Tuesday: MarketTimeSchema,
    Wednesday: MarketTimeSchema,
    Thursday: MarketTimeSchema,
    Friday: MarketTimeSchema,
    Saturday: MarketTimeSchema,
    Sunday: MarketTimeSchema,
  }),
});

interface marketEditTypes {
  marketId: string;
  market_name: string;
}

export function EditMarket({ marketId }: marketEditTypes) {
  const [open, setOpen] = useState(false);
  const [trigger, { data, isSuccess }] = useLazyGetSingleMarketListQuery();

  useEffect(() => {
    if (open) {
      trigger(marketId);
    }
  }, [open, marketId, trigger]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      market_name: "",
      market_status: false,
      market_time: {
        Monday: { open: "9: 00 AM", close: "10: 00 PM", status: true },
        Tuesday: { open: "9: 00 AM", close: "10: 00 PM", status: true },
        Wednesday: { open: "9: 00 AM", close: "10: 00 PM", status: true },
        Thursday: { open: "10: 00 AM", close: "10: 00 PM", status: true },
        Friday: { open: "10: 00 AM", close: "10: 00 PM", status: true },
        Saturday: { open: "10: 00 AM", close: "11: 00 PM", status: true },
        Sunday: { open: "11: 00 AM", close: "9: 00 PM", status: true },
      },
    },
  });

  useEffect(() => {
    const marketData = data?.data[0];
    if (isSuccess && marketData) {
      form.setValue("market_name", marketData.market_name);
      form.setValue("market_status", marketData.market_status);

      if (marketData.market_time) {
        // Loop through each day in market_time and update form values
        Object.entries(marketData.market_time).forEach(([day, time]) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          form.setValue(`market_time.${day}.open`, time.open);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          form.setValue(`market_time.${day}.close`, time.close);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          form.setValue(`market_time.${day}.status`, time.status);
        });
      }
    }
  }, [isSuccess, form, data]);

  const [
    patchMarket,
    {
      data: dataMarketUpdate,
      isSuccess: isSuccessMarketUpdate,
      isError: isErrorMarketUpdate,
      error: errorMarketUpdate,
    },
  ] = usePatchUpdateMarketMutation();

  useEffect(() => {
    // ✅ Handle successful API response (status: true)
    if (dataMarketUpdate && isSuccessMarketUpdate && dataMarketUpdate?.status) {
      toast.success(dataMarketUpdate?.message);
      setOpen(false);
    }

    // ✅ Handle API response errors (status: false in API response)
    if (
      dataMarketUpdate &&
      isSuccessMarketUpdate &&
      !dataMarketUpdate?.status
    ) {
      toast.error(dataMarketUpdate?.message || "Something went wrong");
    }

    // ✅ Handle API request errors (e.g., 401 Unauthorized)
    if (isErrorMarketUpdate && errorMarketUpdate) {
      let errorMessage = "An error occurred";

      // ✅ Ensure errorMarketUpdate is of type APIError
      if ((errorMarketUpdate as APIError)?.data) {
        const apiError = errorMarketUpdate as APIError;
        errorMessage = apiError.data.message || "Unauthorized access";
      }

      toast.error(errorMessage);
    }
  }, [
    isSuccessMarketUpdate,
    dataMarketUpdate,
    isErrorMarketUpdate,
    errorMarketUpdate,
    trigger,
  ]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("data ->>>>>>>>>>>>>>>>>>>>>>>", data);

    patchMarket({
      id: marketId,
      ...data,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Market</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] overflow-y-auto h-[600px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="market_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Market Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="market_status"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel>Market Status</FormLabel>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormItem>
              )}
            />

            {Object.keys(form.getValues().market_time).map((day) => (
              <div key={day} className="border p-3 rounded-md">
                <Label>{day}</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <FormField
                    control={form.control}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    name={`market_time.${day}.open` as string}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Open</FormLabel>
                        <FormControl>
                          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                          {/* @ts-ignore */}
                          <Input placeholder="9: 00 AM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    name={`market_time.${day}.close` as string}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Close</FormLabel>
                        <FormControl>
                          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                          {/* @ts-ignore */}
                          <Input placeholder="10: 00 PM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    name={`market_time.${day}.status` as string}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormLabel>Status</FormLabel>
                        <Switch
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}

            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
