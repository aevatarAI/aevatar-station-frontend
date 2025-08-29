import { socialMediaList } from "@/constants/socialMedia";
import clsx from "clsx";

const socialMediaReander = (className: string) => (
  <div className={clsx("flex justify-between", className)}>
    {socialMediaList.map((item) => (
      <a
        className="text-[var(--muted-foreground)] font-outfit text-[16px] font-semibold leading-normal"
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
