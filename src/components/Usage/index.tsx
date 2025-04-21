import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import clsx from "clsx";
import { textGradient } from "@/constants/cls";
import { Form, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useGetAPIRequests } from "@/hooks/useGetAPIRequests";
import Loading from "@/components/Loading";
import dayjs from "@/api/dayjs";
import { useEffect, useState } from "react";
import { useGetSystemModels } from "@/hooks/useGetSystemModels";
import { useGetLLMTokens } from "@/hooks/useGetLLMTokenUsage";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";
import { generateLast7Days } from "@/utils/helpers";

const UNCHANGED_DATA = [
  {
    name: "01/03",
    input: 8,
    output: 3,
  },
  {
    name: "02/03",
    input: 4,
    output: 4,
  },
  {
    name: "03/03",
    input: 12,
    output: 3,
  },
  {
    name: "04/03",
    input: 12,
    output: 3,
  },
  {
    name: "04/03",
    input: 9,
    output: 3,
  },
  {
    name: "04/03",
    input: 9,
    output: 2,
  },
  {
    name: "05/03",
    input: 3,
    output: 3,
  },
];

export function Usage() {
  const form = useForm();
  const [apiRequests, setAPIRequests] = useState([]);
  const [date, setDate] = useState({
    from: dayjs.utc("2025-04-01").valueOf(),
    to: dayjs.utc("2025-04-01").add(30, "day").valueOf(),
  });
  const { data, isLoading } = useGetAPIRequests(date);
  const { data: models } = useGetSystemModels();
  const { data: tokens } = useGetLLMTokens();

  useEffect(() => {
    if (data) {
      const transformed = data?.data?.requests?.map((datum: any) => ({
        ...datum,
        time: dayjs.utc(datum.time).local().format("DD/MM"),
      }));
      setAPIRequests(transformed);
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex justify-between">
        <span className={clsx(textGradient)}>usage</span>
        <DatePickerWithRange date={date} onDateChange={setDate} />
      </div>
      <div className="py-[16px]" />
      <span className="text-gray-light">llms model</span>
      <div className="py-[10px]" />
      <div className="flex justify-between">
        <div className="flex gap-10">
          <span className="text-gray-light">
            <strong className="underline text-white">?</strong> total cost
          </span>
          <span className="text-gray-light">
            <strong className="underline text-white">?</strong> total input
            tokens
          </span>
          <span className="text-gray-light">
            <strong className="underline text-white">?</strong> total output
            tokens
          </span>
        </div>
        <Form {...form}>
          <FormItem aria-labelledby="models" className="w-[120px]">
            <Select defaultValue="all models">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="w-[286px] left-0 -top-[4px] p-[8px_8px_20px_10px] cutCorner cutCorner__white">
                {models?.data?.length > 0 ? (
                  models?.data?.map((item: string) => (
                    <SelectItem className="text-[14px]" key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem className="text-[14px]" value="all models">
                    all models
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </Form>
      </div>
      <div className="py-[10px]" />
      <ResponsiveContainer width="100%" height={302}>
        <BarChart data={UNCHANGED_DATA} barSize={36}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="input" stackId="a" fill="#606060" />
          <Bar dataKey="output" stackId="a" fill="#303030" />
        </BarChart>
      </ResponsiveContainer>
      <div className="py-[15px]" />
      <span className="text-gray-light">api request</span>
      <div className="py-[10px]" />
      <span className="text-gray-light">
        <strong className="underline text-white">
          {data?.data?.totalRequests}
        </strong>{" "}
        api request
      </span>
      <div className="py-[10px]" />
      {apiRequests.length > 0 ? (
        <ResponsiveContainer width="100%" height={302}>
          <LineChart width={1040} height={302} data={apiRequests}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip
              itemStyle={{ color: "#000000" }}
              labelStyle={{ color: "gray" }}
            />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#ffffff" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <EmptyAPIRequests from={date.from} />
      )}
    </div>
  );
}

export const EmptyAPIRequests = ({ from }: { from: number }) => {
  const last7Days = generateLast7Days(from);

  return (
    <ResponsiveContainer width="100%" height={302}>
      <LineChart width={1040} height={302} data={[]} margin={{ top: 40 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          domain={last7Days}
          tickFormatter={(value, index) => (index === 0 ? "" : value)}
        />
        <YAxis
          domain={[0, 4]}
          tickFormatter={(_, index) => (index === 0 ? "0" : "")}
          tickLine={false}
          label={{
            value: "count",
            position: "top",
            fill: "#ffffff",
            offset: 20,
            dx: 50,
          }}
        />
        <Tooltip
          itemStyle={{ color: "#000000" }}
          labelStyle={{ color: "gray" }}
        />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#ffffff" />
      </LineChart>
    </ResponsiveContainer>
  );
};