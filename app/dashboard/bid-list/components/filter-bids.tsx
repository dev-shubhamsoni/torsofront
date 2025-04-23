"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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
import { bidListColumnsTableSetTypes } from "./bidListColumns";
import {
  useGetSingleGameListNamesQuery,
  useGetSingleMarketListNamesQuery,
} from "@/redux/marketManagementApi";
import { useEffect, useState } from "react";

const FormSchema = z.object({
  created_at: z.date().optional(),
  market_id: z.string().optional(),
  game_id: z.string().optional(),
  bid_type_id: z.string().optional(),
});

interface FilterBidsTypes {
  setPaginationData: React.Dispatch<
    React.SetStateAction<bidListColumnsTableSetTypes>
  >;
  triggerFilter: () => void;
}

interface RenderItemProps {
  label: string;
  value: string;
  market_name: string;
  game_name: string;
  id: string;
}

export function FilterBids({
  setPaginationData,
  triggerFilter,
}: FilterBidsTypes) {
  const { data: marketList } = useGetSingleMarketListNamesQuery({});
  const { data: gameList } = useGetSingleGameListNamesQuery({});
  const [marketData, setMarketData] = useState([]);
  const [gameListData, setGameListData] = useState([]);
  const [bidTypeData] = useState([
    { label: "All", value: "all" },
    { label: "Open", value: "Open" },
    { label: "Close", value: "Close" },
  ]);

  useEffect(() => {
    if (!marketList?.data) return; // Ensure data exists before processing

    const marketChange = marketList.data.map((item: RenderItemProps) => ({
      label: item.market_name,
      value: item.market_name,
    }));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setMarketData([{ label: "All", value: "all" }, ...marketChange]);
  }, [marketList?.data]);

  useEffect(() => {
    if (!gameList?.data) return; // Ensure data exists before processing

    const gameChange = gameList.data.map((item: RenderItemProps) => ({
      label: item.game_name,
      value: item.game_name,
    }));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setGameListData([{ label: "All", value: "all" }, ...gameChange]);
  }, [gameList?.data]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setPaginationData((prevData) => ({
      ...prevData,
      dateToSort: data?.created_at ? format(data.created_at, "yyyy-MM-dd") : "",
      marketToSortId: data?.market_id
        ? data?.market_id === "all"
          ? ""
          : data?.market_id
        : "",
      gameToSortId: data?.game_id
        ? data?.game_id === "all"
          ? ""
          : data?.game_id
        : "",
      bidTypeToSortId: data?.bid_type_id
        ? data?.bid_type_id === "all"
          ? ""
          : data?.bid_type_id
        : "",
    }));
    triggerFilter();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="created_at"
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
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
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
            name="market_id"
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
                                form.setValue("market_id", language.value);
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
            name="game_id"
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
                                form.setValue("game_id", language.value);
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
            name="bid_type_id"
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
                                form.setValue("bid_type_id", language.value);
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
