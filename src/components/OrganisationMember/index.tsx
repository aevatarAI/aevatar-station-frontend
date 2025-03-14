import {
  getOrganizationMembers,
  type IMemberItem,
} from "@/api/utils/organization";
import InviteMembersDialog from "@/components/InviteMembersDialog";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";
import { columns } from "@/components/OrganisationMember/columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { textGradient } from "@/constants/cls";
import { useToast } from "@/hooks/use-toast";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_ORGANIZATION_ROLE_ATOM,
  ORGANIZATION_MEMBER_ATOM,
} from "@/state/atoms/organisation";
import { handleErrorMessage, sleep } from "@etransfer/utils";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { request } from "@/api";

export default function OrganisationMember() {
  const [memberList, setMemberList] = useAtom(ORGANIZATION_MEMBER_ATOM);
  const [loading, setLoading] = useState<boolean>();
  const [organizationId] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const { toast } = useToast();
  const [roleList] = useAtom(CURRENT_ORGANIZATION_ROLE_ATOM);

  const userPermissions = useUserPermissions();

  const getMembers = useCallback(async () => {
    try {
      setLoading(true);
      if (!organizationId) return;
      const result = await getOrganizationMembers(organizationId);
      setLoading(false);
      setMemberList(result);
    } catch (error) {
      toast({
        description: handleErrorMessage(error),
      });
      setLoading(false);
    }
  }, [toast, organizationId, setMemberList]);

  useEffect(() => {
    getMembers();
  }, [getMembers]);

  const onChangeRole = useCallback(
    async (userId: string, roleId: string) => {
      try {
        await request.organizations.editOrganizationRoles({
          data: {
            userId,
            roleId,
          },
        });
        toast({
          description: "Successfully",
        });
      } catch (error) {
        toast({
          description: handleErrorMessage(error),
        });
      }
    },
    [toast]
  );

  const onSetMember = useCallback(
    async (email: string, join: boolean, roleId: string) => {
      try {
        const result = await request.organizations.editOrganizationMembers({
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
        role: (
          <>
            {item.roleId ? (
              <Select
                value={item.roleId}
                onValueChange={(v) => onChangeRole(item.id, v)}>
                <SelectTrigger className="border-none p-0 justify-start items-center bg-transparent">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="w-[193px] left-[0] -left-[70px] top-[4px] py-[16px] px-[22px] cutCorner cutCorner__white">
                  {roleList.map((roleItem) => (
                    <SelectItem
                      className="text-[14px]"
                      key={roleItem.roleId}
                      value={roleItem.roleId}>
                      {roleItem.roleName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-[12px] font-syne">invite pending</div>
            )}
          </>
        ),
        operation: (
          <div className="flex items-center justify-between gap-[7px] pl-[20px]">
            {userPermissions.memberDelete ? (
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
    [memberList, userPermissions, roleList, onSetMember, onChangeRole]
  );

  return (
    <div>
      <div className="flex justify-between items-center pb-[30px]">
        <div className={clsx(textGradient)}>Organisation name members</div>
        {userPermissions.memberAdd ? (
          <InviteMembersDialog
            defaultRole={roleList[0]?.roleId}
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
        tableHeadClassName={"first:pl-[15px]"}
        columns={columns}
        loading={loading}
        data={tableData}
      />
    </div>
  );
}
