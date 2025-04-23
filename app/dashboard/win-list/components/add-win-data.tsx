"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { addHours, format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  useGetSingleGameListNamesQuery,
  useGetSingleMarketListNamesQuery,
} from "@/redux/marketManagementApi";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  date: z.coerce.date(),
  marketId: z.string(),
  gameId: z.string(),
  bid_type: z.string(),
  win_number: z.coerce.number(),
});

export interface AddWinTypes {
  triggerWinDataFunc: (data: {
    date: Date;
    marketId: string;
    gameId: string;
    bid_type: string;
    win_number: number;
  }) => void;
}

interface RenderItemProps {
  label: string;
  value: string;
  market_name: string;
  game_name: string;
  id: string;
}

export function AddWinData({ triggerWinDataFunc }: AddWinTypes) {
  const { data: marketList } = useGetSingleMarketListNamesQuery({});
  const { data: gameList } = useGetSingleGameListNamesQuery({});
  const [marketData, setMarketData] = useState([]);
  const [gameListData, setGameListData] = useState([]);
  const [bidTypeData] = useState([
    { label: "Open", value: "Open" },
    { label: "Close", value: "Close" },
  ]);

  useEffect(() => {
    if (!marketList?.data) return; // Ensure data exists before processing

    const marketChange = marketList.data.map((item: RenderItemProps) => ({
      label: item.market_name,
      value: item.id,
    }));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setMarketData([...marketChange]);
  }, [marketList?.data]);

  useEffect(() => {
    if (!gameList?.data) return; // Ensure data exists before processing

    const gameChange = gameList.data.map((item: RenderItemProps) => ({
      label: item.game_name,
      value: item.id,
    }));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setGameListData([...gameChange]);
  }, [gameList?.data]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: undefined, // Change from undefined to null (React considers this controlled)
      marketId: "", // Ensure strings are initialized as empty
      gameId: "",
      bid_type: "",
      win_number: 0, // Change from undefined to 0 (for number input)
    },
  });
  

  function onSubmit(data: z.infer<typeof FormSchema>) {
    triggerWinDataFunc(data);
    form.setValue("win_number", 0);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-5 gap-4">
          <FormField
            control={form.control}
            name="win_number"
            render={({ field }) => (
              <FormItem className=" -mt-2 pt-0">
                <FormLabel>Win Number</FormLabel>
                <FormControl>
                  <Input
                    className=" bg-white mt-0 pt-0"
                    placeholder="Enter win number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Pick a date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Result Date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) =>
                        field.onChange(date ? addHours(date, 12) : date)
                      }
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marketId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Market Name</FormLabel>
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
                          ? marketData?.find(
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              (language) => language.value === field.value
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                            )?.label
                          : "Select market"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search market name..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No market found.</CommandEmpty>
                        <CommandGroup>
                          {marketData?.map((language) => (
                            <CommandItem
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              value={language.label}
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              key={language.value}
                              onSelect={() => {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                form.setValue("marketId", language.value);
                              }}
                            >
                              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                              {/* @ts-ignore */}
                              {language.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore
                                  language.value === field.value
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
            name="gameId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Game Name</FormLabel>
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
                          ? gameListData?.find(
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              (language) => language.value === field.value
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                            )?.label
                          : "Select Game Name"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search Game Name..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No Game Name.</CommandEmpty>
                        <CommandGroup>
                          {gameListData?.map((language) => (
                            <CommandItem
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              value={language.label}
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              key={language.value}
                              onSelect={() => {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                form.setValue("gameId", language.value);
                              }}
                            >
                              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                              {/* @ts-ignore */}
                              {language.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore
                                  language.value === field.value
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
            name="bid_type"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Bid Type Name</FormLabel>
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
                          ? bidTypeData?.find(
                              (language) => language.value === field.value
                            )?.label
                          : "Select Bid Type"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search Bid Type name..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No Bid Type found.</CommandEmpty>
                        <CommandGroup>
                          {bidTypeData?.map((language) => (
                            <CommandItem
                              value={language.label}
                              key={language.value}
                              onSelect={() => {
                                form.setValue("bid_type", language.value);
                              }}
                            >
                              {language.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  language.value === field.value
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
