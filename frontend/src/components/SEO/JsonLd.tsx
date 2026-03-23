type JsonLdProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
};

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Funded For You",
  url: "https://fundedforyou.com",
  logo: "https://fundedforyou.com/og.png",
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Funded For You",
  url: "https://fundedforyou.com",
};
