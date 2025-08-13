import { request } from "@/api";
import {
  type IMemberItem,
  IMemberStatus,
  getOrganizationMembers,
} from "@/api/utils/organization";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";
import InviteMembersDialog from "@/components/InviteMembersDialog";
import { columns } from "@/components/OrganisationMember/columns";
import {
  Select,
  SelectContentHypotenuse,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { textGradient } from "@/constants/cls";
import { useToast } from "@/hooks/use-toast";
import { useOrgPermissions } from "@/hooks/useOrgPermissions";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_ORGANIZATION_ROLE_ATOM,
  ORGANIZATION_MEMBER_ATOM,
} from "@/state/atoms/organisation";
import { USER_PROFILE_ATOM } from "@/state/atoms/profile";
import { handleErrorMessage } from "@/utils/error";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function OrganisationMember() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>();
  const [memberList, setMemberList] = useAtom(ORGANIZATION_MEMBER_ATOM);
  const [organizationId] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const [roleList] = useAtom(CURRENT_ORGANIZATION_ROLE_ATOM);
  const userPermissions = useOrgPermissions();
  const [profile] = useAtom(USER_PROFILE_ATOM);

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
        if (!organizationId) return;

        await request.organizations.editOrganizationRoles({
          query: organizationId,

          data: {
            userId,
            roleId,
          },
        });
        toast({
          description: "successfully saved",
        });
        getMembers();
      } catch (error) {
        toast({
          description: handleErrorMessage(error),
        });
      }
    },
    [organizationId, toast, getMembers],
  );

  const onSetMember = useCallback(
    async (email: string, join: boolean, roleId: string) => {
      try {
        if (!organizationId) return;
        await request.organizations.editOrganizationMembers({
          query: organizationId,
          data: {
            email,
            join,
            roleId,
          },
        });

        toast({
          description: `successfully ${join ? "invited" : "removed"}`,
        });
        getMembers();
      } catch (error) {
        toast({
          description: handleErrorMessage(error),
        });
      }
    },
    [organizationId, toast, getMembers],
  );

  const getRoleName = useCallback(
    (roleId: string) =>
      roleList
        .find((roleItem) => roleItem.id === roleId)
        ?.name?.split("_")[1] ?? "--",
    [roleList],
  );

  const tableData = useMemo(
    () =>
      memberList.map((item) => ({
        ...item,
        role: (
          <>
            {!userPermissions?.organizationMembersManage ||
            item.email === profile?.email ||
            item.status !== IMemberStatus.joined ? (
              <div className="text-[13px] font-outfit font-semibold lowercase">
                {item.roleId && getRoleName(item.roleId)}
                {item.status === IMemberStatus.refused && "rejected"}
                {item.status === IMemberStatus.pending && "invite pending"}
              </div>
            ) : (
              <Select
                value={item.roleId ?? ""}
                onValueChange={(v) => onChangeRole(item.id, v)}
              >
                <SelectTrigger className="border-none p-0 justify-start items-center bg-transparent">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContentHypotenuse wrapperClassName="w-[193px] left-0 -left-[70px] top-[4px]">
                  {roleList.map((roleItem) => (
                    <SelectItem
                      className="text-[16px]"
                      key={roleItem.id}
                      value={roleItem.id}
                    >
                      {roleItem.name.split("_")[1]}
                    </SelectItem>
                  ))}
                </SelectContentHypotenuse>
              </Select>
            )}
          </>
        ),
        operation: (
          <div className="flex items-center justify-between gap-[7px] pl-[20px]">
            {userPermissions.organizationMembersManage &&
            item.email !== profile?.email ? (
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
    [
      memberList,
      userPermissions,
      roleList,
      profile,
      getRoleName,
      onSetMember,
      onChangeRole,
    ],
  );

  return (
    <div>
      <div className="flex justify-between items-center pb-[30px]">
        <div className={clsx(textGradient)}>Organisation members</div>
        {userPermissions.organizationMembersManage ? (
          <InviteMembersDialog
            defaultRole={roleList[0]?.id}
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
