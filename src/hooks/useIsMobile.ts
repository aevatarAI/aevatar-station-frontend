import { useCallback, useEffect, useState } from "react";

export const useIsMobile = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);

  const handleWindowSizeChange = useCallback(() => {
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, [handleWindowSizeChange]);

  return { isMobile: width <= 768 };
};
