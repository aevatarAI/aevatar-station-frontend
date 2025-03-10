import { z } from "zod";

const REQUIRED_MESSAGE = "*Required to fill";

export const createApiKeyForm = z.object({
  name: z
    .string()
    .min(1, { message: REQUIRED_MESSAGE })
    .max(100, { message: "Name should be less than 100 characters" }),
  project: z.string(),
});

export type TCreateApiKeyForm = z.infer<typeof createApiKeyForm>;
