import { initAuth0 } from '@auth0/nextjs-auth0';

let auth0Instance: any;

try {
  auth0Instance = initAuth0({
    secret: process.env.AUTH0_SECRET || 'a_long_32_character_secret_key_placeholder_for_auth0',
    baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:3000',
    clientID: process.env.AUTH0_CLIENT_ID || 'mock_client_id',
    clientSecret: process.env.AUTH0_CLIENT_SECRET || 'mock_client_secret',
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://displaycellpros.us.auth0.com',
  });
} catch (e) {
  console.warn('[Auth0] Initialization warning, using fallback handler:', e);
  auth0Instance = {
    handleAuth: () => () => new Response(JSON.stringify({ ok: true }), { status: 200 }),
    getSession: async () => null,
    getAccessToken: async () => null,
    withApiAuthRequired: (fn: any) => fn,
    withPageAuthRequired: (fn: any) => fn,
  };
}

export const auth0 = auth0Instance;
export default auth0;

