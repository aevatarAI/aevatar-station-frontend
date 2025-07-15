import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ServerConfigForm,
  type TServerConfigForm,
} from "@/constants/form/serverConfig";
import { useToast } from "@/hooks/use-toast";
import { handleErrorMessage } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

export default function ServiceConfiguration() {
  const form = useForm<TServerConfigForm>({
    resolver: zodResolver(ServerConfigForm),
    defaultValues: {
      serverUrl: "https://station-developer-dev-staging.aevatar.ai",
      authServerUrl: "https://auth-pre-station-dev-staging.aevatar.ai",
    },
  });
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const onSubmit = useCallback(
    async (values: TServerConfigForm) => {
      try {
        // Remove trailing slash if present
        const sanitizeUrl = (url: string) =>
          url.endsWith("/") ? url.slice(0, -1) : url;
        const serverUrl = sanitizeUrl(values.serverUrl);
        const authServerUrl = sanitizeUrl(values.authServerUrl);
        localStorage.setItem("serverUrl", serverUrl);
        localStorage.setItem("authServerUrl", authServerUrl);
        toast({
          description: "successfully saved",
        });
        window.location.reload();
      } catch (error) {
        toast({
          title: "error",
          description: handleErrorMessage(error, "something error"),
        });
      }
    },
    [toast],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {import.meta.env.VITE_APP_SUPPORT_CONFIG_URL === "1" && (
          <Button
            className={clsx(
              "text-white text-center font-outfit text-[13px] font-semibold py-[7px] leading-[14px] lowercase w-full lg:w-[408px]",
            )}
          >
            <span>Service Configuration</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        aria-describedby="create new api key"
        className="w-[328px] p-5 flex flex-col gap-[28px] rounded-[6px] border border-black-light"
      >
        <DialogHeader>
          <DialogTitle className="text-left text-gradient inline text-[18px] font-semibold leading-normal lowercase">
            Service Configuration
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-[28px] items-start content-start self-stretch">
              <FormField
                key={"serverUrl"}
                control={form.control}
                name={"serverUrl"}
                render={({ field }) => (
                  <FormItem aria-labelledby="nameLabel" className="w-full">
                    <FormLabel id="nameLabel">serverUrl</FormLabel>
                    <FormControl>
                      <Input placeholder="-" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="authServerUrl"
                render={({ field }) => (
                  <FormItem
                    aria-labelledby="domainNameLabel"
                    className="w-full"
                  >
                    <FormLabel id="domainNameLabel">domain name</FormLabel>
                    <FormControl>
                      <Input placeholder="-" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-start w-full">
                <Button
                  className="text-[13px] py-[7px] leading-[14px]"
                  type="reset"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  cancel
                </Button>
                <Button
                  className="text-[13px] bg-white text-black-light py-[7px] leading-[14px]"
                  type="submit"
                >
                  <span>save</span>
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
