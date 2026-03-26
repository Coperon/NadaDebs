import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TRADE_ADMIN_EMAIL = process.env.RESEND_TRADE_ADMIN_EMAIL;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;
const RESEND_ALLOW_EXTERNAL_RECIPIENTS = process.env.RESEND_ALLOW_EXTERNAL_RECIPIENTS === 'true';

if (!RESEND_API_KEY || !TRADE_ADMIN_EMAIL || !RESEND_FROM_EMAIL) {
  throw new Error('Missing required env vars: RESEND_API_KEY, RESEND_TRADE_ADMIN_EMAIL, RESEND_FROM_EMAIL');
}

const resend = new Resend(RESEND_API_KEY);

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const companyName = body?.['company-name'] || body?.companyName;
  const companyWebsite = body?.['company-website'] || body?.companyWebsite;
  const typeOfBusiness = body?.['type-of-business'] || body?.typeOfBusiness;
  const firstName = body?.['first-name'] || body?.firstName;
  const lastName = body?.['last-name'] || body?.lastName;
  const mobileNumber = body?.['mobile-number'] || body?.mobileNumber;
  const emailAddress = body?.['email-address'] || body?.emailAddress;
  const country = body?.country;
  const message = body?.message;
  const submittedAt = new Date().toISOString();

  if (!companyName || !companyWebsite || !typeOfBusiness || !firstName || !lastName || !mobileNumber || !emailAddress || !country || !message) {
    throw createError({
      statusCode: 400,
      message: 'Missing required trade form fields',
    });
  }

  const fields = [
    ['Submitted at', submittedAt],
    ['Company Name', companyName],
    ['Company Website', companyWebsite],
    ['Type of Business', typeOfBusiness],
    ['First Name', firstName],
    ['Last Name', lastName],
    ['Mobile Number', mobileNumber],
    ['Email Address', emailAddress],
    ['Country', country],
    ['Message', message],
  ] as const;

  const fieldsText = fields.map(([k, v]) => `${k}: ${String(v)}`).join('\n');
  const fieldsHtmlRows = fields
    .map(
      ([k, v]) => `
        <tr>
          <td style="padding:10px 12px;border:1px solid #e5e5e5;background:#fafafa;vertical-align:top;width:180px;"><strong>${escapeHtml(k)}</strong></td>
          <td style="padding:10px 12px;border:1px solid #e5e5e5;vertical-align:top;white-space:pre-wrap;">${escapeHtml(v)}</td>
        </tr>
      `.trim()
    )
    .join('');

  const adminHtml = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:#111;">
      <h2 style="margin:0 0 12px 0;">New trade form submission</h2>
      <p style="margin:0 0 16px 0;">From <strong>${escapeHtml(firstName)} ${escapeHtml(lastName)}</strong> (${escapeHtml(emailAddress)})</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:720px;">
        ${fieldsHtmlRows}
      </table>
    </div>
  `.trim();

  const senderHtml = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:#111;">
      <h2 style="margin:0 0 12px 0;">We received your trade enquiry</h2>
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
    to: [TRADE_ADMIN_EMAIL],
    subject: `New trade form submission from ${firstName} ${lastName}`,
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
    subject: 'We received your trade enquiry',
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