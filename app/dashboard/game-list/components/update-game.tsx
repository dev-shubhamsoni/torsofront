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
import { useLazyGetSingleGameListQuery } from "@/redux/gameManagementApi";
import { useEffect, useState } from "react";

const FormSchema = z.object({
  game_name: z.string().min(2, {
    message: "game name must be at least 2 characters.",
  }),
  min_game_amount: z.string().min(1, {
    message: "Min Game Amount must be at least 1 characters.",
  }),
  max_game_amount: z.string().min(1, {
    message: "Max Game Amount must be at least 1 characters.",
  }),
  game_status: z.boolean(),
});
interface UpdateGameType {
  triggerUpdateGame: () => void;
  id: string;
}

export function UpdateGame({ triggerUpdateGame, id }: UpdateGameType) {
  const [open, setOpen] = useState(false);
  const [trigger, { data, isSuccess }] = useLazyGetSingleGameListQuery();

  useEffect(() => {
    if (open) {
      trigger(id);
    }
  }, [open, id, trigger]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      game_name: "",
      min_game_amount: undefined,
      max_game_amount: undefined,
      game_status: false,
    },
  });

  useEffect(() => {
    const gameData = data?.data[0];
    if (isSuccess && gameData) {
      form.setValue("game_name", gameData.game_name);
      form.setValue("game_status", gameData.game_status);
      form.setValue("min_game_amount", gameData.min_game_amount?.toString());
      form.setValue("max_game_amount", gameData.max_game_amount?.toString());
    }
  }, [isSuccess, form, data]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
    triggerUpdateGame({
      id,
      min_game_amount: parseInt(data?.min_game_amount),
      max_game_amount: parseInt(data?.max_game_amount),
      game_name: data?.game_name,
      game_status: data?.game_status,
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Game</Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" space-y-6 w-full"
          >
            <div className=" flex flex-col gap-4 items-center w-full">
              <FormField
                control={form.control}
                name="game_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Game Name</FormLabel>
                    <FormControl>
                      <Input
                        required
                        className="bg-white w-full"
                        placeholder="Enter Game Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="min_game_amount"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Min Game Amount</FormLabel>
                    <FormControl>
                      <Input
                        required
                        className="bg-white w-full"
                        placeholder="Min Game Amount"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_game_amount"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Max Game Amount</FormLabel>
                    <FormControl>
                      <Input
                        required
                        className="bg-white w-full"
                        placeholder="Max Game Amount"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="game_status"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel>Game Status</FormLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
