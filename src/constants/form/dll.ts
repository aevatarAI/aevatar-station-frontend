import { FIFTEEN_MB } from "@/constants";
import { z } from "zod";

export const DllSchema = z.object({
  file: z
    .custom<{ content: File; name: string }[]>((files) => files.length > 0, {
      message: "Please upload a file.",
    })
    .refine((files) => files.length === 1, {
      message: "You can upload only one file at a time.",
    })
    .refine((files) => files[0]?.content?.size <= FIFTEEN_MB, {
      message: "Please upload a file smaller than 15 MB.",
    })
    .refine((files) => files[0]?.name.endsWith(".dll"), {
      message: "Only .dll files are supported.",
    }),
});

export type TDllEditForm = z.infer<typeof DllSchema>;
