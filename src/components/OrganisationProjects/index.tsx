import ProjectEditDialog from "@/components/ProjectEditDialog";
import DataTable from "@/components/DataTable";
import { columns } from "@/components/OrganisationProjects/columns";
import { textGradient } from "@/constants/cls";
import { handleErrorMessage, sleep } from "@etransfer/utils";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { TProjectEditForm } from "@/constants/form/project";
import DeleteDialog from "@/components/DeleteDialog";
import { useAtom } from "jotai";
import {
  CURRENT_ORGANIZATION_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import { getProjectList } from "@/api/utils/organization";
import { useToast } from "@/hooks/use-toast";
import { request } from "@/api";
import { useUserPermissions } from "@/hooks/useUserPermissions";

export default function OrganisationProjects() {
  const [loading, setLoading] = useState<boolean>();
  const { toast } = useToast();
  const [projectList, setProjectList] = useAtom(PROJECT_LIST_ATOM);
  const [organizationId] = useAtom(CURRENT_ORGANIZATION_ATOM);

  const userPermissions = useUserPermissions();

  const updateProjectList = useCallback(async () => {
    try {
      if (!organizationId) return;
      setLoading(true);

      const list = await getProjectList(organizationId);
      setProjectList(list);
      setLoading(false);
    } catch (error) {
      toast({
        description: handleErrorMessage(error),
      });
      setLoading(false);
    }
  }, [organizationId, setProjectList, toast]);

  useEffect(() => {
    updateProjectList();
  }, [updateProjectList]);

  const onEdit = useCallback(
    async ({ name, domainName }: TProjectEditForm, id: string) => {
      try {
        await request.projects.editProject({
          query: id,
          data: {
            displayName: name,
            domainName,
          },
        });
        await sleep(500);
        updateProjectList();
      } catch (error) {
        toast({
          description: handleErrorMessage(error),
        });
      }
    },
    [updateProjectList, toast]
  );

  const onCreate = useCallback(
    async ({ domainName, name }: TProjectEditForm) => {
      try {
        if (!organizationId) return;
        await request.projects.addProject({
          data: {
            organizationId,
            displayName: name,
            domainName,
          },
        });
        await sleep(500);
        updateProjectList();
      } catch (error) {
        toast({
          description: handleErrorMessage(error),
        });
      }
    },
    [organizationId, toast, updateProjectList]
  );

  const onDeleteYes = useCallback(
    async (id: string) => {
      try {
        const result = await request.projects.deleteProject({
          query: id,
        });
        console.log(result, "result=");
      } catch (error) {
        toast({
          description: handleErrorMessage(error),
        });
      }
    },
    [toast]
  );

  const tableData = useMemo(
    () =>
      projectList.map((item) => ({
        ...item,
        operation: (
          <div className="flex items-center gap-[7px] pl-[20px]">
            {userPermissions?.edit ? (
              <ProjectEditDialog
                type="edit"
                name={item.displayName}
                domainName={item.domainName}
                onSubmit={(v) => onEdit(v, item.id)}
              />
            ) : (
              <span />
            )}
            {userPermissions?.delete ? (
              <DeleteDialog
                onYes={() => onDeleteYes(item.id)}
                title={"Are you sure you want to delete the project?"}
                description={
                  "*Once deleted, the existing project will become invalid."
                }
              />
            ) : (
              <span />
            )}
          </div>
        ),
      })),
    [projectList, userPermissions, onEdit, onDeleteYes]
  );
  console.log(loading, "loading==");
  return (
    <div>
      <div className="flex justify-between items-center pb-[30px]">
        <div className={clsx(textGradient)}>organisation projects</div>
        {userPermissions?.create ? (
          <ProjectEditDialog type="create" onSubmit={onCreate} />
        ) : (
          <span />
        )}
      </div>
      <DataTable
        className={clsx(!loading && projectList.length && "min-w-[600px]")}
        tableHeadClassName={"first:pl-[15px]"}
        columns={columns}
        loading={loading}
        data={tableData}
      />
    </div>
  );
}
