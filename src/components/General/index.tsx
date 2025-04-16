import { Input } from "@/components/ui/input";
import clsx from "clsx";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import LoadingButton from "@/components/LoadingButton.tsx";

export interface IGeneralProps {
  header: ReactNode;
  title: ReactNode;
  defaultValue?: string;
  inputPlaceholder?: string;
  buttonProps?: {
    placement?: "top-right" | "bottom-left";
    text?: string;
    className?: string;
  };
  extraInput?: ReactNode;
  onConfirm: (value: string) => Promise<void>;
}

const defalutButtonProps: IGeneralProps["buttonProps"] = {
  placement: "bottom-left",
  text: "save",
  className: "text-[12px] font-normal px-[18px] py-[8px]",
};

export interface IGeneralInstance {
  updateInput: (value: string) => void;
}

const General = forwardRef(
  (
    {
      header,
      title,
      defaultValue,
      inputPlaceholder,
      buttonProps = defalutButtonProps,
      extraInput,
      onConfirm,
    }: IGeneralProps,
    ref
  ) => {
    const _buttonProps = useMemo(
      () => ({ ...defalutButtonProps, ...buttonProps }),
      [buttonProps]
    );
    const [inputText, setInputText] = useState<string>(defaultValue ?? "");

    const updateInput = useCallback((value: string) => {
      setInputText(value);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        updateInput,
      }),
      [updateInput]
    );

    const buttonELe = useMemo(
      () => (
        <LoadingButton
          className={clsx(_buttonProps?.className, "font-semibold")}
          onClick={async () => {
            if (!inputText) return;
            await onConfirm?.(inputText);
          }}>
          {_buttonProps.text}
        </LoadingButton>
      ),
      [_buttonProps, inputText, onConfirm]
    );
    return (
      <div>
        <div className="flex justify-between items-center pb-[20px] lg:pb-[30px] border-b border-[#303030]">
          <div className="font-syne text-[18px] font-semibold lowercase aevatarai-text-gradient">
            {header}
          </div>
          <div>{_buttonProps.placement === "top-right" && buttonELe}</div>
        </div>
        <div className="pt-[30px]">
          <div>
            <div className="text-[#B9B9B9] font-syne text-[12px] font-semibold leading-normal pb-[10px]">
              {title}
            </div>
            <Input
              className="max-w-[498px]"
              placeholder={inputPlaceholder}
              defaultValue={defaultValue}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          {extraInput}
          <div className="pt-[30px]">
            {_buttonProps.placement === "bottom-left" && buttonELe}
          </div>
        </div>
      </div>
    );
  }
);

export default General;
