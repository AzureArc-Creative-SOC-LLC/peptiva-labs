export type Product = {
  slug: string;
  name: string;
  meta: string;
  price: number; // base price in AED
  from?: boolean; // show "from" prefix (variants/options)
  img: string;
  gallery?: string[];
  bg: string; // accent background used on the catalogue card overlay
  category: string;
  blurb: string;
  description: string[];
  highlights: string[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "bpc-157-tb-500",
    name: "BPC-157 + TB-500",
    meta: "40 mg dual blend",
    price: 999,
    img: "/images/bpc/front.jpg",
    gallery: [
      "/images/bpc/front.jpg",
      "/images/bpc/pen.jpg",
      "/images/bpc/open.jpg",
      "/images/bpc/uv.jpg",
    ],
    bg: "bg-lilac",
    category: "Recovery",
    blurb:
      "Two of the most studied recovery peptides, paired in one research-grade vial for streamlined protocols.",
    description: [
      "Our BPC-157 + TB-500 dual blend pairs two of the most widely researched repair peptides into a single, accurately dosed vial — built for studies that would otherwise juggle two separate reconstitutions.",
      "Each batch is third-party tested for identity and purity, sealed, and cold-stored in our Dubai facility before dispatch. Labelling reflects exactly what is in the vial — nothing more, nothing less.",
    ],
    highlights: [
      "40 mg total (20 mg / 20 mg) per vial",
      "99.4% verified purity, third-party tested",
      "Lyophilised, sealed, cold-chain handled",
      "For laboratory research use only",
    ],
  },
  {
    slug: "glow",
    name: "Glow",
    meta: "5 mg · 70 mg options",
    price: 1199,
    from: true,
    img: "/images/glow/front.jpg",
    gallery: [
      "/images/glow/front.jpg",
      "/images/glow/pen.jpg",
      "/images/glow/open.jpg",
      "/images/glow/uv.jpg",
    ],
    bg: "bg-cream",
    category: "Skin & Tissue",
    blurb:
      "Our skin and tissue blend, formulated for studies focused on appearance, texture, and recovery markers.",
    description: [
      "Glow is our skin-and-tissue research line, offered in two concentrations so study designs focused on appearance, texture and recovery markers can pick the strength they need.",
      "Every batch is verified for concentration and purity, then sealed and dispatched cold from Dubai with accurate, honest labelling.",
    ],
    highlights: [
      "Available in 5 mg and 70 mg options",
      "Concentration-verified every batch",
      "Sealed, tamper-evident vials",
      "For laboratory research use only",
    ],
  },
  {
    slug: "retatrutide",
    name: "Retatrutide",
    meta: "20 mg · 40 mg",
    price: 1990,
    from: true,
    img: "/images/retatrutide/front.jpg",
    gallery: [
      "/images/retatrutide/front.jpg",
      "/images/retatrutide/pen.jpg",
      "/images/retatrutide/open.jpg",
      "/images/retatrutide/uv.jpg",
    ],
    bg: "bg-nude-green",
    category: "Metabolic",
    blurb:
      "A next-generation triple-agonist peptide for advanced metabolic research, batch-tested before dispatch.",
    description: [
      "Retatrutide is a next-generation triple-agonist peptide stocked for advanced metabolic research, available in 20 mg and 40 mg concentrations.",
      "Sourced directly from certified manufacturers, every batch is independently tested before it touches a customer order, then sealed and cold-shipped across the UAE.",
    ],
    highlights: [
      "Available in 20 mg and 40 mg",
      "Triple-agonist research peptide",
      "Independently batch-tested",
      "For laboratory research use only",
    ],
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    meta: "5 / 20 / 40 mg",
    price: 750,
    from: true,
    img: "/images/tirzepatide/front.jpg",
    gallery: [
      "/images/tirzepatide/front.jpg",
      "/images/tirzepatide/back.jpg",
      "/images/tirzepatide/open.jpg",
      "/images/tirzepatide/uv.jpg",
    ],
    bg: "bg-nude-orange",
    category: "Metabolic",
    blurb:
      "Dual-agonist GLP-1 / GIP peptide stocked in three concentrations to suit different study designs.",
    description: [
      "Tirzepatide is a dual-agonist GLP-1 / GIP research peptide kept in three concentrations so different study designs can order exactly the strength they need.",
      "Held in our temperature-controlled Dubai facility and dispatched same or next working day, each vial is verified, sealed and accurately labelled.",
    ],
    highlights: [
      "Available in 5 mg, 20 mg and 40 mg",
      "Dual-agonist GLP-1 / GIP peptide",
      "Verified purity, sealed handling",
      "For laboratory research use only",
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function relatedProducts(slug: string, limit = 3): Product[] {
  return PRODUCTS.filter((p) => p.slug !== slug).slice(0, limit);
}

export function formatAED(n: number): string {
  return `AED ${n.toLocaleString("en-US")}`;
}

export function priceLabel(p: Product): string {
  return `${p.from ? "from " : ""}${formatAED(p.price)}`;
}
