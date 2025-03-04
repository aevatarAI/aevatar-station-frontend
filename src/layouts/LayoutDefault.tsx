import "@fontsource/source-code-pro";
import "@fontsource/syne";
import "@fontsource/syne/600.css";
import "@fontsource/syne/700.css";
import "@fontsource/kode-mono/600.css";
import "./style.css";

import "./tailwind.css";

import Loading from "@/components/Loading";
import { Toaster } from "@/components/ui/toaster";
import type React from "react";

import ProviderComponent from "@/components/providers/webProvider";

export default function LayoutDefault({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProviderComponent>
      <div>
        <div className="flex-grow">{children}</div>
        <Loading />
        <Toaster />
      </div>
    </ProviderComponent>
  );
}
