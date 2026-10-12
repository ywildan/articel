"use client";

import { useEffect, useRef } from "react";

/**
 * Mencatat satu view artikel dari sisi browser. Halaman artikel kini
 * statis (ISR), jadi penghitung views tidak lagi ditulis saat render
 * server — beacon ini yang memanggil API view sekali per kunjungan.
 */
export default function ViewBeacon({ articleId }: { articleId: number }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    fetch(`/api/articles/${articleId}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  }, [articleId]);

  return null;
}
