import PageLoading from "@/components/PageLoading";
import { CURRENT_PROJECT_ATOM } from "@/state/atoms/organisation";
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
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUpdateEffect } from "react-use";
import { useSearchParams } from "wouter";

const supportAgentTypes = [
  "Aevatar.GAgents.InputGAgent.GAgent.InputGAgent",
  "aevatar.mcp",
  "psi.omni",
  "Aevatar.GAgents.Twitter.GAgents.ChatAIAgent.ChatAIGAgent",
  "social.twitter.twitter-webapi",
  "tool.twitter",
  "AevatarGAgentsConstants.ToolGAgentNameSpace.twitter",
  "agentworkertest",
];

enum WorkflowType {
  WorkflowList = "WorkflowList",
  WorkflowEdit = "WorkflowEdit",
}

export default function WorkflowPage() {
  const [workflowType, setWorkflowType] = useState<WorkflowType>();

  const [searchParams] = useSearchParams();

  const [agentTypeList, setAgentTypeList] = useState<IAgentsConfiguration[]>();
  const [gaevatarList, setGaevatarList] = useState<IAgentInfoDetail[]>();

  // State for fullscreen mode of WorkflowConfiguration
  const [fullscreen, setFullscreen] = useState(false);
  // Handler object to control fullscreen enter/exit and status
  const fullscreenHandle = useMemo(
    () => ({
      active: fullscreen,
      enter: () => setFullscreen(true),
      exit: () => setFullscreen(false),
    }),
    [fullscreen],
  );

  const refreshGaevatarList = useCallback(async () => {
    const agentTypeList =
      await aevatarAI.services.agent.getAllAgentsConfiguration();

    // TODO: support more agent types
    const _agentTypeList = agentTypeList.filter((item) =>
      supportAgentTypes.includes(item.agentType),
    );
    setAgentTypeList(_agentTypeList);

    // const list = gaevatarList.map((item) => {
    //   const agentType = agentTypeList.find(
    //     (type) => type.agentType === item.agentType
    //   );
    //   item.propertyJsonSchema = agentType?.propertyJsonSchema;
    //   // TODO
    //   item.businessAgentGrainId =
    //     item.businessAgentGrainId ??
    //     `${item.agentType}/${item.id.replace(/-/g, "")}`;
    //   return { ...item };
    // });
    // setGaevatarList(list);
  }, []);

  useEffect(() => {
    refreshGaevatarList();
  }, [refreshGaevatarList]);

  const onShowWorkflow = useCallback(async () => {
    await refreshGaevatarList();
    setWorkflowType(WorkflowType.WorkflowEdit);
  }, [refreshGaevatarList]);

  const [editWorkflow, setEditWorkflow] = useState<any>();

  const getWorkflowDetail = useCallback(async (workflowAgentId: string) => {
    const result =
      await aevatarAI.getWorkflowViewDataByAgentId(workflowAgentId);
    console.log("getWorkflowDetail", result);
    setEditWorkflow({
      workflowAgentId,
      workflowId: result.workflowId,
      workflowName: result.workflowName,
      workflowViewData: result.workflowViewData,
    });
  }, []);

  const onEditWorkflow = useCallback(
    async (workflowAgentId: string) => {
      await getWorkflowDetail(workflowAgentId);
      await onShowWorkflow();
    },
    [onShowWorkflow, getWorkflowDetail],
  );

  useEffect(() => {
    const workflowId = searchParams.get("workflowId");
    if (workflowId) {
      onEditWorkflow(workflowId).catch(() => {
        setWorkflowType(WorkflowType.WorkflowList);
      });
    } else {
      setWorkflowType(WorkflowType.WorkflowList);
    }
  }, [searchParams, onEditWorkflow]);

  useEffect(() => {
    if (workflowType === WorkflowType.WorkflowList) {
      fullscreenHandle.exit();
    }
  }, [workflowType, fullscreenHandle]);

  const workflowListRef = useRef<{ refresh: () => void }>(null);
  const [projectId] = useAtom(CURRENT_PROJECT_ATOM);

  useUpdateEffect(() => {
    setWorkflowType(WorkflowType.WorkflowList);
    setEditWorkflow(undefined);
    fullscreenHandle.exit();
    setGaevatarList(undefined);
    setAgentTypeList(undefined);
    setFullscreen(false);

    if (workflowListRef.current) {
      workflowListRef.current.refresh();
    }
  }, [projectId]);

  return (
    <AevatarProvider>
      {workflowType === WorkflowType.WorkflowList && (
        <div className={clsx("h-full pt-[35px] pl-[43px] pr-[40px]")}>
          <WorkflowList
            ref={workflowListRef}
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
        <div
          className={clsx(
            "h-full",
            // Apply fullscreen styles when fullscreen is active
            fullscreen &&
              "fixed top-0 left-0 w-screen h-screen z-[2000] bg-black",
          )}
        >
          <WorkflowConfiguration
            sidebarConfig={{
              gaevatarList,
              isNewGAevatar: true,
              gaevatarTypeList: agentTypeList,
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
                    style={{
                      width: 16,
                      height: 16,
                    }}
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
              if (fullscreenHandle.active) {
                fullscreenHandle.exit();
              } else {
                setWorkflowType(WorkflowType.WorkflowList);
              }
            }}
            editWorkflow={editWorkflow}
          />
        </div>
      )}
      {!workflowType && <PageLoading className="relative" />}
    </AevatarProvider>
  );
}
