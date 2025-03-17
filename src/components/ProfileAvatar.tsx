import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import profileImg from "@/assets/profile.png";
import Copy from "@/components/Copy";
import { itemClassName, itemHoverClassName } from "@/constants/cls";
import { useNavigate } from "@/hooks/navigate";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { useLogout } from "@/hooks/useLogout";

export default function ProfileAvatar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>();
  const logout = useLogout()

  const useInfo = useMemo(
    () => ({ email: "xxxx.xx@gmail.com", userName: "userName" }),
    []
  );

  return (
    <div className="border-4 border-white rounded-[2px] w-[34px] h-[34px] bg-white">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <img src={profileImg} alt="profile" className="object-cover" />
        </PopoverTrigger>
        <PopoverContent>
          {useInfo.userName && (
            <div className={clsx(itemClassName, "font-semibold font-syne" )}>
              <span>{useInfo?.userName}</span>
            </div>
          )}
          <div className={itemClassName}>
            <span>{useInfo?.email}</span>
            <Copy
              toCopy={useInfo.email}
              iconClassName="w-[20px] h-[20px] text-[#606060] hover:text-[#B9B9B9]"
            />
          </div>
          <div
            className={clsx(itemClassName, itemHoverClassName)}
            onClick={() => {
              setOpen(false);

              navigate("/profile");
            }}>
            profile
          </div>
          <div
            className={clsx(itemClassName, itemHoverClassName)}
            onClick={async () => {
              logout();
              setOpen(false);
              navigate("/login");
            }}>
            log out
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
