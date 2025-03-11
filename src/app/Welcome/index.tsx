import LogoIcon from "@/assets/logo.svg?react";
import Copy from "@/components/Copy";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { accessTokenAtom } from "@/state/atoms";
import { useAtom } from "jotai";
import type React from "react";
import { useState } from "react";
const WelcomePage: React.FC = () => {
  const [accessToken] = useAtom(accessTokenAtom);
  console.log(accessToken, "accessToken");
  const [org, setOrg] = useState<string>();
  const organisations = [
    { id: "org1", name: "organisation #1" },
    { id: "org2", name: "organisation #2" },
  ];
  const onRadioChange = (value: string) => {
    console.log(value, "xxxx");
    setOrg(value);
  };

  const [hasInvitation] = useState(false);
  const email = "duke_geng@aelf.io";
  return (
    <div className="flex flex-col items-center lg:justify-center min-h-screen ">
      <LogoIcon
        width={50}
        height={50}
        className="mb-[45px] mt-[57px] lg:mt-[85px]"
      />
      <div className="text-center mb-[72px]">
        <h1 className="text-gradient text-[36px] lg:text-[54px] font-semibold leading-none">
          welcome to aevatar.ai
        </h1>
        <p className="text-gray-light text-[14px]">
          create or join an organisation
        </p>
      </div>
      <div className="w-full lg:w-[793px] flex-col-reverse lg:flex-row flex gap-5  justify-center ">
        <div className="w-full lg:w-[346px] px-5 py-5 bg-black relative cutCornerNoBorder border-0 min-h-[285px]">
          <div className="absolute inset-0 bg-black bg-opacity-50 z-10 cutCornerNoBorder border-0" />
          <h2 className="font-semibold text-[18px] mb-3 text-white">
            create a new organisation
          </h2>
          <p className="text-[12px] text-gray-light">
            create a new organisation - You will be the owner
          </p>
        </div>

        {hasInvitation ? (
          <div className="w-full lg:w-[346px] px-5 py-5 bg-black flex flex-col justify-between cutCornerNoBorder border-0 min-h-[285px]">
            <div>
              <h2 className="font-semibold text-[18px] mb-3 text-white">
                join an existing organisation
              </h2>
              <p className="text-[12px] text-gray-light">
                pending invitations for your approval
              </p>
              <div className="w-full h-[1px] bg-black-light my-4" />

              <RadioGroup
                defaultValue=""
                className="space-y-[18px]"
                onValueChange={onRadioChange}
              >
                {organisations.map((org) => (
                  <div
                    key={org.id}
                    className="flex items-center space-x-[10px]"
                  >
                    <RadioGroupItem value={org.id} id={org.id} />
                    <label
                      htmlFor={org.id}
                      className="text-[11px] text-gray-light"
                    >
                      {org.name}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <Button className="mx-auto bottom-0 w-[226px]">join</Button>
          </div>
        ) : (
          <div className="w-full lg:w-[346px] px-5 py-5 bg-black flex flex-col cutCornerNoBorder border-0 min-h-[285px]">
            <h2 className="font-semibold text-[18px] mb-3 text-white">
              join an existing organisation
            </h2>
            <p className="text-[12px] text-gray-light">
              pending invitations for your approval
            </p>
            <div className="w-full h-[1px] bg-black-light my-4" />
            <div className="flex justify-between px-[14px] py-[10px] border border-black-light">
              <span className="text-[12px]">{email}</span>
              <Copy toCopy={email} className="text-gray-light" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomePage;
