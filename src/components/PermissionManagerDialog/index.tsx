import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "@/assets/loading.svg?react";
import clsx from "clsx";
import { useToast } from "@/hooks/use-toast";
import {
  inviteMembersForm,
  type TInviteMembersKeyForm,
} from "@/constants/form/inviteMembers";
import type { CheckedState } from "@radix-ui/react-checkbox";
import {
  menuItemClx,
  menuItemSelectedClx,
  menuItemTextClx,
} from "@/constants/cls";
import CheckboxLabel from "@/components/CheckboxLabel";
import LoadingButton from "@/components/LoadingButton.tsx";

const checkboxCls =
  "border-[#989DA0] bg-white  disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#606060] data-[state=checked]:border-[#606060]";

type TChildPermission = {
  permission: string;
  permissionList: string[];
  checked: string[];
};

type TPermission = {
  permission: string;
  permissionList: TChildPermission[];
};

const permission: TPermission[] = [
  {
    permission: "book store",
    permissionList: [
      {
        permission: "author_management",
        permissionList: [
          "author_management_create_books",
          "author_management_delete_books",
          "author_management_edit_books",
        ],
        checked: [
          "author_management_create_books",
          "author_management_delete_books",
        ],
      },
    ],
  },
  {
    permission: "identity management",
    permissionList: [
      {
        permission: "identity_management",
        permissionList: [
          "identity_management_create_books",
          "identity_management_delete_books",
          "identity_management_edit_books",
        ],
        checked: [],
      },
    ],
  },
  {
    permission: "tenant management",
    permissionList: [
      {
        permission: "tenant_management",
        permissionList: [
          "tenant_management_create_books",
          "tenant_management_delete_books",
          "tenant_management_edit_books",
        ],
        checked: [
          "tenant_management_create_books",
          "tenant_management_delete_books",
          "tenant_management_edit_books",
        ],
      },
      {
        permission: "tenant1_management",
        permissionList: [
          "tenant1_management_create_books",
          "tenant1_management_delete_books",
          "tenant1_management_edit_books",
        ],
        checked: [
          "tenant1_management_create_books",
          "tenant1_management_edit_books",
        ],
      },
    ],
  },
];

