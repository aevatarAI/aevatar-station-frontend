import { service } from "@/api/axios";
import type {
  IAgentInfoDetail,
  IAgentsConfiguration,
} from "@aevatar-react-sdk/services";
import {
  AevatarProvider,
  ConfigProvider,
  WorkflowConfiguration,
  aevatarAI,
} from "@aevatar-react-sdk/ui-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { delay } from "@/utils/common";
import myEvents from "@/utils/myEvent";

aevatarAI.fetchRequest.setHeaders({
  // authorization: sdkToken,
  authorization: (service.defaults.headers.Authorization as string) || "",
});

export default function WorkflowPage() {
  const [gaevatarList, setGaevatarList] = useState<IAgentInfoDetail[]>();
  const [agentTypeList, setAgentTypeList] = useState<IAgentsConfiguration[]>();
  const refreshGaevatarList = useCallback(async () => {
    const [gaevatarList, agentTypeList] = await Promise.all([
      aevatarAI.services.agent.getAgents({
        pageIndex: 0,
        pageSize: 100,
      }),
      aevatarAI.services.agent.getAllAgentsConfiguration(),
    ]);
    console.log(gaevatarList, "gaevatarList==");
    setAgentTypeList(agentTypeList);
    const list = gaevatarList.map((item) => {
      const agentType = agentTypeList.find(
        (type) => type.agentType === item.agentType,
      );
      item.propertyJsonSchema = agentType?.propertyJsonSchema;
      // TODO
      item.businessAgentGrainId =
        item.businessAgentGrainId ??
        `${item.agentType}/${item.id.replace(/-/g, "")}`;
      return { ...item };
    });
    setGaevatarList(list);
  }, []);

  useEffect(() => {
    refreshGaevatarList();
  }, [refreshGaevatarList]);

  const tokenPendingRef = useRef(false);

  const getAuthToken = useCallback(async () => {
    if (!tokenPendingRef.current) {
      tokenPendingRef.current = true;
      myEvents.AuthorizationExpired.emit();
    }

    const token: string = await new Promise((resolve) => {
      const { remove } = myEvents.AuthorizationUpdated.addListener(
        (data: { error?: any; token?: string }) => {
          if (data.token) resolve(data.token);
          remove();
        },
      );
    });
    tokenPendingRef.current = false;
    service.defaults.headers.Authorization = token;

    console.log("getAuthToken==");
    // TODO
    return (service.defaults.headers.Authorization as string) || "";
  }, []);

  useEffect(() => {
    ConfigProvider.setConfig({
      getAevatarAuthToken: getAuthToken,
    });
  }, [getAuthToken]);

  const onGaevatarChange = useCallback(
    async (isCreate: boolean, data: { params: any; agentId?: string }) => {
      console.log(isCreate, data, "isCreate, data=");
      let result: IAgentInfoDetail;
      if (isCreate) {
        result = await aevatarAI.services.agent.createAgent(data.params);
      } else {
        if (!data.agentId) throw "Not agentId";
        result = await aevatarAI.services.agent.updateAgentInfo(
          data.agentId,
          data.params,
        );
      }
      await delay(1500);
      await refreshGaevatarList();

      return result;
    },
    [refreshGaevatarList],
  );

  return (
    <AevatarProvider>
      <WorkflowConfiguration
        sidebarConfig={{
          gaevatarList,
          isNewGAevatar: true,
          gaevatarTypeList: agentTypeList,
        }}
        onBack={() => {
          // setStage(undefined);
        }}
        onSave={(workflowAgentId: string) => {
          console.log(workflowAgentId, "workflowAgentId==");
          workflowAgentId &&
            localStorage.setItem("workflowAgentId", workflowAgentId);
        }}
        // editWorkflow={editWorkflow}
        onGaevatarChange={onGaevatarChange}
      />
    </AevatarProvider>
  );
}
