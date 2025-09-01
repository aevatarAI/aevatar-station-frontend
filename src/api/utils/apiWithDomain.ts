import request from "@/api/server";
import type { TDataResponse } from "@/api/types/index";
import type { IAgentInfo } from "@aevatar-react-sdk/services";

export const getServiceHealthStatus = (
  domain: string,
): Promise<"Healthy" | "Unhealthy"> => {
  return request.projectPrivateDomain.getServiceHealthStatus({
    query: domain,
  });
};

export const createDefaultWorkflow = async (domain: string) => {
  const result: TDataResponse<IAgentInfo> =
    await request.projects.createDefaultWorkflow({
      query: `${domain}-client`,
    });
  return result.data;
};
