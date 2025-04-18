import LogoIcon from "@/assets/logo.svg?react";
import Copy from "@/components/Copy";
import Loading from "@/components/Loading";
import socialMediaReander from "@/components/SocialMediaReander";
import { Button } from "@/components/ui/button";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { ACCEPTED } from "@/constants";
import { useNavigate } from "@/hooks/navigate";
import { useEmail } from "@/hooks/useEmail";
import { useGetInvitations } from "@/hooks/useGetInvitations";
import { useGetOrganisationInvites } from "@/hooks/useGetOrganisationInvites";
import { useGetOrganizations } from "@/hooks/useGetOrganizations";
import { useUpdateJoinNotifications } from "@/hooks/useUpdateNotifications";
import type React from "react";

const WelcomePage: React.FC = () => {
  const email = useEmail();
  const navigate = useNavigate();
  const { data, isLoading } = useGetOrganisationInvites();
  const { mutateAsync, isPending } = useUpdateJoinNotifications();
  const { invites, hasInvites, selectedValues, setSelectedValues } =
    useGetInvitations(data);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center lg:justify-center relative min-h-[800px] h-[calc(100vh-60px)] px-5">
      <LogoIcon className="mb-[45px] mt-[57px] lg:mt-[85px] min-w-[50px] min-h-[50px]" />
      <div className="text-center mb-[72px]">
        <h1 className="text-gradient text-[36px] lg:text-[54px] font-semibold leading-none mb-[11px]">
          welcome to aevatar.ai
        </h1>
        <p className="text-gray-light text-[14px] font-source-code">
          create or join an organisation
        </p>
      </div>
      <div className="w-full lg:w-[793px] flex-col-reverse lg:flex-row flex gap-5  justify-center ">
        <div className="w-full lg:w-[346px] px-5 py-5 bg-black relative cutCornerNoBorder border-0 min-h-[285px]">
          <div className="absolute inset-0 bg-black/50 z-10 cutCornerNoBorder border-0" />
          <h2 className="font-semibold text-[18px] mb-3 text-white">
            create a new organisation
          </h2>
          <p className="text-[12px] text-gray-light font-source-code">
            create a new organisation - You will be the owner
          </p>
        </div>

        {hasInvites ? (
          <div className="w-full lg:w-[346px] px-5 py-5 bg-black flex flex-col justify-between cutCornerNoBorder border-0 min-h-[285px]">
            <div>
              <h2 className="font-semibold text-[18px] mb-3 text-white">
                join an existing organisation
              </h2>
              <p className="text-[12px] text-gray-light font-source-code">
                pending invitations for your approval
              </p>
              <div className="w-full h-[1px] bg-black-light my-4" />
              <CheckboxGroup
                data={invites}
                values={selectedValues}
                onChange={setSelectedValues}
              />
            </div>
            <Button
              disabled={isPending || selectedValues.length === 0}
              className="mx-auto bottom-0 w-[226px]"
              onClick={async () => {
                for (const id of selectedValues) {
                  await mutateAsync({ id, status: ACCEPTED });
                }
                navigate("/profile");
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
            <p className="text-[12px] text-gray-light font-source-code">
              you haven't received an invitation yet. Share your address with
              the organisation owner
            </p>
            <div className="w-full h-[1px] bg-black-light my-4" />
            <span className="text-gray-light font-syne text-[12px] font-semibold leading-normal lowercase mb-2.5 ">
              your email address
            </span>
            <div className="flex justify-between px-[14px] py-[10px] border border-black-light">
              <span className="text-[12px] font-source-code">{email}</span>
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
        "relative lg:absolute w-full lg:w-[275px] bottom-[40px] lg:px-0 mt-[58px] justify-around",
      )}
    </div>
  );
};

export default WelcomePage;
