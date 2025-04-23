import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AddRemoveProps {
    triggerRemoveMoney: ({ amount, uid }: { amount: number; uid: string | undefined }) => void;
    uid? : string;
  }
  

const FormSchema = z.object({
  amount: z.coerce.number().min(1, {
    message: "Amount must be at least 1 digit",
  }),
});

export function MoneyRemovePopup({triggerRemoveMoney, uid}:AddRemoveProps) {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: undefined,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const main = {
        ...data,
        uid 
    }
    triggerRemoveMoney(main)

  }

  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button className="bg-red-500 text-white px-4 py-2 rounded-md w-full hover:bg-red-600">
              Withdraw Fund
            </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Amount." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
