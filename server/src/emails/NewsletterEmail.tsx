import { env } from "@/env";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import React from "react";

interface NewsletterEmailProps {
  subject: string;
  body: string;
  unsubscribeUrl: string;
}

const logoUrl = env.EMAIL_LOGO_URL ?? `${env.SERVER_URL}/public/assets/logo.png`;

export const NewsletterEmail = ({
  subject,
  body,
  unsubscribeUrl,
}: NewsletterEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>{subject}</Preview>

        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={logoUrl}
              width="48"
              height="48"
              alt="Funded For You"
              style={{ margin: "0 auto" }}
            />
            <Text style={brandName}>Funded For You</Text>
          </Section>

          {/* Content Card */}
          <Section style={card}>
            <Heading style={h1}>{subject}</Heading>
            <Text style={bodyText}>{body}</Text>

            <Hr style={divider} />

            <Text style={unsubscribeText}>
              Don&apos;t want to receive these emails?{" "}
              <Link href={unsubscribeUrl} style={unsubscribeLink}>
                Unsubscribe
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()}{" "}
              <Link href={env.FRONTEND_URL} style={footerLink}>
                Funded For You
              </Link>
              . All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// ─── Styles ──────────────────────────────────────────────

const fontFamily =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";

const main = {
  backgroundColor: "#f4f4f7",
  fontFamily,
};

const container = {
  margin: "0 auto",
  padding: "40px 16px",
  maxWidth: "560px",
};

const header = {
  backgroundColor: "#1a1a2e",
  borderRadius: "12px 12px 0 0",
  padding: "32px 24px 24px",
  textAlign: "center" as const,
};

const brandName = {
  color: "#ffffff",
  fontFamily,
  fontSize: "18px",
  fontWeight: "600" as const,
  margin: "12px 0 0",
  textAlign: "center" as const,
};

const card = {
  backgroundColor: "#ffffff",
  borderRadius: "0 0 12px 12px",
  padding: "32px 40px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
};

const h1 = {
  color: "#1a1a2e",
  fontFamily,
  fontSize: "26px",
  fontWeight: "700" as const,
  margin: "0 0 16px",
  padding: "0",
  textAlign: "center" as const,
};

const bodyText = {
  color: "#4a4a4a",
  fontFamily,
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 8px",
  whiteSpace: "pre-wrap" as const,
};

const divider = {
  borderColor: "#e8e8e8",
  margin: "24px 0",
};

const unsubscribeText = {
  color: "#ababab",
  fontFamily,
  fontSize: "12px",
  margin: "0",
  textAlign: "center" as const,
};

const unsubscribeLink = {
  color: "#297056",
  textDecoration: "underline",
};

const footer = {
  padding: "24px 0 0",
  textAlign: "center" as const,
};

const footerText = {
  color: "#9ca3af",
  fontFamily,
  fontSize: "12px",
  margin: "0",
};

const footerLink = {
  color: "#297056",
  textDecoration: "none",
};
