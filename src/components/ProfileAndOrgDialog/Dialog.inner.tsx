import OrganisationInner from "@/components/OrganisationInner";
import ProfileInner from "@/components/ProfileInner";
import { PROFILE_DIALOG_ATOM } from "@/state/atoms/profile.dialog";
import { useAtom } from "jotai";

export default function DialogInner() {
  const [{ menu = "profile", tab = "general" }] = useAtom(PROFILE_DIALOG_ATOM);

  return (
    <div className="flex-1 overflow-y-auto">
      {menu === "profile" && <ProfileInner tab={tab} />}
      {menu === "organisation" && <OrganisationInner tab={tab} />}
    </div>
  );
}
