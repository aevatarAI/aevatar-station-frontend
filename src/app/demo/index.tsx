import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
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
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={tableData} />
    </div>
  );
}
