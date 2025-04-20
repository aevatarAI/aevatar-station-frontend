import { request } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useGetSystemModels = () => {
  return useQuery({
    queryKey: ["models"],
    queryFn: () => request.apiRequests.getSystemLLM(),
  });
};
