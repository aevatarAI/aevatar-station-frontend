"use client";

import dayjs from "@/api/dayjs";
import UpDownIcon from "@/assets/updown.svg?react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type * as React from "react";
import type { DateRange } from "react-day-picker";

interface DatePickerWithRangeProps {
  date: any;
  onDateChange: (date: any) => void;
  className?: React.HTMLAttributes<HTMLDivElement>;
}

export function DatePickerWithRange({
  date,
  onDateChange,
  className,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="ghost"
            className={cn(
              "font-outfit font-light text-[14px] max-[768px]:px-[0px]",
              !date && "text-muted-foreground",
            )}
          >
            <div className="flex justify-end items-center gap-2 w-full">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd/MM/yyyy")} -{" "}
                    {format(date.to, "dd/MM/yyyy")}
                  </>
                ) : (
                  format(date.from, "dd/MM/yyyy")
                )
              ) : (
                <span>Pick a date</span>
              )}
              <UpDownIcon />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-black-light" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(date?: DateRange) => {
              const dayFrom = dayjs(date?.from).startOf("day").valueOf();

              let dayTo: number;
              if (dayjs(date?.to).isBefore(date?.from)) {
                dayTo = dayjs(date?.from).endOf("day").valueOf();
              } else {
                dayTo = dayjs(date?.to).endOf("day").valueOf();
              }
              onDateChange({ from: dayFrom, to: dayTo });
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
