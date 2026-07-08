interface VersionEntry {
  version: string;
  date: string;
  changes: string;
}

interface VersionTableProps {
  versions: VersionEntry[];
}

export function VersionTable({ versions = [] }: VersionTableProps) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border" style={{ WebkitOverflowScrolling: "touch" }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-heading font-semibold">Version</th>
            <th className="px-4 py-3 text-left font-heading font-semibold">Release Date</th>
            <th className="px-4 py-3 text-left font-heading font-semibold">Changes</th>
          </tr>
        </thead>
        <tbody>
          {versions.map((v, i) => (
            <tr
              key={i}
              className={`border-b border-border last:border-0 ${
                i % 2 === 0 ? "bg-transparent" : "bg-muted/20"
              }`}
            >
              <td className="px-4 py-3 font-mono text-purple-700 dark:text-purple-300">{v.version}</td>
              <td className="px-4 py-3 text-muted-foreground">{v.date}</td>
              <td className="px-4 py-3 text-muted-foreground">{v.changes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
