import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedLogos from "@/components/TrustedLogos";
import About from "@/components/About";
import Services from "@/components/Services";
import Features from "@/components/Features";
import CaseStudy from "@/components/CaseStudy";
import CTA from "@/components/CTA";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { localBusinessSchema, jsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(localBusinessSchema())}
      />
      <Navbar />
      <main>
        <Hero />
        <TrustedLogos />
        <About />
        <Services />
        <Features />
        <CaseStudy />
        <CTA />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
