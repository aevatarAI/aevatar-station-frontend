"use client";

import * as React from "react";
import { format } from "date-fns";
import UpDownIcon from "@/assets/updown.svg?react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "@/api/dayjs";
import { DateRange } from "react-day-picker";

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
              "font-source-code font-light text-[14px]",
              !date && "text-muted-foreground"
            )}
          >
            <div className="flex justify-end items-center gap-2 w-full">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
              <UpDownIcon />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(date?: DateRange) => {
              const dayFrom = dayjs.utc(date?.from).valueOf();
              const dayTo = dayjs.utc(date?.to).valueOf();

              onDateChange({ from: dayFrom, to: dayTo });
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