export interface IPermissionManagerDialogProps {
  onSave: (value: {
    [x in string]: { [x in string]: TChildPermission };
  }) => Promise<void>;
}
export default function PermissionManagerDialog({
  onSave,
}: IPermissionManagerDialogProps) {
  const form = useForm<TInviteMembersKeyForm>({
    resolver: zodResolver(inviteMembersForm),
    defaultValues: {
      role: "owner",
    },
  });
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    open && form.reset();
  }, [form, open]);

  const [permissionMap, setPermissionMap] =
    useState<{ [x in string]: { [x in string]: TChildPermission } }>();

  useEffect(() => {
    const map: { [x in string]: { [x in string]: TChildPermission } } = {};
    permission.forEach((item) => {
      const itemMap: { [x in string]: TChildPermission } = {};
      item.permissionList.forEach((child) => {
        itemMap[child.permission] = child;
      });
      map[item.permission] = itemMap;
      return item.permission;
    });
    setPermissionMap(map);
  }, []);

  const titles = useMemo(() => permission.map((item) => item.permission), []);

  const [permissionTab, setPermissionTab] = useState<string>(titles[0]);

  const currentPermission = useMemo(
    () => permissionMap?.[permissionTab],
    [permissionMap, permissionTab]
  );

  const checkChildAllSelect = useCallback(
    (list?: string[], checkedList?: string[]) =>
      list?.length === checkedList?.length &&
      list?.every((item) => checkedList?.includes(item)),
    []
  );

  const allSelected = useMemo(() => {
    return Object.entries(permissionMap ?? {}).every((permissionItem) => {
      return Object.entries(permissionItem[1]).every((childItem) =>
        checkChildAllSelect(childItem[1].permissionList, childItem[1].checked)
      );
    });
  }, [permissionMap, checkChildAllSelect]);

  const allChildSelected = useCallback(
    (permissionTab: string) => {
      return Object.entries(permissionMap?.[permissionTab] ?? {}).every(
        (permissionItem) => {
          return checkChildAllSelect(
            permissionItem[1].permissionList,
            permissionItem[1].checked
          );
        }
      );
    },
    [permissionMap, checkChildAllSelect]
  );

  const onChildPermissionCheckedChange = useCallback(
    (
      checked: CheckedState,
      permissionItem: string,
      childPermission: string,
      permission: string
    ) => {
      setPermissionMap((v) => {
        if (!v) return v;

        if (!v[permission]) return v;
        if (!v[permission][childPermission]) return v;

        if (checked === true) {
          v[permission][childPermission].checked.push(permissionItem);
        } else if (!checked) {
          v[permission][childPermission].checked = v[permission][
            childPermission
          ].checked.filter((item) => item !== permissionItem);
        }
        return { ...v };
      });
    },
    []
  );

  const onChildPermissonAllChecked = useCallback(
    (checked: CheckedState, childPermission: string, permission: string) => {
      setPermissionMap((v) => {
        if (!v?.[permission]?.[childPermission]) return v;
        if (checked === true) {
          v[permission][childPermission].checked =
            v[permission][childPermission].permissionList;
        } else if (!checked) {
          v[permission][childPermission].checked = [];
        }
        return { ...v };
      });
    },
    []
  );

  const onAllCheckedChange = useCallback((checked: CheckedState) => {
    setPermissionMap((v) => {
      if (!v) return;
      Object.entries(v).map((permissionItem) =>
        Object.entries(permissionItem[1]).map((childPermission) => {
          childPermission[1].checked =
            checked === true ? childPermission[1].permissionList : [];
          return childPermission;
        })
      );
      return { ...v };
    });
  }, []);

  const onAllChildCheckedChange = useCallback(
    (checked: CheckedState, permission: string) => {
      setPermissionMap((v) => {
        if (!v?.[permission]) return;
        Object.entries(v[permission]).forEach((childPermission) => {
          v[permission][childPermission[0]].checked =
            checked === true ? childPermission[1].permissionList : [];
        });
        return { ...v };
      });
    },
    []
  );

  const onSaveHandler = useCallback(async () => {
    if (!permissionMap) return;
    await onSave(permissionMap);
    toast({
      title: "",
      description: "successfully saved",
    });
  }, [onSave, permissionMap, toast]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="py-[6px] px-[16px] font-pro text-[12px] font-normal leading-[15px] border-none bg-[#303030]">
          edit permissions
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby="create new api key"
        className="sm:max-w-[636px] p-5 flex gap-0 flex-col rounded-[6px] border border-[#303030]">
        <DialogHeader>
          <DialogTitle className="text-left aevatarai-text-gradient-center inline text-[18px] font-semibold leading-[22px] lowercase pb-[18px] border-b border-[#303030]">
            Permission - manager
          </DialogTitle>
        </DialogHeader>
        <div className="pt-[18px]">
          <CheckboxLabel
            wrapperClassName="pb-[18px] pt-0 border-b border-[#303030]"
            checked={allSelected}
            onCheckedChange={onAllCheckedChange}
            text="grant all permissions"
          />
          <div className="h-[387px] lg:h-[260px] overflow-auto flex flex-col">
            <div className="flex flex-col lg:flex-row gap-[8px] pt-[20px]">
              <div className="flex flex-row lg:flex-col gap-[10px] overflow-auto pb-[20px] ">
                {titles.map((title) => (
                  <div
                    key={title}
                    onClick={() => setPermissionTab(title)}
                    className={clsx(
                      menuItemClx,
                      permissionTab === title && menuItemSelectedClx,
                      "whitespace-nowrap",
                      "lg:max-w-[162px] lg:whitespace-normal"
                    )}>
                    <span className={clsx(menuItemTextClx)}>{title}</span>
                  </div>
                ))}
              </div>
              {/* permission card */}
              <div className="flex-1">
                <div className="aevatarai-text-gradient-center font-syne text-[18px] font-semibold leading-[22px] lowercase  pb-[14px] border-b border-[#303030]">
                  {permissionTab}
                </div>
                <CheckboxLabel
                  wrapperClassName="border-b border-[#303030]"
                  checked={allChildSelected(permissionTab)}
                  onCheckedChange={(v) =>
                    onAllChildCheckedChange(v, permissionTab)
                  }
                  text="select all"
                />

                <div>
                  {Object.entries(currentPermission ?? {}).map((item) => (
                    <div key={item[0]}>
                      <CheckboxLabel
                        className={checkboxCls}
                        wrapperClassName="pb-[18px]"
                        checked={checkChildAllSelect(
                          item[1]?.permissionList,
                          item[1]?.checked
                        )}
                        onCheckedChange={(v) =>
                          onChildPermissonAllChecked(v, item[0], permissionTab)
                        }
                        text={item[0]}
                      />
                      <div className="ml-[26px] flex flex-col gap-[8px]">
                        {item[1]?.permissionList.map((childPermission) => (
                          <CheckboxLabel
                            wrapperClassName="py-0"
                            key={childPermission}
                            checked={item[1]?.checked?.includes(
                              childPermission
                            )}
                            onCheckedChange={(v) => {
                              onChildPermissionCheckedChange(
                                v,
                                childPermission,
                                item[0],
                                permissionTab
                              );
                            }}
                            text={childPermission}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-start self-stretch pt-[28px] mt-auto">
              <Button
                className="text-[12px] py-[7px] leading-[14px]"
                type="reset"
                onClick={() => {
                  setOpen(false);
                }}>
                cancel
              </Button>

              <LoadingButton
                className="text-[12px] bg-white text-[#303030] py-[7px] leading-[14px]"
                onClick={onSaveHandler}>
                save
              </LoadingButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
