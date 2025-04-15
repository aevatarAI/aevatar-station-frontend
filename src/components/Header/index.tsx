import aevatarAi from "@/assets/aevatar_ai_logo.svg";
import Notication from "@/assets/notication.svg?react";
import NoticationEmpty from "@/assets/notification_empty.svg?react";
import OriganisactionHeader from "@/components/OriganisactionHeader";
import ProfileAvatar from "@/components/ProfileAvatar";
import { SheetSideBar } from "@/components/SheetSideBar";
import { useNavigate } from "@/hooks/navigate";
import { usePostReadNotifications } from "@/hooks/usePostReadNotifications";
import { UNREAD_NOTIFICATION_ATOM } from "@/state/atoms/notification";
import { PROJECT_LIST_ATOM } from "@/state/atoms/organisation";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { useLocation } from "wouter";

const selectCls = "underline decoration-solid decoration-slice";
const ignoreHeaders = ["/", "/login", "/register", "/verification"];

export default function Header() {
  const [projectList] = useAtom(PROJECT_LIST_ATOM);
  const [unreadNotifications] = useAtom(UNREAD_NOTIFICATION_ATOM);
  const { mutate } = usePostReadNotifications();
  const [pathname] = useLocation();
  const navigate = useNavigate();

  const hidden = useMemo(() => {
    if (pathname === "/") return true;
    return false;
  }, [pathname]);

  return (
    <div
      data-testid="header-wrapper"
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
              "flex items-center justify-center gap-[20px] text-white font-syne text-[14px] font-semibold leading-normal lowercase cursor-pointer ",
              "lg:gap-[34px]",
            )}
          >
            {pathname !== "/welcome" && (
              <>
                <button
                  disabled={!projectList.length}
                  className={clsx(
                    pathname.startsWith("/dashboard") && selectCls,
                    !projectList.length && "text-[#606060] cursor-not-allowed",
                  )}
                  onClick={() => {
                    if (!projectList.length) return;
                    navigate("/dashboard");
                  }}
                >
                  dashboard
                </button>
                <button
                  className={clsx(pathname.startsWith("/profile") && selectCls)}
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  settings
                </button>
                <button
                  onClick={() => {
                    mutate();
                    navigate("/profile/profile/notifications");
                  }}
                >
                  {unreadNotifications ? (
                    <Notication />
                  ) : (
                    <NoticationEmpty className="text-white" />
                  )}
                </button>
              </>
            )}

            <ProfileAvatar />
          </div>
        </div>

        {pathname !== "/welcome" && (
          <div className="lg:hidden py-[12px]">
            <OriganisactionHeader className="justify-start px-[20px]" />
          </div>
        )}
      </div>
    </div>
  );
}
