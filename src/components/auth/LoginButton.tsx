import { Button } from "@/components/ui/button";
import { useNavigate } from "@/hooks/navigate";
import { useToast } from "@/hooks/use-toast";
import { loadingAtom } from "@/state/atoms";
import { handleErrorMessage } from "@/utils/error";
import { useConnectWallet } from "@aelf-web-login/wallet-adapter-react";
import { useAtom } from "jotai";
import { useCallback } from "react";

export default function LoginButton() {
  const [, setLoading] = useAtom(loadingAtom);
  const { connectWallet } = useConnectWallet();
  const { toast } = useToast();
  const navigate = useNavigate();

  const doLogin = useCallback(async () => {
    try {
      const result = await connectWallet();

      navigate("/auth/atomic");
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        duration: 3000,
        description: handleErrorMessage(e, "Something went wrong."),
      });
    } finally {
      setLoading(false);
    }
  }, [connectWallet, setLoading, toast, navigate]);

  return (
    <Button className="w-full text-white" onClick={doLogin}>
      log in
    </Button>
  );
}
