import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Checkout",
  path: "/checkout",
  noindex: true,
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
