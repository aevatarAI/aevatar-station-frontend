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
import ApiKeys from "@/components/ApiKeys";
import { SideBar } from "@/components/SideBar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useCloseDialog } from "@/hooks/useCloseDialog";
import { useSideBarParams } from "@/hooks/useSideBarParams";
import { useUpdateOrganisations } from "@/hooks/useUpdateOrganisations";
import clsx from "clsx";
import { textGradient } from "@/constants/cls";
import { Form, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useGetAPIRequests } from "@/hooks/useGetAPIRequests";

const data = [
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

const requests = [
  {
    time: "01/03",
    api: 2400,
  },
  {
    time: "02/03",
    api: 1398,
  },
  {
    time: "03/03",
    api: 9800,
  },
  {
    time: "04/03",
    api: 3908,
  },
];

export function Usage() {
  const form = useForm();
  const { data: apiRequests, isPending } = useGetAPIRequests();

  return (
    <div>
      <div className="flex justify-between">
        <span className={clsx(textGradient)}>api keys</span>
        <span>01/03/2025 - 04/03/2025</span>
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
                {["all models"].map((item) => (
                  <SelectItem className="text-[14px]" key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </Form>
      </div>
      <div className="py-[10px]" />
      <ResponsiveContainer width="100%" height={302}>
        <BarChart data={data}>
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
      {!isPending ? (
        <ResponsiveContainer width="100%" height={302}>
          <LineChart width={1040} height={302} data={requests}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="api" stroke="#ffffff" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
}

export default function Dashboard() {
  useUpdateOrganisations();
  const [, selectTab] = useSideBarParams();
  const { ref, handleClose } = useCloseDialog();
  return (
    <>
      <Sheet>
        <SheetContent className="hidden lg:block w-[200px] bg-[#191919] min-w-[200px]">
          <DialogClose className="hidden" ref={ref} />
          <SideBar onClose={handleClose} />
        </SheetContent>
      </Sheet>
      <div className="pt-[31px] px-[20px] flex-1 overflow-auto">
        {selectTab === "apikeys" && <ApiKeys />}
        {selectTab === "usage" && <Usage />}
      </div>
    </>
  );
}
