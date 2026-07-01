import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Complete your payment",
  path: "/payment-capture",
  noindex: true,
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
