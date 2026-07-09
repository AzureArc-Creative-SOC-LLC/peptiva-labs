import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/components/CartContext";
import { AuthProvider } from "@/components/AuthContext";
import { ToastProvider } from "@/components/Toast";
import ChatWidgetLoader from "@/components/ChatWidgetLoader";
import {
  SITE_URL,
  SITE_NAME,
  buildMetadata,
  organizationSchema,
  websiteSchema,
  jsonLd,
} from "@/lib/seo";

// Body font — matches lumauae.com
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
});

// Heading / display font — Clash Display, matches lumauae.com
const clashDisplay = localFont({
  variable: "--font-clash",
  display: "swap",
  src: [
    { path: "./fonts/clash/ClashDisplay-Extralight.woff2", weight: "200", style: "normal" },
    { path: "./fonts/clash/ClashDisplay-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/clash/ClashDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/clash/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/clash/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/clash/ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  ...buildMetadata({
    title: "Peptiva Labs — Research Peptides, Sourced and Shipped from Dubai",
    path: "/",
    keywords: [
      "research peptides Dubai",
      "buy peptides UAE",
      "BPC-157 TB-500",
      "tirzepatide research",
      "retatrutide UAE",
      "lab-grade peptides",
      "Peptiva Labs",
    ],
  }),
  // Child routes render "<Page> · Peptiva Labs"; the home page keeps its full title.
  title: {
    default: "Peptiva Labs — Research Peptides, Sourced and Shipped from Dubai",
    template: `%s · ${SITE_NAME}`,
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#F1F1F1",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${clashDisplay.variable}`}
    >
      <body
        suppressHydrationWarning
        className="font-sans antialiased bg-canvas text-ink"
      >
        {/* Keyboard/screen-reader shortcut past the fixed navigation. */}
        <a href="#home" className="skip-link">
          Skip to content
        </a>

        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <SmoothScroll>{children}</SmoothScroll>
              <ChatWidgetLoader />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(organizationSchema())}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(websiteSchema())}
        />
      </body>
    </html>
  );
}
