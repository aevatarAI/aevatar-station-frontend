import Docs from "@/assets/docs.svg?react";
import Github from "@/assets/github-sidebar.svg?react";
import Website from "@/assets/website.svg?react";

export const websiteLink = {
  href: "https://aevatar.ai",
  title: "Website",
  icon: <Website />,
};
export const githubLink = {
  href: "https://github.com/aevatarAI",
  title: "Github",
  icon: <Github />,
};
export const docsLink = {
  href: "https://aevatar.ai/aevatar.ai_whitepaper_v0.1.pdf",
  title: "Docs",
  icon: <Docs />,
};

export const socialMediaList = [websiteLink, githubLink, docsLink];
