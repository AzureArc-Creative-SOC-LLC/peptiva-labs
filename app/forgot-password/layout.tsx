import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Reset your password",
  path: "/forgot-password",
  noindex: true,
});

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
