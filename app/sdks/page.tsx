import Link from "next/link";
import { FileCode2, LogIn, FolderPlus, Download, Code2 } from "lucide-react";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";

const STEPS = [
  {
    icon: LogIn,
    title: "Log in or sign up",
    body: "Create a free Net Composure account.",
  },
  {
    icon: FolderPlus,
    title: "Create a project",
    body: "Pick a name and your language or framework.",
  },
  {
    icon: Download,
    title: "Download your SDK",
    body: "Your project page has a Download SDK button. The file comes with your key already built in.",
  },
  {
    icon: Code2,
    title: "Drop it in your project",
    body: "Place the file in your project root, add it to .gitignore, and import it wherever you want protection.",
  },
];

export default function SdksPage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm text-muted hover:text-text">
          Back to home
        </Link>

        <div className="mt-4 flex items-center gap-3">
          <FileCode2 className="h-7 w-7 text-brand" />
          <h1 className="font-display text-3xl font-medium">SDKs</h1>
        </div>
        <p className="mt-3 max-w-2xl text-muted">
          Every Net Composure project gets its own personalized SDK file. No
          manual key configuration required. Here&apos;s how it works.
        </p>

        <div className="mt-10 flex flex-col gap-6">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="flex gap-4 rounded-lg border border-line bg-panel p-5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand/40 text-brand">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted">Step {index + 1}</p>
                  <h3 className="font-display text-base font-medium">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted">{step.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        <Link
          href="/signup"
          className="mt-8 inline-block rounded-md bg-brand px-5 py-3 text-sm font-medium text-ink hover:bg-brand-dim"
        >
          Get started
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
