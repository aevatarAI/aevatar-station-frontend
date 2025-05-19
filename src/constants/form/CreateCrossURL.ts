import { z } from "zod";

export const CreateCrossURLSchema = z.object({
  domain: z
    .string()
    .min(1, { message: "Domain is required" })
    .regex(
      /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.(?!-)(?:[A-Za-z0-9-]{1,63}\.)*[A-Za-z]{2,}$/,
      { message: "Please enter a valid domain, e.g. example.com" },
    ),
});

export type TCreateCrossURLForm = z.infer<typeof CreateCrossURLSchema>;
