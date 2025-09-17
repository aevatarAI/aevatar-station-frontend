import { request } from "@/api";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";
import { columns } from "@/components/OrganisationProjects/columns";
import ProjectEditDialog, {
  type IProjectEditDialogRef,
} from "@/components/ProjectEditDialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { textGradient } from "@/constants/cls";
import type { TProjectEditForm } from "@/constants/form/project";
import { useNavigate } from "@/hooks/navigate";
import { useToast } from "@/hooks/use-toast";
import { useOrgPermissions } from "@/hooks/useOrgPermissions";
import useSetCurrentProject from "@/hooks/useSetCurrentProject";
import { useUpdateProjectHandler } from "@/hooks/useUpdateOrganisations";
import {
  CURRENT_ORGANIZATION_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import { handleErrorMessage } from "@/utils/error";
import clsx from "clsx";
import { useAtom } from "jotai";
import { Ellipsis } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "wouter";

export default function OrganisationProjects() {
  const [loading, setLoading] = useState<boolean>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projectList] = useAtom(PROJECT_LIST_ATOM);
  const [organizationId] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const setCurrentProject = useSetCurrentProject();

  const userPermissions = useOrgPermissions();
  const updateProjectListHandler = useUpdateProjectHandler();
  const [searchParams] = useSearchParams();
  const projectEditDialogRef = useRef<IProjectEditDialogRef>(null);

  useEffect(() => {
    const action = searchParams.get("action");
    console.log(action, "action==");
    if (action === "create") {
      projectEditDialogRef.current?.open();
    }
  }, [searchParams]);

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
      const result = await request.projects.editProject({
        query: id,
        data: {
          displayName: name,
          // domainName,
        },
      });

      updateProjectList();
      return { projectId: id, domainName: result.data.domainName };
    },
    [updateProjectList],
  );

  const onCreate = useCallback(
    async ({ name }: TProjectEditForm) => {
      if (!organizationId) throw new Error("organizationId is required");
      const result = await request.projects.addProject({
        data: {
          organizationId,
          displayName: name,
        },
      });
      const projectId = result.data.id;
      await updateProjectListHandler(organizationId);
      setCurrentProject(projectId, result.data.domainName);
      navigate("/dashboard/workflows");
      return { projectId, domainName: result.data.domainName };
    },
    [organizationId, updateProjectListHandler, setCurrentProject, navigate],
  );

  // const onCheckProjectService = useCallback(
  //   async (domainName: string) => {
  //     setProjectInitialising(true);
  //     await checkProjectService(domainName);
  //     setProjectInitialising(false);
  //     navigate("/dashboard/workflows");
  //   },
  //   [checkProjectService, navigate, setProjectInitialising]
  // );

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
          <>
            {(userPermissions?.projectsEdit ||
              userPermissions?.projectsDelete) && (
              <Popover>
                <PopoverTrigger className="flex items-center gap-[8px] py-[4px] px-[6px]">
                  <Ellipsis className="text-[var(--color-text-foreground)] w-[16px] h-[16px]" />
                </PopoverTrigger>
                <PopoverContent
                  side="bottom"
                  align="end"
                  className="lg:p-0 left-0 lg:-top-[10px] w-[224px]"
                >
                  <div className="lg:p-[8px] max-h-[300px] scrollbar-hide overflow-auto">
                    {userPermissions?.projectsEdit && (
                      <ProjectEditDialog
                        type="edit"
                        name={item.displayName}
                        domainName={item.domainName}
                        onSubmit={(v) => onEdit(v, item.id)}
                      />
                    )}
                    {userPermissions?.projectsDelete && (
                      <DeleteDialog
                        onYes={() => onDeleteYes(item.id)}
                        title={"Are you sure you want to delete the project?"}
                        description={
                          "*Once deleted, the existing project will become invalid."
                        }
                      />
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </>
        ),
      })),
    [projectList, userPermissions, onEdit, onDeleteYes],
  );
  return (
    <div>
      <div className="flex justify-between items-center pb-[30px]">
        <div className={clsx(textGradient)}>Organisation Projects</div>
        {userPermissions?.projectsCreate ? (
          <ProjectEditDialog
            modal={false}
            ref={projectEditDialogRef}
            type="create"
            onSubmit={onCreate}
            // onCheckProjectService={onCheckProjectService}
          />
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
