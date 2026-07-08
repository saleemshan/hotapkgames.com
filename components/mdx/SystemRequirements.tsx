interface Requirement {
  label: string;
  value: string;
}

interface SystemRequirementsProps {
  requirements: Requirement[];
}

export function SystemRequirements({ requirements = [] }: SystemRequirementsProps) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-heading font-semibold">Requirement</th>
            <th className="px-4 py-3 text-left font-heading font-semibold">Details</th>
          </tr>
        </thead>
        <tbody>
          {requirements.map((req, i) => (
            <tr
              key={i}
              className={`border-b border-border last:border-0 ${
                i % 2 === 0 ? "bg-transparent" : "bg-muted/20"
              }`}
            >
              <td className="px-4 py-3 font-medium">{req.label}</td>
              <td className="px-4 py-3 text-muted-foreground">{req.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
