import Link from "next/link";

export default function SiteNav() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-brand" />
          <span className="font-display text-lg font-medium">Net Composure</span>
        </Link>
        <nav className="hidden gap-8 text-sm text-muted md:flex">
          <Link href="/product" className="hover:text-text">Product</Link>
          <Link href="/pricing" className="hover:text-text">Pricing</Link>
          <Link href="/docs" className="hover:text-text">Docs</Link>
          <Link href="/sdks" className="hover:text-text">SDKs</Link>
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/login" className="text-muted hover:text-text">Log in</Link>
          <Link
            href="/signup"
            className="rounded-md bg-brand px-4 py-2 font-medium text-ink hover:bg-brand-dim"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}