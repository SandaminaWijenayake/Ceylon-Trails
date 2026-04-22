import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ContactEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const ContactEmail = ({
  name,
  email,
  subject,
  message,
}: ContactEmailProps) => {
  const previewText = `New contact from ${name}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img
              src={`${baseUrl}/logo.png`}
              width="40"
              height="40"
              alt="CeylonTrails"
              style={logo}
            />
          </Section>

          <Heading style={heading}>New Contact Form Submission</Heading>

          <Section style={detailsSection}>
            <div style={detailRow}>
              <Text style={label}>Name:</Text>
              <Text style={value}>{name}</Text>
            </div>
            <div style={detailRow}>
              <Text style={label}>Email:</Text>
              <Text style={value}>{email}</Text>
            </div>
            <div style={detailRow}>
              <Text style={label}>Subject:</Text>
              <Text style={value}>{subject}</Text>
            </div>
          </Section>

          <Section style={messageSection}>
            <Text style={messageLabel}>Message:</Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Section style={ctaSection}>
            <Button style={button} href={`mailto:${email}`}>
              Reply to {email}
            </Button>
          </Section>

          <Text style={footer}>
            This email was sent from the CeylonTrails contact form.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ContactEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 0",
  maxWidth: "600px",
};

const logoSection = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const logo = {
  borderRadius: "8px",
};

const heading = {
  textAlign: "center" as const,
  fontSize: "24px",
  color: "#1a4d2e",
  marginBottom: "24px",
  marginTop: "0",
};

const detailsSection = {
  padding: "0 40px",
};

const detailRow = {
  display: "flex" as const,
  marginBottom: "16px",
  borderBottom: "1px solid #e6ebf1",
  paddingBottom: "8px",
};

const label = {
  fontWeight: "600",
  color: "#525f7f",
  width: "80px",
  margin: "0",
};

const value = {
  color: "#32325d",
  margin: "0",
};

const messageSection = {
  padding: "0 40px",
  marginTop: "24px",
};

const messageLabel = {
  fontWeight: "600",
  color: "#525f7f",
  marginBottom: "8px",
  marginTop: "0",
};

const messageText = {
  color: "#32325d",
  lineHeight: "1.6",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const ctaSection = {
  padding: "0 40px",
  marginTop: "32px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#1a4d2e",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px 24px",
  textDecoration: "none",
  textAlign: "center" as const,
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "32px",
  padding: "0 40px",
};