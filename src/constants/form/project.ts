import { z } from "zod";

const REQUIRED_MESSAGE = "*Required to fill";

export const ProjectEditForm = z.object({
  name: z.string().min(1, { message: REQUIRED_MESSAGE }),
  // .max(100, { message: "Name should be less than 100 characters" }),
  domainName: z
    .string()
    .min(1, { message: REQUIRED_MESSAGE })
    // TODO
    .max(20, { message: "Domain name should be less than 20 characters" })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "Domain name can only contain letters and numbers",
    }),
});

export type TProjectEditForm = z.infer<typeof ProjectEditForm>;
