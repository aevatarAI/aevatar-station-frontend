import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import profileImg from "@/assets/profile.png";
import { clearLocalJWT } from "@/components/auth/utils/jwt";
import { useNavigate } from "@/hooks/navigate";
import { useMemo, useState } from "react";
import Copy from "@/components/Copy";
import clsx from "clsx";
import { itemClassName, itemHoverClassName } from "@/constants/cls";

export default function ProfileAvatar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>();

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
            <div className={clsx(itemClassName, "font-semibold")}>
              <span>{useInfo?.userName}</span>
            </div>
          )}
          <div className={itemClassName}>
            <span>{useInfo?.email}</span>
            <Copy toCopy={useInfo.email} />
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
              // TODO clear userLogin
              clearLocalJWT();
              setOpen(false);
              navigate("/");
            }}>
            Log out
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
