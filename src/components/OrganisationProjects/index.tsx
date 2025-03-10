import ProjectEditDialog from "@/components/ProjectEditDialog";
import DataTable from "@/components/DataTable";
import {
  columns,
  type IProjectList,
} from "@/components/OrganisationProjects/columns";
import { textGradient } from "@/constants/cls";
import { sleep } from "@etransfer/utils";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { TProjectEditForm } from "@/constants/form/project";
import DeleteDialog from "@/components/DeleteDialog";

export default function OrganisationProjects() {
  const [projectList, setProjectList] = useState<IProjectList[]>([]);
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    setLoading(true);
    sleep(2000).then(() => {
      setProjectList([
        {
          id: "1",
          name: "name",
          domainName: "apiKeysapiKeysapiKeysapiKeysapiKeysapiKeys111111",
          created:
            Date.now() - Math.floor(Math.random() * (24 * 60 * 60 * 1000)),
          isEdit: true,
          isRemove: true,
          members: 0,
        },
        {
          id: "2",
          name: "name22222222222",
          domainName: "apiKeysapiKeysapiKeysapiKeysapiKeysapiKeys111111",
          created:
            Date.now() - Math.floor(Math.random() * (24 * 60 * 60 * 1000)),
          isEdit: true,
          isRemove: true,
          members: 0,
        },
        {
          id: "3",
          name: "name22223332222222",
          domainName: "apiKeysapiKeysapiKeysapiKeysapiKeysapiKeys111111",
          created:
            Date.now() - Math.floor(Math.random() * (24 * 60 * 60 * 1000)),
          isEdit: true,
          isRemove: true,
          members: 0,
        },
        {
          id: "4",
          name: "name22223332222222",
          domainName: "apiKeysapiKeysapiKeysapiKeysapiKeysapiKeys111111",
          created:
            Date.now() - Math.floor(Math.random() * (24 * 60 * 60 * 1000)),
          isEdit: true,
          isRemove: true,
          members: 0,
        },
      ]);
      setLoading(false);
    });
  }, []);

  const onEdit = useCallback(async (values: TProjectEditForm) => {
    console.log(values, "values===");
    await sleep(2000);
  }, []);

  const onCreate = useCallback(async (values: TProjectEditForm) => {
    console.log(values, "values===");

    await sleep(2000);
  }, []);

  const onDeleteYes = useCallback(async () => {
    await sleep(1000);
  }, []);

  const tableData = useMemo(
    () =>
      projectList.map((item) => ({
        ...item,
        operation: (
          <div className="flex items-center justify-between gap-[7px] pl-[20px]">
            {item.isEdit ? (
              <ProjectEditDialog
                type="edit"
                name={item.name}
                domainName={item.domainName}
                onSubmit={onEdit}
              />
            ) : (
              <span />
            )}
            {item.isRemove ? (
              <DeleteDialog
                onYes={onDeleteYes}
                title={"Are you sure you want to delete the project"}
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
    [projectList, onEdit, onDeleteYes]
  );
  console.log(loading, "loading==");
  return (
    <div>
      <div className="flex justify-between items-center pb-[30px]">
        <div className={clsx(textGradient)}>organisation projects</div>
        <ProjectEditDialog type="create" onSubmit={onCreate} />
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
