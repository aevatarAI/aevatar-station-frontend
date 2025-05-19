import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { IRolePermissionsItem } from "@/api/utils/organization";
import CardLoading from "@/components/CardLoading";
import CheckboxLabel from "@/components/CheckboxLabel";
import LoadingButton from "@/components/LoadingButton.tsx";
import {
  menuItemClx,
  menuItemSelectedClx,
  menuItemTextClx,
} from "@/constants/cls";
import { handleErrorMessage } from "@/utils/error";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { useUpdateEffect } from "react-use";

const checkboxCls =
  "border-[#989DA0] bg-white  disabled:cursor-not-allowed disabled:opacity-100 disabled:bg-gray-deep disabled:border-gray-deep data-[state=checked]:bg-gray-deep data-[state=checked]:border-gray-deep";

type TChildPermission = {
  permission: string;
  checked?: boolean;
  permissionList: TChildPermission[];
};

const buildTreeFromPermissions = (
  permissions: IRolePermissionsItem[],
): TChildPermission[] => {
  const nodeMap = new Map<string, TChildPermission>();

  permissions.forEach((item) => {
    nodeMap.set(item.name, {
      permission: item.name,
      checked: item.isGranted,
      permissionList: [],
    });
  });

  const tree: TChildPermission[] = [];

  permissions.forEach((item) => {
    const node = nodeMap.get(item.name);
    if (item.parentName) {
      const parent = nodeMap.get(item.parentName);
      if (parent) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        parent.permissionList.push(node!);
      }
    } else {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      tree.push(node!);
    }
  });

  return tree;
};
const TreeNode = ({
  node,
  disabled,
  onCheckChange,
}: {
  node: TChildPermission;
  disabled?: boolean;
  onCheckChange: (checkedNode: TChildPermission, isChecked: boolean) => void;
}) => {
  const handleCheckChange = (checked: CheckedState) => {
    onCheckChange(node, checked === true);
  };

  return (
    <div>
      <CheckboxLabel
        className={checkboxCls}
        wrapperClassName="pb-[18px]"
        checked={node.checked}
        disabled={disabled}
        onCheckedChange={handleCheckChange}
        text={
          node.permissionList.length > 0
            ? `${node.permission}.Read`
            : node.permission
        }
      />
      <div className="ml-[26px] flex flex-col gap-[8px]">
        {node.permissionList.map((child) => (
          <TreeNode
            disabled={disabled}
            key={child.permission}
            node={child}
            onCheckChange={onCheckChange}
          />
        ))}
      </div>
    </div>
  );
};

const TreeCheckbox = ({
  permissions,
  disabled,
  onPermissionsChanged,
}: {
  permissions: TChildPermission;
  disabled?: boolean;
  onPermissionsChanged: (permissions: TChildPermission) => void;
}) => {
  const updateChildNodes = (node: TChildPermission, checked: boolean) => {
    if (!checked) {
      node.permissionList.forEach((child) => updateChildNodes(child, false));
    }
    node.checked = checked;
  };

  const updateParentNodes = (
    tree: TChildPermission[],
    targetNode: TChildPermission,
  ) => {
    const findParent = (
      nodes: TChildPermission[],
      child: TChildPermission,
    ): TChildPermission | null => {
      for (const node of nodes) {
        if (node.permissionList.includes(child)) {
          return node;
        }
        const parent = findParent(node.permissionList, child);
        if (parent) {
          return parent;
        }
      }
      return null;
    };

    const parent = findParent(tree, targetNode);
    if (parent) {
      const someChecked = parent.permissionList.some((child) => child.checked);
      if (!parent.checked) parent.checked = someChecked;
      updateParentNodes(tree, parent);
    }
  };

  const handleToggle = (node: TChildPermission, checked: boolean) => {
    const updateTree = (nodes: TChildPermission[]): TChildPermission[] => {
      return nodes.map((n) => {
        if (n.permission === node.permission) {
          updateChildNodes(n, checked);
        } else if (n.permissionList.length > 0) {
          n.permissionList = updateTree(n.permissionList);
        }
        return n;
      });
    };

    permissions.permissionList = updateTree([...permissions.permissionList]);
    updateParentNodes(permissions.permissionList, node);
    onPermissionsChanged(permissions);
  };

  return (
    <div key={permissions.permission} className="ml-[26px]">
      {permissions.permissionList.map((node) => (
        <TreeNode
          disabled={disabled}
          key={node.permission}
          node={node}
          onCheckChange={handleToggle}
        />
      ))}
    </div>
  );
};

