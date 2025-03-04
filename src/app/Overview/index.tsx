import Thumbprint from "@/assets/thumbprint.svg?react";

import robotImg1 from "@/assets/Overview/robot1.png";
import robotImg2 from "@/assets/Overview/robot2.png";
import robotImg3 from "@/assets/Overview/robot3.png";
import robotImg4 from "@/assets/Overview/robot4.png";
import Logo from "@/assets/logo.svg?react";

import { websiteLink, githubLink, docsLink } from "@/constants/socialMedia";

const images = [robotImg1, robotImg2, robotImg3, robotImg4];

const socialMediaList = [websiteLink, githubLink, docsLink];

import LoginButton from "@/components/auth/LoginButton";
import { useCallback, useMemo } from "react";
import clsx from "clsx";

export default function Overview() {
  const randomImage = useMemo(
    () => images[Math.floor(Math.random() * images.length)],
    []
  );

  const socialMediaReander = useCallback(
    (className: string) => (
      <div
        className={clsx(
          "inline-flex items-center gap-[71px] lg:gap-[69px]",
          className
        )}>
        {socialMediaList.map((item) => (
          <a
            className="text-[#B9B9B9] font-syne text-[14px] font-semibold leading-normal lowercase"
            key={item.title}
            href={item.href}
            target="_blank"
            rel="noreferrer">
            {item.title}
          </a>
        ))}
      </div>
    ),
    []
  );

  return (
    <div className="pt-[70px] pr-[47px] pb-[51px] h-[100vh] pl-[47px] md:px-[40px] md:py-[42px] flex flex-col lg:flex-row lg:gap-20">
      <div className="lg:basis-1/2 lg:self-center lg:h-full flex flex-col items-center justify-between">
        <Logo className="text-white self-start hidden lg:block" />
        <div className="max-w-[285px] lg:mx-auto">
          <Thumbprint className="mb-[18px] lg:mb-[35px]" />
          <h1 className="text-4xl lg:text-[54px] font-bold font-syne mb-[25px] leading-tight text-gradient">
            log in to
            <br />
            aevatar.ai
          </h1>
          <h2 className="text-sm font-pro lowercase mb-[36px] lg:mb-[54.5px] text-muted-foreground">
            the future of on-chain autonomous
            <br />
            intelligence
          </h2>
          <div className="hidden lg:block">
            <LoginButton />
          </div>
        </div>
        {socialMediaReander("hidden lg:inline-flex ")}
      </div>
      <div className="basis-1/2">
        <div
          className="w-full h-full cutCorner bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: `url(${randomImage})` }}
        />
      </div>
      <div className="lg:hidden mt-[36px]">
        <LoginButton />
      </div>
      {socialMediaReander("lg:hidden self-center mt-auto")}
    </div>
  );
}
