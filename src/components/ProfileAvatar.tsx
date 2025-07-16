import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import profileImg from "@/assets/profile.png";
import Copy from "@/components/Copy";
import { itemClassName, itemHoverClassName } from "@/constants/cls";
import { useNavigate } from "@/hooks/navigate";
import { useLogout } from "@/hooks/useLogout";
import { USER_PROFILE_ATOM } from "@/state/atoms/profile";
import { shortenString } from "@/utils/helpers";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";

export default function ProfileAvatar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>();

  const logout = useLogout();
  const [profile] = useAtom(USER_PROFILE_ATOM);
  const profileName = useMemo(() => {
    return profile?.userName || profile?.name || "";
  }, [profile]);

  return (
    <div className="border-4 border-white rounded-[2px] w-[34px] h-[34px] bg-white">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <img src={profileImg} alt="profile" className="object-cover" />
        </PopoverTrigger>
        <PopoverContent className="profile-popover">
          {profileName && (
            <div className={clsx(itemClassName, "font-semibold font-outfit")}>
              <span>
                {profileName?.length >= 30
                  ? shortenString(profileName, 5, 5)
                  : profileName}
              </span>
            </div>
          )}
          <div className={itemClassName}>
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              {profile?.email ?? "--"}
            </span>
            {profile?.email && (
              <Copy
                description="email address copied"
                toCopy={profile.email}
                iconClassName="w-[20px] h-[20px] text-gray-deep hover:text-[#B9B9B9]"
              />
            )}
          </div>
          <div
            className={clsx(itemClassName, itemHoverClassName)}
            onClick={() => {
              setOpen(false);

              navigate("/profile");
            }}
          >
            profile
          </div>
          <div
            className={clsx(itemClassName, itemHoverClassName)}
            onClick={async () => {
              logout();
              setOpen(false);
              navigate("/login");
            }}
          >
            log out
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
