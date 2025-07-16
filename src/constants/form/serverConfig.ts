import { z } from "zod";

export const ServerConfigForm = z.object({
  serverUrl: z.string().url(),
  domainName: z.string(),
  authServerUrl: z.string().url(),
});

export type TServerConfigForm = z.infer<typeof ServerConfigForm>;
