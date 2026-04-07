const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY;
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID;

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export const handler = async (event: { httpMethod: string; body: string | null }) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { message: 'Method not allowed' });
  }

  if (!KLAVIYO_API_KEY || !KLAVIYO_LIST_ID) {
    return jsonResponse(500, { message: 'Missing Klaviyo env vars' });
  }

  let email: string;
  try {
    const body = JSON.parse(event.body || '{}');
    email = String(body.email || '').trim().toLowerCase();
  } catch {
    return jsonResponse(400, { message: 'Invalid JSON body' });
  }

  if (!email) {
    return jsonResponse(400, { message: 'Email is required' });
  }

  const klaviyoHeaders = {
    Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
    revision: '2024-10-15',
    'Content-Type': 'application/json',
  };

  try {
    // Step 1: create profile (or get existing ID on 409)
    const profileRes = await fetch('https://a.klaviyo.com/api/profiles/', {
      method: 'POST',
      headers: klaviyoHeaders,
      body: JSON.stringify({
        data: { type: 'profile', attributes: { email } },
      }),
    });
    const profileJson = await profileRes.json();
    let profileId: string;
    if (profileRes.status === 409) {
      profileId = profileJson.errors?.[0]?.meta?.duplicate_profile_id;
      if (!profileId) return jsonResponse(500, { message: 'Klaviyo duplicate profile but no ID returned' });
    } else {
      profileId = profileJson.data.id;
    }

    // Step 2: add profile to list
    await fetch(`https://a.klaviyo.com/api/lists/${KLAVIYO_LIST_ID}/relationships/profiles/`, {
      method: 'POST',
      headers: klaviyoHeaders,
      body: JSON.stringify({ data: [{ type: 'profile', id: profileId }] }),
    });

    return jsonResponse(200, { status: 'subscribed' });
  } catch (err: any) {
    console.error('[subscribe] Klaviyo error', err?.message);
    return jsonResponse(500, { message: 'Subscription failed' });
  }
};
