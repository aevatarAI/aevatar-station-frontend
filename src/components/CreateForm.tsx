import CloudIcon from "@/assets/cloud.svg?react";
import MinusIcon from "@/assets/minus.svg?react";
import PlusIcon from "@/assets/plus.svg?react";
import WarningIcon from "@/assets/warning.svg?react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@//lib/utils";
import {
  AtomicAevatarType,
  type TAtomicAevatar,
  TELEGRAM_ABILITIES,
  TWITTER_ABILITIES,
  formSchema,
} from "@//assets/schema/atomic-aevatar";
import { atomicAevatarAtom } from "@//state/atoms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useEffect, useMemo } from "react";
import Dropzone from "react-dropzone";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "@/hooks/navigate";

interface ICreateFormProps {
  name?: string;
}

export default function CreateForm({ name }: ICreateFormProps) {
  const [atomicAevatars, setAtomicAevatars] = useAtom(atomicAevatarAtom);
  const navigate = useNavigate();

  const form = useForm<TAtomicAevatar>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: AtomicAevatarType.AIBasic,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "knowledgeBase",
    control: form.control,
  });

  function onSubmit(values: TAtomicAevatar) {
    if (name) {
      const index = atomicAevatars.findIndex((a) => a.name === name);
      const newAevatars = [...atomicAevatars];
      newAevatars[index] = values;
      setAtomicAevatars(newAevatars);
      navigate("/auth/atomic");
    } else if (!atomicAevatars.find((a) => a.name === values.name)) {
      setAtomicAevatars([...atomicAevatars, values]);
      navigate("/auth/atomic");
    } else {
      form.setError("name", { message: "Name already exists" });
    }
  }

  const type = form.watch("type");

  useEffect(() => {
    if (type && !name) {
      form.resetField("id", { defaultValue: "" });
      form.resetField("key", { defaultValue: "" });
      form.resetField("ability", { defaultValue: [] });
      form.resetField("modelProvider", { defaultValue: "Open AI" });
      form.resetField("bio", { defaultValue: "" });
      form.resetField("lore", { defaultValue: "" });
      form.resetField("topic", { defaultValue: "" });
      //   form.resetField("knowledgeBase", { defaultValue: [] });
    }
  }, [type, form, name]);

  const existingItem = useMemo(
    () => atomicAevatars.find((a) => a.name === name),
    [name, atomicAevatars]
  );

  useEffect(() => {
    if (existingItem) {
      form.resetField("type", { defaultValue: existingItem.type });
      setTimeout(() => {
        form.reset(existingItem, { keepValues: false });
      }, 10);
    }
  }, [existingItem, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:flex-row gap-[19px]">
          <div className="flex-1">
            <h2 className="bg-white mb-[13px] block w-full border border-solid border-[#303030] text-black text-[15px] font-semibold font-syne pt-[9px] px-[10px] pb-[8px]">
              Atomic-Aevatars Type
            </h2>
            <Card className="cutCorner__white w-full">
              <CardContent>
                <FormField
                  control={form.control}
                  name="type"
                  disabled={!!name}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        value={field.value}
                        disabled={field.disabled}
                        onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={AtomicAevatarType.AIBasic}>
                            AI-Basic
                          </SelectItem>
                          <SelectItem value={AtomicAevatarType.Telegram}>
                            Telegram Messaging
                          </SelectItem>
                          <SelectItem value={AtomicAevatarType.Twitter}>
                            Twitter Messaging
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  disabled={!!name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Atomic-Aevatar Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Atomic-Aevatar Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div className="flex-1">
            <h2 className="bg-white mb-[13px] block w-full border border-solid border-[#303030] text-black text-[15px] font-semibold font-syne pt-[9px] px-[10px] pb-[8px]">
              Details
            </h2>
            <Card className="cutCorner__white w-full">
              <CardContent>
                {type === AtomicAevatarType.AIBasic ? (
                  <>
                    <FormField
                      control={form.control}
                      name="modelProvider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model Provider</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Model Provider" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Open AI">Open AI</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>*Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Description of the Aevatar"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lore</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Description of the Aevatar"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Description of the Aevatar"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="knowledgeBase"
                      render={() => (
                        <FormItem>
                          <FormLabel className="flex justify-between items-center">
                            *Knowledge Base <PlusIcon />
                          </FormLabel>
                          <Dropzone
                            accept={{
                              "application/pdf": [],
                            }}
                            onDropAccepted={async (acceptedFiles) => {
                              form.clearErrors("knowledgeBase");
                              for (const file of acceptedFiles) {
                                const name = file.name;
                                append({
                                  name,
                                  content: file,
                                });
                              }
                            }}
                            onDropRejected={() => {
                              form.setError("knowledgeBase", {
                                message: "Only PDF files are allowed",
                              });
                            }}
                            multiple={true}
                            maxSize={5000000}>
                            {({ getRootProps, getInputProps }) => (
                              <div
                                {...getRootProps({
                                  className: cn(
                                    "border py-[17px] flex items-center justify-center cursor-pointer"
                                  ),
                                })}>
                                <input {...getInputProps()} />
                                <p className="font-pro text-[11px] text-[#606060] flex gap-4 items-center">
                                  <CloudIcon />
                                  Click to upload (PDF)
                                </p>
                              </div>
                            )}
                          </Dropzone>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="-mt-[10px]">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex mb-[10px] justify-between">
                          <div className="font-pro text-[11px] text-[#606060]">
                            {field.name}
                          </div>
                          <MinusIcon onClick={() => remove(index)} />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{type} ID</FormLabel>
                          <FormControl>
                            <Input placeholder="@123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{type} Key</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="12212345432345svbjk2343234543234"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ability</FormLabel>
                          <FormControl>
                            <ToggleGroup
                              {...field}
                              type="multiple"
                              onValueChange={(value) => field.onChange(value)}>
                              {(type === AtomicAevatarType.Telegram
                                ? TELEGRAM_ABILITIES
                                : TWITTER_ABILITIES
                              ).map((ability) => (
                                <ToggleGroupItem
                                  key={ability}
                                  value={ability}
                                  aria-label={ability}>
                                  {ability}
                                </ToggleGroupItem>
                              ))}
                            </ToggleGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="pt-[55px]">
            <Button className="border-[#b9b9b9] min-w-[183px]" type="submit">
              {name ? "Save" : "Create"}
            </Button>
            {!!name && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="min-w-[183px] flex mt-[9px] text-[#606060] border-[#606060] hover:bg-inherit hover:text-[#606060] cursor-not-allowed"
                      type="button">
                      <WarningIcon /> Delete
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      The current Atomic-avatar is already matched with agents
                      and cannot be deleted.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
