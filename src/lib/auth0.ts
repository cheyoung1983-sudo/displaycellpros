import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN || 'displaycellpros.us.auth0.com',
  clientId: process.env.AUTH0_CLIENT_ID || 'mock_client_id',
  clientSecret: process.env.AUTH0_CLIENT_SECRET || 'mock_client_secret',
  secret: process.env.AUTH0_SECRET || 'a_long_32_character_secret_key_placeholder_for_auth0',
  appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
});

export default auth0;
