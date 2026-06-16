// emails/onboardingTemplate.ts
// Builds the "Hour Logging for Deck Doctors" onboarding email sent to a new
// employee with their portal login credentials. Content mirrors
// emails/onboardingFormat. The HTML is intentionally simple inline-styled
// markup — a design-focused pass will restyle it later.

const PORTAL_URL = "https://deckdocne.com/employee-portal";
const CONTACT_PHONE = "860-478-3791";
const CONTACT_EMAIL = "SamuelG@DeckDocNE.com";

interface OnboardingEmailInput {
  first_name: string;
  username: string;
  password: string;
}

interface BuiltEmail {
  subject: string;
  htmlBody: string;
  textBody: string;
}

export function buildOnboardingEmail({
  first_name,
  username,
  password,
}: OnboardingEmailInput): BuiltEmail {
  const subject = "Hour Logging for Deck Doctors";

  const textBody = [
    `Hi ${first_name},`,
    ``,
    `We have just set up a new way to track your hours so we can ensure you get paid accurately and on time.`,
    ``,
    `Go to ${PORTAL_URL} and sign in with your credentials.`,
    `Username: ${username}`,
    `Password: ${password}`,
    `*Please change your password once you log in*`,
    ``,
    `You simply press clock in when you arrive at a site and then clock out as you leave.`,
    ``,
    `If you have any problems, suggestions, or questions please do not hesitate to ask. Phone: ${CONTACT_PHONE}, Email: ${CONTACT_EMAIL}.`,
    ``,
    `--`,
    `Samuel Goldsmith`,
    `Deck Doctors`,
    `Owner | Restoration Expert`,
  ].join("\n");

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background-color:#ece3d8;">
    <div style="max-width:600px;margin:0 auto;padding:24px 12px;">
      <div style="max-width:600px;margin:0 auto;background-color:#fdfbf8;border-radius:12px;overflow:hidden;border:1px solid #e3dccf;box-shadow:0 4px 20px -6px rgba(43,34,32,0.20);">

        <!-- Header / Logo -->
        <div style="background-color:#fdfbf8;padding:28px 32px 20px;text-align:center;border-bottom:1px solid #e3dccf;">
          <img src="https://deckdocne.com/logo-black-tp.png" width="64" height="64" alt="Deck Doctors" style="display:block;margin:0 auto 8px;border:0;" />
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:bold;color:#5c4533;letter-spacing:0.04em;">
            DECK DOCTORS
          </div>
        </div>

        <!-- Body -->
        <div style="padding:32px;font-family:Arial,Helvetica,sans-serif;color:#2b2220;">
          <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:bold;margin:0 0 20px;color:#5c4533;">
            Welcome to Deck Doctors
          </h1>
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Hi ${first_name},</p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
            We have just set up a new way to track your hours so we can ensure you get paid accurately and on time.
          </p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 24px;">
            Go to the employee portal and sign in with the credentials below.
          </p>

          <!-- CTA Button -->
          <div style="margin:0 0 24px;text-align:center;">
            <a href="${PORTAL_URL}" style="display:inline-block;background-color:#5c4533;color:#fdfbf8;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:6px;font-family:Arial,Helvetica,sans-serif;">
              Open Employee Portal
            </a>
          </div>

          <!-- Credentials box -->
          <div style="background-color:#f7f1ea;border:1px solid #e3dccf;border-radius:8px;padding:18px 20px;margin:0 0 24px;">
            <p style="font-size:13px;line-height:1.6;margin:0 0 8px;color:#7a6a5d;text-transform:uppercase;letter-spacing:0.06em;font-weight:bold;">
              Your Login Credentials
            </p>
            <p style="font-size:15px;line-height:1.8;margin:0;font-family:'Courier New',Courier,monospace;color:#2b2220;">
              <strong>Username:</strong> ${username}<br />
              <strong>Password:</strong> ${password}
            </p>
            <p style="font-size:13px;line-height:1.5;margin:10px 0 0;color:#7a6a5d;">
              Please change your password once you log in.
            </p>
          </div>

          <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
            You simply press clock in when you arrive at a site and then clock out as you leave.
          </p>
          <p style="font-size:15px;line-height:1.6;margin:0 0 8px;">
            If you have any problems, suggestions, or questions please do not hesitate to ask.<br />
            Phone: ${CONTACT_PHONE}<br />
            Email: <a href="mailto:${CONTACT_EMAIL}" style="color:#5c4533;font-weight:600;">${CONTACT_EMAIL}</a>
          </p>
        </div>

        <!-- Footer / Signature -->
        <div style="background-color:#e3dccf;padding:20px 32px;border-top:1px solid #d8cfc0;">
          <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;margin:0;color:#5c4533;">
            <strong>Samuel Goldsmith</strong><br />
            Deck Doctors<br />
            Owner | Restoration Expert
          </p>
        </div>

      </div>
    </div>
  </body>
</html>`;

  return { subject, htmlBody, textBody };
}
