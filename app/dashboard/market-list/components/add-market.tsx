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

interface AddMarketProps {
  triggerAddMarket: ({ market_name }: { market_name: string }) => void;
  isLoadingAddMarket : boolean
}

const FormSchema = z.object({
  market_name: z.string().min(2, {
    message: "market_name must be at least 2 characters.",
  }),
});

const AddMarket: React.FC<AddMarketProps> = ({
  triggerAddMarket,
  isLoadingAddMarket,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      market_name: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    triggerAddMarket(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[20%]  space-y-6"
      >
        <FormField
          control={form.control}
          name="market_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Market Name</FormLabel>
              <FormControl>
                <Input
                  required
                  className="bg-white"
                  placeholder="Enter Market Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{isLoadingAddMarket ? "Adding Market" : "Add Market"}</Button>
      </form>
    </Form>
  );
};

export default AddMarket;
