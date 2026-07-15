export type Product = {
  slug: string;
  name: string;
  meta: string;
  price: number; // base price in USD
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
    price: 130,
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
      "Two of the most studied recovery peptides, paired in one research-grade pre-filled pen for streamlined protocols.",
    description: [
      "Our BPC-157 + TB-500 dual blend pairs two of the most widely researched repair peptides into a single, accurately dosed pre-filled pen — built for studies that would otherwise juggle two separate reconstitutions.",
      "Each batch is third-party tested for identity and purity, sealed, and cold-stored in our Dubai facility before dispatch. Labelling reflects exactly what is in the pen — nothing more, nothing less.",
    ],
    highlights: [
      "40 mg total (20 mg / 20 mg) per pen",
      "99.4% verified purity, third-party tested",
      "Sealed, cold-chain handled",
      "For laboratory research use only",
    ],
  },
  {
    slug: "glow",
    name: "Glow",
    meta: "5 mg · 70 mg options",
    price: 100,
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
      "Sealed, tamper-evident pens",
      "For laboratory research use only",
    ],
  },
  {
    slug: "retatrutide",
    name: "Retatrutide 20mg",
    meta: "20 mg pre-filled pen",
    price: 100,
    img: "/images/retatrutide/20mg-front.jpg",
    gallery: [
      "/images/retatrutide/20mg-front.jpg",
      "/images/retatrutide/front.jpg",
      "/images/retatrutide/pen.jpg",
      "/images/retatrutide/open.jpg",
    ],
    bg: "bg-nude-green",
    category: "Metabolic",
    blurb:
      "Next-generation triple-agonist peptide in a sealed 20 mg pre-filled research pen, batch-tested before dispatch.",
    description: [
      "A 20 mg Retatrutide formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound stability analysis, formulation studies and delivery-mechanism evaluation.",
      "Independently tested and verified by Janoshik Analytical. Concentration is measured per ml; verified content reflects the total assayed mass across the stated fill volume.",
    ],
    highlights: [
      "20 mg Retatrutide, pre-filled research pen",
      "Triple-agonist research peptide",
      "Janoshik Analytical verified",
      "For laboratory research use only",
    ],
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    meta: "5 / 20 / 40 mg",
    price: 100,
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
      "Held in our temperature-controlled Dubai facility and dispatched same or next working day, each pen is verified, sealed and accurately labelled.",
    ],
    highlights: [
      "Available in 5 mg, 20 mg and 40 mg",
      "Dual-agonist GLP-1 / GIP peptide",
      "Verified purity, sealed handling",
      "For laboratory research use only",
    ],
  },
  {
    slug: "retatrutide-40mg",
    name: "Retatrutide 40mg",
    meta: "40 mg pre-filled pen",
    price: 180,
    img: "/images/retatrutide/40mg-front.jpg",
    gallery: [
      "/images/retatrutide/40mg-front.jpg",
      "/images/retatrutide/front.jpg",
      "/images/retatrutide/pen.jpg",
      "/images/retatrutide/open.jpg",
    ],
    bg: "bg-nude-green",
    category: "Metabolic",
    blurb:
      "High-dose 40 mg Retatrutide in a sealed pre-filled research pen for controlled laboratory R&D applications.",
    description: [
      "A 40 mg Retatrutide formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound stability analysis, formulation studies and delivery-mechanism evaluation.",
      "Independently tested and verified by Janoshik Analytical. Concentration is measured per ml; verified content reflects the total assayed mass across the stated fill volume.",
    ],
    highlights: [
      "40 mg Retatrutide, pre-filled research pen",
      "Janoshik Analytical verified",
      "Sealed for stability and formulation studies",
      "For laboratory research use only",
    ],
  },
  {
    slug: "nad-plus-1000mg",
    name: "NAD+ 1,000mg",
    meta: "2 × 500 mg pre-filled pens",
    price: 140,
    img: "/images/nad/front.jpg",
    gallery: [
      "/images/nad/front.jpg",
      "/images/nad/pen.jpg",
      "/images/nad/open.jpg",
      "/images/nad/uv.jpg",
    ],
    bg: "bg-lilac",
    category: "Cellular",
    blurb:
      "Nicotinamide Adenine Dinucleotide research kit — two pre-filled 500 mg pens for controlled laboratory studies.",
    description: [
      "NAD+ (Nicotinamide Adenine Dinucleotide) research formulation for laboratory analysis and in vitro studies only. Provided exclusively for controlled laboratory R&D applications.",
      "Each NAD+ 1,000mg kit ships with two pre-filled 500 mg research pens and an information sheet, sealed and cold-shipped from our Dubai facility.",
    ],
    highlights: [
      "2 × pre-filled NAD+ pens (500 mg each)",
      "Research information sheet included",
      "Sealed, tamper-evident kit",
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

export function formatUSD(n: number): string {
  return `$ ${n.toLocaleString("en-US")}`;
}

export function priceLabel(p: Product): string {
  return `${p.from ? "from " : ""}${formatUSD(p.price)}`;
}
