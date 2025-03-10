import { z } from "zod";

const REQUIRED_MESSAGE = "*Required to fill";

export const ProjectEditForm = z.object({
  name: z
    .string()
    .min(1, { message: REQUIRED_MESSAGE })
    .max(100, { message: "Name should be less than 100 characters" }),
  domainName: z.string().min(1, { message: REQUIRED_MESSAGE }),
});

export type TProjectEditForm = z.infer<typeof ProjectEditForm>;
