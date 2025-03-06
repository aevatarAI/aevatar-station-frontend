import ApiKeys from "@/components/ApiKeys";
import { SideBar } from "@/components/SideBar";
import { useMemo } from "react";
import { useParams } from "wouter";

export default function Dashboard() {
  const params = useParams();

  const currentTab = useMemo(() => params?.tab ?? "apiKeys", [params?.tab]);

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="hidden lg:block w-[200px] h-[calc(100vh-60px)] bg-[#191919]">
        <SideBar />
      </div>
      <div className="pt-[31px] px-[20px]">
        {currentTab === "apiKeys" && <ApiKeys />}
      </div>
    </div>
  );
}
