import { socialMediaList } from "@/constants/socialMedia";
import clsx from "clsx";

const socialMediaReander = (className: string) => (
  <div className={clsx("flex justify-between", className)}>
    {socialMediaList.map((item) => (
      <a
        className="text-[#B9B9B9] font-outfit text-[14px] font-semibold leading-normal lowercase"
        key={item.title}
        href={item.href}
        target="_blank"
        rel="noreferrer"
      >
        {item.title}
      </a>
    ))}
  </div>
);
export default socialMediaReander;
