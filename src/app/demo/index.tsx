import { request } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTheme } from "@/hooks/useTheme";
import { myPersistentAtom } from "@/state/persistentAtom";
import { useAtom } from "jotai";

function AtomInput() {
  const [value, setValue] = useAtom(myPersistentAtom);
  return (
    <div className="ml-[20px]">
      <span className="text-[var(--color-foreground)]">input: {value}</span>
      <Input
        className=" w-[200px] text-[var(--color-foreground)]"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

// Sample data for table demonstration
const sampleData = [
  {
    name: "John Doe",
    domain: "john@example.com",
    members: 5,
    created: "2025-01-21",
  },
  {
    name: "Jane Smith",
    domain: "jane@example.com",
    members: 3,
    created: "2025-01-20",
  },
  {
    name: "Bob Johnson",
    domain: "bob@example.com",
    members: 7,
    created: "2025-01-19",
  },
];

function TableDemo() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-lg font-semibold">Table with Borders</h3>
        <Button onClick={toggleTheme} variant="outline">
          Current Theme: {theme === "light" ? "🌞 Light" : "🌙 Dark"}
        </Button>
        <span className="text-sm text-gray-600">
          Click to toggle theme and see border changes
        </span>
      </div>

      <div className="border rounded-lg p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.map((row) => (
              <TableRow key={row.domain}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.domain}</TableCell>
                <TableCell>{row.members}</TableCell>
                <TableCell>{row.created}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Border Features:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Table outer border with rounded corners</li>
          <li>Header bottom separator line</li>
          <li>Row bottom separator lines</li>
          <li>Automatic theme-aware border colors</li>
          <li>Hover effects on rows</li>
        </ul>
      </div>
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
            }}
          >
            getUserOrganizations
          </Button>
        </div>
      </div>

      <div>
        <div className="text-[20px] mb-4">Table Border Styles</div>
        <div className="ml-[20px]">
          <TableDemo />
        </div>
      </div>
    </div>
  );
}
