import { request } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { myPersistentAtom } from "@/state/persistentAtom";
import { useAtom } from "jotai";

function AtomInput() {
  const [value, setValue] = useAtom(myPersistentAtom);
  return (
    <div className="ml-[20px]">
      <span className="text-white">input: {value}</span>
      <Input
        className=" w-[200px] text-white"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

export default function DemoPage() {
  console.log("demo page");
  return (
    <div className="container mx-auto p-10 flex gap-4 flex-col">
      <div>
        <div className="text-[20px]">How to use Atom</div>
        <AtomInput />
      </div>

      <div>
        <div className="text-[20px]">How to use request</div>
        <div className="ml-[20px]">
          <Button
            onClick={() => {
              request.organizations.getUserOrganizations();
            }}>
            getUserOrganizations
          </Button>
        </div>
      </div>
    </div>
  );
}
