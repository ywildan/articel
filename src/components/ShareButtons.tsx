"use client";

import { useState } from "react";
import { Twitter, Facebook, Linkedin, Link2, Check } from "lucide-react";

export default function ShareButtons({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const networks = [
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
      color: "hover:bg-sky-500 hover:text-white",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      color: "hover:bg-blue-700 hover:text-white",
    },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* abaikan */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-medium text-black/60 dark:text-white/60">
        Bagikan:
      </span>
      {networks.map((n) => (
        <a
          key={n.name}
          href={n.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Bagikan ke ${n.name}`}
          className={`grid h-9 w-9 place-items-center rounded-xl border border-black/10 dark:border-white/10 transition-all hover:-translate-y-0.5 ${n.color}`}
        >
          <n.icon className="h-4 w-4" />
        </a>
      ))}
      <button
        onClick={copy}
        aria-label="Salin tautan"
        className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 dark:border-white/10 transition-all hover:-translate-y-0.5 hover:bg-brand-500 hover:text-white"
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
