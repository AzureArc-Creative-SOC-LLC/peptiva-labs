"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// The chat widget is non-critical UI. Keep it out of the initial bundle and
// only fetch/mount it once the browser is idle, so it never competes with
// hero rendering or LCP.
const ChatWidget = dynamic(() => import("./ChatWidget"), { ssr: false });

export default function ChatWidgetLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reveal = () => setShow(true);

    const ric = (
      window as unknown as {
        requestIdleCallback?: (
          cb: () => void,
          opts?: { timeout: number }
        ) => number;
        cancelIdleCallback?: (id: number) => void;
      }
    ).requestIdleCallback;

    if (typeof ric === "function") {
      const id = ric(reveal, { timeout: 3000 });
      return () => {
        (
          window as unknown as { cancelIdleCallback?: (id: number) => void }
        ).cancelIdleCallback?.(id);
      };
    }

    const t = setTimeout(reveal, 2000);
    return () => clearTimeout(t);
  }, []);

  return show ? <ChatWidget /> : null;
}
