import { Resend } from 'resend';

// ── Branding & email config ──────────────────────────────────────────────────

const FROM_EMAIL = 'Nada Debs <info@nadadebs.com>';
const PUBLIC_SITE_URL = 'https://nadadebs.com';
const EMAIL_BRAND_NAME = 'Nada Debs';
const EMAIL_LOGO_URL = 'https://www.nadadebs.com/corporate3/images/1214/logo-black.png?width=300';

const ADMIN_EMAILS = {
  trade: 'info@nadadebs.com',
  contact: 'info@nadadebs.com',
  contactInquiry: 'sales@nadadebs.com',
  apply: 'careers@nadadebs.com',
};

// ── Email template helpers ───────────────────────────────────────────────────

const FONT_STACK = 'sans-serif';
const TEXT_COLOR = '#151515';
const BORDER_COLOR = '#151515';
const BACKGROUND_COLOR = '#E0DCD6';

const TITLE_STYLE = `margin:0 0 48px 0;font-size:22px;line-height:1;font-weight:700;letter-spacing:1.1px;text-transform:uppercase;text-align:center;`;
const TABLE_LABEL_STYLE = `padding:12px 0;border-bottom:1px solid ${BORDER_COLOR};width:180px;font-size:12px;line-height:14px;font-weight:700;letter-spacing:0.12px;text-transform:uppercase;color:${TEXT_COLOR};`;
const TABLE_VALUE_STYLE = `padding:12px 0;border-bottom:1px solid ${BORDER_COLOR};white-space:pre-wrap;font-size:14px;line-height:19px;font-weight:300;letter-spacing:0.14px;color:${TEXT_COLOR} !important;`;
const FOOTER_STYLE = `padding:0 24px;text-align:center;font-size:12px;line-height:1;font-weight:500;letter-spacing:0.6px;`;

type EmailFieldRow = {
  label: string;
  textValue: string;
  htmlValue?: string;
};

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderFieldsTable(fields: EmailFieldRow[]) {
  const rows = fields
    .map(
      ({ label, textValue, htmlValue }) => `
        <tr>
          <td style="${TABLE_LABEL_STYLE}"><strong>${escapeHtml(label)}</strong></td>
          <td style="${TABLE_VALUE_STYLE}">${htmlValue || escapeHtml(textValue)}</td>
        </tr>`.trim()
    )
    .join('');

  return `
    <div style="margin:36px 0;">
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
        ${rows}
      </table>
    </div>`.trim();
}

function renderEmailLayout({ title, introHtml, bodyHtml }: { title: string; introHtml?: string; bodyHtml: string }) {
  return `
    <div style="margin:0;padding:32px 16px;background:${BACKGROUND_COLOR};color:${TEXT_COLOR};font-family:${FONT_STACK};font-size:14px;line-height:19px;font-weight:300;letter-spacing:0.14px;">
      <div style="max-width:720px;margin:0 auto;">
        <div style="text-align:center;">
          <img src="${escapeHtml(EMAIL_LOGO_URL)}" alt="${escapeHtml(EMAIL_BRAND_NAME)}" style="height:20px;width:auto;display:inline-block;" />
        </div>

        <div style="padding:96px 24px 48px 24px;">
          <h2 style="${TITLE_STYLE}">${escapeHtml(title)}</h2>
          ${introHtml || ''}
          ${bodyHtml}
        </div>

        <div style="${FOOTER_STYLE}">
          <a href="https://nadadebs.com" style="color:${TEXT_COLOR} !important;text-decoration:none !important;"><span style="color:${TEXT_COLOR} !important;text-decoration:none !important;"><font color="${TEXT_COLOR}">nadadebs.com</font></span></a>
        </div>
      </div>
    </div>`.trim();
}

// ── Form configs ─────────────────────────────────────────────────────────────

const FORM_CONFIGS = {
  trade: {
    adminEmail: ADMIN_EMAILS.trade,
    adminTitle: 'New trade form submission',
    senderTitle: 'We received your trade enquiry',
    requiredFields: ['company-name', 'company-website', 'type-of-business', 'first-name', 'last-name', 'mobile-number', 'email-address', 'country', 'message'],
    fieldLabels: {
      'company-name': 'Company Name',
      'company-website': 'Company Website',
      'type-of-business': 'Type of Business',
      'first-name': 'First Name',
      'last-name': 'Last Name',
      'mobile-number': 'Mobile Number',
      'email-address': 'Email Address',
      country: 'Country',
      message: 'Message',
    },
  },
  contact: {
    adminEmail: ADMIN_EMAILS.contact,
    adminTitle: 'New contact form submission',
    senderTitle: 'We received your message',
    requiredFields: ['first-name', 'last-name', 'mobile-number', 'email-address', 'country', 'profession', 'message'],
    fieldLabels: {
      'first-name': 'First Name',
      'last-name': 'Last Name',
      'mobile-number': 'Mobile Number',
      'email-address': 'Email Address',
      country: 'Country',
      profession: 'Profession',
      message: 'Message',
    },
  },
  apply: {
    adminEmail: ADMIN_EMAILS.apply,
    adminTitle: 'New job application',
    senderTitle: 'We received your application',
    requiredFields: ['first-name', 'last-name', 'mobile-number', 'email-address', 'country', 'cv-url', 'motivation'],
    fieldLabels: {
      'first-name': 'First Name',
      'last-name': 'Last Name',
      'mobile-number': 'Mobile Number',
      'email-address': 'Email Address',
      country: 'Country',
      'cv-url': 'CV / Profile URL',
      motivation: 'Motivation',
    },
  },
} as const;

