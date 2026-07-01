import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProductNotFound() {
  return (
    <>
      <Navbar />
      <main
        id="home"
        className="container-fluid flex min-h-[70vh] flex-col items-center justify-center text-center"
      >
        <h1 className="text-h2 font-normal">Product not found</h1>
        <p className="mt-3 max-w-sm text-[14px] text-ink-secondary">
          The item you’re looking for may have sold out or moved. Explore the
          full range instead.
        </p>
        <Link href="/#products" className="btn-dark mt-6">
          Back to the range
        </Link>
      </main>
      <Footer />
    </>
  );
}
