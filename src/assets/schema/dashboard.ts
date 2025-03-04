import { z } from "zod";

export const dashboardRowItemSchema = z.object({
	id: z.string(),
	name: z.string(),
	state: z.enum(["running", "not started", "error"]),
	errorMessage: z.string().optional(),
});

export const dashboardSchema = z.array(dashboardRowItemSchema);

export type DashboardRowItem = z.infer<typeof dashboardRowItemSchema>;
export type Dashboard = z.infer<typeof dashboardSchema>;
