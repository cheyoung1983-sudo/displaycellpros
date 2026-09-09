import { Auth0Client } from '@auth0/nextjs-auth0/server';

const REQUIRED_ENV_VARS = ['AUTH0_DOMAIN', 'AUTH0_CLIENT_ID', 'AUTH0_CLIENT_SECRET', 'AUTH0_SECRET', 'APP_BASE_URL'] as const;

function createAuth0Client(): Auth0Client {
  if (process.env.NODE_ENV === 'production') {
    const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
    if (missing.length > 0) {
      throw new Error(`[Auth0] Refusing to start: missing required environment variable(s) in production: ${missing.join(', ')}`);
    }
    return new Auth0Client(); // reads the (now-confirmed-present) env vars directly
  }

  return new Auth0Client({
    domain: process.env.AUTH0_DOMAIN || 'displaycellpros.us.auth0.com',
    clientId: process.env.AUTH0_CLIENT_ID || 'mock_client_id',
    clientSecret: process.env.AUTH0_CLIENT_SECRET || 'mock_client_secret',
    secret: process.env.AUTH0_SECRET || 'a_long_32_character_secret_key_placeholder_for_auth0',
    appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
  });
}

let cachedClient: Auth0Client | undefined;
function getClient(): Auth0Client {
  if (!cachedClient) {
    cachedClient = createAuth0Client();
  }
  return cachedClient;
}

// Lazy so the production env-var check above runs on first real use (a request),
// not at module import time -- constructing eagerly would make this throw during
// `next build`'s page-data collection, breaking the build itself, not just runtime.
export const auth0 = new Proxy({} as Auth0Client, {
  get(_target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client as object, prop, receiver);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export default auth0;
