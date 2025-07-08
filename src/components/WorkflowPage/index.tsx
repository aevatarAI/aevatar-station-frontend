import { service } from "@/api/axios";
import { delay } from "@/utils/common";
import type {
  IAgentInfoDetail,
  IAgentsConfiguration,
} from "@aevatar-react-sdk/services";
import {
  AevatarProvider,
  FullScreenIcon,
  WorkflowConfiguration,
  WorkflowList,
  aevatarAI,
} from "@aevatar-react-sdk/ui-react";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

enum WorkflowType {
  WorkflowList = "WorkflowList",
  WorkflowEdit = "WorkflowEdit",
}

export default function WorkflowPage() {
  const [workflowType, setWorkflowType] = useState<WorkflowType>(
    WorkflowType.WorkflowList,
  );

  const [agentTypeList, setAgentTypeList] = useState<IAgentsConfiguration[]>();
  const [gaevatarList, setGaevatarList] = useState<IAgentInfoDetail[]>();

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

  const onShowWorkflow = useCallback(async () => {
    await refreshGaevatarList();
    setWorkflowType(WorkflowType.WorkflowEdit);
  }, [refreshGaevatarList]);

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
  const [editWorkflow, setEditWorkflow] = useState<any>();

  const getWorkflowDetail = useCallback(async (workflowAgentId: string) => {
    const result =
      await aevatarAI.getWorkflowUnitRelationByAgentId(workflowAgentId);
    console.log("getWorkflowDetail", result);
    setEditWorkflow({
      workflowAgentId,
      workflowName: result.workflowName,
      workUnitRelations: result.workUnitRelations,
    });
  }, []);

  const onEditWorkflow = useCallback(
    async (workflowAgentId: string) => {
      await getWorkflowDetail(workflowAgentId);
      onShowWorkflow();
    },
    [onShowWorkflow, getWorkflowDetail],
  );

  const fullscreenHandle = useFullScreenHandle();

  return (
    <AevatarProvider>
      {workflowType === WorkflowType.WorkflowList && (
        <div className={clsx("h-full pt-[35px] pl-[43px] pr-[40px]")}>
          <WorkflowList
            onEditWorkflow={(workflowAgentId) => {
              onEditWorkflow(workflowAgentId);
            }}
            onNewWorkflow={async () => {
              setEditWorkflow(undefined);
              await delay(10);
              onShowWorkflow();
            }}
          />
        </div>
      )}
      {workflowType === WorkflowType.WorkflowEdit && (
        <div className={clsx("h-full")}>
          <FullScreen className="h-full" handle={fullscreenHandle}>
            <WorkflowConfiguration
              sidebarConfig={{
                gaevatarList,
                isNewGAevatar: true,
                gaevatarTypeList: agentTypeList,
                type: "newAgent",
              }}
              extraControlBar={
                <div className="w-full h-full bg-[#141415] flex flow-row border-[1px] border-[#303030]">
                  <div
                    className={`p-[4px] w-[26px] h-[26px] flex justify-center items-center cursor-pointer ${
                      fullscreenHandle.active ? "bg-[#AFC6DD]" : ""
                    }`}
                    onClick={() => {
                      fullscreenHandle.active
                        ? fullscreenHandle.exit()
                        : fullscreenHandle.enter();
                    }}
                  >
                    <FullScreenIcon
                      className={
                        fullscreenHandle.active
                          ? "text-[#606060]"
                          : "text-[#B9B9B9]"
                      }
                    />
                  </div>
                </div>
              }
              onBack={() => {
                setWorkflowType(WorkflowType.WorkflowList);
              }}
              onSave={async (workflowAgentId: string) => {
                await delay(2000);
                await getWorkflowDetail(workflowAgentId);
              }}
              editWorkflow={editWorkflow}
              onGaevatarChange={onGaevatarChange}
            />
          </FullScreen>
        </div>
      )}
    </AevatarProvider>
  );
}
