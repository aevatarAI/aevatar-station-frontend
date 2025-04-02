import Copy from "@/components/Copy";
import LogoIcon from "@/assets/logo.svg?react";
import socialMediaReander from "@/components/SocialMediaReander";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ACCEPTED } from "@/constants";
import { useEmail } from "@/hooks/useEmail";
import { useGetOrganizations } from "@/hooks/useGetOrganizations";
import { useGetOrganisationInvites } from "@/hooks/useGetOrganisationInvites";
import { useUpdateJoinNotifications } from "@/hooks/useUpdateNotifications";
import { deduplicate, reverse } from "@/utils/helpers";
import type React from "react";
import { useState } from "react";
import { navigate } from "wouter/use-browser-location";
import Loading from "@/components/Loading";
import { useGetProjects } from "@/hooks/useGetProjects";

const WelcomePage: React.FC = () => {
  const email = useEmail();
  const [selectValue, setSelectValue] = useState("");
  const { data: organisations } = useGetOrganizations();
  const { data: invitations, isLoading } = useGetOrganisationInvites();
  const { data: projects } = useGetProjects();
  const { mutate, isPending } = useUpdateJoinNotifications();

  // [TODO] Remove after backend sorts
  const reversed = reverse(invitations?.data);
  const invites = deduplicate(reversed, "organizationId");
  const hasInvites = invites.length > 0;

  const onRadioChange = (value: string) => {
    setSelectValue(value);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (organisations?.data.items.length > 0 && projects?.data.items.length > 0) {
    navigate("/dashboard");
    return
  }

  if (organisations?.data.items.length > 0) {
    navigate("/profile");
    return;
  }

  return (
    <div className="flex flex-col items-center lg:justify-center relative min-h-[800px] h-[calc(100vh-60px)] px-5">
      <LogoIcon
        width={50}
        height={50}
        className="mb-[45px] mt-[57px] lg:mt-[85px]"
      />
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
          <div className="absolute inset-0 bg-black bg-opacity-50 z-10 cutCornerNoBorder border-0" />
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

              <RadioGroup
                defaultValue=""
                className="space-y-[18px]"
                onValueChange={onRadioChange}
              >
                {invites?.map((org: any) => (
                  <div
                    key={org.id}
                    className="flex items-center space-x-[10px]"
                  >
                    <RadioGroupItem value={org.id} id={org.id} />
                    <label
                      htmlFor={org.id}
                      className="text-[11px] text-gray-light font-source-code"
                    >
                      {org.organizationName}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <Button
              disabled={isPending || !selectValue}
              className="mx-auto bottom-0 w-[226px]"
              onClick={() => {
                mutate({ id: selectValue, status: ACCEPTED });
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
              you haven’t received an invitation yet. Share your address with
              the organisation owner
            </p>
            <div className="w-full h-[1px] bg-black-light my-4" />
            <span className="text-gray-light font-syne text-[12px] font-semibold leading-normal lowercase mb-2.5 ">your email address</span>
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
        "relative lg:absolute w-full lg:w-[275px] bottom-[40px] lg:px-0 mt-[58px] justify-around"
      )}
    </div>
  );
};

export default WelcomePage;
