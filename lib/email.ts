import { ServerClient } from "postmark";
import { buildOnboardingEmail } from "@/emails/onboardingTemplate";

const token = process.env.POSTMARK_SERVER_TOKEN;
const from = process.env.POSTMARK_FROM;

// POSTMARK_TO may be a single address or a comma-separated list of addresses.
const to = (process.env.POSTMARK_TO ?? "")
  .split(",")
  .map((addr) => addr.trim())
  .filter(Boolean)
  .join(", ");

const client = token ? new ServerClient(token) : null;

interface SendEmailOptions {
  subject: string;
  htmlBody: string;
  textBody: string;
  to?: string;
}

/**
 * Sends a notification email via Postmark. No-ops (with a console warning)
 * if POSTMARK_SERVER_TOKEN/POSTMARK_FROM/POSTMARK_TO aren't configured, and
 * never throws — a failed email should never block a form submission.
 * Pass `to` to override the module-level fixed recipient (POSTMARK_TO).
 */
export async function sendEmail({ subject, htmlBody, textBody, to: toOverride }: SendEmailOptions) {
  const recipient = toOverride ?? to;
  if (!client || !from || !recipient) {
    console.warn("Postmark is not configured — skipping email notification.");
    return;
  }

  try {
    await client.sendEmail({
      From: from,
      To: recipient,
      Subject: subject,
      HtmlBody: htmlBody,
      TextBody: textBody,
    });
  } catch (error) {
    console.error("Failed to send email notification:", error);
  }
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
  restoration: "Deck Restoration",
  new_build: "New Deck Build",
  repair: "Repair",
  staining_sealing: "Staining / Sealing",
  inspection: "Inspection",
};

export async function sendEstimateNotification(estimate: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  service_type: string;
  message?: string | null;
}) {
  const serviceLabel = SERVICE_TYPE_LABELS[estimate.service_type] ?? estimate.service_type;
  const subject = `New estimate request: ${estimate.first_name} ${estimate.last_name}`;

  const rows: [string, string | null | undefined][] = [
    ["Name", `${estimate.first_name} ${estimate.last_name}`],
    ["Email", estimate.email],
    ["Phone", estimate.phone],
    ["Address", estimate.address],
    ["Service", serviceLabel],
    ["Message", estimate.message],
  ];

  const textBody = rows
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  const htmlBody = `
    <h2>New estimate request</h2>
    <a href="https://deckdocne.com/employee-portal/estimates">View in dashboard to see status</a>
    <table cellpadding="4" cellspacing="0">
      ${rows
        .filter(([, value]) => value)
        .map(
          ([label, value]) =>
            `<tr><td><strong>${label}</strong></td><td>${value}</td></tr>`
        )
        .join("")}
    </table>
  `;

  await sendEmail({ subject, htmlBody, textBody });
}

export async function sendOnboardingEmail({
  to,
  first_name,
  username,
  password,
}: {
  to: string;
  first_name: string;
  username: string;
  password: string;
}) {
  if (!to) {
    console.warn("sendOnboardingEmail: missing recipient email — skipping.");
    return;
  }
  const { subject, htmlBody, textBody } = buildOnboardingEmail({ first_name, username, password });
  await sendEmail({ subject, htmlBody, textBody, to });
}

const POSITION_LABELS: Record<string, string> = {
  laborer: "Laborer",
  carpenter: "Carpenter",
  painter: "Painter",
};

export async function sendApplicationNotification(application: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  availability: string;
  has_driving_license: boolean;
  message?: string | null;
}) {
  const positionLabel = POSITION_LABELS[application.position] ?? application.position;
  const subject = `New job application: ${application.first_name} ${application.last_name}`;

  const rows: [string, string | null | undefined][] = [
    ["Name", `${application.first_name} ${application.last_name}`],
    ["Email", application.email],
    ["Phone", application.phone],
    ["Position", positionLabel],
    ["Experience", application.experience],
    ["Availability", application.availability],
    ["Driving license", application.has_driving_license ? "Yes" : "No"],
    ["Message", application.message],
  ];

  const textBody = rows
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  const htmlBody = `
    <h2>New job application</h2>
    <table cellpadding="4" cellspacing="0">
      ${rows
        .filter(([, value]) => value)
        .map(
          ([label, value]) =>
            `<tr><td><strong>${label}</strong></td><td>${value}</td></tr>`
        )
        .join("")}
    </table>
  `;

  await sendEmail({ subject, htmlBody, textBody });
}
