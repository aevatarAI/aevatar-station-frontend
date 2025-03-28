import LoginImage from "@/assets/login.png";
import LogoIcon from "@/assets/logo-white.svg?react";
import { CustomButton } from "@/components/CustomButton";
import DescHome from "@/components/DescHome";
import socialMediaReander from "@/components/SocialMediaReander";
export default function Layout({
  children,
  backgroundImage,
}: {
  children: JSX.Element;
  backgroundImage: string;
}) {
  return (
    <div className="flex flex-col h-screen lg:flex-row relative min-h-[600px]">
      <CustomButton path="/"><LogoIcon className="absolute top-10 left-10 hidden lg:block" /></CustomButton>
      <div className=" flex flex-col gap-[30px] lg:gap-[36px] basis-1/2 items-start lg:justify-center lg:items-center py-9 px-[47px] relative">
        <DescHome className="w-full lg:w-[408px]" />
        <div className="h-[1px] w-full lg:w-[408px] bg-black-light hidden lg:block" />
        <div className=" w-full lg:hidden inline-block">
          <div
            className="w-full h-full min-h-[40vh] cutCorner bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        </div>
        {children}
        {socialMediaReander(
          "relative lg:absolute w-full lg:w-[408px] mt-[68px] lg:mt-auto lg:bottom-[40px]",
        )}
      </div>
      <div className="basis-1/2 justify-center py-10 pr-10 hidden lg:block">
        <div
          className="w-full h-full min-h-[80vh] cutCornerBig bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      </div>
    </div>
  );
}
