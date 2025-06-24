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
  "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjM1MjQwQUZEQzBFRkU2OTk1ODJEQjYzMDYyRDE5M0UyMjZGNTcxQUQiLCJ4NXQiOiJOU1FLX2NEdjVwbFlMYll3WXRHVDRpYjFjYTAiLCJ0eXAiOiJhdCtqd3QifQ.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODIvIiwiZXhwIjoxNzQ5Mjc3Mzk4LCJpYXQiOjE3NDkxMDQ1OTksImF1ZCI6IkFldmF0YXIiLCJqdGkiOiJlOTA0ZmMyZC03MmQ3LTRhYTgtOGU1YS0xNzk0ZjFjNjRiYmQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiIyTHh0R3JBa2J6QWdjQkVxZlBVdU5OeGVLc3k1aG1LRnV5U3Nob1d3REJoYjRpQVo2biIsImVtYWlsIjoiNWY4ZjQ3MWViYzU1NDRlYzhlMTJmNWRlNzc2NTE3MzZAQUJQLklPIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjoiRmFsc2UiLCJlbWFpbF92ZXJpZmllZCI6IkZhbHNlIiwidW5pcXVlX25hbWUiOiIyTHh0R3JBa2J6QWdjQkVxZlBVdU5OeGVLc3k1aG1LRnV5U3Nob1d3REJoYjRpQVo2biIsInNlY3VyaXR5X3N0YW1wIjoiWDNHNUJXR0IyTjdJSlhZVVBZNkpHVllTVDcyTlVVWU0iLCJzdWIiOiJjYWU4YmQzYS0yMTAyLTQxMTUtOTBiNS1kY2JkMmE3NDUxYTAiLCJyb2xlIjoiYmFzaWNVc2VyIiwib2lfcHJzdCI6IkFldmF0YXJBdXRoU2VydmVyIiwiY2xpZW50X2lkIjoiQWV2YXRhckF1dGhTZXJ2ZXIiLCJvaV90a25faWQiOiIyNGE0OWExMy00NTYxLTk4YTQtZmZlOC0zYTFhNTBlZWY5NmEifQ.RZxVaPe-p38RpTUTtLXfpUu8eRMytfkPdUZZNEco4caeizsVTwk169r-ejE56LvwqWJL8TbPNTQQYqVPr-Bq_T247mrxB4o-uL_xAXrkzVet16POMKT44m2Jspe1X2XYZqMxXLmkZE5BTpH10lGlSplmkRxwFMZdVQcku2q_Qyajo7vGA8-NRvcSjRXx9a0Z7yHHd32tc9rm050DausGeKGlAXv9UZb8uPs6FyfU2GqnnF3YWzu4J3jHKBNu0K-QwKyCG6ij-YpkU8kduMmuk2TFujetB4FeZHvTOKuo2XQG7FTdovZhZ4RmcZK07jwJFsf07BkGqQQTsUs-8cinXw";

ConfigProvider.setConfig({
  // requestDefaults: {
  //   baseURL: "/agent-api",
  // },
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
    <AevatarProvider hiddenGAevatarType={[]}>
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
