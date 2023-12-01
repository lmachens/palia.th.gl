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
    <div className="flex items-center">
      <span className="text-xs font-mono truncate">{label}</span>
      <label
        className={`ml-2 relative w-8 block overflow-hidden h-5 rounded-full cursor-pointer ${
          checked ? "bg-green-400" : "bg-neutral-500"
        }`}
      >
        <input
          type="checkbox"
          className={`absolute block w-5 h-5 rounded-full appearance-none cursor-pointer bg-white ${
            checked ? "right-0" : ""
          }`}
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
      </label>
    </div>
  );
}
