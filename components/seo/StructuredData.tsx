import { siteConfig } from "@/lib/site";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inline; no user input is interpolated.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Site-wide structured data: a HomeAndConstructionBusiness (a LocalBusiness
 * subtype) for local search + the WebSite entity. Rendered once in the root
 * layout so it appears on every page. Service-area business — areaServed lists
 * the regions instead of a street address (set siteConfig.address to add one).
 */
export function SiteJsonLd() {
  const { url, name, description, logo, phoneIntl, email, areaServed, sameAs, address } =
    siteConfig;
  const logoUrl = `${url}${logo}`;

  const business: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${url}/#business`,
    name,
    url,
    image: logoUrl,
    logo: logoUrl,
    description,
    telephone: phoneIntl,
    email,
    priceRange: "$$",
    areaServed: areaServed.map((region) => ({ "@type": "State", name: region })),
    sameAs,
    knowsAbout: [
      "Deck restoration",
      "Deck repair",
      "New deck construction",
      "Composite (Trex) decking",
      "Deck staining and sealing",
    ],
    ...(address ? { address: { "@type": "PostalAddress", ...address } } : {}),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    url,
    name,
    description,
    publisher: { "@id": `${url}/#business` },
    inLanguage: "en-US",
  };

  return (
    <>
      <JsonLd data={business} />
      <JsonLd data={website} />
    </>
  );
}
