import ProjectInitialising from "@/components/ProjectInitialising";
import { projectInitialisingLoadingAtom } from "@/state/atoms";
import { useAtom } from "jotai";

export default function ProjectInitialisingLoading() {
  const [show] = useAtom(projectInitialisingLoadingAtom);
  return show ? (
    <ProjectInitialising className="absolute top-0 left-0 z-500" />
  ) : null;
}
