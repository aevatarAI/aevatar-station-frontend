import { request } from "@/api";
import { useQuery } from "@tanstack/react-query";

interface DateRange {
  from: number;
  to: number;
}

export const useGetLLMTokens = (date: DateRange, hasPermission: boolean) => {
  return useQuery({
    queryKey: ["llm-tokens-usage"],
    queryFn: () => {
      return request.apiRequests.getLLMTokenUsage({});
    },
    enabled: !!(date.from && date.to) && hasPermission,
  });
};
