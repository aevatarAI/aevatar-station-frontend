import { FormLabel, FormMessage } from "@/components/ui/form";
import { FIFTEEN_MB } from "@/constants";
import { useIsMobile } from "@/hooks/useIsMobile";
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

// Utility: parse accept prop, return allowed mime types and extensions
function parseAccept(accept?: Accept): { mimeTypes: string[]; exts: string[] } {
  const mimeTypes: string[] = [];
  const exts: string[] = [];
  if (!accept) return { mimeTypes, exts };
  if (Array.isArray(accept)) {
    for (const item of accept) {
      if (item.startsWith(".")) exts.push(item.toLowerCase());
      else mimeTypes.push(item.toLowerCase());
    }
  } else if (typeof accept === "object") {
    for (const [mime, extArr] of Object.entries(accept)) {
      mimeTypes.push(mime.toLowerCase());
      if (Array.isArray(extArr)) {
        for (const ext of extArr) {
          exts.push(ext.toLowerCase());
        }
      }
    }
  } else if (typeof accept === "string") {
    // Comma separated
    for (const item of (accept as string).split(",")) {
      const trimmed = item.trim();
      if (trimmed.startsWith(".")) exts.push(trimmed.toLowerCase());
      else mimeTypes.push(trimmed.toLowerCase());
    }
  }
  return { mimeTypes, exts };
}

// Utility: check if file matches accept
function isFileAccepted(file: File, accept?: Accept): boolean {
  if (!accept) return true;
  const { mimeTypes, exts } = parseAccept(accept);
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  // MIME type match
  if (
    mimeTypes.some((m) =>
      m.endsWith("/*")
        ? fileType.startsWith(`${m.split("/")[0]}/`)
        : fileType === m,
    )
  ) {
    return true;
  }
  // Extension match
  if (exts.some((ext) => fileName.endsWith(ext))) {
    return true;
  }
  return false;
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

  const { isMobile } = useIsMobile();

  const fieldsUpload = useMemo(
    () => fields as { name: string; id: string; content: File }[],
    [fields],
  );

  const { exts } = useMemo(() => parseAccept(accept), [accept]);

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
        accept={isMobile ? undefined : accept}
        onDropAccepted={async (acceptedFiles) => {
          form.clearErrors(name);
          // Manually validate file type
          const validFiles = acceptedFiles.filter((file) =>
            isFileAccepted(file, accept),
          );
          const invalidFiles = acceptedFiles.filter(
            (file) => !isFileAccepted(file, accept),
          );
          if (invalidFiles.length > 0) {
            form.setError(name, {
              message: `Invalid ${exts
                .map((ext) => ext.replace(".", ""))
                .join(
                  "/",
                )} file format. Please upload a valid file and try again.`,
            });
          }
          for (const file of validFiles) {
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
                "border border-dashed border-black-light py-[29px] flex items-center justify-center cursor-pointer focus-visible:outline-hidden",
              ),
              "data-testid": "dropzone-id",
            })}
          >
            <input {...getInputProps()} aria-label={uploadText} />
            <p className="font-pro text-[12px] text-[#B9B9B9] flex flex-col gap-[4px] items-center">
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
                className="font-pro text-[12px] text-[#B9B9B9]"
              >
                {field.name}
              </div>
              <div className="font-pro text-[12px] text-gray-deep">
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
