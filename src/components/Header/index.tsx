import aevatarAi from "@/assets/aevatar_ai_logo.svg";
import Notication from "@/assets/notication.svg?react";
import NoticationEmpty from "@/assets/notification_empty.svg?react";
import OriganisactionHeader from "@/components/OriganisactionHeader";
import ProfileAvatar from "@/components/ProfileAvatar";
import { SheetSideBar } from "@/components/SheetSideBar";
import { useNavigate } from "@/hooks/navigate";
import clsx from "clsx";
import { useMemo } from "react";
import { useLocation } from "wouter";

const selectCls = "underline decoration-solid decoration-slice";

const ignoreHeaders = ["/", "/login", "/register", "/verification"];

export default function Header() {
  const [pathname] = useLocation();
  const navigate = useNavigate();

  const hidden = useMemo(() => {
    if (pathname === "/") return true;
    return false;
  }, [pathname]);

  // TODO
  const isNotication = true;

  console.log(pathname, "pathname==");

  return (
    <div
      className={clsx(
        "lg:h-[60px]",
        pathname === "/welcome" ? "h-[60px]" : "h-[110px]",
        ignoreHeaders.includes(pathname) && "hidden",
      )}
    >
      <div className={clsx("fixed z-10 w-full  bg-[#000]", hidden && "hidden")}>
        <div
          className={clsx(
            "border-b border-[#303030] flex items-center justify-between pt-[13px] pr-[16px] pb-[13px] pl-[19px]",
            "lg:px-[16px] lg:py-[13px] lg:pl-[19px]",
          )}
        >
          <div>
            {pathname === "/welcome" && <img src={aevatarAi} alt="aevatarAi" />}
            {pathname !== "/welcome" && (
              <OriganisactionHeader className="hidden lg:flex" />
            )}
            {pathname !== "/welcome" && <SheetSideBar />}
          </div>
          <div
            className={clsx(
              "flex items-center justify-center gap-[20px] text-white font-syne text-[12px] font-semibold leading-normal lowercase cursor-pointer ",
              "lg:gap-[34px]",
            )}
          >
            {pathname !== "/welcome" && (
              <>
                <div
                  className={clsx(
                    pathname.startsWith("/dashboard") && selectCls,
                  )}
                  onClick={() => {
                    navigate("/dashboard");
                  }}
                >
                  dashboard
                </div>
                <div
                  className={clsx(pathname.startsWith("/profile") && selectCls)}
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  settings
                </div>
                <div
                  onClick={() => {
                    navigate("/profile/profile/notications");
                  }}
                >
                  {isNotication ? (
                    <Notication />
                  ) : (
                    <NoticationEmpty className="text-white" />
                  )}
                </div>
              </>
            )}

            <ProfileAvatar />
          </div>
        </div>

        {pathname !== "/welcome" && (
          <div className="py-[13px]">
            <OriganisactionHeader className="lg:hidden justify-center" />
          </div>
        )}
      </div>
    </div>
  );
}
