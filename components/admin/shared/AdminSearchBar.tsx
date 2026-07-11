import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type AdminSearchBarProps = {
  defaultValue?: string;
  placeholder?: string;
  name?: string;
};

export default function AdminSearchBar({
  defaultValue = "",
  placeholder = "Search...",
  name = "q",
}: AdminSearchBarProps) {
  return (
    <form className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

      <Input
        type="search"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-12 pl-11"
      />
    </form>
  );
}
