import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL } from "@/lib/nebbook/editorial";
import type { Status } from "@/lib/nebbook/types";

const DOT: Record<Status, string> = {
  draft: "bg-subtle",
  submitted: "bg-cyan",
  under_review: "bg-violet",
  changes_requested: "bg-warn",
  approved: "bg-violet",
  rejected: "bg-danger",
  published: "bg-ok",
  archived: "bg-subtle",
};

export function StatusPill({ status }: { status: Status }) {
  return (
    <Badge>
      <span className={`size-1.5 rounded-full ${DOT[status]}`} aria-hidden />
      {STATUS_LABEL[status]}
    </Badge>
  );
}
