import Link from "next/link";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";

export default function ProductPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm text-muted hover:text-text">
          ← Back to home
        </Link>
        <h1 className="mt-4 font-display text-3xl font-medium">Product</h1>
        <p className="mt-4 text-muted">
          Net Composure watches the security signals your app already
          produces and turns them into findings your team can act on —
          then takes safe, automatic action on the clear-cut ones.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-line bg-panel p-5">
            <h3 className="font-display text-base font-medium">Detect</h3>
            <p className="mt-2 text-sm text-muted">
              Malware hash scanning and dependency vulnerability checks
              against real, live threat databases.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-panel p-5">
            <h3 className="font-display text-base font-medium">Defend</h3>
            <p className="mt-2 text-sm text-muted">
              A real-time request firewall blocks known attack patterns
              before they reach your app.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-panel p-5">
            <h3 className="font-display text-base font-medium">Respond</h3>
            <p className="mt-2 text-sm text-muted">
              Critical findings trigger automatic, reversible action —
              no human has to be watching at 3am.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-panel p-5">
            <h3 className="font-display text-base font-medium">Advise</h3>
            <p className="mt-2 text-sm text-muted">
              Every finding comes with a clear explanation and a concrete
              next step, not just a scary alert.
            </p>
          </div>
        </div>
        <Link
          href="/docs"
          className="mt-8 inline-block rounded-md bg-brand px-5 py-3 text-sm font-medium text-ink hover:bg-brand-dim"
        >
          Read the integration guide
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}