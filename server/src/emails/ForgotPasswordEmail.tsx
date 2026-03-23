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

interface ForgotPasswordEmailProps {
  token?: string;
}

const logoUrl = env.EMAIL_LOGO_URL ?? `${env.SERVER_URL}/public/assets/logo.png`;

export const ForgotPasswordEmail = ({ token }: ForgotPasswordEmailProps) => {
  const resetPasswordUrl = `${env.FRONTEND_URL}/auth/reset-password?token=${token}`;

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Reset your password</Preview>

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
            <Heading style={h1}>Reset Your Password</Heading>
            <Text style={text}>
              We received a request to reset your password. Click the button
              below to choose a new one.
            </Text>

            {/* CTA Button */}
            <Section style={{ textAlign: "center" as const, margin: "32px 0" }}>
              <Link href={resetPasswordUrl} target="_blank" style={button}>
                Reset Password
              </Link>
            </Section>

            <Hr style={divider} />

            <Text style={fallbackText}>
              Or, copy and paste this link into your browser:
            </Text>
            <code style={code}>{resetPasswordUrl}</code>

            <Text style={disclaimer}>
              If you didn&apos;t request a password reset, you can safely ignore
              this email.
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

ForgotPasswordEmail.PreviewProps = {
  token: "example-token-1234",
} as ForgotPasswordEmailProps;

export default ForgotPasswordEmail;

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

const text = {
  color: "#4a4a4a",
  fontFamily,
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 8px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#297056",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontFamily,
  fontSize: "16px",
  fontWeight: "700" as const,
  padding: "14px 32px",
  textDecoration: "none",
  textAlign: "center" as const,
};

const divider = {
  borderColor: "#e8e8e8",
  margin: "24px 0",
};

const fallbackText = {
  color: "#6b6b6b",
  fontFamily,
  fontSize: "13px",
  margin: "0 0 8px",
};

const code = {
  display: "block",
  padding: "12px 16px",
  backgroundColor: "#f4f4f7",
  borderRadius: "6px",
  border: "1px solid #e8e8e8",
  color: "#297056",
  fontFamily: "monospace",
  fontSize: "13px",
  wordBreak: "break-all" as const,
  lineHeight: "20px",
};

const disclaimer = {
  color: "#ababab",
  fontFamily,
  fontSize: "13px",
  margin: "20px 0 0",
  lineHeight: "20px",
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
