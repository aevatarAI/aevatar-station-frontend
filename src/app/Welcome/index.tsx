import { Button } from "@/components/ui/button";
import { useAppDispatch, useCommonInfo } from "@/store/Provider/hooks";
import { setIsPrompt } from "@/store/reducers/common/slice";

export default function Welcome() {
  const { isPrompt } = useCommonInfo();
  const dispatch = useAppDispatch();
  return (
    <div>
      <Button
        className="text-white"
        onClick={() => {
          dispatch(setIsPrompt(!isPrompt));
        }}>
        isPrompt: {String(isPrompt)}
      </Button>
    </div>
  );
}
