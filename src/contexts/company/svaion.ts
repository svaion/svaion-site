import { defineCompany } from "./model";

/** Facts and approved messages from the Brand Identity Guidelines v1.0 (September 14, 2026). */
export const svaion = defineCompany({
  shortName: "Svaion",
  presentationName: "Svaion Technologies",
  legalName: "SVAION TECHNOLOGIES, INC.",
  registration: { kind: "proposed" },
  domain: "svaiontech.com",
  positioning: "Svaion is an AI-native software development and technology company serving growing businesses.",
  descriptor: "Intelligent software and technology systems for growing businesses. AI-assisted. Human-led.",
  tagline: "Intelligence, switched on.",
  headline: "Intelligent software, engineered for growth.",
  subheadline: "Svaion designs, builds, and supports dependable digital products using AI-assisted, human-led engineering.",
  channels: {
    general: { purpose: "general", address: "hello@svaiontech.com" },
    sales: { purpose: "sales", address: "sales@svaiontech.com" },
    support: { purpose: "support", address: "support@svaiontech.com" },
    privacy: { purpose: "privacy", address: "privacy@svaiontech.com" },
  },
  socialHandle: "@svaiontech",
});
