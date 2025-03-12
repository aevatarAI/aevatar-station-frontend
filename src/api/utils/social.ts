import type { TDataResponse } from "@/api/types/index";
import { request } from "..";

export type TGetBindStatusParams = {
  agentName: string;
};

export enum BindStatusEnum {
  Unbound = 0,
  Bound = 1,
}
export type TBindStatusInfo = {
  telegramBindStatus: BindStatusEnum;
  telegramBotName: string;
  twitterBindStatus: BindStatusEnum;
  twitterName: string;
};
export const getBindStatus = async () => {
  const result: TDataResponse<TBindStatusInfo> =
    await request.organizations.addOrganization({});
  return result.data;
};
