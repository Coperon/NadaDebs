import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FORMS_ADMIN_EMAIL = process.env.RESEND_FORMS_ADMIN_EMAIL;
const TRADE_ADMIN_EMAIL = process.env.RESEND_TRADE_ADMIN_EMAIL;
const CONTACT_ADMIN_EMAIL = process.env.RESEND_CONTACT_ADMIN_EMAIL;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const RESEND_ALLOW_EXTERNAL_RECIPIENTS = process.env.RESEND_ALLOW_EXTERNAL_RECIPIENTS === 'true';
const PUBLIC_SITE_URL = 'https://nadadebs.netlify.app';

if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
  throw new Error('Missing required env vars: RESEND_API_KEY, RESEND_FROM_EMAIL');
}

const resend = new Resend(RESEND_API_KEY);

const FORM_CONFIGS = {
  trade: {
    adminEmail: TRADE_ADMIN_EMAIL || RESEND_FORMS_ADMIN_EMAIL,
    adminTitle: 'New trade form submission',
    senderTitle: 'We received your trade enquiry',
    requiredFields: [
      'company-name',
      'company-website',
      'type-of-business',
      'first-name',
      'last-name',
      'mobile-number',
      'email-address',
      'country',
      'message',
    ],
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
    adminEmail: CONTACT_ADMIN_EMAIL || RESEND_FORMS_ADMIN_EMAIL,
    adminTitle: 'New contact form submission',
    senderTitle: 'We received your message',
    requiredFields: [
      'first-name',
      'last-name',
      'mobile-number',
      'email-address',
      'country',
      'profession',
      'message',
    ],
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
} as const;

type FormType = keyof typeof FORM_CONFIGS;

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

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

export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event);
  const formType = String(body?.formType || body?.['form-name'] || '').toLowerCase() as FormType;
  const config = FORM_CONFIGS[formType];

  if (!config) {
    throw createError({
      statusCode: 400,
      message: 'Unsupported form type',
    });
  }

  if (!config.adminEmail) {
    throw createError({
      statusCode: 500,
      message: `Missing admin email config for form type "${formType}"`,
    });
  }

  const missingFields = config.requiredFields.filter((field) => !readBodyValue(body, field));
  if (missingFields.length > 0) {
    throw createError({
      statusCode: 400,
      message: `Missing required fields: ${missingFields.join(', ')}`,
    });
  }

  const firstName = readBodyValue(body, 'first-name');
  const lastName = readBodyValue(body, 'last-name');
  const emailAddress = readBodyValue(body, 'email-address');
  const inquiryTitle = readBodyValue(body, 'inquiry-title');
  const inquiryLink = toAbsoluteUrl(readBodyValue(body, 'inquiry-link'));
  const inquiryProductId = readBodyValue(body, 'inquiry-product-id');
  const fields: Array<{ label: string; textValue: string; htmlValue?: string }> = [];

  if (formType === 'contact' && inquiryTitle && inquiryLink) {
    const productText = inquiryTitle;
    fields.push({
      label: 'Inquired Product',
      textValue: `${productText} (${inquiryLink})`,
      htmlValue: `<a href="${escapeHtml(inquiryLink)}" target="_blank" rel="noopener noreferrer">${escapeHtml(productText)}</a>`,
    });
  }

  if (formType === 'contact' && inquiryProductId) {
    fields.push({
      label: 'Product ID',
      textValue: inquiryProductId,
    });
  }

  for (const [fieldKey, fieldLabel] of Object.entries(config.fieldLabels)) {
    const value = readBodyValue(body, fieldKey);
    if (value) fields.push({ label: fieldLabel, textValue: value });
  }

  const fieldsText = fields.map(({ label, textValue }) => `${label}: ${textValue}`).join('\n');
  const fieldsHtmlRows = fields
    .map(
      ({ label, textValue, htmlValue }) => `
        <tr>
          <td style="padding:10px 12px;border:1px solid #e5e5e5;background:#fafafa;vertical-align:top;width:180px;"><strong>${escapeHtml(label)}</strong></td>
          <td style="padding:10px 12px;border:1px solid #e5e5e5;vertical-align:top;white-space:pre-wrap;">${htmlValue || escapeHtml(textValue)}</td>
        </tr>
      `.trim()
    )
    .join('');

  const adminHtml = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:#111;">
      <h2 style="margin:0 0 12px 0;">${escapeHtml(config.adminTitle)}</h2>
      <p style="margin:0 0 16px 0;">From <strong>${escapeHtml(firstName)} ${escapeHtml(lastName)}</strong> (${escapeHtml(emailAddress)})</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:720px;">
        ${fieldsHtmlRows}
      </table>
    </div>
  `.trim();

  const senderHtml = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:#111;">
      <h2 style="margin:0 0 12px 0;">${escapeHtml(config.senderTitle)}</h2>
      <p style="margin:0 0 16px 0;">Hi ${escapeHtml(firstName)},</p>
      <p style="margin:0 0 16px 0;">Thanks for reaching out. Here’s a copy of what you submitted:</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:720px;">
        ${fieldsHtmlRows}
      </table>
      <p style="margin:16px 0 0 0;">We’ll get back to you as soon as possible.</p>
    </div>
  `.trim();

  const adminResponse = await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: [config.adminEmail],
    subject: `${config.adminTitle} from ${firstName} ${lastName}`,
    html: adminHtml,
    text: fieldsText,
  });

  if (adminResponse.error) {
    throw createError({
      statusCode: 500,
      message: adminResponse.error.message || 'Error sending admin email',
    });
  }

  const senderTo = RESEND_ALLOW_EXTERNAL_RECIPIENTS ? emailAddress : 'delivered@resend.dev';
  const senderResponse = await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: [senderTo],
    replyTo: emailAddress,
    subject: config.senderTitle,
    html: senderHtml,
    text: fieldsText,
  });

  return {
    admin: adminResponse.data,
    sender: senderResponse.data,
    sandboxedSender: !RESEND_ALLOW_EXTERNAL_RECIPIENTS,
    senderError: senderResponse.error ? { message: senderResponse.error.message, name: senderResponse.error.name } : null,
  };
});