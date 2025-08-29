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
import clsx from "clsx";
import { useAtom } from "jotai";
import { useState } from "react";

export default function ProfileAvatar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const logout = useLogout();
  const [profile] = useAtom(USER_PROFILE_ATOM);

  return (
    <div className="border-4 border-white rounded-[2px] w-[34px] h-[34px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <img src={profileImg} alt="profile" className="object-cover" />
        </PopoverTrigger>
        <PopoverContent>
          {profile?.userName && (
            <div className={clsx(itemClassName, "font-semibold font-outfit")}>
              <span>{profile?.userName}</span>
            </div>
          )}
          <div className={itemClassName}>
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {profile?.email ?? "--"}
            </span>
            {profile?.email && (
              <Copy
                description="email address copied"
                toCopy={profile.email}
                iconClassName="w-[20px] h-[20px] text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)]"
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
