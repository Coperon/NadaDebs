const EMAIL_BRAND_NAME = 'Nada Debs';
const EMAIL_LOGO_URL = 'https://www.nadadebs.com/corporate3/images/1214/logo-black.png?width=300';

const FONT_STACK = "sans-serif";
const TEXT_COLOR = '#151515';
const BORDER_COLOR = '#151515';
const BACKGROUND_COLOR = '#E0DCD6';

const TITLE_STYLE = `margin:0 0 48px 0;font-size:22px;line-height:1;font-weight:700;letter-spacing:1.1px;text-transform:uppercase;text-align:center;`;
const TABLE_LABEL_STYLE = `padding:12px 0;border-bottom:1px solid ${BORDER_COLOR};width:180px;font-size:12px;line-height:14px;font-weight:700;letter-spacing:0.12px;text-transform:uppercase;color:${TEXT_COLOR};`;
const TABLE_VALUE_STYLE = `padding:12px 0;border-bottom:1px solid ${BORDER_COLOR};white-space:pre-wrap;font-size:14px;line-height:19px;font-weight:300;letter-spacing:0.14px;color:${TEXT_COLOR} !important;`;
const FOOTER_STYLE = `padding:0 24px;text-align:center;font-size:12px;line-height:1;font-weight:500;letter-spacing:0.6px;`;

export type EmailFieldRow = {
  label: string;
  textValue: string;
  htmlValue?: string;
  labelStyle?: string;
  valueStyle?: string;
};

export function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function renderFieldsHtmlRows(fields: EmailFieldRow[]) {
  return fields
    .map(
      ({ label, textValue, htmlValue, labelStyle, valueStyle }) => `
        <tr>
          <td style="${TABLE_LABEL_STYLE}${labelStyle || ''}"><strong>${escapeHtml(label)}</strong></td>
          <td style="${TABLE_VALUE_STYLE}${valueStyle || ''}">${htmlValue || escapeHtml(textValue)}</td>
        </tr>
      `.trim()
    )
    .join('');
}

export function renderFieldsTable(fields: EmailFieldRow[]) {
  const rowsHtml = renderFieldsHtmlRows(fields);
  return `
    <div style="margin:36px 0;">
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
        ${rowsHtml}
      </table>
    </div>
  `.trim();
}

export function renderEmailLayout({
  title,
  introHtml,
  bodyHtml,
  logoUrl,
  brandName,
}: {
  title: string;
  introHtml?: string;
  bodyHtml: string;
  logoUrl?: string;
  brandName?: string;
}) {
  const resolvedBrandName = brandName || EMAIL_BRAND_NAME;
  const resolvedLogoUrl = logoUrl || EMAIL_LOGO_URL;

  return `
    <div style="margin:0;padding:32px 16px;background:${BACKGROUND_COLOR};color:${TEXT_COLOR};font-family:${FONT_STACK};font-size:14px;line-height:19px;font-weight:300;letter-spacing:0.14px;">
      <div style="max-width:720px;margin:0 auto;">
        <div style="text-align:center;">
          <img src="${escapeHtml(resolvedLogoUrl)}" alt="${escapeHtml(resolvedBrandName)}" style="height:20px;width:auto;display:inline-block;" />
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
    </div>
  `.trim();
}
