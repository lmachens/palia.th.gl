import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { ReactNode } from "react";

export default function HeaderToggle({
  label,
  checked,
  onChange,
}: {
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Label className="flex items-center gap-2">
      <Switch checked={checked} onCheckedChange={onChange} />
      {label}
    </Label>
  );
}
