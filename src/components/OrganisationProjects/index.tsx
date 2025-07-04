import { request } from "@/api";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";
import { columns } from "@/components/OrganisationProjects/columns";
import ProjectEditDialog from "@/components/ProjectEditDialog";
import { textGradient } from "@/constants/cls";
import type { TProjectEditForm } from "@/constants/form/project";
import { useToast } from "@/hooks/use-toast";
import { useOrgPermissions } from "@/hooks/useOrgPermissions";
import { useUpdateProjectHandler } from "@/hooks/useUpdateOrganisations";
import {
  CURRENT_ORGANIZATION_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import { handleErrorMessage } from "@/utils/error";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function OrganisationProjects() {
  const [loading, setLoading] = useState<boolean>();
  const { toast } = useToast();
  const [projectList] = useAtom(PROJECT_LIST_ATOM);
  const [organizationId] = useAtom(CURRENT_ORGANIZATION_ATOM);

  const userPermissions = useOrgPermissions();
  const updateProjectListHandler = useUpdateProjectHandler();

  const updateProjectList = useCallback(async () => {
    if (!organizationId) return;

    setLoading(true);

    await updateProjectListHandler(organizationId);
    setLoading(false);
    window.scrollTo(0, 0);
  }, [organizationId, updateProjectListHandler]);

  useEffect(() => {
    updateProjectList();
  }, [updateProjectList]);

  const onEdit = useCallback(
    async ({ name }: TProjectEditForm, id: string) => {
      await request.projects.editProject({
        query: id,
        data: {
          displayName: name,
          // domainName,
        },
      });

      updateProjectList();
    },
    [updateProjectList],
  );

  const onCreate = useCallback(
    async ({ domainName, name }: TProjectEditForm) => {
      if (!organizationId) return;
      await request.projects.addProject({
        data: {
          organizationId,
          displayName: name,
          domainName,
        },
      });

      updateProjectList();
    },
    [organizationId, updateProjectList],
  );

  const onDeleteYes = useCallback(
    async (id: string) => {
      try {
        await request.projects.deleteProject({
          query: id,
        });
        toast({
          description: "successfully deleted",
        });
        updateProjectList();
      } catch (error) {
        toast({
          description: handleErrorMessage(error),
        });
      }
    },
    [toast, updateProjectList],
  );

  const tableData = useMemo(
    () =>
      projectList.map((item) => ({
        ...item,
        operation: (
          <div className="flex items-center gap-[7px] pl-[20px]">
            {userPermissions?.projectsEdit ? (
              <ProjectEditDialog
                type="edit"
                name={item.displayName}
                domainName={item.domainName}
                onSubmit={(v) => onEdit(v, item.id)}
              />
            ) : (
              <span />
            )}
            {userPermissions?.projectsDelete ? (
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
    [projectList, userPermissions, onEdit, onDeleteYes],
  );
  return (
    <div>
      <div className="flex justify-between items-center pb-[30px]">
        <div className={clsx(textGradient)}>organisation projects</div>
        {userPermissions?.projectsCreate ? (
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
