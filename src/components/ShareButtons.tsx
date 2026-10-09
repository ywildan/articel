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
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard tidak tersedia */
    }
  }

  const base =
    "grid h-9 w-9 place-items-center border border-line text-muted transition-colors hover:border-accent hover:text-accent";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="eyebrow mr-1">Bagikan</span>
      {networks.map((n) => (
        <a
          key={n.name}
          href={n.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Bagikan ke ${n.name}`}
          className={base}
        >
          <n.icon className="h-4 w-4" />
        </a>
      ))}
      <button onClick={copy} aria-label="Salin tautan" className={base}>
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
