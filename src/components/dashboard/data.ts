import type { DashboardRowItem } from "@//assets/schema/dashboard";

export const data: DashboardRowItem[] = [
	{
		id: "1",
		name: "Jack #1",
		state: "running",
	},
	{
		id: "2",
		name: "Jack #2",
		state: "not started",
	},
	{
		id: "3",
		name: "Jack #3",
		state: "error",
		errorMessage: "insufficient reasoning fee",
	},
];
