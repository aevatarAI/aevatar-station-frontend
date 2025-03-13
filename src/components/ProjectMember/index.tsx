import AddMembersDialog from "@/components/AddMembersDialog";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";
import { type IMemberList, columns } from "@/components/ProjectMember/columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { textGradient } from "@/constants/cls";
import { sleep } from "@etransfer/utils";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";

const roleList = ["owner", "member"];

export default function ProjectMember() {
  const [memberList, setMemberList] = useState<IMemberList[]>([]);
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    setLoading(true);
    sleep(1000).then(() => {
      setMemberList([
        {
          id: "1",
          name: "test",
          email: "user123@aelf.io",
          isRemove: true,
          projectRole: "owner",
        },
        {
          id: "2",
          name: "test",
          email: "user@aelf.io",
          isRemove: false,
          projectRole: "owner",
        },
        {
          id: "4",
          name: "test",
          email: "user123@aelf.io",
          isRemove: false,
          projectRole: "pending",
        },
      ]);
      setLoading(false);
    });
  }, []);

  const onDeleteYes = useCallback(async () => {
    await sleep(1000);
  }, []);

  const onChangeRole = useCallback(async (id: string, role: string) => {
    await sleep(1000);
  }, []);

  const tableData = useMemo(
    () =>
      memberList.map((item) => ({
        ...item,
        role:
          item.projectRole === "pending" ? (
            <span className="text-[12px] font-syne">invite pending</span>
          ) : (
            <Select
              value={item.projectRole}
              onValueChange={(v) => onChangeRole(item.id, v)}
            >
              <SelectTrigger className="border-none p-0 justify-start items-center bg-transparent">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="w-[193px] left-[0] -left-[70px] top-[4px] py-[16px] px-[22px] cutCorner cutCorner__white">
                {roleList.map((item) => (
                  <SelectItem className="text-[14px]" key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ),
        operation: (
          <div className="flex items-center justify-between gap-[7px] pl-[20px]">
            {item.isRemove ? (
              <DeleteDialog
                onYes={onDeleteYes}
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
    [memberList, onDeleteYes, onChangeRole],
  );

  return (
    <div>
      <div className="flex justify-between items-center pb-[30px]">
        <div className={clsx(textGradient)}>Organisation name members</div>
        <AddMembersDialog />
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
