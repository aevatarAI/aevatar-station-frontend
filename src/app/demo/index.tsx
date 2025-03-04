import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { myPersistentAtom } from "@/state/persistentAtom";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { type Payment, columns } from "./columns";

async function getData(): Promise<Payment[]> {
  // Fetch data from api
  return [
    {
      id: "728ed52f",
      members: 100,
      name: "test",
      domainName: "m@example.com",
      created: "21.01.2025",
    },
  ];
}
function AtomInput() {
  const [value, setValue] = useAtom(myPersistentAtom);
  return (
    <div>
      <span className="text-white">input: {value}</span>
      <Input
        className=" w-[200px] text-white"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
export default function DemoPage() {
  const [data, setData] = useState<Payment[]>([]);

  useEffect(() => {
    getData().then(setData);
  }, []);

  const tableData = data.map((item) => ({
    ...item,
    operation: (
      <Button onClick={() => alert(`Action for ${item.id}`)}>Action</Button>
    ),
  }));

  return (
    <div className="container mx-auto p-10 flex gap-4 flex-col">
      <DataTable columns={columns} data={tableData} />
      <AtomInput />
    </div>
  );
}
