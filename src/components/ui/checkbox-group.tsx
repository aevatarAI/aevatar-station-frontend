import { Checkbox } from "@/components/ui/checkbox";
import type { Invite } from "@/hooks/useGetOrganisationInvites";

export const CheckboxGroup = ({
  data,
  values,
  onChange,
}: {
  data: Invite[];
  values: string[];
  onChange: any;
}) => {
  return data?.map((datum) => (
    <div key={datum.id} className="flex flex-center gap-[10px] mb-[16px]">
      <Checkbox
        defaultChecked
        id={datum.id}
        name={datum.organizationName}
        onCheckedChange={(checked: boolean) => {
          if (!checked) {
            const filtered = values.filter((value) => value !== datum.id);
            onChange(filtered);
          } else {
            const isPresent = values.includes(datum.id);
            if (!isPresent) {
              const transformed = [...values, datum.id];
              onChange(transformed);
            }
          }
        }}
      />
    </div>
  ));
};
  