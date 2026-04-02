// NOTE: This file handles /api/send in production (Netlify Functions).
// A mirrored version exists at server/api/send.ts for local dev.
// If you edit this, remember to update the other send.ts as well.

import { Resend } from 'resend';

// ── Branding & email config ──────────────────────────────────────────────────

const FROM_EMAIL = 'Nada Debs <info@nadadebs.com>';
const PUBLIC_SITE_URL = 'https://nadadebs.com';
const EMAIL_BRAND_NAME = 'Nada Debs';
const EMAIL_LOGO_URL = 'https://www.nadadebs.com/corporate3/images/1214/logo-black.png?width=300';

const IS_PRODUCTION = process.env.APP_ENV === 'production';

const ADMIN_EMAILS = {
  trade: IS_PRODUCTION ? 'sales@nadadebs.com' : 'delivered@resend.dev',
  contact: IS_PRODUCTION ? 'info@nadadebs.com' : 'delivered@resend.dev',
  contactInquiry: IS_PRODUCTION ? 'sales@nadadebs.com' : 'delivered@resend.dev',
  apply: IS_PRODUCTION ? 'careers@nadadebs.com' : 'delivered@resend.dev',
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
  labelStyle?: string;
  valueStyle?: string;
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
      ({ label, textValue, htmlValue, labelStyle, valueStyle }) => `
        <tr>
          <td style="${TABLE_LABEL_STYLE}${labelStyle || ''}"><strong>${escapeHtml(label)}</strong></td>
          <td style="${TABLE_VALUE_STYLE}${valueStyle || ''}">${htmlValue || escapeHtml(textValue)}</td>
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
    requiredFields: ['first-name', 'last-name', 'mobile-number', 'email-address', 'country', 'motivation'],
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
  const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY;
  const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID;

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

  if (formType === 'apply') {
    const hasCvUrl = Boolean(readBodyValue(body, 'cv-url'));
    const hasCvFile = Boolean(readBodyValue(body, 'cv-file'));
    if (!hasCvUrl && !hasCvFile) {
      return jsonResponse(400, { message: 'Please provide a CV / Portfolio URL or upload a file.' });
    }
  }

  const firstName = readBodyValue(body, 'first-name');
  const lastName = readBodyValue(body, 'last-name');
  const emailAddress = readBodyValue(body, 'email-address');
  const cvFileBase64 = readBodyValue(body, 'cv-file');
  const cvFileFilename = readBodyValue(body, 'cv-file-filename');
  const cvFileType = readBodyValue(body, 'cv-file-type');
  const inquiryTitle = readBodyValue(body, 'inquiry-title');
  const inquiryImage = toAbsoluteUrl(readBodyValue(body, 'inquiry-image'));
  const inquiryLink = toAbsoluteUrl(readBodyValue(body, 'inquiry-link'));
  const inquiryProductId = readBodyValue(body, 'inquiry-product-id');
  const isContactInquiry = formType === 'contact' && Boolean(inquiryTitle && inquiryLink);
  const adminTitle = isContactInquiry ? 'New product inquiry' : config.adminTitle;
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

    if (inquiryImage) {
      fields.push({
        label: 'Product Image',
        textValue: inquiryImage,
        labelStyle: 'vertical-align:top;padding-top:16px;',
        valueStyle: 'padding:16px 0;',
        htmlValue: `<div style="background:#F1EAE4;padding:16px;"><img src="${escapeHtml(inquiryImage)}" alt="${escapeHtml(inquiryTitle)}" style="display:block;width:100%;height:auto;" /></div>`,
      });
    }
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

  if (formType === 'apply' && cvFileFilename) {
    fields.push({ label: 'CV / Portfolio File', textValue: cvFileFilename });
  }

  const fieldsText = fields.map(({ label, textValue }) => `${label}: ${textValue}`).join('\n');
  const fieldsTableHtml = renderFieldsTable(fields);

  const adminHtml = renderEmailLayout({
    title: adminTitle,
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

  const cvAttachments =
    formType === 'apply' && cvFileBase64 && cvFileFilename
      ? [{ content: Buffer.from(cvFileBase64, 'base64'), filename: cvFileFilename, contentType: cvFileType || undefined }]
      : undefined;

  const adminResponse = await resend.emails.send({
    from: FROM_EMAIL,
    to: [adminRecipient],
    subject: `${adminTitle} from ${firstName} ${lastName}`,
    html: adminHtml,
    text: fieldsText,
    attachments: cvAttachments,
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

  const subscribeToKlaviyo = readBodyValue(body, 'klaviyo-subscribe') === 'on';
  if (subscribeToKlaviyo && KLAVIYO_API_KEY && KLAVIYO_LIST_ID) {
    try {
      const klaviyoHeaders = {
        Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        revision: '2024-10-15',
        'Content-Type': 'application/json',
      };

      // Step 1: create profile (or get existing ID on 409)
      const profileRes = await fetch('https://a.klaviyo.com/api/profiles/', {
        method: 'POST',
        headers: klaviyoHeaders,
        body: JSON.stringify({
          data: {
            type: 'profile',
            attributes: { email: emailAddress, first_name: firstName, last_name: lastName },
          },
        }),
      });
      const profileJson = await profileRes.json();
      let profileId: string;
      if (profileRes.status === 409) {
        profileId = profileJson.errors?.[0]?.meta?.duplicate_profile_id;
        if (!profileId) throw new Error('Klaviyo duplicate profile but no ID returned');
      } else {
        profileId = profileJson.data.id;
      }

      // Step 2: patch profile with location (works for both new and existing profiles)
      await fetch(`https://a.klaviyo.com/api/profiles/${profileId}/`, {
        method: 'PATCH',
        headers: klaviyoHeaders,
        body: JSON.stringify({
          data: {
            type: 'profile',
            id: profileId,
            attributes: { location: { country: readBodyValue(body, 'country') } },
          },
        }),
      });

      // Step 3: add profile to list
      await fetch(`https://a.klaviyo.com/api/lists/${KLAVIYO_LIST_ID}/relationships/profiles/`, {
        method: 'POST',
        headers: klaviyoHeaders,
        body: JSON.stringify({ data: [{ type: 'profile', id: profileId }] }),
      });

      console.info('[send] Klaviyo profile added to list', { email: emailAddress, profileId });
    } catch (err: any) {
      console.error('[send] Klaviyo subscription failed', {
        status: err?.status,
        message: err?.message,
      });
    }
  }

  return jsonResponse(200, {
    admin: adminResponse.data,
    sender: senderResponse.data,
    senderError: senderResponse.error
      ? { message: senderResponse.error.message, name: senderResponse.error.name }
      : null,
  });
};
