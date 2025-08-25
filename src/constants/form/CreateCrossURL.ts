import { z } from "zod";

export const CreateCrossURLSchema = z.object({
  domain: z
    .string()
    .min(1, { message: "Domain is required" })
    .url({ message: "Please enter a valid URL, e.g. https://example.com" }),
});

export type TCreateCrossURLForm = z.infer<typeof CreateCrossURLSchema>;
