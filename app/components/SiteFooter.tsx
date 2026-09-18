import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 text-sm sm:grid-cols-3">
        <div>
          <p className="font-display text-text">Product</p>
          <ul className="mt-3 space-y-2 text-muted">
            <li><Link href="/product" className="hover:text-text">Overview</Link></li>
            <li><Link href="/pricing" className="hover:text-text">Pricing</Link></li>
            <li><Link href="/docs" className="hover:text-text">Docs</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-display text-text">Developers</p>
          <ul className="mt-3 space-y-2 text-muted">
            <li><Link href="/docs" className="hover:text-text">API reference</Link></li>
            <li><Link href="/sdks" className="hover:text-text">SDKs</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-display text-text">Company</p>
          <ul className="mt-3 space-y-2 text-muted">
            <li><Link href="/about" className="hover:text-text">About</Link></li>
            <li><Link href="/contact" className="hover:text-text">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line px-6 py-6 text-center text-xs text-muted">
        © 2026 Net Composure.
      </div>
    </footer>
  );
}