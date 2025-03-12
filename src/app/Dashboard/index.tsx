import ApiKeys from "@/components/ApiKeys";
import { SideBar } from "@/components/SideBar";
import { useSideBarParams } from "@/hooks/useSideBarParams";
import { useUpdateOrganisations } from "@/hooks/useUpdateOrganisations";

export default function Dashboard() {
  const [, selectTab] = useSideBarParams();
  // TODO
  useUpdateOrganisations();
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-60px)]">
      <div className="hidden lg:block w-[200px]  bg-[#191919] min-w-[200px]">
        <SideBar />
      </div>
      <div className="pt-[31px] px-[20px] flex-1 overflow-auto">
        {selectTab === "apikeys" && <ApiKeys />}
      </div>
    </div>
  );
}
