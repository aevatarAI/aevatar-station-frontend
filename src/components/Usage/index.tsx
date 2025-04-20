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
  const { data, isLoading } = useGetAPIRequests();
  const { data: models } = useGetSystemModels();
  const { data: tokens } = useGetLLMTokens();
  const [apiRequests, setAPIRequests] = useState([]);

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
        <span className={clsx(textGradient)}>api keys</span>
        <DatePickerWithRange />
      </div>
      <div className="py-[16px]" />
      <span className="text-gray-light">llms model</span>
      <div className="py-[10px]" />
      <div className="flex justify-between">
        <div className="flex gap-10">
          <span className="text-gray-light">
            <strong className="underline text-white">$0.00</strong> total cost
          </span>
          <span className="text-gray-light">
            <strong className="underline text-white">1.1m</strong> total input
            tokens
          </span>
          <span className="text-gray-light">
            <strong className="underline text-white">1.1m</strong> total output
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
        <strong className="underline text-white">1.1m</strong> api request
      </span>
      <div className="py-[10px]" />
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
    </div>
  );
}
