import { request } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useGetLLMTokens = () => {
  return useQuery({
    queryKey: ["llm-tokens-usage"],
    queryFn: () => {
      return request.apiRequests.getLLMTokenUsage({});
    },
  });
};
