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

interface AddGameProps {
  triggerAddGame: ({
    game_name,
  }: {
    game_name: string;
    min_game_amount: number;
    max_game_amount: number;
  }) => void;
  isLoadingAddGame: boolean;
}

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
});

const AddGame: React.FC<AddGameProps> = ({
  triggerAddGame,
  isLoadingAddGame,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      game_name: "",
      min_game_amount: undefined,
      max_game_amount: undefined,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    triggerAddGame({
      ...data,
      min_game_amount: parseInt(data?.min_game_amount),
      max_game_amount: parseInt(data?.max_game_amount),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[100%]  space-y-6"
      >
        <div className=" flex gap-4 items-center w-full">
          <FormField
            control={form.control}
            name="game_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Game Name</FormLabel>
                <FormControl>
                  <Input
                    required
                    className="bg-white"
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
              <FormItem>
                <FormLabel>Min Game Amount</FormLabel>
                <FormControl>
                  <Input
                    required
                    className="bg-white"
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
              <FormItem>
                <FormLabel>Max Game Amount</FormLabel>
                <FormControl>
                  <Input
                    required
                    className="bg-white"
                    placeholder="Max Game Amount"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">
          {isLoadingAddGame ? "Adding Game" : "Add Game"}
        </Button>
      </form>
    </Form>
  );
};

export default AddGame;
