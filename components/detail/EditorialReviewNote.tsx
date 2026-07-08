import { formatPkDate } from "@/lib/utils";

export function EditorialReviewNote({
  updatedAt,
}: {
  updatedAt: string | Date;
}) {
  return (
    <p className="rounded-xl border border-border-subtle bg-bg-card/40 px-4 py-3 text-sm text-text-muted">
      <span className="font-medium text-text">Editorial listing.</span> Last
      checked{" "}
      {formatPkDate(
        typeof updatedAt === "string"
          ? updatedAt
          : updatedAt.toISOString(),
      )}
      . Front matter on this page is our
      editorial snapshot—confirm version, size, and withdrawal options inside
      the app before you fund an account.
    </p>
  );
}
