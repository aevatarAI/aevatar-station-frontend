import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import "@fontsource/outfit";
import "@fontsource/syne";
import "@fontsource/syne/600.css";
import "@fontsource/syne/700.css";
import "@fontsource/kode-mono/600.css";
import "./style.css";

import "./tailwind.css";

import Loading from "@/components/Loading";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import type React from "react";

import RestartPodServer from "@/components/ RestartPodServer";

const queryClient = new QueryClient();

export default function LayoutDefault({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {/* <ProviderComponent> */}
        <div>
          <div className="grow">{children}</div>
          <Loading />
          <Toaster />
          <RestartPodServer />
        </div>
        {/* </ProviderComponent> */}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
