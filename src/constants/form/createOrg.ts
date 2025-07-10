import { z } from "zod";

const REQUIRED_MESSAGE = "*Required to fill";

export const createOrgForm = z.object({
  orgName: z
    .string()
    .min(1, { message: REQUIRED_MESSAGE })
    .max(100, { message: "Name should be less than 100 characters" }),
});

export type TCreateOrgForm = z.infer<typeof createOrgForm>;
