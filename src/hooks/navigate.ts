import { useEffect } from "react";
import { useLocation } from "wouter";

export const useNavigate = () => {
  const [, navigate] = useLocation();
  return navigate;
};

export const useScrollToTop = () => {
  const [pathname] = useLocation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
