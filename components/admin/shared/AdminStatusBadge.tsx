import { Badge } from "@/components/ui/badge";

type Status = "ACTIVE" | "INACTIVE" | "ARCHIVED";

type AdminStatusBadgeProps = {
  status: Status;
};

const statusStyles: Record<Status, string> = {
  ACTIVE: "border-transparent bg-emerald-600 text-white hover:bg-emerald-600",
  INACTIVE: "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100",
  ARCHIVED: "border-transparent bg-slate-200 text-slate-700 hover:bg-slate-200",
};

export default function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  return <Badge className={statusStyles[status]}>{formatStatus(status)}</Badge>;
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
