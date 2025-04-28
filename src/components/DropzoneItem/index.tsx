import { FormLabel, FormMessage } from "@/components/ui/form";
import { FIFTEEN_MB } from "@/constants";
import clsx from "clsx";
import { useMemo } from "react";
import Dropzone, { type Accept } from "react-dropzone";
import { useFieldArray, type useForm } from "react-hook-form";
import MinusIcon from "../../assets/minus_icon.svg?react";
import UploadIcon from "../../assets/upload_icon.svg?react";
import { cn } from "../../lib/utils";

export interface IDropzoneItemProps {
  form: ReturnType<typeof useForm>;
  name: string;
  hiddenLabel?: boolean;
  accept?: Accept;
  multiple?: boolean;
  uploadText?: string;
  maxSize?: number;
}

export default function DropzoneItem({
  form,
  name,
  accept,
  hiddenLabel,
  multiple = true,
  uploadText = "click to select",
  maxSize = FIFTEEN_MB,
}: IDropzoneItemProps) {
  const { fields, append, remove } = useFieldArray({
    name,
    control: form.control,
  });

  const fieldsUpload = useMemo(
    () => fields as { name: string; id: string; content: File }[],
    [fields],
  );

  return (
    <>
      <FormLabel
        className={clsx(
          "flex justify-between items-center",
          hiddenLabel && "hidden",
        )}
      >
        {name}
      </FormLabel>
      <Dropzone
        accept={accept}
        onDropAccepted={async (acceptedFiles) => {
          form.clearErrors(name);
          for (const file of acceptedFiles) {
            const name = file.name;
            append({
              name,
              content: file,
            });
          }
        }}
        onDropRejected={(error) => {
          form.setError(name, {
            message: error[0]?.errors?.[0]?.message ?? "Upload file error",
          });
        }}
        multiple={multiple}
        maxSize={maxSize}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps({
              className: cn(
                "border border-dashed border-[#303030] py-[29px] flex items-center justify-center cursor-pointer focus-visible:outline-hidden",
              ),
              "data-testid": "dropzone-id",
            })}
          >
            <input {...getInputProps()} aria-label={uploadText} />
            <p className="font-pro text-[10px] text-[#B9B9B9] flex flex-col gap-[4px] items-center">
              <UploadIcon />
              <div>{uploadText}</div>
            </p>
          </div>
        )}
      </Dropzone>
      <FormMessage />
      <div>
        {fieldsUpload.map((field, index) => (
          <div key={field.id} className="flex mb-[10px] justify-between">
            <div>
              <div
                data-testid="field-name-dropzoneItem"
                className="font-pro text-[11px] text-[#B9B9B9]"
              >
                {field.name}
              </div>
              <div className="font-pro text-[10px] text-[#606060]">
                {field.content?.size && `${field.content?.size} bytes`}
              </div>
            </div>

            <MinusIcon
              role="img"
              className="cursor-pointer"
              onClick={() => remove(index)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