type FormType = keyof typeof FORM_CONFIGS;

// ── Helpers ──────────────────────────────────────────────────────────────────

function readBodyValue(body: Record<string, unknown>, key: string) {
  const value = body[key];
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

function toAbsoluteUrl(urlOrPath: string) {
  if (!urlOrPath) return '';
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) return urlOrPath;
  if (urlOrPath.startsWith('/')) return `${PUBLIC_SITE_URL}${urlOrPath}`;
  return `${PUBLIC_SITE_URL}/${urlOrPath}`;
}

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

// ── Handler ──────────────────────────────────────────────────────────────────

export const handler = async (event: { httpMethod: string; body: string | null }) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { message: 'Method not allowed' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return jsonResponse(500, { message: 'Missing RESEND_API_KEY env var' });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { message: 'Invalid JSON body' });
  }

  const formType = String(body?.formType || body?.['form-name'] || '').toLowerCase() as FormType;
  const config = FORM_CONFIGS[formType];

  if (!config) {
    return jsonResponse(400, { message: 'Unsupported form type' });
  }

  const missingFields = config.requiredFields.filter((field) => !readBodyValue(body, field));
  if (missingFields.length > 0) {
    return jsonResponse(400, { message: `Missing required fields: ${missingFields.join(', ')}` });
  }

  const firstName = readBodyValue(body, 'first-name');
  const lastName = readBodyValue(body, 'last-name');
  const emailAddress = readBodyValue(body, 'email-address');
  const inquiryTitle = readBodyValue(body, 'inquiry-title');
  const inquiryLink = toAbsoluteUrl(readBodyValue(body, 'inquiry-link'));
  const inquiryProductId = readBodyValue(body, 'inquiry-product-id');
  const isContactInquiry = formType === 'contact' && Boolean(inquiryTitle && inquiryLink);
  const positionTitle = readBodyValue(body, 'position');
  const positionLink = toAbsoluteUrl(readBodyValue(body, 'position-link'));
  const adminRecipient = isContactInquiry ? ADMIN_EMAILS.contactInquiry : config.adminEmail;

  const fields: EmailFieldRow[] = [];

  if (isContactInquiry) {
    fields.push({
      label: 'Inquired Product',
      textValue: `${inquiryTitle} (${inquiryLink})`,
      htmlValue: `<a href="${escapeHtml(inquiryLink)}" target="_blank" rel="noopener noreferrer" style="color:#151515 !important;text-decoration:underline !important;"><span style="color:#151515 !important;text-decoration:underline !important;"><font color="#151515">${escapeHtml(inquiryTitle)}</font></span></a>`,
    });
  }

  if (formType === 'contact' && inquiryProductId) {
    fields.push({ label: 'Product ID', textValue: inquiryProductId });
  }

  if (formType === 'apply' && positionTitle && positionLink) {
    fields.push({
      label: 'Position',
      textValue: `${positionTitle} (${positionLink})`,
      htmlValue: `<a href="${escapeHtml(positionLink)}" target="_blank" rel="noopener noreferrer" style="color:#151515 !important;text-decoration:underline !important;"><span style="color:#151515 !important;text-decoration:underline !important;"><font color="#151515">${escapeHtml(positionTitle)}</font></span></a>`,
    });
  }

  for (const [fieldKey, fieldLabel] of Object.entries(config.fieldLabels)) {
    const value = readBodyValue(body, fieldKey);
    if (value) fields.push({ label: fieldLabel, textValue: value });
  }

  const fieldsText = fields.map(({ label, textValue }) => `${label}: ${textValue}`).join('\n');
  const fieldsTableHtml = renderFieldsTable(fields);

  const adminHtml = renderEmailLayout({
    title: config.adminTitle,
    introHtml: `<p style="margin:0 0 16px 0;">From <strong>${escapeHtml(firstName)} ${escapeHtml(lastName)}</strong> (${escapeHtml(emailAddress)})</p>`,
    bodyHtml: fieldsTableHtml,
  });

  const senderHtml = renderEmailLayout({
    title: config.senderTitle,
    introHtml: `
      <p style="margin:0 0 12px 0;">Hi ${escapeHtml(firstName)},</p>
      <p style="margin:0 0 16px 0;">Thanks for reaching out. Here's a copy of what you submitted:</p>
    `.trim(),
    bodyHtml: `${fieldsTableHtml}<p style="margin:16px 0 0 0;">We'll get back to you as soon as possible.</p>`,
  });

  const resend = new Resend(RESEND_API_KEY);

  const adminResponse = await resend.emails.send({
    from: FROM_EMAIL,
    to: [adminRecipient],
    subject: `${config.adminTitle} from ${firstName} ${lastName}`,
    html: adminHtml,
    text: fieldsText,
  });

  if (adminResponse.error) {
    console.error('[send] Admin email failed', adminResponse.error);
    return jsonResponse(500, { message: adminResponse.error.message || 'Error sending admin email' });
  }

  const senderResponse = await resend.emails.send({
    from: FROM_EMAIL,
    to: [emailAddress],
    replyTo: emailAddress,
    subject: config.senderTitle,
    html: senderHtml,
    text: fieldsText,
  });

  if (senderResponse.error) {
    console.error('[send] Sender email failed', senderResponse.error);
  }

  return jsonResponse(200, {
    admin: adminResponse.data,
    sender: senderResponse.data,
    senderError: senderResponse.error
      ? { message: senderResponse.error.message, name: senderResponse.error.name }
      : null,
  });
};
