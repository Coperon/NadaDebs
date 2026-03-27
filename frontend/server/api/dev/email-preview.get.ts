import { renderEmailLayout, renderFieldsTable, type EmailFieldRow } from '../../utils/emailTemplate';

function buildPreview(type: string) {
  const baseRows: Record<string, EmailFieldRow[]> = {
    trade: [
      { label: 'Company Name', textValue: 'Atelier North' },
      { label: 'Company Website', textValue: 'https://ateliernorth.example' },
      { label: 'Type of Business', textValue: 'Interior Design Studio' },
      { label: 'First Name', textValue: 'Laura' },
      { label: 'Last Name', textValue: 'Bennett' },
      { label: 'Mobile Number', textValue: '+44 7700 900123' },
      { label: 'Email Address', textValue: 'laura@ateliernorth.example' },
      { label: 'Country', textValue: 'United Kingdom' },
      { label: 'Message', textValue: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    ],
    contact: [
      {
        label: 'Inquired Product',
        textValue: 'Zaytoun Nesting Cabinet (https://nadadebs.netlify.app/shop/zaytoun-nesting-cabinet)',
        htmlValue:
          '<a href="https://nadadebs.netlify.app/shop/zaytoun-nesting-cabinet" target="_blank" rel="noopener noreferrer" style="color:#151515 !important;text-decoration:underline !important;"><span style="color:#151515 !important;text-decoration:underline !important;"><font color="#151515">Zaytoun Nesting Cabinet</font></span></a>',
      },
      { label: 'Product ID', textValue: '9282853732520' },
      { label: 'First Name', textValue: 'Tamer' },
      { label: 'Last Name', textValue: 'Khatib' },
      { label: 'Mobile Number', textValue: '+34 600 111 222' },
      { label: 'Email Address', textValue: 'tamer@example.com' },
      { label: 'Country', textValue: 'Spain' },
      { label: 'Profession', textValue: 'Architect' },
      { label: 'Message', textValue: 'Interested in availability and lead times.' },
    ],
    apply: [
      {
        label: 'Position',
        textValue: 'Senior Product Designer (https://nadadebs.netlify.app/work-with-us/senior-product-designer)',
        htmlValue:
          '<a href="https://nadadebs.netlify.app/work-with-us/senior-product-designer" target="_blank" rel="noopener noreferrer" style="color:#151515 !important;text-decoration:underline !important;"><span style="color:#151515 !important;text-decoration:underline !important;"><font color="#151515">Senior Product Designer</font></span></a>',
      },
      { label: 'First Name', textValue: 'Maya' },
      { label: 'Last Name', textValue: 'Haddad' },
      { label: 'Mobile Number', textValue: '+961 70 123 456' },
      { label: 'Email Address', textValue: 'maya@example.com' },
      { label: 'Country', textValue: 'Lebanon' },
      { label: 'CV / Profile URL', textValue: 'https://linkedin.com/in/maya-haddad' },
      { label: 'Motivation', textValue: 'Excited to contribute to exceptional craft-led design.' },
    ],
  };

  const rows = baseRows[type] || baseRows.trade;
  const titleMap: Record<string, { admin: string; sender: string; firstName: string; lastName: string; email: string }> = {
    trade: {
      admin: 'New trade form submission',
      sender: 'We received your trade enquiry',
      firstName: 'Laura',
      lastName: 'Bennett',
      email: 'laura@ateliernorth.example',
    },
    contact: {
      admin: 'New contact form submission',
      sender: 'We received your message',
      firstName: 'Tamer',
      lastName: 'Khatib',
      email: 'tamer@example.com',
    },
    apply: {
      admin: 'New job application',
      sender: 'We received your application',
      firstName: 'Maya',
      lastName: 'Haddad',
      email: 'maya@example.com',
    },
  };

  const data = titleMap[type] || titleMap.trade;
  const fieldsTableHtml = renderFieldsTable(rows, { margin: '24px 0' });

  const adminHtml = renderEmailLayout({
    title: data.admin,
    introHtml: `<p style="margin:0 0 16px 0;">From <strong>${data.firstName} ${data.lastName}</strong> (${data.email})</p>`,
    bodyHtml: fieldsTableHtml,
    logoUrl: 'http://localhost:3000/nd-logo.png',
  });

  const senderHtml = renderEmailLayout({
    title: data.sender,
    introHtml: `
      <p style="margin:0 0 12px 0;">Hi ${data.firstName},</p>
      <p style="margin:0 0 16px 0;">Thanks for reaching out. Here’s a copy of what you submitted:</p>
    `.trim(),
    bodyHtml: `${fieldsTableHtml}<p style="margin:16px 0 0 0;">We’ll get back to you as soon as possible.</p>`,
    logoUrl: 'http://localhost:3000/nd-logo.png',
  });

  return { adminHtml, senderHtml };
}

export default defineEventHandler((event) => {
  const type = String(getQuery(event).type || 'trade').toLowerCase();
  const variant = String(getQuery(event).variant || 'admin').toLowerCase();
  const { adminHtml, senderHtml } = buildPreview(type);
  const html = variant === 'sender' ? senderHtml : adminHtml;

  setResponseHeader(event, 'content-type', 'text/html; charset=utf-8');
  return html;
});
