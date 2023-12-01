import type { ReactNode } from "react";

export default function HeaderSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="flex items-center">
      <span className="text-xs font-mono truncate">{label}</span>
      <select
        className={`ml-2 h-5 rounded-lg border-gray-600 cursor-pointer bg-neutral-900 text-gray-200 text-xs`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-neutral-900 text-gray-200"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
