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
import { generateDates } from "@/utils/helpers";
import { useIsMobile } from "@/hooks/useIsMobile";

const UNCHANGED_DATA = [
  {
    name: "18/04",
    input: 8,
    output: 3,
  },
  {
    name: "19/04",
    input: 4,
    output: 4,
  },
  {
    name: "20/04",
    input: 12,
    output: 3,
  },
  {
    name: "21/04",
    input: 12,
    output: 3,
  },
  {
    name: "22/04",
    input: 9,
    output: 3,
  },
  {
    name: "23/04",
    input: 9,
    output: 2,
  },
  {
    name: "24/04",
    input: 3,
    output: 3,
  },
];

interface Results {
  time: string;
  count: number;
}

const processRequestData = (data: any): Results[] => {
  if (!data?.data?.requests?.length) {
    return [];
  }

  const dailyCounts: { [key: string]: number } = {};

  data.data.requests.forEach((request: any) => {
    const day = dayjs.utc(request.time).local().format("DD/MM");

    dailyCounts[day] = (dailyCounts[day] || 0) + request.count;
  });

  return Object.entries(dailyCounts).map(([day, count]) => ({
    time: day,
    count,
  }));
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any;
  label?: string;
}) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="custom-tooltip bg-black p-1.5 border-[#303030]">
      <p className="label font-['source_code_pro'] text-[#B9B9B9] text-[10px] my-0.5">
        {label}
      </p>
      {payload.map((entry: any, index: number) => {
        return (
          <p
            className="font-['source_code_pro'] text-[10px] my-[2px]"
            key={`item-${index}`}
          >
            <span style={{ color: entry.color }}>{entry.name}: </span>
            <span className="font-color-white">{entry.value}</span>
          </p>
        );
      })}
    </div>
  );
};

export function Usage() {
  const form = useForm();
  const [apiRequests, setAPIRequests] = useState<Results[]>([]);
  const [date, setDate] = useState({
    from: dayjs().subtract(6, "day").startOf("day").valueOf(),
    to: dayjs().endOf("day").valueOf(),
  });

  const { data, isLoading } = useGetAPIRequests(date);
  const { data: models } = useGetSystemModels();
  const { data: tokens } = useGetLLMTokens();
  const { isMobile } = useIsMobile();

  useEffect(() => {
    const results = processRequestData(data);
    setAPIRequests(results);
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="pb-[25px]">
      <div className="flex max-[768px]:flex-col max-[768px]:items-start justify-between items-center">
        <span className={clsx(textGradient)}>usage</span>
        <DatePickerWithRange date={date} onDateChange={setDate} />
      </div>
      <div className="max-[768px]:h-[1px] max-[768px]:my-[30px] max-[768px]:bg-[#303030] min-[769px]:py-[15px]" />
      <span className="text-[14px] text-gray-light font-semibold max-[768px]:text-white">
        llms model
      </span>
      <div className="py-[10px]" />
      <div className="flex justify-between items-center max-[768px]:grid max-[768px]:justify-normal max-[768px]:items-start">
        <div className="flex max-[768px]:grid max-[768px]:grid-cols-2 max-[768px]:gap-[5px] gap-[10px]">
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
        <div className="max-[768px]:py-[10px]" />
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
      <div className="bg-[#141415] pt-[9px] pr-[35px] pb-[24px] pl-0">
        <ResponsiveContainer width="100%" height={302}>
          <BarChart
            data={UNCHANGED_DATA}
            barSize={isMobile ? 19 : 36}
            margin={{ top: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#303030" />
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
            <Tooltip
              content={(props) => <CustomTooltip {...props} />}
              cursor={{ fill: "#FFFFFF", opacity: 0.05 }}
            />
            <Legend
              wrapperStyle={{ paddingLeft: isMobile ? 44 : 0 }}
              formatter={(value) => (
                <span className="font-source-code text-white text-[10px]">
                  {value}
                </span>
              )}
            />
            <Bar
              dataKey="output"
              name="total output tokens"
              stackId="a"
              fill="#303030"
            />
            <Bar
              dataKey="input"
              name="total input tokens"
              stackId="a"
              fill="#606060"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="py-[15px]" />
      <span className="text-[14px] text-gray-light font-semibold max-[768px]:text-white">
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
      <div className="bg-[#141415] pt-[30px] pr-[35px] pb-[24px] pl-0">
        {apiRequests.length > 0 ? (
          <ResponsiveContainer width="100%" height={302}>
            <LineChart width={1040} height={302} data={apiRequests}>
              <CartesianGrid strokeDasharray="3 3" stroke="#303030" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip
                content={(props) => <CustomTooltip {...props} />}
                cursor={{ fill: "#FFFFFF", opacity: 0.05 }}
              />
              <Legend
                wrapperStyle={{
                  paddingLeft: isMobile ? 44 : 0,
                }}
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
          <EmptyAPIRequests from={date.from} to={date.to} isMobile={isMobile} />
        )}
      </div>
    </div>
  );
}

export const EmptyAPIRequests = ({
  from,
  to,
  isMobile,
}: {
  from: number;
  to: number;
  isMobile: boolean;
}) => {
  const days = generateDates(from, to);

  return (
    <ResponsiveContainer width="100%" height={302}>
      <LineChart width={1040} height={302} data={[]} margin={{ top: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#303030" />
        <XAxis dataKey="time" domain={days} />
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
          content={(props) => <CustomTooltip {...props} />}
          cursor={{ fill: "#FFFFFF", opacity: 0.05 }}
        />
        <Legend
          wrapperStyle={{
            paddingLeft: isMobile ? 44 : 0,
          }}
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