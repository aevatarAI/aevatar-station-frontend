import { z } from "zod";

export const inviteMembersForm = z.object({
  email: z.string().email(),
  role: z.string(),
  defaultProject: z.boolean().optional(),
});

export type TInviteMembersKeyForm = z.infer<typeof inviteMembersForm>;
