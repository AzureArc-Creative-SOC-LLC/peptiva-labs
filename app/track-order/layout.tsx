import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Track your order",
  path: "/track-order",
  noindex: true,
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
