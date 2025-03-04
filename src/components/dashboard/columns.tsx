import StatusIndicator, { Status } from "@/components/StatusIndicator";
import type { DashboardRowItem } from "@//assets/schema/dashboard";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import LogButton from "./LogButton";
import StopButton from "./StopButton";

const columnHelper = createColumnHelper<DashboardRowItem>();

// https://stackoverflow.com/a/78858411
export const columns: ColumnDef<DashboardRowItem>[] = [
	columnHelper.accessor("id", {
		id: "index",
		header: "No.",
		cell: (info) => info.row.index + 1,
	}),
	columnHelper.accessor("name", {
		id: "name",
		header: "Aevatar",
		cell: (info) => `${info.renderValue()} (ID: ${info.row.original.id})`,
	}),
	columnHelper.accessor("state", {
		id: "state",
		header: "State",
		cell: (info) => (
			<>
				<StatusIndicator
					status={
						{
							running: Status.Running,
							error: Status.Error,
							"not started": Status.NotStarted,
						}[info.getValue()]
					}
					message={info.row.original.errorMessage}
				/>
			</>
		),
	}),
	columnHelper.accessor("id", {
		id: "id",
		header: "",
		cell: (info) => (
			<div className="flex flex-col lg:flex-row gap-[13px]">
				<StopButton id={info.row.original.id} />
				<LogButton id={info.row.original.id} />
			</div>
		),
	}),
] as Array<ColumnDef<DashboardRowItem, unknown>>;
