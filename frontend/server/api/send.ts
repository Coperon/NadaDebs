// NOTE: This file handles /api/send locally (npm run dev).
// A mirrored version exists at netlify/functions/send.ts for production.
// If you edit this, remember to update the other send.ts as well.

import { Resend } from 'resend';
import { escapeHtml, renderEmailLayout, renderFieldsTable, type EmailFieldRow } from '../utils/emailTemplate';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  throw new Error('Missing required env var: RESEND_API_KEY');
}

const FROM_EMAIL = 'Nada Debs <info@nadadebs.com>';
const PUBLIC_SITE_URL = 'https://nadadebs.com';

const ADMIN_EMAILS = {
  trade: 'delivered@resend.dev',
  contact: 'delivered@resend.dev',
  contactInquiry: 'delivered@resend.dev',
  apply: 'delivered@resend.dev',
};

const resend = new Resend(RESEND_API_KEY);

const FORM_CONFIGS = {
  trade: {
    adminEmail: ADMIN_EMAILS.trade,
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
    adminEmail: ADMIN_EMAILS.contact,
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
  apply: {
    adminEmail: ADMIN_EMAILS.apply,
    adminTitle: 'New job application',
    senderTitle: 'We received your application',
    requiredFields: [
      'first-name',
      'last-name',
      'mobile-number',
      'email-address',
      'country',
      'cv-url',
      'motivation',
    ],
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
  const isContactInquiry = formType === 'contact' && Boolean(inquiryTitle && inquiryLink);
  const positionTitle = readBodyValue(body, 'position');
  const positionLink = toAbsoluteUrl(readBodyValue(body, 'position-link'));
  const adminRecipient = isContactInquiry ? ADMIN_EMAILS.contactInquiry : config.adminEmail;

  if (!adminRecipient) {
    throw createError({
      statusCode: 500,
      message: `Missing admin email config for form type "${formType}"`,
    });
  }
  const fields: EmailFieldRow[] = [];

  if (isContactInquiry) {
    const productText = inquiryTitle;
    fields.push({
      label: 'Inquired Product',
      textValue: `${productText} (${inquiryLink})`,
      htmlValue: `<a href="${escapeHtml(inquiryLink)}" target="_blank" rel="noopener noreferrer" style="color:#151515 !important;text-decoration:underline !important;"><span style="color:#151515 !important;text-decoration:underline !important;"><font color="#151515">${escapeHtml(productText)}</font></span></a>`,
    });
  }

  if (formType === 'contact' && inquiryProductId) {
    fields.push({
      label: 'Product ID',
      textValue: inquiryProductId,
    });
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
      <p style="margin:0 0 16px 0;">Thanks for reaching out. Here’s a copy of what you submitted:</p>
    `.trim(),
    bodyHtml: `${fieldsTableHtml}<p style="margin:16px 0 0 0;">We’ll get back to you as soon as possible.</p>`,
  });

  console.info('[send.ts] Sending emails', {
    formType,
    isContactInquiry,
    from: FROM_EMAIL,
    adminTo: adminRecipient,
    senderTo: emailAddress,
  });

  const adminResponse = await resend.emails.send({
    from: FROM_EMAIL,
    to: [adminRecipient],
    subject: `${config.adminTitle} from ${firstName} ${lastName}`,
    html: adminHtml,
    text: fieldsText,
  });

  if (adminResponse.error) {
    console.error('[send.ts] Admin email failed', {
      formType,
      to: adminRecipient,
      error: adminResponse.error,
    });
    throw createError({
      statusCode: 500,
      message: adminResponse.error.message || 'Error sending admin email',
    });
  }

  console.info('[send.ts] Admin email sent', {
    formType,
    to: adminRecipient,
    id: adminResponse.data?.id || null,
  });

  const senderResponse = await resend.emails.send({
    from: FROM_EMAIL,
    to: [emailAddress],
    replyTo: emailAddress,
    subject: config.senderTitle,
    html: senderHtml,
    text: fieldsText,
  });

  if (senderResponse.error) {
    console.error('[send.ts] Sender email failed', {
      formType,
      to: emailAddress,
      error: senderResponse.error,
    });
  } else {
    console.info('[send.ts] Sender email sent', {
      formType,
      to: emailAddress,
      id: senderResponse.data?.id || null,
    });
  }

  return {
    admin: adminResponse.data,
    sender: senderResponse.data,
    senderError: senderResponse.error ? { message: senderResponse.error.message, name: senderResponse.error.name } : null,
  };
});