import aevatarAi from "@/assets/aevatar_ai_logo.svg";
import Notication from "@/assets/notication.svg?react";
import NoticationEmpty from "@/assets/notification_empty.svg?react";
import OriganisactionHeader from "@/components/OriganisactionHeader";
import ProfileAvatar from "@/components/ProfileAvatar";
import { SheetSideBar } from "@/components/SheetSideBar";
import { useNavigate } from "@/hooks/navigate";
import { usePermissionNavigate } from "@/hooks/usePermissionNavigate";
import { usePostReadNotifications } from "@/hooks/usePostReadNotifications";
import { UNREAD_NOTIFICATION_ATOM } from "@/state/atoms/notification";
import { PROJECT_LIST_ATOM } from "@/state/atoms/organisation";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { useLocation } from "wouter";

const selectCls = "underline decoration-solid box-decoration-slice";
const ignoreHeaders = ["/", "/login", "/register", "/verification"];

export default function Header() {
  const [projectList] = useAtom(PROJECT_LIST_ATOM);
  const [unreadNotifications] = useAtom(UNREAD_NOTIFICATION_ATOM);
  const { mutate } = usePostReadNotifications();
  const [pathname] = useLocation();
  const navigate = useNavigate();
  const { to } = usePermissionNavigate();

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
      <div
        className={clsx("fixed top-0 left-0 z-100 w-full", hidden && "hidden")}
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div
          className={clsx(
            "border-b flex items-center justify-between pt-[13px] pr-[16px] pb-[13px] pl-[19px]",
            "lg:px-[16px] lg:py-[13px] lg:pl-[19px]",
            "border-[var(--color-border-primary)]",
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
              "flex items-center justify-center gap-[20px] font-outfit text-[16px] font-semibold leading-normal cursor-pointer ",
              "lg:gap-[34px]",
              "text-[var(--color-text-primary)]",
            )}
          >
            {pathname !== "/welcome" && (
              <>
                {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                <button
                  disabled={!projectList.length}
                  className={clsx(
                    pathname.startsWith("/dashboard") && selectCls,
                    !projectList.length && "cursor-not-allowed",
                    !projectList.length
                      ? "text-[var(--color-text-tertiary)]"
                      : "text-[var(--color-text-primary)]",
                  )}
                  onClick={() => {
                    if (!projectList.length) return;
                    navigate(to);
                  }}
                >
                  dashboard
                </button>
                {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                <button
                  className={clsx(pathname.startsWith("/profile") && selectCls)}
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  settings
                </button>
                {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                <button
                  onClick={() => {
                    mutate();
                    navigate("/profile/profile/notifications");
                  }}
                >
                  {unreadNotifications ? (
                    <Notication />
                  ) : (
                    <NoticationEmpty
                      style={{ color: "var(--color-text-primary)" }}
                    />
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
