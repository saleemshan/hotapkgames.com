import Link from "next/link";

export function SafetyTrustBlock() {
  return (
    <section
      className="rounded-xl border border-border-subtle bg-bg-card/40 p-4 text-sm text-text-muted"
      aria-labelledby="safety-trust-heading"
    >
      <h2 id="safety-trust-heading" className="font-display text-base font-bold text-text">
        Safety &amp; trust (Pakistan)
      </h2>
      <ul className="mt-2 list-inside list-disc space-y-1">
        <li>Match downloaded file size to this listing before opening the APK.</li>
        <li>
          Never share wallet OTPs, CNIC photos, or PINs with unofficial WhatsApp
          &ldquo;agents.&rdquo;
        </li>
        <li>Use Play Protect / device security updates where available.</li>
      </ul>
      <p className="mt-3">
        <Link className="text-accent hover:underline" href="/guides/safe-apk-download-pakistan">
          Safe APK downloads
        </Link>
        {" · "}
        <Link className="text-accent hover:underline" href="/guides/fake-casino-apps-pakistan">
          Fake app signals
        </Link>
      </p>
    </section>
  );
}
