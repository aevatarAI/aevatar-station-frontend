import request from "@/api/server";

export const getServiceHealthStatus = (domain: string) => {
  return request.projectPrivateDomain.getServiceHealthStatus({
    query: domain,
  });
};
