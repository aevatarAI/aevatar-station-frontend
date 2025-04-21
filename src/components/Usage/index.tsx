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

export const useIsMobile = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return { isMobile: width <= 768 };
};

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
  const isMobile = useIsMobile();

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
    <div className="pb-[25px]">
      <div className="flex max-[400px]:flex-col max-[400px]:items-start justify-between items-center">
        <span className={clsx(textGradient)}>usage</span>
        <DatePickerWithRange date={date} onDateChange={setDate} />
      </div>
      <div className="max-[400px]:h-[1px] max-[400px]:my-[30px] max-[400px]:bg-[#303030] min-[401px]:py-[15px]" />
      <span className="text-[14px] text-gray-light font-semibold max-[400px]:text-white">
        llms model
      </span>
      <div className="py-[10px]" />
      <div className="flex justify-between items-center max-[400px]:grid max-[400px]:justify-normal max-[400px]:items-start">
        <div className="flex max-[400px]:grid max-[400px]:grid-cols-2 max-[400px]:gap-[5px] gap-[10px]">
          <span className="text-gray-light font-semibold text-[15px]">
            <strong className="underline text-white">?</strong>{" "}
            <span>total cost</span>
          </span>
          <span className="text-gray-light font-semibold text-[15px]">
            <strong className="underline text-white">?</strong>{" "}
            <span>total input tokens</span>
          </span>
          <span className="text-gray-light font-semibold text-[15px]">
            <strong className="underline text-white">?</strong>{" "}
            <span>total output tokens</span>
          </span>
        </div>
        <div className="max-[400px]:py-[10px]" />
        <div className="justify-self-end self-end">
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
                      <SelectItem
                        className="text-[14px]"
                        key={item}
                        value={item}
                      >
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
      </div>
      <div className="py-[10px]" />
      <div className="bg-[#1e1e1f] pt-[9px] pr-[35px] pb-[24px] pl-0">
        <ResponsiveContainer width="100%" height={302}>
          <BarChart
            data={UNCHANGED_DATA}
            barSize={isMobile ? 19 : 36}
            margin={{ top: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              label={{
                fontSize: 10,
                fontFamily: "Source code pro",
                value: "tokens",
                position: "top",
                fill: "#ffffff",
                offset: 20,
                dx: 46,
              }}
            />
            <Tooltip />
            <Legend
              formatter={(value) => (
                <span className="font-source-code text-white text-[10px]">
                  {value}
                </span>
              )}
            />
            <Bar
              dataKey="input"
              name="total input tokens"
              stackId="a"
              fill="#606060"
            />
            <Bar
              dataKey="output"
              name="total output tokens"
              stackId="a"
              fill="#303030"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="py-[15px]" />
      <span className="text-[14px] text-gray-light font-semibold max-[400px]:text-white">
        api request
      </span>
      <div className="py-[10px]" />
      <span className="text-gray-light font-semibold text-[15px]">
        <strong className="underline text-white">
          {data?.data?.totalRequests}
        </strong>{" "}
        api request
      </span>
      <div className="py-[10px]" />
      <div className="bg-[#1e1e1f] pt-[30px] pr-[35px] pb-[24px] pl-0">
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
              <Legend
                formatter={(value) => (
                  <span className="font-source-code text-white text-[10px]">
                    {value}
                  </span>
                )}
              />
              <Line type="monotone" dataKey="count" stroke="#ffffff" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyAPIRequests from={date.from} />
        )}
      </div>
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
            fontSize: 10,
            fontFamily: "Source code pro",
            value: "count",
            position: "top",
            fill: "#ffffff",
            offset: 20,
            dx: 46,
          }}
        />
        <Tooltip
          itemStyle={{ color: "#000000" }}
          labelStyle={{ color: "gray" }}
        />
        <Legend
          formatter={(value) => (
            <span className="font-source-code text-white text-[10px]">
              {value}
            </span>
          )}
        />
        <Line type="monotone" dataKey="count" stroke="#ffffff" />
      </LineChart>
    </ResponsiveContainer>
  );
};