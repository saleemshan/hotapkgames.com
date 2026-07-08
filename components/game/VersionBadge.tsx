import { Badge } from "@/components/ui/Badge";

interface VersionBadgeProps {
  isNew?: boolean | null;
  isUpdated?: boolean | null;
  isFeatured?: boolean | null;
}

export function VersionBadge({ isNew, isUpdated, isFeatured }: VersionBadgeProps) {
  if (isNew) {
    return (
      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30">
        New
      </Badge>
    );
  }
  if (isUpdated) {
    return (
      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30">
        Updated
      </Badge>
    );
  }
  if (isFeatured) {
    return (
      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">
        Hot
      </Badge>
    );
  }
  return null;
}
