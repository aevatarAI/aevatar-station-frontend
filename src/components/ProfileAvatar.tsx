import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import DarkIcon from "@/assets/dark.svg?react";
import LightIcon from "@/assets/light.svg?react";
import NotificationsIcon from "@/assets/notification_empty.svg?react";
import profileImg from "@/assets/profile.png";
import Copy from "@/components/Copy";
import { useNavigate } from "@/hooks/navigate";
import { useLogout } from "@/hooks/useLogout";
import { useTheme } from "@/hooks/useTheme";
import { USER_PROFILE_ATOM } from "@/state/atoms/profile";
import { shortenString } from "@/utils/helpers";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";

// Icons for menu items
const AccountIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label="Account icon"
  >
    <title>Account</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-label="Logout icon"
  >
    <title>Logout</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

export default function ProfileAvatar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>();

  const logout = useLogout();
  const { theme, toggleTheme } = useTheme();
  const [profile] = useAtom(USER_PROFILE_ATOM);
  const profileName = useMemo(() => {
    return profile?.userName || profile?.name || "";
  }, [profile]);

  return (
    <div className="border-4 border-white rounded-[2px] w-[34px] h-[34px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <img src={profileImg} alt="profile" className="object-cover" />
        </PopoverTrigger>
        <PopoverContent
          className={`profile-popover border shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] p-0! rounded-md min-w-32 ${
            theme === "dark"
              ? "bg-zinc-950 border-zinc-700"
              : "bg-white border-zinc-200"
          }`}
        >
          {/* Profile Section */}
          <div
            className={"flex flex-col items-start justify-start p-1 w-full "}
          >
            <div className="flex gap-2 items-center justify-start p-2 rounded-md w-full">
              <div className="flex flex-col gap-1 grow items-start justify-start min-h-px min-w-px">
                {profileName && (
                  <div
                    className={`font-['Geist:SemiBold',_sans-serif] font-semibold leading-none overflow-ellipsis overflow-hidden text-[14px] text-nowrap w-full text-[var(--sidebar-foreground)]`}
                  >
                    <span>
                      {profileName?.length >= 30
                        ? shortenString(profileName, 5, 5)
                        : profileName}
                    </span>
                  </div>
                )}
                <div className="flex gap-1 items-center justify-start w-full">
                  <div
                    className={`font-['Geist:Regular',_sans-serif] font-normal leading-none overflow-ellipsis overflow-hidden text-[12px] text-nowrap text-[var(--color-popover-foreground)]`}
                  >
                    <span className="leading-[16px]">
                      {profile?.email ?? "--"}
                    </span>
                  </div>
                  {profile?.email && (
                    <Copy
                      description="email address copied"
                      toCopy={profile.email}
                      iconClassName={`w-3.5 h-3.5 hover:text-[var(--muted-foreground)] ${
                        theme === "dark"
                          ? "text-[var(--muted-foreground)]"
                          : "text-zinc-500"
                      }`}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className={"border-t border-[var(--border)]"} />

          {/* Account Section */}
          <div
            className={"flex flex-col items-start justify-start p-1 w-full "}
          >
            <div
              className={`flex gap-2 items-center justify-start min-w-32 pl-8 pr-2 py-1.5 rounded w-full relative cursor-pointer transition-colors ${
                theme === "dark"
                  ? "bg-zinc-950 hover:bg-zinc-900"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
            >
              <div
                className={`absolute left-2 top-1/2 -translate-y-1/2 ${
                  theme === "dark" ? "text-zinc-100" : "text-zinc-950"
                }`}
              >
                <AccountIcon />
              </div>
              <div
                className={`font-['Geist:Regular',_sans-serif] font-normal grow leading-[20px] min-h-px min-w-px overflow-ellipsis overflow-hidden text-[14px] text-nowrap ${
                  theme === "dark" ? "text-neutral-50" : "text-zinc-950"
                }`}
              >
                <span>Account</span>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div
            className={"flex flex-col items-start justify-start p-1 w-full "}
          >
            <div
              className={`flex gap-2 items-center justify-start min-w-32 pl-8 pr-2 py-1.5 rounded w-full relative cursor-pointer transition-colors ${
                theme === "dark"
                  ? "bg-zinc-950 hover:bg-zinc-900"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => {
                setOpen(false);
                navigate("/profile/profile/notifications");
              }}
            >
              <div
                className={
                  "absolute left-2 top-1/2 -translate-y-1/2 text-[var(--popover-foreground)]"
                }
              >
                <NotificationsIcon style={{ width: "16px", height: "16px" }} />
              </div>
              <div
                className={`font-['Geist:Regular',_sans-serif] font-normal grow leading-[20px] min-h-px min-w-px overflow-ellipsis overflow-hidden text-[14px] text-nowrap ${
                  theme === "dark" ? "text-neutral-50" : "text-zinc-950"
                }`}
              >
                <span>Notifications</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className={`border-t ${
              theme === "dark" ? "border-zinc-700" : "border-zinc-200"
            }`}
          />

          {/* Theme Toggle Section */}
          <div className={"flex flex-col items-start justify-start p-1 w-full"}>
            <div
              className={`flex gap-2 items-center justify-start min-w-32 pl-8 pr-2 py-1.5 rounded w-full relative cursor-pointer transition-colors ${
                theme === "dark"
                  ? "bg-zinc-950 hover:bg-zinc-900"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => {
                toggleTheme();
                setOpen(false);
              }}
            >
              <div
                className={
                  "absolute left-2 top-1/2 -translate-y-1/2 text-[var(--popover-foreground)]"
                }
              >
                {theme === "dark" ? <LightIcon /> : <DarkIcon />}
              </div>
              <div
                className={`font-['Geist:Regular',_sans-serif] font-normal grow leading-[20px] min-h-px min-w-px overflow-ellipsis overflow-hidden text-[14px] text-nowrap ${
                  theme === "dark" ? "text-neutral-50" : "text-zinc-950"
                }`}
              >
                <span>{theme === "dark" ? "Light theme" : "Dark theme"}</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className={"border-t border-[var(--border)]"} />

          {/* Logout Section */}
          <div
            className={
              "flex flex-col gap-2.5 items-start justify-start p-1 w-full "
            }
          >
            <div
              className={`flex gap-2 items-center justify-start min-w-32 pl-8 pr-2 py-1.5 rounded w-full relative cursor-pointer transition-colors ${
                theme === "dark"
                  ? "bg-zinc-950 hover:bg-zinc-900"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={async () => {
                logout();
                setOpen(false);
                navigate("/login");
              }}
            >
              <div
                className={
                  "absolute left-2 top-1/2 -translate-y-1/2 text-[var(--popover-foreground)]"
                }
              >
                <LogoutIcon />
              </div>
              <div
                className={`font-['Geist:Regular',_sans-serif] font-normal grow leading-[20px] min-h-px min-w-px overflow-ellipsis overflow-hidden text-[14px] text-nowrap text-[var(--popover-foreground)]`}
              >
                <span>Log out</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
