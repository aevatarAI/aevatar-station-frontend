import { request } from "@/api";
import { getProjectMembers, type IMemberItem } from "@/api/utils/project";
import AddMembersDialog from "@/components/AddMembersDialog";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";
import { columns } from "@/components/ProjectMember/columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { textGradient } from "@/constants/cls";
import { useToast } from "@/hooks/use-toast";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";
import {
  CURRENT_PROJECT_ATOM,
  CURRENT_PROJECT_ROLE_ATOM,
  ORGANIZATION_MEMBER_ATOM,
} from "@/state/atoms/organisation";
import { handleErrorMessage, sleep } from "@etransfer/utils";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function ProjectMember() {
  const [memberList, setMemberList] = useState<IMemberItem[]>([]);
  const [loading, setLoading] = useState<boolean>();

  const { toast } = useToast();
  const [roleList] = useAtom(CURRENT_PROJECT_ROLE_ATOM);
  const [projectId] = useAtom(CURRENT_PROJECT_ATOM);

  const userPermissions = useProjectPermissions();

  const getMembers = useCallback(async () => {
    try {
      setLoading(true);
      if (!projectId) return;
      const result = await getProjectMembers(projectId);
      setLoading(false);
      setMemberList(result);
    } catch (error) {
      toast({
        description: handleErrorMessage(error),
      });
      setLoading(false);
    }
  }, [toast, projectId]);

  useEffect(() => {
    getMembers();
  }, [getMembers]);

  const onChangeRole = useCallback(
    async (userId: string, roleId: string) => {
      try {
        await request.projects.editProjectRoles({
          data: {
            userId,
            roleId,
          },
        });
        toast({
          description: "Successfully",
        });
        await sleep(500);
        getMembers();
      } catch (error) {
        toast({
          description: handleErrorMessage(error),
        });
      }
    },
    [toast, getMembers]
  );

  const onSetMember = useCallback(
    async (email: string, join: boolean, roleId: string) => {
      try {
        const result = await request.projects.editProjectMembers({
          data: {
            email,
            join,
            roleId,
          },
        });
        console.log(result, "result==");
        toast({
          description: `successfully ${join ? "invited" : "removed"}`,
        });
        await sleep(1000);
        getMembers();
      } catch (error) {
        toast({
          description: handleErrorMessage(error),
        });
      }
    },
    [toast, getMembers]
  );

  const tableData = useMemo(
    () =>
      memberList.map((item) => ({
        ...item,
        role: !item.roleId ? (
          <span className="text-[12px] font-syne font-semibold">
            invite pending
          </span>
        ) : (
          <Select
            value={item.roleId}
            onValueChange={(v) => onChangeRole(item.id, v)}>
            <SelectTrigger className="border-none p-0 justify-start items-center bg-transparent">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="w-[193px] left-[0] -left-[70px] top-[4px] py-[16px] px-[22px] cutCorner cutCorner__white">
              {roleList.map((item) => (
                <SelectItem
                  className="text-[14px]"
                  key={item.id}
                  value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ),
        operation: (
          <div className="flex items-center justify-between gap-[7px] pl-[20px]">
            {userPermissions.projectsMembersManage ? (
              <DeleteDialog
                onYes={() => onSetMember(item.email, false, item.roleId || "")}
                title={"Are you sure you want to delete the member?"}
                description={
                  "*Once deleted, the existing member will become invalid."
                }
              />
            ) : (
              <span />
            )}
          </div>
        ),
      })),
    [memberList, roleList, userPermissions, onSetMember, onChangeRole]
  );

  const [orgMemberList] = useAtom(ORGANIZATION_MEMBER_ATOM);

  return (
    <div>
      <div className="flex justify-between items-center pb-[30px]">
        <div className={clsx(textGradient)}>projects members</div>

        {userPermissions.projectsMembersManage ? (
          <AddMembersDialog
            defaultRoleId={roleList[0]?.id}
            orgMemberList={orgMemberList}
            onAddMember={(values) =>
              onSetMember(values.email, true, values.role)
            }
          />
        ) : (
          <span />
        )}
      </div>
      <DataTable
        className={clsx(!loading && memberList.length && "min-w-[600px]")}
        tableHeadClassName={"first:pl-[15px] "}
        columns={columns}
        loading={loading}
        data={tableData}
      />
    </div>
  );
}
