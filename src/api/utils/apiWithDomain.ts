import request from "@/api/server";

export const getServiceHealthStatus = (
  domain: string,
): Promise<"Healthy" | "Unhealthy"> => {
  return request.projectPrivateDomain.getServiceHealthStatus({
    query: domain,
  });
};
