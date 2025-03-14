import { request } from "@/api";
import OrganisationInner from "@/components/OrganisationInner";
import ProfileInner from "@/components/ProfileInner";
import ProjectsInner from "@/components/ProjectsInner";
import { SideBar } from "@/components/SideBar";
import { useSideBarParams } from "@/hooks/useSideBarParams";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function Profile() {
  useWebSocket();
  const [selectMenu, selectTab] = useSideBarParams();

  return (
    <div className="flex flex-col lg:flex-row  h-[calc(100vh-60px)]">
      <div className="hidden lg:block w-[200px] bg-[#191919] min-w-[200px]">
        <SideBar />
      </div>
      <div className="pt-[31px] lg:pt-[39px] px-[20px] lg:pl-[43px] lg:pr-[40px] flex-1 overflow-auto">
        {selectMenu === "profile" && <ProfileInner tab={selectTab} />}
        {selectMenu === "organisation" && <OrganisationInner tab={selectTab} />}
        {selectMenu === "projects" && <ProjectsInner tab={selectTab} />}
      </div>
    </div>
  );
}
