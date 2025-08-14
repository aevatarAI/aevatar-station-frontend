import { z } from "zod";

export const ServerConfigForm = z.object({
  serverUrl: z.string().url(),
  domainUrl: z.string().url(),
  authServerUrl: z.string().url(),
});

export type TServerConfigForm = z.infer<typeof ServerConfigForm>;