export type TFlatPermission = {
  name: string;
  isGranted?: boolean;
};

function flattenPermissions(data: {
  [key: string]: TChildPermission;
}): TFlatPermission[] {
  const resultMap = new Map<string, TFlatPermission>();

  function processPermission(permission: TChildPermission): void {
    const { permission: name, checked } = permission;

    if (!resultMap.has(name)) {
      resultMap.set(name, {
        name,
        isGranted: checked,
      });
    }

    const existing = resultMap.get(name);
    if (existing) {
      existing.isGranted = existing.isGranted || checked;
    }

    for (const childPermission of permission.permissionList) {
      processPermission(childPermission);
    }
  }

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      processPermission(data[key]);
    }
  }

  return Array.from(resultMap.values());
}

export interface IPermissionManagerDialogProps {
  permissionOrigin: IRolePermissionsItem[];
  readonly?: boolean;
  onSave: (value: TFlatPermission[]) => Promise<void>;
}

export default function PermissionManagerInnerDialog({
  permissionOrigin = [],
  readonly,
  onSave,
}: IPermissionManagerDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const permission = useMemo(
    () => buildTreeFromPermissions(permissionOrigin),
    [permissionOrigin],
  );

  const permissionOrgMap = useMemo(() => {
    const map = new Map<string, TFlatPermission>();
    permissionOrigin.forEach((item) => {
      map.set(item.name, { name: item.name, isGranted: item.isGranted });
    });
    return map;
  }, [permissionOrigin]);

  const [permissionMap, setPermissionMap] =
    useState<{ [x in string]: TChildPermission }>();

  useEffect(() => {
    const map: { [x in string]: TChildPermission } = {};
    const _permission: TChildPermission[] = JSON.parse(
      JSON.stringify(permission ?? []),
    );
    _permission?.forEach((item) => {
      map[item.permission] = {
        checked: item.checked,
        permission: item.permission,
        permissionList: [item],
      };
      return item.permission;
    });
    setPermissionMap(map);
  }, [permission]);

  const titles = useMemo(
    () => permission?.map((item) => item.permission) ?? [],
    [permission],
  );

  const [permissionTab, setPermissionTab] = useState<string>(titles[0]);

  useUpdateEffect(() => {
    setPermissionTab(titles[0]);
  }, [titles[0]]);

  const onSaveHandler = useCallback(async () => {
    try {
      if (!permissionMap) return;
      const flatPermission = flattenPermissions(permissionMap);
      const filterList = flatPermission.filter(
        (item) => permissionOrgMap.get(item.name)?.isGranted !== item.isGranted,
      );
      await onSave(filterList);
      setOpen(false);
      toast({
        title: "",
        description: "successfully saved",
      });
    } catch (error) {
      toast({
        description: handleErrorMessage(error, "saved error"),
      });
    }
  }, [onSave, permissionMap, permissionOrgMap, toast]);

  const onChildPermissionsChanged = useCallback(
    (permissions: TChildPermission) => {
      setPermissionMap((v) => {
        if (!v) return v;
        v[permissionTab] = permissions;
        v[permissionTab].checked = permissions.permissionList.every(
          (item) => item.checked,
        );
        return { ...v };
      });
    },
    [permissionTab],
  );

  const isAllChecked = useCallback((permission: TChildPermission): boolean => {
    if (!permission.checked) {
      return false;
    }

    for (const child of permission.permissionList) {
      if (!isAllChecked(child)) {
        return false;
      }
    }
    return true;
  }, []);

  const updateChildNodes = useCallback(
    (node: TChildPermission, checked: boolean) => {
      node.checked = checked;
      if (node.permissionList.length > 0) {
        node.permissionList.forEach((child) =>
          updateChildNodes(child, checked),
        );
      }
      return node;
    },
    [],
  );

  const onAllChildCheckedChange = useCallback(
    (checked: CheckedState, permission: string) => {
      setPermissionMap((v) => {
        if (!v) return v;
        updateChildNodes(v[permission], checked === true);

        return { ...v };
      });
    },
    [updateChildNodes],
  );

  const onAllCheckedChange = useCallback(
    (checked: CheckedState) => {
      if (!permissionMap) return;
      Object.entries(permissionMap).forEach((item) => {
        onAllChildCheckedChange(checked, item[0]);
      });
    },
    [permissionMap, onAllChildCheckedChange],
  );

  const allSelected = useMemo(() => {
    if (!permissionMap) return false;
    return Object.entries(permissionMap).every((item) => isAllChecked(item[1]));
  }, [permissionMap, isAllChecked]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="py-[6px] px-[16px] font-pro text-[12px] font-normal leading-[15px] border-black-light">
          {`${readonly ? "view" : "edit"} permissions`}
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby="create new api key"
        className="w-[328px] sm:w-[636px] p-5 flex gap-0 flex-col rounded-[6px] border border-black-light"
      >
        <DialogHeader>
          <DialogTitle className="text-left aevatarai-text-gradient-center inline text-[18px] font-semibold leading-[22px] lowercase pb-[18px] border-b border-black-light">
            Permission - manager
          </DialogTitle>
        </DialogHeader>

        <div
          className={clsx(
            "pt-[18px]",
            !permissionOrigin?.length && " h-[387px] lg:h-[260px]",
          )}
        >
          {!permissionOrigin?.length ? (
            <div className={clsx("absolute top-[130px] w-full")}>
              <CardLoading className="ml-[-20px]" />
            </div>
          ) : (
            <>
              <CheckboxLabel
                wrapperClassName="pb-[18px] pt-0 border-b border-black-light"
                checked={allSelected}
                disabled={readonly}
                className={checkboxCls}
                onCheckedChange={onAllCheckedChange}
                text="grant all permissions"
              />
              <div className="h-[387px] lg:h-[260px] flex flex-col">
                <div className="flex flex-col flex-1 overflow-auto lg:flex-row lg:gap-[28px] gap-[8px] pt-[20px]">
                  <div className="flex flex-row lg:flex-col gap-[10px] overflow-auto lg:overflow-visible pb-[20px] ">
                    {titles.map((title) => (
                      <div
                        key={title}
                        onClick={() => setPermissionTab(title)}
                        className={clsx(
                          menuItemClx,
                          permissionTab === title && menuItemSelectedClx,
                          "whitespace-nowrap",
                          "lg:max-w-[162px] lg:whitespace-normal",
                        )}
                      >
                        <span className={clsx(menuItemTextClx)}>
                          {title?.split(".")?.[1] ?? title}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* permission card */}
                  <div className="flex-1">
                    <div className="aevatarai-text-gradient-center font-syne text-[18px] font-semibold leading-[22px] lowercase  pb-[14px] border-b border-black-light">
                      {permissionTab?.split(".")?.[1] ?? permissionTab}
                    </div>
                    {permissionMap?.[permissionTab] && (
                      <TreeCheckbox
                        disabled={readonly}
                        permissions={permissionMap?.[permissionTab]}
                        onPermissionsChanged={onChildPermissionsChanged}
                      />
                    )}
                  </div>
                </div>

                {!readonly && (
                  <div className="flex justify-between items-start self-stretch pt-[28px] mt-auto">
                    <Button
                      className="text-[12px] py-[7px] leading-[14px]"
                      type="reset"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      cancel
                    </Button>

                    <LoadingButton
                      className="text-[12px] bg-white text-black-light py-[7px] leading-[14px]"
                      onClick={onSaveHandler}
                    >
                      save
                    </LoadingButton>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
