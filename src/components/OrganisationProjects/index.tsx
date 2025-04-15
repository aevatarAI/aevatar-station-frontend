import { request } from "@/api";
import DataTable from "@/components/DataTable";
import DeleteDialog from "@/components/DeleteDialog";
import { columns } from "@/components/OrganisationProjects/columns";
import ProjectEditDialog from "@/components/ProjectEditDialog";
import { textGradient } from "@/constants/cls";
import type { TProjectEditForm } from "@/constants/form/project";
import { useCreateProject } from "@/hooks/useCreateProject";
import { useDeleteProject } from "@/hooks/useDeleteProject";
import { useEditProject } from "@/hooks/useEditProject";
import { useGetProjects } from "@/hooks/useGetProjects";
import { useOrgPermissions } from "@/hooks/useOrgPermissions";
import { useUpdateProjectHandler } from "@/hooks/useUpdateOrganisations";
import {
  CURRENT_ORGANIZATION_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import { handleErrorMessage } from "@/utils/error";
import clsx from "clsx";
import { useAtom } from "jotai";

export default function OrganisationProjects() {
  const userPermissions = useOrgPermissions();
  const [organizationId] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const { data: projectList, isLoading } = useGetProjects();
  const { mutate: mutateCreate } = useCreateProject();
  const { mutate: mutateDelete } = useDeleteProject();
  const { mutate: mutateEdit } = useEditProject();

  const onEdit = async ({ domainName, name }: TProjectEditForm, id: string) => {
    mutateEdit({ id, organizationId: organizationId || "", domainName, displayName: name})
  }

  const onCreate = async ({ domainName, name }: TProjectEditForm) => {
    mutateCreate({organizationId: organizationId || "", domainName, displayName: name })
  }

  const onDeleteYes = async (id: string) => {
    mutateDelete(id)
  }

  const tableData = projectList?.data?.items?.map((item: any) => ({
      ...item,
      operation: (
        <div className="flex items-center gap-[7px] pl-[20px]">
          {userPermissions?.organizationsEdit ? (
            <ProjectEditDialog
              type="edit"
              name={item.displayName}
              domainName={item.domainName}
              onSubmit={(v) => onEdit(v, item.id)}
            />
          ) : (
            <span />
          )}
          {userPermissions?.organizationsDelete ? (
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
    }))

  return (
    <div>
      <div className="flex justify-between items-center pb-[30px]">
        <div className={clsx(textGradient)}>organisation projects</div>
        {userPermissions?.organizationsCreate ? (
          <ProjectEditDialog type="create" onSubmit={onCreate} />
        ) : (
          <span />
        )}
      </div>
      <DataTable
        className={clsx(!isLoading && projectList?.data?.items.length && "min-w-[600px]")}
        tableHeadClassName={"first:pl-[15px]"}
        columns={columns}
        loading={isLoading}
        data={tableData}
      />
    </div>
  );
}
