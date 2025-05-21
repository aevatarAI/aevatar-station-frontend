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
import myEvents from "@/utils/myEvent";

const sdkToken =
  "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkI2QjRENTkyQzM2MUFFQ0ZCQzk3NUZBNkRDMUM5RDAzMDE0QzYzMkQiLCJ4NXQiOiJ0clRWa3NOaHJzLThsMS1tM0J5ZEF3Rk1ZeTAiLCJ0eXAiOiJhdCtqd3QifQ.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODIvIiwiZXhwIjoxNzQ3ODgzMzMxLCJpYXQiOjE3NDc3MTA1MzIsImF1ZCI6IkFldmF0YXIiLCJqdGkiOiIxODdkYzc2Zi04NzQ2LTRiMjgtYTZkNy0yYzljZGYwODYyOGQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiIyTHh0R3JBa2J6QWdjQkVxZlBVdU5OeGVLc3k1aG1LRnV5U3Nob1d3REJoYjRpQVo2biIsImVtYWlsIjoiNWY4ZjQ3MWViYzU1NDRlYzhlMTJmNWRlNzc2NTE3MzZAQUJQLklPIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjoiRmFsc2UiLCJlbWFpbF92ZXJpZmllZCI6IkZhbHNlIiwidW5pcXVlX25hbWUiOiIyTHh0R3JBa2J6QWdjQkVxZlBVdU5OeGVLc3k1aG1LRnV5U3Nob1d3REJoYjRpQVo2biIsInNlY3VyaXR5X3N0YW1wIjoiWDNHNUJXR0IyTjdJSlhZVVBZNkpHVllTVDcyTlVVWU0iLCJzdWIiOiJjYWU4YmQzYS0yMTAyLTQxMTUtOTBiNS1kY2JkMmE3NDUxYTAiLCJyb2xlIjoiYmFzaWNVc2VyIiwib2lfcHJzdCI6IkFldmF0YXJBdXRoU2VydmVyIiwiY2xpZW50X2lkIjoiQWV2YXRhckF1dGhTZXJ2ZXIiLCJvaV90a25faWQiOiI2ZWRmZTdiYS04YzhlLTI3NDktNDU2Yy0zYTE5ZmRkNzMzYWMifQ.OYMu7_FIdj8Uny0Rb9w9TnLrXSyjp3dQR0Q14bWnNtuuEfXo6CmbQ2nij_PujNMyCs4wuJvD8LDG1FF6x4fRq6wKo-ljd5jVDNH2hDXWoGXxO9zIUewl-cazf5gblJm6onM6g7HKcEK2a1ulc49dH7K-OwjPF2e3MZpmSP9LVeEN6vn7CKgtAhYHuN0fgjuXXuVX4MQ25ws8Hqiuf-4lobsJF98tMeL7IFA7lRKZbzyNblP0j8-uDX3J7HK9gT544GEAOz0yXSzZaC4yAnVdlAxR49lpI4Fepi7B6u2Kim0tqPDfXq7N7awzLCupXp3i2hJl4mVVe2ZAG3AmaxNgAg";

ConfigProvider.setConfig({
  requestDefaults: {
    baseURL: "/agent-api",
  },
});

aevatarAI.fetchRequest.setHeaders({
  authorization: sdkToken,
  // (service.defaults.headers.Authorization as string) || "",
});

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

  const onEditGaevatar = useCallback(
    async (id: string) => {
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
    },
    [showLoading],
  );

  const tokenPendingRef = useRef(false);
  // TODO:
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
    return sdkToken;
    // return (service.defaults.headers.Authorization as string) || "";
  }, []);

  useEffect(() => {
    ConfigProvider.setConfig({
      getAevatarAuthToken: getAuthToken,
    });
  }, [getAuthToken]);

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
