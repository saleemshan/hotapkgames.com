interface Step {
  title: string;
  description: string;
}

interface DownloadGuideProps {
  steps: Step[];
}

export function DownloadGuide({ steps = [] }: DownloadGuideProps) {
  return (
    <div className="my-6 space-y-4">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4 rounded-xl border border-border bg-card p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-primary text-sm font-bold text-white">
            {i + 1}
          </div>
          <div>
            <h4 className="font-heading font-semibold">{step.title}</h4>
            <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
