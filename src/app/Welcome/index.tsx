import { createOrganization } from "@/api/utils/organization";
import LogoIcon from "@/assets/logo.svg?react";
import Copy from "@/components/Copy";
import CreateOrgDialog from "@/components/CreateOrgDialog";
import Loading from "@/components/Loading";
import socialMediaReander from "@/components/SocialMediaReander";
import { Button } from "@/components/ui/button";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { ACCEPTED } from "@/constants";
import type { TCreateOrgForm } from "@/constants/form/createOrg";
import { useNavigate } from "@/hooks/navigate";
import { useToast } from "@/hooks/use-toast";
import { useEmail } from "@/hooks/useEmail";
import { useGetInvitations } from "@/hooks/useGetInvitations";
import { useGetOrganisationInvites } from "@/hooks/useGetOrganisationInvites";
import { useUpdateJoinNotifications } from "@/hooks/useUpdateNotifications";
import { refreshTokenLogin } from "@/services/auth";
import { accessTokenAtom, refreshTokenAtom } from "@/state/atoms";
import { CURRENT_ORGANIZATION_ATOM } from "@/state/atoms/organisation";
import { handleErrorMessage } from "@/utils/error";
import { useAtom } from "jotai";
import type React from "react";
import { useCallback } from "react";

const WelcomePage: React.FC = () => {
  const { toast } = useToast();
  const email = useEmail();
  const navigate = useNavigate();
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const [refreshToken, setRefreshToken] = useAtom(refreshTokenAtom);
  const { data, isLoading } = useGetOrganisationInvites();
  const { mutateAsync, isPending } = useUpdateJoinNotifications();
  const { invites, hasInvites, selectedValues, setSelectedValues } =
    useGetInvitations(data);
  const [, setCurrentOrganization] = useAtom(CURRENT_ORGANIZATION_ATOM);

  const onCreateOrg = useCallback(
    async (values: TCreateOrgForm) => {
      console.log(values);
      try {
        const response = await createOrganization(values.orgName);
        setCurrentOrganization(response.id);
        toast({
          description: "Organization created",
        });
        navigate("/profile");
      } catch (error) {
        toast({
          description: handleErrorMessage(
            error,
            "Failed to create organization"
          ),
        });
      }
    },
    [navigate, setCurrentOrganization, toast]
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center lg:justify-center relative min-h-[800px] h-[calc(100vh-60px)] px-5">
      <LogoIcon className="mb-[45px] mt-[57px] lg:mt-[85px] min-w-[50px] min-h-[50px]" />
      <div className="text-center mb-[72px]">
        <h1 className="text-gradient text-[36px] lg:text-[54px] font-syne font-semibold leading-none mb-[11px]">
          welcome to aevatar.ai
        </h1>
        <p className="text-gray-light text-[16px] font-outfit">
          create or join an organisation
        </p>
      </div>
      <div className="w-full lg:w-[793px] flex-col-reverse lg:flex-row flex gap-5  justify-center ">
        <div className="w-full lg:w-[346px] px-5 py-5 bg-black relative border-0 min-h-[285px]">
          {/* <div className="absolute inset-0 bg-black/50 z-10  border-0" /> */}
          <h2 className="font-semibold text-[18px] mb-3 text-white">
            create a new organisation
          </h2>
          <p className="text-[13px] text-gray-light font-outfit mb-[16px]">
            create a new organisation - You will be the owner
          </p>
          <CreateOrgDialog onCreate={onCreateOrg} />
        </div>

        {hasInvites ? (
          <div className="flex flex-col  justify-between w-full lg:w-[346px] px-5 py-5 bg-black border-0 min-h-[285px]">
            <div>
              <h2 className="font-semibold text-[18px] mb-3 text-white">
                join an existing organisation
              </h2>
              <p className="text-[13px] text-gray-light font-outfit">
                pending invitations for your approval
              </p>
              <div className="w-full h-px bg-black-light my-4" />
              <CheckboxGroup
                data={invites}
                values={selectedValues}
                onChange={setSelectedValues}
              />
            </div>
            <Button
              disabled={isPending || selectedValues.length === 0}
              className="mx-auto bottom-0 w-[226px] cursor-pointer"
              onClick={async () => {
                for (const id of selectedValues) {
                  await mutateAsync({ id, status: ACCEPTED });
                }
                try {
                  const response = await refreshTokenLogin(
                    refreshToken as string
                  );
                  const { access_token, refresh_token } = response;
                  setAccessToken(access_token);
                  setRefreshToken(refresh_token);
                  navigate("/profile");
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              {isPending ? "joining..." : "join"}
            </Button>
          </div>
        ) : (
          <div className="w-full lg:w-[346px] px-5 py-5 bg-black flex flex-col cutCornerNoBorder border-0 min-h-[285px]">
            <h2 className="font-semibold text-[18px] mb-3 text-white ">
              join an existing organisation
            </h2>
            <p className="text-[13px] text-gray-light font-outfit">
              you haven't received an invitation yet. Share your address with
              the organisation owner
            </p>
            <div className="w-full h-px bg-black-light my-4" />
            <span className="text-gray-light font-outfit text-[13px] font-semibold leading-normal lowercase mb-2.5 ">
              your email address
            </span>
            <div className="flex justify-between px-[14px] py-[10px] border border-black-light">
              <span className="text-[13px] font-outfit truncate overflow-hidden block max-w-[200px]">
                {email}
              </span>
              <Copy
                description="email address copied"
                toCopy={email}
                className="text-gray-light hover:text-white"
              />
            </div>
          </div>
        )}
      </div>
      {socialMediaReander(
        "relative lg:absolute w-full lg:w-[275px] bottom-[40px] lg:px-0 mt-[58px] justify-around"
      )}
    </div>
  );
};

export default WelcomePage;
