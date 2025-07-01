import { service } from "@/api/axios";
import { useToastLoading } from "@/hooks/useToastLoading";
import {
  AevatarProvider,
  ConfigProvider,
  CreateGAevatar,
  EditGAevatarInner,
  MyGAevatar,
  aevatarAI,
} from "@aevatar-react-sdk/ui-react";
import { useCallback, useEffect, useRef, useState } from "react";
import "./index.css";

enum Stage {
  myGAevatar = "MyGAevatar",
  newGAevatar = "newGAevatar",
  editGAevatar = "editGAevatar",
}

export default function GAgents() {
  const [stage, setStage] = useState<Stage>(Stage.myGAevatar);

  const showLoading = useToastLoading();

  const [editAgents, setEditAgents] = useState<{
    agentTypeList: string[];
    jsonSchemaString?: string;
    properties?: Record<string, string>;
    agentName: string;
    agentId: string;
  }>();

  const onNewGAevatar = useCallback(() => {
    setStage(Stage.newGAevatar);
  }, []);

  const onEditClickRef = useRef<boolean>(false);

  const onEditGaevatar = useCallback(
    async (id: string) => {
      if (onEditClickRef.current) return;
      onEditClickRef.current = true;
      const { dismiss } = showLoading();
      const result = await aevatarAI.services.agent.getAgentInfo(id);
      const agentTypeList = [result.agentType];
      dismiss();
      setEditAgents({
        agentId: result.id,
        agentTypeList,
        jsonSchemaString: result?.propertyJsonSchema,
        agentName: result.name,
        properties: result.properties,
      });

      setStage(Stage.editGAevatar);
      onEditClickRef.current = false;
    },
    [showLoading],
  );

  return (
    <AevatarProvider>
      {stage === Stage.myGAevatar && (
        <MyGAevatar
          height={"100%"}
          onNewGAevatar={onNewGAevatar}
          onEditGaevatar={onEditGaevatar}
        />
      )}
      {stage === Stage.editGAevatar && editAgents && (
        <EditGAevatarInner
          type="edit"
          {...editAgents}
          onBack={() => {
            setStage(Stage.myGAevatar);
          }}
          onSuccess={() => {
            setStage(Stage.myGAevatar);
          }}
        />
      )}
      {stage === Stage.newGAevatar && (
        <CreateGAevatar
          onBack={() => {
            setStage(Stage.myGAevatar);
          }}
          onSuccess={() => {
            setStage(Stage.myGAevatar);
          }}
        />
      )}
    </AevatarProvider>
  );
}
