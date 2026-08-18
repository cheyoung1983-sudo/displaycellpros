import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  Smartphone, 
  Terminal, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  FileText,
  Cpu,
  Layers,
  Zap,
  Tv,
  Radio,
  ArrowRight,
  HelpCircle,
  Code2,
  Binary,
  Share2,
  Eye,
  Flame,
  Check,
  AlertTriangle,
  Server,
  ShieldAlert,
  Globe,
  Activity,
  ChevronRight,
  Sliders,
  Send,
  KeyRound,
  Fingerprint,
  FileCode2,
  Bug,
  BookOpen,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from './Toast.tsx';

export interface Auth0Flow {
  id: string;
  name: string;
  badge: string;
  category: 'Standard Web & Mobile' | 'Privacy & Enterprise' | 'Machine & IoT' | 'Advanced & Legacy';
  rfcOrStandard: string;
  description: string;
  bestFor: string;
  securityRating: 'Recommended' | 'High Security' | 'Specialized' | 'Legacy / Caution';
  endpoints: Record<string, string>;
  grantTypeOrResponseType: string;
  authMethod: 'OAuth2 Access Token' | 'Client ID & Client Secret' | 'Client ID & Client Assertion' | 'Client ID (Public)' | 'mTLS Authentication';
  samplePayload: Record<string, any>;
  headers?: Record<string, string>;
  steps: { step: number; title: string; from: string; to: string; detail: string }[];
  documentationUrls: { title: string; url: string }[];
  codeSnippets: {
    curl: string;
    typescript: string;
    fetch: string;
    python: string;
  };
}

export const auth0FlowsData: Auth0Flow[] = [
  {
    id: 'auth_code',
    name: 'Authorization Code Flow',
    badge: 'Server-Side Apps',
    category: 'Standard Web & Mobile',
    rfcOrStandard: 'OAuth 2.0 RFC 6749 §4.1',
    description: 'Because regular web apps are server-side apps where the source code and client secret are protected, they exchange an Authorization Code for tokens directly on the backend.',
    bestFor: 'Traditional web applications with a secure backend (Node.js/Express, Next.js API, Django, Ruby on Rails, ASP.NET).',
    securityRating: 'Recommended',
    grantTypeOrResponseType: 'response_type=code / grant_type=authorization_code',
    authMethod: 'Client ID & Client Secret',
    endpoints: {
      authorize: 'https://{yourDomain}/authorize',
      token: 'https://{yourDomain}/oauth/token',
      userinfo: 'https://{yourDomain}/userinfo'
    },
    samplePayload: {
      grant_type: 'authorization_code',
      client_id: 'dcp_web_app_client_id_01',
      client_secret: 'sec_prod_994827163018274615293048',
      code: 'SplxlOBeZQQYbYS6WxSbIA',
      redirect_uri: 'https://displaycellpros.com/api/auth/callback'
    },
    headers: {
      'Content-Type': 'application/json'
    },
    steps: [
      { step: 1, title: 'Redirect to Auth0', from: 'User Browser', to: 'Auth0 Authorization Server', detail: 'App redirects user to /authorize with client_id, scope, redirect_uri, and state.' },
      { step: 2, title: 'User Authenticates', from: 'User', to: 'Auth0 Universal Login', detail: 'User enters credentials, social login, or Enterprise SSO.' },
      { step: 3, title: 'Return Authorization Code', from: 'Auth0', to: 'Backend Callback URL', detail: 'Auth0 redirects browser back to redirect_uri with temporary authorization code.' },
      { step: 4, title: 'Code for Token Exchange', from: 'Backend Server', to: 'Auth0 /oauth/token', detail: 'Server sends code + client_secret via secure backchannel to receive Access Token, ID Token & Refresh Token.' }
    ],
    documentationUrls: [
      { title: 'Authorization Code Flow', url: 'https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow' },
      { title: 'Add Login with Auth Code', url: 'https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow/add-login-auth-code-flow' },
      { title: 'Call API with Auth Code', url: 'https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow/call-your-api-using-the-authorization-code-flow' }
    ],
    codeSnippets: {
      curl: `curl --request POST \\
  --url 'https://{yourDomain}/oauth/token' \\
  --header 'content-type: application/json' \\
  --data '{"grant_type":"authorization_code","client_id":"YOUR_CLIENT_ID","client_secret":"YOUR_CLIENT_SECRET","code":"AUTH_CODE","redirect_uri":"https://displaycellpros.com/api/auth/callback"}'`,
      typescript: `import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';

// app/auth/[auth0]/route.ts
export const GET = handleAuth({
  callback: handleCallback({
    redirectUri: 'https://displaycellpros.com/api/auth/callback'
  })
});`,
      fetch: `const response = await fetch('https://{yourDomain}/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'authorization_code',
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    code: authorizationCode,
    redirect_uri: 'https://displaycellpros.com/api/auth/callback'
  })
});
const { access_token, id_token, refresh_token } = await response.json();`,
      python: `import httpx

async with httpx.AsyncClient() as client:
    response = await client.post(
        "https://{yourDomain}/oauth/token",
        json={
            "grant_type": "authorization_code",
            "client_id": "YOUR_CLIENT_ID",
            "client_secret": "YOUR_CLIENT_SECRET",
            "code": auth_code,
            "redirect_uri": "https://displaycellpros.com/api/auth/callback"
        }
    )
    tokens = response.json()`
    }
  },
  {
    id: 'pkce',
    name: 'Auth Code with PKCE',
    badge: 'SPAs & Mobile Apps',
    category: 'Standard Web & Mobile',
    rfcOrStandard: 'RFC 7636 (Proof Key for Code Exchange)',
    description: 'Cryptographically protects public clients (Single-Page Apps and Native Mobile apps) that cannot safely hold a Client Secret against authorization code interception attacks.',
    bestFor: 'React/Vue/Angular SPAs, iOS/Android Swift & Kotlin apps, React Native, and Flutter.',
    securityRating: 'Recommended',
    grantTypeOrResponseType: 'code_challenge_method=S256 / code_verifier exchange',
    authMethod: 'Client ID (Public)',
    endpoints: {
      authorize: 'https://{yourDomain}/authorize',
      token: 'https://{yourDomain}/oauth/token'
    },
    samplePayload: {
      grant_type: 'authorization_code',
      client_id: 'dcp_spa_client_pkce_02',
      code_verifier: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk',
      code: 'SplxlOBeZQQYbYS6WxSbIA',
      redirect_uri: 'https://displaycellpros.com/callback'
    },
    headers: {
      'Content-Type': 'application/json'
    },
    steps: [
      { step: 1, title: 'Generate PKCE Pair', from: 'Client SPA / Mobile', to: 'Local Memory', detail: 'Client generates high-entropy code_verifier and calculates SHA-256 code_challenge.' },
      { step: 2, title: 'Authorize with Challenge', from: 'Client App', to: 'Auth0 /authorize', detail: 'Sends code_challenge & code_challenge_method=S256 with standard OAuth parameters.' },
      { step: 3, title: 'Auth0 Issues Code', from: 'Auth0', to: 'Client Callback', detail: 'Auth0 stores code_challenge and returns temporary authorization code.' },
      { step: 4, title: 'Verify & Exchange', from: 'Client App', to: 'Auth0 /oauth/token', detail: 'Client sends code + plain code_verifier. Auth0 hashes verifier and confirms it matches original challenge before returning JWT tokens.' }
    ],
    documentationUrls: [
      { title: 'Authorization Code Flow with PKCE', url: 'https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-pkce' },
      { title: 'Add Login Using PKCE', url: 'https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-pkce/add-login-using-the-authorization-code-flow-with-pkce' }
    ],
    codeSnippets: {
      curl: `curl --request POST \\
  --url 'https://{yourDomain}/oauth/token' \\
  --header 'content-type: application/json' \\
  --data '{"grant_type":"authorization_code","client_id":"YOUR_SPA_CLIENT_ID","code_verifier":"CODE_VERIFIER_STRING","code":"AUTH_CODE","redirect_uri":"https://displaycellpros.com/callback"}'`,
      typescript: `import { createAuth0Client } from '@auth0/auth0-spa-js';

const auth0 = await createAuth0Client({
  domain: '{yourDomain}',
  clientId: 'YOUR_SPA_CLIENT_ID',
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: 'https://api.displaycellpros.com'
  },
  useRefreshTokens: true,
  cacheLocation: 'localstorage'
});`,
      fetch: `// Code exchange using code_verifier
const res = await fetch('https://{yourDomain}/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'authorization_code',
    client_id: 'YOUR_SPA_CLIENT_ID',
    code_verifier: window.sessionStorage.getItem('pkce_verifier'),
    code: authCode,
    redirect_uri: window.location.origin
  })
});
const tokens = await res.json();`,
      python: `import httpx

# Public native client token exchange with PKCE
async with httpx.AsyncClient() as client:
    res = await client.post(
        "https://{yourDomain}/oauth/token",
        json={
            "grant_type": "authorization_code",
            "client_id": "YOUR_NATIVE_CLIENT_ID",
            "code_verifier": code_verifier_str,
            "code": auth_code,
            "redirect_uri": "com.displaycellpros.app://callback"
        }
    )
    tokens = res.json()`
    }
  },
  {
    id: 'client_credentials',
    name: 'Client Credentials Flow (M2M)',
    badge: 'Machine-to-Machine',
    category: 'Machine & IoT',
    rfcOrStandard: 'OAuth 2.0 RFC 6749 §4.4',
    description: 'Used for machine-to-machine (M2M) applications like daemons, scheduled cron jobs, background worker services, or backend APIs communicating with other APIs without user interaction.',
    bestFor: 'Backend services, microservices, cloud functions, CLI administrative tools, and automated testing suites.',
    securityRating: 'Recommended',
    grantTypeOrResponseType: 'grant_type=client_credentials',
    authMethod: 'Client ID & Client Secret',
    endpoints: {
      token: 'https://{yourDomain}/oauth/token'
    },
    samplePayload: {
      grant_type: 'client_credentials',
      client_id: 'm2m_dcp_inventory_sync_service',
      client_secret: 'sec_prod_994827163018274615293048',
      audience: 'https://api.displaycellpros.com'
    },
    headers: {
      'Content-Type': 'application/json'
    },
    steps: [
      { step: 1, title: 'M2M Token Request', from: 'Daemon / Microservice', to: 'Auth0 /oauth/token', detail: 'Service sends POST request with client_id, client_secret, and target API audience.' },
      { step: 2, title: 'Client Grant Validation', from: 'Auth0 Engine', to: 'Client Grant Policy', detail: 'Auth0 verifies client credentials and scopes permitted on the API client grant.' },
      { step: 3, title: 'Access Token Issued', from: 'Auth0', to: 'Microservice', detail: 'Auth0 returns a signed RS256 JWT Access Token valid for authorized backend API calls.' }
    ],
    documentationUrls: [
      { title: 'Client Credentials Flow', url: 'https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow' },
      { title: 'Call API Using Client Credentials', url: 'https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow/call-your-api-using-the-client-credentials-flow' }
    ],
    codeSnippets: {
      curl: `curl --request POST \\
  --url 'https://{yourDomain}/oauth/token' \\
  --header 'content-type: application/json' \\
  --data '{"client_id":"M2M_CLIENT_ID","client_secret":"M2M_CLIENT_SECRET","audience":"https://api.displaycellpros.com","grant_type":"client_credentials"}'`,
      typescript: `import { ManagementClient } from 'auth0';

const management = new ManagementClient({
  domain: '{yourDomain}',
  clientId: process.env.AUTH0_M2M_CLIENT_ID!,
  clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET!,
  audience: 'https://{yourDomain}/api/v2/'
});`,
      fetch: `const response = await fetch('https://{yourDomain}/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'client_credentials',
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    audience: 'https://api.displaycellpros.com'
  })
});
const { access_token, expires_in, token_type } = await response.json();`,
      python: `import httpx

async def get_m2m_token():
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://{yourDomain}/oauth/token",
            json={
                "grant_type": "client_credentials",
                "client_id": "YOUR_M2M_CLIENT_ID",
                "client_secret": "YOUR_M2M_CLIENT_SECRET",
                "audience": "https://api.displaycellpros.com"
            }
        )
        return res.json()["access_token"]`
    }
  },
  {
    id: 'device_auth',
    name: 'Device Authorization Flow',
    badge: 'Smart TVs & IoT',
    category: 'Machine & IoT',
    rfcOrStandard: 'OAuth 2.0 RFC 8628',
    description: 'Enables internet-connected, input-constrained devices (smart TVs, gaming consoles, IoT devices, terminal CLI tools) to instruct the user to complete login on a second device like a smartphone.',
    bestFor: 'Apple TV, Android TV, Roku, Smart Appliances, Command-line CLIs with no local browser.',
    securityRating: 'Recommended',
    grantTypeOrResponseType: 'grant_type=urn:ietf:params:oauth:grant-type:device_code',
    authMethod: 'Client ID (Public)',
    endpoints: {
      deviceCode: 'https://{yourDomain}/oauth/device/code',
      token: 'https://{yourDomain}/oauth/token'
    },
    samplePayload: {
      client_id: 'dcp_smart_workbench_display',
      scope: 'openid profile read:repairs manage:stations',
      audience: 'https://api.displaycellpros.com'
    },
    headers: {
      'Content-Type': 'application/json'
    },
    steps: [
      { step: 1, title: 'Request Device Code', from: 'Smart TV / IoT Device', to: 'Auth0 /oauth/device/code', detail: 'Device requests a device_code, user_code, and verification_uri.' },
      { step: 2, title: 'Display QR & Code to User', from: 'Device Screen', to: 'End User', detail: 'Device displays: "Go to displaycellpros.com/activate and enter code: WDTC-KRLP" (or scans QR code).' },
      { step: 3, title: 'User Authorizes on Mobile', from: 'User Smartphone', to: 'Auth0 Universal Login', detail: 'User logs in on their phone and confirms access for the device.' },
      { step: 4, title: 'Device Polls Token', from: 'IoT Device', to: 'Auth0 /oauth/token', detail: 'Device repeatedly polls /oauth/token until user completes authorization, then receives Access & Refresh tokens.' }
    ],
    documentationUrls: [
      { title: 'Device Authorization Flow', url: 'https://auth0.com/docs/get-started/authentication-and-authorization-flow/device-authorization-flow' },
      { title: 'Call API with Device Flow', url: 'https://auth0.com/docs/get-started/authentication-and-authorization-flow/device-authorization-flow/call-your-api-using-the-device-authorization-flow' }
    ],
    codeSnippets: {
      curl: `curl --request POST \\
  --url 'https://{yourDomain}/oauth/device/code' \\
  --header 'content-type: application/json' \\
  --data '{"client_id":"YOUR_DEVICE_CLIENT_ID","scope":"openid profile email","audience":"https://api.displaycellpros.com"}'`,
      typescript: `// Step 1: Initiate device code request
const initRes = await fetch('https://{yourDomain}/oauth/device/code', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    client_id: 'YOUR_DEVICE_CLIENT_ID',
    scope: 'openid profile read:repairs',
    audience: 'https://api.displaycellpros.com'
  })
});
const { device_code, user_code, verification_uri_complete, interval } = await initRes.json();
console.log('User visits:', verification_uri_complete);`,
      fetch: `// Step 2: Poll token endpoint until authenticated
async function pollForDeviceToken(device_code, interval = 5) {
  while (true) {
    const res = await fetch('https://{yourDomain}/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        device_code,
        client_id: 'YOUR_DEVICE_CLIENT_ID'
      })
    });
    const data = await res.json();
    if (data.access_token) return data;
    if (data.error === 'authorization_pending') {
      await new Promise(r => setTimeout(r, interval * 1000));
    } else {
      throw new Error(data.error_description || data.error);
    }
  }
}`,
      python: `import httpx, asyncio

async def run_device_flow():
    async with httpx.AsyncClient() as client:
        # Step 1: Request Code
        res = await client.post(
            "https://{yourDomain}/oauth/device/code",
            json={"client_id": "DEVICE_CLIENT_ID", "scope": "openid profile"}
        )
        data = res.json()
        print(f"Authorize at: {data['verification_uri_complete']}")
        
        # Step 2: Poll for completion
        while True:
            t_res = await client.post(
                "https://{yourDomain}/oauth/token",
                json={
                    "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
                    "device_code": data["device_code"],
                    "client_id": "DEVICE_CLIENT_ID"
                }
            )
            token_data = t_res.json()
            if "access_token" in token_data:
                return token_data
            await asyncio.sleep(data.get("interval", 5))`
    }
  },
  {
    id: 'passwordless',
    name: 'Passwordless (OTP & Magic Link)',
    badge: 'Frictionless Auth',
    category: 'Standard Web & Mobile',
    rfcOrStandard: 'Auth0 Passwordless Specification',
    description: 'Enables passwordless authentication via one-time SMS verification codes, email magic links, or email one-time passwords (OTP), eliminating password reuse risks.',
    bestFor: 'Customer portals, rapid technician intake, public consumer onboarding, and frictionless mobile verify.',
    securityRating: 'Recommended',
    grantTypeOrResponseType: 'grant_type=http://auth0.com/oauth/grant-type/passwordless/otp',
    authMethod: 'Client ID (Public) or Client Secret',
    endpoints: {
      start: 'https://{yourDomain}/passwordless/start',
      verify: 'https://{yourDomain}/oauth/token'
    },
    samplePayload: {
      grant_type: 'http://auth0.com/oauth/grant-type/passwordless/otp',
      client_id: 'dcp_customer_intake_app',
      username: '+15095550199',
      otp: '849201',
      realm: 'sms',
      scope: 'openid profile email'
    },
    headers: {
      'Content-Type': 'application/json'
    },
    steps: [
      { step: 1, title: 'Initiate OTP / Magic Link', from: 'Client App', to: 'Auth0 /passwordless/start', detail: 'Sends user phone or email with connection type (sms or email).' },
      { step: 2, title: 'Auth0 Dispatches OTP', from: 'Auth0 (Twilio / SendGrid)', to: 'User Device', detail: 'User receives 6-digit verification code or instant magic link.' },
      { step: 3, title: 'Submit OTP for Tokens', from: 'Client App', to: 'Auth0 /oauth/token', detail: 'Submits OTP with grant_type=passwordless/otp to receive ID & Access tokens.' }
    ],
    documentationUrls: [
      { title: 'Passwordless Overview', url: 'https://auth0.com/docs/authenticate/passwordless' },
      { title: 'Passwordless with Auth API', url: 'https://auth0.com/docs/authenticate/passwordless/implement-login/embedded-login/native' }
    ],
    codeSnippets: {
      curl: `curl --request POST \\
  --url 'https://{yourDomain}/passwordless/start' \\
  --header 'content-type: application/json' \\
  --data '{"client_id":"YOUR_CLIENT_ID","connection":"sms","phone_number":"+15095550199","send":"code"}'`,
      typescript: `// Step 1: Request SMS/Email Code
await fetch('https://{yourDomain}/passwordless/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
    connection: 'email',
    email: 'technician@displaycellpros.com',
    send: 'code'
  })
});`,
      fetch: `// Step 2: Verify Code
const res = await fetch('https://{yourDomain}/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'http://auth0.com/oauth/grant-type/passwordless/otp',
    client_id: 'YOUR_CLIENT_ID',
    username: 'technician@displaycellpros.com',
    otp: '123456',
    realm: 'email',
    scope: 'openid profile email'
  })
});
const tokens = await res.json();`,
      python: `import httpx

async def verify_otp(email: str, otp_code: str):
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://{yourDomain}/oauth/token",
            json={
                "grant_type": "http://auth0.com/oauth/grant-type/passwordless/otp",
                "client_id": "YOUR_CLIENT_ID",
                "username": email,
                "otp": otp_code,
                "realm": "email",
                "scope": "openid profile"
            }
        )
        return res.json()`
    }
  },
  {
    id: 'private_key_jwt',
    name: 'Private Key JWT (Client Assertion)',
    badge: 'Zero-Secret High Security',
    category: 'Privacy & Enterprise',
    rfcOrStandard: 'RFC 7521 & RFC 7523',
    description: 'Replaces static client secrets with asymmetric cryptographic signatures (RSA/ECDSA). The client signs a JWT assertion using its private key, which Auth0 validates against the registered public certificate.',
    bestFor: 'Confidential backend microservices, regulated enterprise connections, and organizations banning static shared secrets.',
    securityRating: 'High Security',
    grantTypeOrResponseType: 'client_assertion_type=jwt-bearer & client_assertion',
    authMethod: 'Client ID & Client Assertion',
    endpoints: {
      token: 'https://{yourDomain}/oauth/token'
    },
    samplePayload: {
      grant_type: 'client_credentials',
      client_id: 'dcp_enterprise_core_backend',
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      client_assertion: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjcC0yMDI2LWtleSJ9.eyJpc3MiOiJkY3BfZW50ZXJwcmlzZV9jb3JlX2JhY2tlbmQiLCJzdWIiOiJkY3BfZW50ZXJwcmlzZV9jb3JlX2JhY2tlbmQiLCJhdWQiOiJodHRwczovL3t5b3VyRG9tYWlufS9vYXV0aC90b2tlbiIsImp0aSI6ImIzOWM0ZDk5LTc0YmUtNGY0YS05MmUzLTA1ZDdiOGY5OTkyMSIsImV4cCI6MTc4Njk0MjgwMCwiaWF0IjoxNzg2OTM5MjAwfQ.Signature...',
      audience: 'https://api.displaycellpros.com'
    },
    headers: {
      'Content-Type': 'application/json'
    },
    steps: [
      { step: 1, title: 'Sign Client Assertion JWT', from: 'Backend Server', to: 'Local Key Vault', detail: 'Signs a JWT assertion (iss, sub, aud, jti, exp) using private RSA/ECDSA key.' },
      { step: 2, title: 'POST Assertion to Auth0', from: 'Backend Server', to: 'Auth0 /oauth/token', detail: 'Sends client_assertion with urn:ietf:params:oauth:client-assertion-type:jwt-bearer.' },
      { step: 3, title: 'Validate Public Certificate', from: 'Auth0 Engine', to: 'Registered Public Key', detail: 'Auth0 verifies assertion signature and issues Access Token without any static secret transmission.' }
    ],
    documentationUrls: [
      { title: 'Authenticate with Private Key JWT', url: 'https://auth0.com/docs/get-started/authentication-and-authorization-flow/authenticate-with-private-key-jwt' }
    ],
    codeSnippets: {
      curl: `curl --request POST \\
  --url 'https://{yourDomain}/oauth/token' \\
  --header 'content-type: application/json' \\
  --data '{"client_id":"YOUR_CLIENT_ID","client_assertion_type":"urn:ietf:params:oauth:client-assertion-type:jwt-bearer","client_assertion":"SIGNED_JWT_ASSERTION","grant_type":"client_credentials","audience":"https://api.displaycellpros.com"}'`,
      typescript: `import { SignJWT, importPKCS8 } from 'jose';

// Generate Private Key JWT Assertion
const privateKey = await importPKCS8(process.env.AUTH0_PRIVATE_KEY!, 'RS256');
const assertion = await new SignJWT({
  iss: process.env.AUTH0_CLIENT_ID,
  sub: process.env.AUTH0_CLIENT_ID,
  aud: 'https://{yourDomain}/oauth/token',
  jti: crypto.randomUUID()
})
  .setProtectedHeader({ alg: 'RS256', kid: 'dcp-key-01' })
  .setIssuedAt()
  .setExpirationTime('5m')
  .sign(privateKey);`,
      fetch: `const res = await fetch('https://{yourDomain}/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'client_credentials',
    client_id: process.env.AUTH0_CLIENT_ID,
    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    client_assertion: assertion,
    audience: 'https://api.displaycellpros.com'
  })
});
const { access_token } = await res.json();`,
      python: `import jwt, time, uuid, httpx

# Generate Signed JWT Assertion
payload = {
    "iss": "YOUR_CLIENT_ID",
    "sub": "YOUR_CLIENT_ID",
    "aud": "https://{yourDomain}/oauth/token",
    "jti": str(uuid.uuid4()),
    "iat": int(time.time()),
    "exp": int(time.time()) + 300
}
assertion = jwt.encode(payload, private_key_pem, algorithm="RS256")

# Exchange for Access Token
async with httpx.AsyncClient() as client:
    res = await client.post(
        "https://{yourDomain}/oauth/token",
        json={
            "grant_type": "client_credentials",
            "client_id": "YOUR_CLIENT_ID",
            "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
            "client_assertion": assertion,
            "audience": "https://api.displaycellpros.com"
        }
    )`
    }
  },
  {
    id: 'mtls_auth',
    name: 'mTLS Authentication (Mutual TLS)',
    badge: 'X.509 Certificate Binding',
    category: 'Privacy & Enterprise',
    rfcOrStandard: 'RFC 8705 (OAuth 2.0 Mutual-TLS)',
    description: 'Enables mutual TLS certificate validation at the customer edge network and forwards cryptographically bound client certificate headers to the Auth0 authentication plane.',
    bestFor: 'Zero-trust networks, defense/banking integrations, hardware security modules (HSM), and certificate-pinned endpoints.',
    securityRating: 'High Security',
    grantTypeOrResponseType: 'mTLS Handshake + Custom Edge Forwarding',
    authMethod: 'mTLS Authentication',
    endpoints: {
      token: 'https://auth.displaycellpros.com/oauth/token'
    },
    samplePayload: {
      grant_type: 'client_credentials',
      client_id: 'dcp_mtls_edge_node',
      audience: 'https://api.displaycellpros.com'
    },
    headers: {
      'cname-api-key': 'dcp_custom_domain_api_key_8842',
      'client-certificate': '-----BEGIN CERTIFICATE-----\\nMIIBkDC...\\n-----END CERTIFICATE-----',
      'client-certificate-ca-verified': 'SUCCESS',
      'Content-Type': 'application/json'
    },
    steps: [
      { step: 1, title: 'mTLS Handshake at Edge', from: 'Client Microservice', to: 'Customer Edge Proxy', detail: 'Client completes mutual TLS handshake presenting X.509 client certificate.' },
      { step: 2, title: 'Forward Verified Cert Headers', from: 'Customer Edge Proxy', to: 'Auth0 Custom Domain', detail: 'Edge proxy forwards request with cname-api-key, client-certificate, and client-certificate-ca-verified.' },
      { step: 3, title: 'Validate & Issue Bound Tokens', from: 'Auth0 Engine', to: 'Client Microservice', detail: 'Auth0 validates certificate fingerprints and issues sender-constrained tokens (RFC 8705).' }
    ],
    documentationUrls: [
      { title: 'Authenticate with mTLS', url: 'https://auth0.com/docs/get-started/authentication-and-authorization-flow/authenticate-with-mtls' },
      { title: 'Configure mTLS for a Client', url: 'https://auth0.com/docs/get-started/applications/configure-mtls/configure-mtls-for-a-client' }
    ],
    codeSnippets: {
      curl: `curl --request POST \\
  --url 'https://auth.displaycellpros.com/oauth/token' \\
  --header 'content-type: application/json' \\
  --header 'cname-api-key: YOUR_CNAME_API_KEY' \\
  --header 'client-certificate: CERT_DATA_URL_ENCODED' \\
  --header 'client-certificate-ca-verified: SUCCESS' \\
  --data '{"client_id":"YOUR_CLIENT_ID","grant_type":"client_credentials","audience":"https://api.displaycellpros.com"}'`,
      typescript: `// Reverse Proxy / Edge Worker (Cloudflare Workers / AWS CloudFront)
export async function handleMtlsProxy(request: Request) {
  const clientCert = request.headers.get('cf-tls-client-cert');
  const certVerified = request.headers.get('cf-tls-client-cert-verified');

  return fetch('https://auth.displaycellpros.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'cname-api-key': process.env.AUTH0_CNAME_API_KEY!,
      'client-certificate': encodeURIComponent(clientCert || ''),
      'client-certificate-ca-verified': certVerified === 'SUCCESS' ? 'SUCCESS' : 'FAILED'
    },
    body: request.body
  });
}`,
      fetch: `// Direct call via HTTPS with mutual TLS client cert
const res = await fetch('https://auth.displaycellpros.com/oauth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'cname-api-key': 'YOUR_CNAME_KEY',
    'client-certificate-ca-verified': 'SUCCESS'
  },
  body: JSON.stringify({
    grant_type: 'client_credentials',
    client_id: 'YOUR_MTLS_CLIENT_ID',
    audience: 'https://api.displaycellpros.com'
  })
});`,
      python: `import httpx

# Mutual TLS client certificate request
async with httpx.AsyncClient(
    cert=("client-cert.pem", "client-key.pem"),
    verify="ca-bundle.pem"
) as client:
    res = await client.post(
        "https://auth.displaycellpros.com/oauth/token",
        headers={"cname-api-key": "YOUR_CNAME_KEY"},
        json={
            "grant_type": "client_credentials",
            "client_id": "YOUR_CLIENT_ID",
            "audience": "https://api.displaycellpros.com"
        }
    )`
    }
  },
  {
    id: 'refresh_token_rotation',
    name: 'Refresh Token Rotation & Revocation',
    badge: 'Token Lifecycle',
    category: 'Standard Web & Mobile',
    rfcOrStandard: 'OAuth 2.0 RFC 6749 §6 & RFC 7009',
    description: 'Issues a new refresh token every time the previous one is exchanged (rotation) and automatically revokes all compromised token families upon reuse detection.',
    bestFor: 'SPAs, mobile apps, long-lived technician sessions, and secure session revocation upon logout or device wipe.',
    securityRating: 'Recommended',
    grantTypeOrResponseType: 'grant_type=refresh_token / /oauth/revoke',
    authMethod: 'Client ID & Client Secret or Client ID (Public)',
    endpoints: {
      token: 'https://{yourDomain}/oauth/token',
      revoke: 'https://{yourDomain}/oauth/revoke'
    },
    samplePayload: {
      grant_type: 'refresh_token',
      client_id: 'dcp_spokane_workbench_client',
      refresh_token: 'r_token_9843bda771e892cfa'
    },
    headers: {
      'Content-Type': 'application/json'
    },
    steps: [
      { step: 1, title: 'Present Refresh Token', from: 'Client App', to: 'Auth0 /oauth/token', detail: 'Sends grant_type=refresh_token with existing refresh token.' },
      { step: 2, title: 'Rotate Token Pair', from: 'Auth0 Engine', to: 'Token Store', detail: 'Auth0 invalidates used refresh token and issues a brand-new Refresh Token + Access Token.' },
      { step: 3, title: 'Revoke on Signout', from: 'Client App', to: 'Auth0 /oauth/revoke', detail: 'Sends refresh_token to /oauth/revoke endpoint to immediately kill session.' }
    ],
    documentationUrls: [
      { title: 'Refresh Token Rotation', url: 'https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation' },
      { title: 'Revoke Refresh Tokens', url: 'https://auth0.com/docs/secure/tokens/refresh-tokens/revoke-refresh-tokens' }
    ],
    codeSnippets: {
      curl: `curl --request POST \\
  --url 'https://{yourDomain}/oauth/token' \\
  --header 'content-type: application/json' \\
  --data '{"grant_type":"refresh_token","client_id":"YOUR_CLIENT_ID","refresh_token":"CURRENT_REFRESH_TOKEN"}'`,
      typescript: `import { auth0 } from '@/lib/auth0';

// Next.js App Router API Handler for Token Refresh
export async function POST(req: Request) {
  const session = await auth0.getSession();
  if (!session?.refreshToken) {
    return Response.json({ error: 'No refresh token' }, { status: 401 });
  }
  // The SDK automatically rotates refresh tokens when obtaining new access tokens
  const token = await auth0.getAccessToken();
  return Response.json({ accessToken: token });
}`,
      fetch: `// Revoke Refresh Token
await fetch('https://{yourDomain}/oauth/revoke', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
    token: storedRefreshToken
  })
});`,
      python: `import httpx

async def rotate_tokens(refresh_token: str):
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://{yourDomain}/oauth/token",
            json={
                "grant_type": "refresh_token",
                "client_id": "YOUR_CLIENT_ID",
                "refresh_token": refresh_token
            }
        )
        return res.json()`
    }
  },
  {
    id: 'rar_par_jar',
    name: 'Enhanced Privacy (RAR / PAR / JAR)',
    badge: 'High Security & FAPI',
    category: 'Privacy & Enterprise',
    rfcOrStandard: 'RFC 9396 (RAR), RFC 9126 (PAR), RFC 9101 (JAR)',
    description: 'Advanced protocols for regulated sectors (FinTech, Open Banking, Healthcare, Highly-Regulated Identity). Pushes parameters securely (PAR), signs request objects (JAR), and details fine-grained transactional authorization (RAR).',
    bestFor: 'Banking APIs, Payment Initiation, Healthcare HIPAA scopes, and OpenID Financial-Grade API (FAPI) compliance.',
    securityRating: 'High Security',
    grantTypeOrResponseType: 'authorization_details / request_uri / signed JWT',
    authMethod: 'Client ID & Client Secret',
    endpoints: {
      par: 'https://{yourDomain}/oauth/par',
      authorize: 'https://{yourDomain}/authorize?client_id=...&request_uri=urn:ietf:params:oauth:request_uri:...',
      token: 'https://{yourDomain}/oauth/token'
    },
    samplePayload: {
      client_id: 'dcp_fapi_bank_client',
      authorization_details: [
        {
          type: 'repair_invoice_payment',
          repair_id: 'DCP-REP-2026-8842',
          actions: ['authorize_charge', 'release_hardware'],
          locations: ['https://api.displaycellpros.com/payments'],
          instructedAmount: { currency: 'USD', amount: '249.00' }
        }
      ],
      pushed_authorization_request: true,
      request_uri: 'urn:ietf:params:oauth:request_uri:9f8e7d6c5b4a3'
    },
    headers: {
      'Content-Type': 'application/json'
    },
    steps: [
      { step: 1, title: 'Push Parameters (PAR)', from: 'Client Backend', to: 'Auth0 /oauth/par', detail: 'Client POSTs fine-grained authorization_details (RAR) and sensitive data directly to PAR endpoint.' },
      { step: 2, title: 'Obtain request_uri', from: 'Auth0', to: 'Client Backend', detail: 'Auth0 securely stores parameters and returns an opaque, single-use request_uri with short TTL.' },
      { step: 3, title: 'Clean Browser Redirect', from: 'User Browser', to: 'Auth0 /authorize', detail: 'Redirects with only client_id and request_uri—no sensitive query parameters are exposed in URL history or access logs.' },
      { step: 4, title: 'Encrypted Token Issue (JWE)', from: 'Auth0', to: 'Client Backend', detail: 'Auth0 verifies signature and returns JSON Web Encrypted (JWE) tokens.' }
    ],
    documentationUrls: [
      { title: 'Rich Authorization Requests (RAR)', url: 'https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow/authorization-code-flow-with-rar' },
      { title: 'Pushed Authorization Requests (PAR)', url: 'https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow/authorization-code-flow-with-par' },
      { title: 'JWT-Secured Authorization Requests (JAR)', url: 'https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow/authorization-code-flow-with-jar' }
    ],
    codeSnippets: {
      curl: `curl --request POST \\
  --url 'https://{yourDomain}/oauth/par' \\
  --header 'content-type: application/json' \\
  --data '{"client_id":"YOUR_CLIENT_ID","client_secret":"YOUR_CLIENT_SECRET","response_type":"code","redirect_uri":"https://displaycellpros.com/callback","scope":"openid","authorization_details":[{"type":"account_access","actions":["read","write"]}]}'`,
      typescript: `// Push Authorization Request (PAR) to Auth0
const parResponse = await fetch('https://{yourDomain}/oauth/par', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    response_type: 'code',
    redirect_uri: 'https://displaycellpros.com/callback',
    scope: 'openid profile email',
    authorization_details: [{
      type: 'repair_payment',
      amount: '249.00',
      currency: 'USD'
    }]
  })
});
const { request_uri, expires_in } = await parResponse.json();
// Redirect user to: https://{yourDomain}/authorize?client_id=...&request_uri=\${request_uri}`,
      fetch: `// PAR initiation fetch
const par = await fetch('https://{yourDomain}/oauth/par', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
    response_type: 'code',
    redirect_uri: 'https://displaycellpros.com/callback',
    scope: 'openid'
  })
});
const { request_uri } = await par.json();`,
      python: `import httpx

async def push_authorization_request():
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://{yourDomain}/oauth/par",
            json={
                "client_id": "YOUR_CLIENT_ID",
                "client_secret": "YOUR_CLIENT_SECRET",
                "response_type": "code",
                "redirect_uri": "https://displaycellpros.com/callback",
                "scope": "openid profile"
            }
        )
        return res.json()["request_uri"]`
    }
  },
  {
    id: 'ciba',
    name: 'Client-Initiated Backchannel (CIBA)',
    badge: 'Decoupled Authentication',
    category: 'Privacy & Enterprise',
    rfcOrStandard: 'OpenID Foundation CIBA Core 1.0',
    description: 'Decoupled authentication flow where the client app backend initiates authentication on behalf of a user who confirms the request on a separate consumption device (such as an authenticator push notification on their phone).',
    bestFor: 'Point of sale (POS) terminals, call center agents verifying phone callers, smart speakers, kiosk check-in stations.',
    securityRating: 'High Security',
    grantTypeOrResponseType: 'grant_type=urn:openid:params:grant-type:ciba',
    authMethod: 'Client ID & Client Secret',
    endpoints: {
      bcAuthorize: 'https://{yourDomain}/bc-authorize',
      token: 'https://{yourDomain}/oauth/token'
    },
    samplePayload: {
      client_id: 'dcp_pos_register_spokane',
      login_hint: 'user@displaycellpros.com',
      binding_message: 'Authorize repair bench payment #8842',
      scope: 'openid profile offline_access payments:charge'
    },
    headers: {
      'Content-Type': 'application/json'
    },
    steps: [
      { step: 1, title: 'Backend Initiates Challenge', from: 'POS Register / Agent Console', to: 'Auth0 /bc-authorize', detail: 'Sends user identifier (login_hint or user_id) and binding message to Auth0.' },
      { step: 2, title: 'Push Notification to User', from: 'Auth0 Guardian', to: 'User Smartphone App', detail: 'Auth0 sends push notification with binding message to user registered mobile device.' },
      { step: 3, title: 'Biometric Approval', from: 'User', to: 'Mobile Authenticator', detail: 'User approves login with FaceID/fingerprint on their personal smartphone.' },
      { step: 4, title: 'Backchannel Token Issue', from: 'Auth0', to: 'POS Backend', detail: 'Auth0 delivers tokens to the POS backend via Poll mode, Ping mode, or Push webhook.' }
    ],
    documentationUrls: [
      { title: 'CIBA Overview', url: 'https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-initiated-backchannel-authentication-flow' },
      { title: 'User Authentication with CIBA', url: 'https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-initiated-backchannel-authentication-flow/user-authentication-with-ciba' }
    ],
    codeSnippets: {
      curl: `curl --request POST \\
  --url 'https://{yourDomain}/bc-authorize' \\
  --header 'content-type: application/json' \\
  --data '{"client_id":"YOUR_CLIENT_ID","client_secret":"YOUR_CLIENT_SECRET","login_hint":"user@displaycellpros.com","binding_message":"Authorize POS Login #8842","scope":"openid profile"}'`,
      typescript: `// CIBA Backchannel Trigger
const cibaRes = await fetch('https://{yourDomain}/bc-authorize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    login_hint: 'ryan@displaycellpros.com',
    binding_message: 'Spokane Bench Verification #8842',
    scope: 'openid profile'
  })
});
const { auth_req_id, expires_in, interval } = await cibaRes.json();`,
      fetch: `// Poll CIBA token
async function pollCibaToken(auth_req_id, interval = 5) {
  while (true) {
    const res = await fetch('https://{yourDomain}/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'urn:openid:params:grant-type:ciba',
        client_id: 'YOUR_CLIENT_ID',
        client_secret: 'YOUR_CLIENT_SECRET',
        auth_req_id
      })
    });
    const data = await res.json();
    if (data.access_token) return data;
    if (data.error === 'authorization_pending') {
      await new Promise(r => setTimeout(r, interval * 1000));
    } else {
      throw new Error(data.error);
    }
  }
}`,
      python: `import httpx, asyncio

async def initiate_ciba_flow(email: str, binding_msg: str):
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://{yourDomain}/bc-authorize",
            json={
                "client_id": "YOUR_CLIENT_ID",
                "client_secret": "YOUR_CLIENT_SECRET",
                "login_hint": email,
                "binding_message": binding_msg,
                "scope": "openid profile"
            }
        )
        data = res.json()
        return data["auth_req_id"]`
    }
  },
  {
    id: 'custom_token_exchange',
    name: 'Custom Token Exchange (CTE)',
    badge: 'Token Transformation',
    category: 'Advanced & Legacy',
    rfcOrStandard: 'OAuth 2.0 RFC 8693',
    description: 'Enables applications to exchange pre-existing identity tokens (from legacy IDPs, third-party clouds, or partner security tokens) for Auth0 tokens by invoking /oauth/token associated with Auth0 Actions.',
    bestFor: 'Cross-audience delegation, microservice impersonation, legacy identity migration, and multi-cloud security token bridging.',
    securityRating: 'Specialized',
    grantTypeOrResponseType: 'grant_type=urn:ietf:params:oauth:grant-type:token-exchange',
    authMethod: 'Client ID & Client Secret',
    endpoints: {
      token: 'https://{yourDomain}/oauth/token'
    },
    samplePayload: {
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      client_id: 'dcp_cloud_bridge_client',
      client_secret: 'sec_bridge_9948201',
      subject_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImxlZ2FjeS0...',
      subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
      requested_token_type: 'urn:ietf:params:oauth:token-type:access_token',
      audience: 'https://api.displaycellpros.com'
    },
    headers: {
      'Content-Type': 'application/json'
    },
    steps: [
      { step: 1, title: 'Submit External Token', from: 'Calling App', to: 'Auth0 /oauth/token', detail: 'Passes external subject_token with subject_token_type to Auth0 token exchange endpoint.' },
      { step: 2, title: 'Execute Custom Action', from: 'Auth0 Engine', to: 'Custom Token Exchange Profile', detail: 'Auth0 validates external signature and runs custom Action code to map claims and permissions.' },
      { step: 3, title: 'Issue Auth0 Token', from: 'Auth0', to: 'Client App', detail: 'Issues native Auth0 JWT token configured for target audience.' }
    ],
    documentationUrls: [
      { title: 'Custom Token Exchange Overview', url: 'https://auth0.com/docs/authenticate/custom-token-exchange' },
      { title: 'Configure Custom Token Exchange', url: 'https://auth0.com/docs/authenticate/custom-token-exchange/configure-custom-token-exchange' }
    ],
    codeSnippets: {
      curl: `curl --request POST \\
  --url 'https://{yourDomain}/oauth/token' \\
  --header 'content-type: application/json' \\
  --data '{"grant_type":"urn:ietf:params:oauth:grant-type:token-exchange","client_id":"YOUR_CLIENT_ID","client_secret":"YOUR_CLIENT_SECRET","subject_token":"EXTERNAL_TOKEN","subject_token_type":"urn:ietf:params:oauth:token-type:jwt","audience":"https://api.displaycellpros.com"}'`,
      typescript: `const tokenExchangeRes = await fetch('https://{yourDomain}/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    subject_token: legacyToken,
    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    audience: 'https://api.displaycellpros.com'
  })
});
const { access_token } = await tokenExchangeRes.json();`,
      fetch: `const res = await fetch('https://{yourDomain}/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
    subject_token: partnerIdpToken,
    subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
    audience: 'https://api.displaycellpros.com'
  })
});`,
      python: `import httpx

async def exchange_partner_token(partner_jwt: str):
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://{yourDomain}/oauth/token",
            json={
                "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
                "client_id": "YOUR_CLIENT_ID",
                "client_secret": "YOUR_CLIENT_SECRET",
                "subject_token": partner_jwt,
                "subject_token_type": "urn:ietf:params:oauth:token-type:jwt",
                "audience": "https://api.displaycellpros.com"
            }
        )
        return res.json()`
    }
  },
  {
    id: 'saml_wsfed',
    name: 'SAML 2.0 & WS-Federation SSO',
    badge: 'Enterprise Identity',
    category: 'Privacy & Enterprise',
    rfcOrStandard: 'OASIS SAML 2.0 Web Browser SSO & WS-Fed 1.2',
    description: 'Enables enterprise Single Sign-On (SSO) with Okta, Microsoft Entra ID / Azure AD, PingIdentity, Active Directory ADFS, and Shibboleth using XML metadata assertions.',
    bestFor: 'Corporate enterprise clients, healthcare systems, university SSO, and legacy Windows AD domains.',
    securityRating: 'High Security',
    grantTypeOrResponseType: 'SAML Response POST / WS-Federation wresult',
    authMethod: 'Client ID & Client Secret',
    endpoints: {
      samlAuthorize: 'https://{yourDomain}/samlp/{client_id}',
      wsfedAuthorize: 'https://{yourDomain}/wsfed/{client_id}',
      metadata: 'https://{yourDomain}/samlp/metadata/{client_id}'
    },
    samplePayload: {
      connection: 'dcp-enterprise-entra-id',
      SAMLRequest: 'fZJfb4IwFMW/itN3KW0... (Base64 Deflated XML)',
      RelayState: 'https://displaycellpros.com/enterprise/dashboard'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    steps: [
      { step: 1, title: 'SP-Initiated SAML Redirect', from: 'Enterprise Portal', to: 'Auth0 SAML Endpoint', detail: 'Generates signed SAMLRequest AuthnRequest and redirects user.' },
      { step: 2, title: 'Authenticate at Enterprise IdP', from: 'User Browser', to: 'Okta / Microsoft Entra', detail: 'User logs into their corporate identity provider with domain credentials.' },
      { step: 3, title: 'Post Signed SAML Assertion', from: 'Enterprise IdP', to: 'Auth0 /login/callback', detail: 'IdP posts signed XML assertion with corporate groups, email, and employee ID.' },
      { step: 4, title: 'Map Claims & Issue JWT', from: 'Auth0 Enterprise Engine', to: 'DisplayCellPros Backend', detail: 'Auth0 transforms XML SAML attributes into standard OIDC JSON claims.' }
    ],
    documentationUrls: [
      { title: 'SAML Protocol in Auth0', url: 'https://auth0.com/docs/protocols/saml' },
      { title: 'Configure SAML Enterprise Connection', url: 'https://auth0.com/docs/authenticate/identity-providers/enterprise-identity-providers/saml' }
    ],
    codeSnippets: {
      curl: `curl --request GET \\
  --url 'https://{yourDomain}/authorize?response_type=code&client_id=YOUR_CLIENT_ID&connection=ENTRA_ID_CONNECTION&redirect_uri=https://displaycellpros.com/callback'`,
      typescript: `// Trigger SAML / Enterprise SSO Login in Next.js
export async function loginWithEnterprise(connectionName = 'dcp-enterprise-entra') {
  // Direct user straight to enterprise IdP bypassing Universal Login picker
  window.location.href = \`/api/auth/login?connection=\${connectionName}\`;
}`,
      fetch: `// Download SAML Metadata XML
const metadataRes = await fetch('https://{yourDomain}/samlp/metadata/YOUR_CLIENT_ID');
const xml = await metadataRes.text();`,
      python: `import httpx

# Fetch SAML SP Metadata
async with httpx.AsyncClient() as client:
    res = await client.get("https://{yourDomain}/samlp/metadata/YOUR_CLIENT_ID")
    saml_metadata_xml = res.text`
    }
  },
  {
    id: 'userinfo_profile',
    name: 'UserInfo & Claims Profile',
    badge: 'User Identity',
    category: 'Standard Web & Mobile',
    rfcOrStandard: 'OpenID Connect Core 1.0 §5.3',
    description: 'Retrieves claims about the authenticated end-user by sending the Access Token as a Bearer credential to /userinfo. Standard claims include sub, name, email, roles, and custom metadata.',
    bestFor: 'Displaying technician profile, verifying permissions, and syncing user details in frontend or backend services.',
    securityRating: 'Recommended',
    grantTypeOrResponseType: 'GET /userinfo with Bearer Access Token',
    authMethod: 'OAuth2 Access Token',
    endpoints: {
      userinfo: 'https://{yourDomain}/userinfo'
    },
    samplePayload: {
      sub: 'auth0|66b84019284fa98',
      name: 'Ryan Young',
      nickname: 'ryan',
      email: 'ryan@displaycellpros.com',
      email_verified: true,
      picture: 'https://displaycellpros.com/assets/ryan-avatar.png',
      'https://displaycellpros.com/roles': ['SuperAdmin', 'MasterTechnician'],
      'https://displaycellpros.com/station': 'Spokane_Bench_01'
    },
    headers: {
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
    },
    steps: [
      { step: 1, title: 'Pass Bearer Token', from: 'Client / Server', to: 'Auth0 /userinfo', detail: 'Sends HTTP GET request with Authorization: Bearer <access_token>.' },
      { step: 2, title: 'Verify Signature & Scope', from: 'Auth0 Identity Engine', to: 'JWT Validator', detail: 'Auth0 verifies token signature and ensures openid and profile/email scopes were granted.' },
      { step: 3, title: 'Return Standardized Claims', from: 'Auth0', to: 'Application', detail: 'Returns JSON payload containing standard OIDC and custom namespace claims.' }
    ],
    documentationUrls: [
      { title: 'Get User Info Endpoint', url: 'https://auth0.com/docs/api/authentication#get-user-info' },
      { title: 'User Profile Claims', url: 'https://auth0.com/docs/manage-users/user-accounts/user-profiles' }
    ],
    codeSnippets: {
      curl: `curl --request GET \\
  --url 'https://{yourDomain}/userinfo' \\
  --header 'authorization: Bearer YOUR_ACCESS_TOKEN'`,
      typescript: `import { auth0 } from '@/lib/auth0';

export async function GET(req: Request) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return Response.json({ user: session.user });
}`,
      fetch: `const res = await fetch('https://{yourDomain}/userinfo', {
  headers: {
    'Authorization': \`Bearer \${accessToken}\`
  }
});
const profile = await res.json();
console.log('Technician sub:', profile.sub, 'Email:', profile.email);`,
      python: `import httpx

async def get_user_profile(access_token: str):
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://{yourDomain}/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        return res.json()`
    }
  },
  {
    id: 'universal_logout',
    name: 'Universal & Federated Logout',
    badge: 'Session Termination',
    category: 'Standard Web & Mobile',
    rfcOrStandard: 'OpenID Connect RP-Initiated Logout 1.0',
    description: 'Terminates the user Auth0 SSO session cookie and optionally performs federated logout to sign the user out of the upstream social or enterprise Identity Provider (e.g. Google, Microsoft).',
    bestFor: 'Clean signout across shared laboratory technician benches, kiosk reset, and compliance requirements.',
    securityRating: 'Recommended',
    grantTypeOrResponseType: 'GET /v2/logout with returnTo & client_id',
    authMethod: 'Client ID (Public)',
    endpoints: {
      logout: 'https://{yourDomain}/v2/logout'
    },
    samplePayload: {
      client_id: 'dcp_spokane_workbench_client',
      returnTo: 'https://displaycellpros.com',
      federated: false
    },
    headers: {},
    steps: [
      { step: 1, title: 'Clear Local Session', from: 'Client App', to: 'Local Cookies / Storage', detail: 'Deletes local app tokens and session state.' },
      { step: 2, title: 'Redirect to Auth0 /v2/logout', from: 'Browser', to: 'Auth0 /v2/logout', detail: 'Redirects browser with returnTo and client_id query parameters.' },
      { step: 3, title: 'Clear Auth0 SSO Cookie', from: 'Auth0 Engine', to: 'Auth0 Session Domain', detail: 'Auth0 clears auth0 SSO cookies and redirects browser to returnTo URL.' }
    ],
    documentationUrls: [
      { title: 'Log Users Out of Auth0', url: 'https://auth0.com/docs/authenticate/login/logout' },
      { title: 'Logout Endpoint Reference', url: 'https://auth0.com/docs/api/authentication#logout' }
    ],
    codeSnippets: {
      curl: `curl --request GET \\
  --url 'https://{yourDomain}/v2/logout?client_id=YOUR_CLIENT_ID&returnTo=https://displaycellpros.com'`,
      typescript: `// Next.js App Router Logout Handler
import { auth0 } from '@/lib/auth0';

export const GET = auth0.handleLogout({
  returnTo: 'https://displaycellpros.com'
});`,
      fetch: `// Browser Logout trigger
function logout() {
  const returnTo = encodeURIComponent(window.location.origin);
  window.location.href = \`https://{yourDomain}/v2/logout?client_id=\${clientId}&returnTo=\${returnTo}\`;
}`,
      python: `# Construct Logout Redirect URL
def get_logout_url(domain: str, client_id: str, return_to: str) -> str:
    return f"https://{domain}/v2/logout?client_id={client_id}&returnTo={return_to}"`
    }
  },
  {
    id: 'ropc_flow',
    name: 'Resource Owner Password Flow (ROPC)',
    badge: 'Legacy Direct Credentials',
    category: 'Advanced & Legacy',
    rfcOrStandard: 'OAuth 2.0 RFC 6749 §4.3 (ROPC)',
    description: 'Allows highly-trusted legacy applications to directly collect user credentials (username and password) and exchange them at /oauth/token. Should only be used when redirect-based flows are strictly impossible.',
    bestFor: 'Highly-trusted legacy internal migration tools where redirect UI cannot be rendered.',
    securityRating: 'Legacy / Caution',
    grantTypeOrResponseType: 'grant_type=password / grant_type=http://auth0.com/oauth/grant-type/password-realm',
    authMethod: 'Client ID & Client Secret',
    endpoints: {
      token: 'https://{yourDomain}/oauth/token'
    },
    samplePayload: {
      grant_type: 'password',
      username: 'tech_lead@displaycellpros.com',
      password: '************************',
      client_id: 'dcp_trusted_cli_client',
      client_secret: 'sec_legacy_9948201948',
      scope: 'openid profile email',
      audience: 'https://api.displaycellpros.com'
    },
    headers: {
      'Content-Type': 'application/json'
    },
    steps: [
      { step: 1, title: 'Direct Credentials Submission', from: 'Trusted App', to: 'Auth0 /oauth/token', detail: 'Application directly transmits user password and username to token endpoint.' },
      { step: 2, title: 'Credential Verification', from: 'Auth0 Database Connection', to: 'Auth0 Engine', detail: 'Auth0 validates password hash against tenant connection and brute-force protection.' },
      { step: 3, title: 'Token Issuance', from: 'Auth0', to: 'Trusted App', detail: 'Auth0 returns Access and ID tokens.' }
    ],
    documentationUrls: [
      { title: 'Resource Owner Password Flow', url: 'https://auth0.com/docs/get-started/authentication-and-authorization-flow/resource-owner-password-flow' },
      { title: 'Call API Using ROPC', url: 'https://auth0.com/docs/get-started/authentication-and-authorization-flow/resource-owner-password-flow/call-your-api-using-resource-owner-password-flow' }
    ],
    codeSnippets: {
      curl: `curl --request POST \\
  --url 'https://{yourDomain}/oauth/token' \\
  --header 'content-type: application/json' \\
  --data '{"grant_type":"password","username":"USER@DOMAIN.COM","password":"PASSWORD","client_id":"YOUR_CLIENT_ID","client_secret":"YOUR_CLIENT_SECRET","scope":"openid"}'`,
      typescript: `const res = await fetch('https://{yourDomain}/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'password',
    username: 'user@displaycellpros.com',
    password: 'UserPassword123!',
    client_id: process.env.AUTH0_CLIENT_ID,
    client_secret: process.env.AUTH0_CLIENT_SECRET,
    scope: 'openid profile email'
  })
});
const data = await res.json();`,
      fetch: `const res = await fetch('https://{yourDomain}/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
    username: 'user@displaycellpros.com',
    password: 'secretPassword',
    realm: 'Username-Password-Authentication',
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
    scope: 'openid profile'
  })
});`,
      python: `import httpx

async def ropc_login(username, password):
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://{yourDomain}/oauth/token",
            json={
                "grant_type": "password",
                "username": username,
                "password": password,
                "client_id": "YOUR_CLIENT_ID",
                "client_secret": "YOUR_CLIENT_SECRET",
                "scope": "openid profile"
            }
        )
        return res.json()`
    }
  }
];

export default function Auth0FlowsHub() {
  const { showToast } = useToast();
  const [selectedFlowId, setSelectedFlowId] = useState<string>('auth_code');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'typescript' | 'fetch' | 'python'>('typescript');
  const [activeViewTab, setActiveViewTab] = useState<'inspector' | 'code' | 'debugger' | 'rates'>('inspector');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [simulationStepIndex, setSimulationStepIndex] = useState<number>(-1);
  const [showDecisionWizard, setShowDecisionWizard] = useState(false);
  
  // Debugger state
  const [debugStatusCode, setDebugStatusCode] = useState<number>(200);
  const [debugTenantDomain, setDebugTenantDomain] = useState<string>('displaycellpros.us.auth0.com');
  const [debugCustomClientId, setDebugCustomClientId] = useState<string>('dcp_spokane_workbench_01');

  // Wizard state
  const [wizardAppType, setWizardAppType] = useState<string>('');
  const [wizardHasBackendSecret, setWizardHasBackendSecret] = useState<string>('');
  const [wizardNeedsSpecialPrivacy, setWizardNeedsSpecialPrivacy] = useState<string>('');

  const selectedFlow = auth0FlowsData.find(f => f.id === selectedFlowId) || auth0FlowsData[0];

  const categories = ['All', 'Standard Web & Mobile', 'Privacy & Enterprise', 'Machine & IoT', 'Advanced & Legacy'];

  const filteredFlows = activeCategory === 'All' 
    ? auth0FlowsData 
    : auth0FlowsData.filter(f => f.category === activeCategory);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationStepIndex(0);
    setSimulationLogs([`[INIT] Initializing Auth0 ${selectedFlow.name} handshake via ${selectedFlow.authMethod}...`]);

    selectedFlow.steps.forEach((step, idx) => {
      setTimeout(() => {
        setSimulationStepIndex(idx);
        setSimulationLogs(prev => [
          ...prev, 
          `[STEP ${step.step}] ${step.title}: ${step.from} ➔ ${step.to} (${step.detail})`
        ]);
      }, (idx + 1) * 550);
    });

    setTimeout(() => {
      setSimulationStepIndex(selectedFlow.steps.length);
      setSimulationLogs(prev => [
        ...prev,
        `[CRYPTO] Verified tenant RS256 signature against https://${debugTenantDomain}/.well-known/jwks.json`,
        `[SUCCESS] Issued JWT Access Token (aud: https://api.displaycellpros.com, exp: +86400s, alg: RS256)`,
        `[SUCCESS] Issued ID Token with Verified User Claims (D&CP Master Tech / Ryan Young)`,
        `[RATE_LIMIT] X-RateLimit-Remaining: 299 / 300 (Window Reset: 60s)`,
        `[COMPLETE] ${selectedFlow.name} execution completed successfully.`
      ]);
      setIsSimulating(false);
      showToast(`${selectedFlow.name} simulation executed successfully!`, 'success');
    }, (selectedFlow.steps.length + 1) * 550);
  };

  const calculateRecommendation = () => {
    if (wizardAppType === 'm2m') return 'client_credentials';
    if (wizardAppType === 'device') return 'device_auth';
    if (wizardAppType === 'ciba') return 'ciba';
    if (wizardAppType === 'cte') return 'custom_token_exchange';
    if (wizardAppType === 'passwordless') return 'passwordless';
    if (wizardAppType === 'saml') return 'saml_wsfed';
    if (wizardNeedsSpecialPrivacy === 'yes') return 'rar_par_jar';
    if (wizardAppType === 'spa' || wizardAppType === 'mobile' || wizardHasBackendSecret === 'no') return 'pkce';
    if (wizardAppType === 'web' && wizardHasBackendSecret === 'yes') return 'auth_code';
    return 'auth_code';
  };

  const getDebugResponse = () => {
    switch (debugStatusCode) {
      case 200:
        return {
          status: 200,
          statusText: 'OK',
          headers: {
            'content-type': 'application/json',
            'x-ratelimit-limit': '300',
            'x-ratelimit-remaining': '298',
            'x-ratelimit-reset': String(Math.floor(Date.now() / 1000) + 55)
          },
          body: {
            access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRjcC0yMDI2In0...',
            id_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
            refresh_token: 'r_tok_dcp_984392817491',
            scope: 'openid profile email read:repairs',
            expires_in: 86400,
            token_type: 'Bearer'
          }
        };
      case 400:
        return {
          status: 400,
          statusText: 'Bad Request',
          headers: {
            'content-type': 'application/json',
            'x-ratelimit-limit': '300',
            'x-ratelimit-remaining': '297',
            'x-ratelimit-reset': String(Math.floor(Date.now() / 1000) + 50)
          },
          body: {
            error: 'invalid_request',
            error_description: 'Missing required parameter: code_verifier for PKCE enabled client application.'
          }
        };
      case 401:
        return {
          status: 401,
          statusText: 'Unauthorized',
          headers: {
            'content-type': 'application/json',
            'www-authenticate': 'Bearer error="invalid_token", error_description="The token is expired"'
          },
          body: {
            error: 'invalid_client',
            error_description: 'Client authentication failed. Invalid client_secret or expired private key assertion.'
          }
        };
      case 403:
        return {
          status: 403,
          statusText: 'Forbidden',
          headers: {
            'content-type': 'application/json'
          },
          body: {
            error: 'access_denied',
            error_description: 'User does not possess the required RBAC permissions for audience: https://api.displaycellpros.com'
          }
        };
      case 429:
        return {
          status: 429,
          statusText: 'Too Many Requests',
          headers: {
            'content-type': 'application/json',
            'x-ratelimit-limit': '300',
            'x-ratelimit-remaining': '0',
            'x-ratelimit-reset': String(Math.floor(Date.now() / 1000) + 42)
          },
          body: {
            error: 'too_many_requests',
            error_description: 'Too many requests. Check the X-RateLimit-Limit, X-RateLimit-Remaining and X-RateLimit-Reset headers.'
          }
        };
      default:
        return {
          status: 500,
          statusText: 'Internal Server Error',
          headers: { 'content-type': 'application/json' },
          body: {
            error: 'server_error',
            error_description: 'Auth0 engine encountered an unexpected upstream issue. Check status.auth0.com'
          }
        };
    }
  };

  const debugResponse = getDebugResponse();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Key className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-playfair font-black text-white">Auth0 Authentication & API Flows Hub</h2>
              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold rounded-md border border-blue-500/30 uppercase">
                OIDC / OAuth 2.0 / FAPI
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Grounded in Auth0 llms.txt: PKCE, RAR, PAR, JAR, CIBA, M2M, Device Flow, Private Key JWT & mTLS
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowDecisionWizard(!showDecisionWizard)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              showDecisionWizard 
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>Which Flow Should I Use?</span>
          </button>
          
          <a
            href="https://auth0.com/llms.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-700"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Auth0 llms.txt</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Decision Wizard Modal / Banner */}
      <AnimatePresence>
        {showDecisionWizard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-900 border border-blue-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-playfair font-bold text-lg text-white">Interactive Flow Decision Wizard</h3>
                  <p className="text-xs text-slate-400">Answer 3 quick architectural questions to determine the optimal OAuth 2.0 flow</p>
                </div>
              </div>
              <button
                onClick={() => setShowDecisionWizard(false)}
                className="text-xs text-slate-400 hover:text-white px-3 py-1 bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Question 1 */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[11px] font-mono uppercase font-bold text-blue-400 block">1. Target Application Type</span>
                <select
                  value={wizardAppType}
                  onChange={(e) => setWizardAppType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs font-mono focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select App Type...</option>
                  <option value="web">Regular Web App (Server-side Next.js/Express)</option>
                  <option value="spa">Single-Page App (React / Vue / Vite)</option>
                  <option value="mobile">Native Mobile App (iOS / Android / Flutter)</option>
                  <option value="m2m">Machine-to-Machine / Daemon / Background Worker</option>
                  <option value="device">Smart TV / IoT / Workbench Hardware</option>
                  <option value="passwordless">Passwordless Consumer Intake (Email/SMS)</option>
                  <option value="ciba">Decoupled / POS Register / Call Center (CIBA)</option>
                  <option value="saml">Enterprise SSO (Okta / Entra ID / SAML)</option>
                  <option value="cte">Token Exchange / Multi-Cloud Bridge</option>
                </select>
              </div>

              {/* Question 2 */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[11px] font-mono uppercase font-bold text-blue-400 block">2. Can Store Secret Securely?</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setWizardHasBackendSecret('yes')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      wizardHasBackendSecret === 'yes' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Yes (Backend)
                  </button>
                  <button
                    onClick={() => setWizardHasBackendSecret('no')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      wizardHasBackendSecret === 'no' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    No (Public Client)
                  </button>
                </div>
              </div>

              {/* Question 3 */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[11px] font-mono uppercase font-bold text-blue-400 block">3. Regulated / Financial Privacy?</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setWizardNeedsSpecialPrivacy('yes')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      wizardNeedsSpecialPrivacy === 'yes' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Yes (FAPI / RAR / PAR)
                  </button>
                  <button
                    onClick={() => setWizardNeedsSpecialPrivacy('no')}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      wizardNeedsSpecialPrivacy === 'no' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Standard Scope
                  </button>
                </div>
              </div>
            </div>

            {/* Recommendation Result */}
            {wizardAppType && (
              <div className="p-4 bg-blue-950/40 border border-blue-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold">Recommended Flow:</span>
                  <div className="text-white font-playfair font-bold text-lg">
                    {auth0FlowsData.find(f => f.id === calculateRecommendation())?.name}
                  </div>
                  <p className="text-xs text-slate-300">
                    {auth0FlowsData.find(f => f.id === calculateRecommendation())?.bestFor}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFlowId(calculateRecommendation());
                    setShowDecisionWizard(false);
                    showToast(`Selected ${auth0FlowsData.find(f => f.id === calculateRecommendation())?.name}`, 'info');
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 shrink-0"
                >
                  <span>Inspect This Flow</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === category
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveViewTab('inspector')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeViewTab === 'inspector' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Sequence Inspector</span>
          </button>
          <button
            onClick={() => setActiveViewTab('code')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeViewTab === 'code' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Generator</span>
          </button>
          <button
            onClick={() => setActiveViewTab('debugger')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeViewTab === 'debugger' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            <span>API & Error Tester</span>
          </button>
          <button
            onClick={() => setActiveViewTab('rates')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeViewTab === 'rates' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Rate Limits & Docs</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Flow Selector List & Detailed View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Flow Selector (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              Available Flows ({filteredFlows.length})
            </h3>
            <span className="text-[11px] font-mono text-blue-400">Auth0 LLMs.txt</span>
          </div>

          <div className="space-y-2.5 max-h-[850px] overflow-y-auto pr-1">
            {filteredFlows.map((flow) => {
              const isSelected = selectedFlowId === flow.id;
              return (
                <button
                  key={flow.id}
                  onClick={() => setSelectedFlowId(flow.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-2 relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-900/30 to-slate-900 border-blue-500/60 text-white shadow-lg shadow-blue-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm font-playfair text-white">{flow.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      flow.securityRating === 'Recommended' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      flow.securityRating === 'High Security' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                      flow.securityRating === 'Specialized' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {flow.securityRating}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-blue-400 font-semibold">{flow.badge}</span>
                    <span className="text-slate-400 text-[10px]">{flow.authMethod}</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {flow.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="truncate max-w-[170px]">{flow.rfcOrStandard}</span>
                    <span className="text-slate-400 flex items-center gap-1 shrink-0">
                      {flow.steps.length} Steps
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Flow Inspector / Code Generator / Debugger (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Top Bar of Selected Flow */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-playfair font-bold text-white">{selectedFlow.name}</h3>
                  <span className="text-xs font-mono px-2.5 py-0.5 bg-slate-800 text-blue-400 rounded-md border border-slate-700">
                    {selectedFlow.rfcOrStandard}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{selectedFlow.description}</p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-[11px] font-mono text-indigo-300 rounded-lg">
                  {selectedFlow.authMethod}
                </span>
                <span className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase border ${
                  selectedFlow.securityRating === 'Recommended' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                  selectedFlow.securityRating === 'High Security' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
                  selectedFlow.securityRating === 'Specialized' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                  'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {selectedFlow.securityRating}
                </span>
              </div>
            </div>

            {/* View Tab 1: Protocol Handshake Sequence Inspector */}
            {activeViewTab === 'inspector' && (
              <div className="space-y-6">
                {/* Best For Section */}
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block mb-1">Optimal Architecture & Use Case:</span>
                  <p className="text-slate-200">{selectedFlow.bestFor}</p>
                </div>

                {/* Sequence Flow Steps Visualizer */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Protocol Handshake Sequence ({selectedFlow.steps.length} Phases)
                    </span>
                    <span className="text-[11px] font-mono text-indigo-400">{selectedFlow.grantTypeOrResponseType}</span>
                  </div>

                  <div className="space-y-2.5">
                    {selectedFlow.steps.map((step, idx) => {
                      const isCurrent = simulationStepIndex === idx;
                      const isPassed = simulationStepIndex > idx;
                      return (
                        <div
                          key={step.step}
                          className={`p-3.5 rounded-2xl border transition-all ${
                            isCurrent 
                              ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                              : isPassed
                              ? 'bg-slate-950/80 border-emerald-500/30 text-slate-300'
                              : 'bg-slate-950 border-slate-800/80 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                                isCurrent ? 'bg-blue-500 text-white animate-pulse' :
                                isPassed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {step.step}
                              </span>
                              <span className="font-bold text-white text-xs">{step.title}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                              <span className="text-blue-400">{step.from}</span>
                              <span>➔</span>
                              <span className="text-emerald-400">{step.to}</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-2 pl-7 leading-relaxed">
                            {step.detail}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tenant Endpoints */}
                <div className="space-y-2.5">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Auth0 OAuth Endpoints
                  </span>
                  <div className="space-y-1.5">
                    {Object.entries(selectedFlow.endpoints).map(([key, url]) => (
                      <div key={key} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                        <span className="text-blue-400 uppercase font-bold text-[11px]">{key}:</span>
                        <span className="text-slate-300 select-all truncate ml-2 text-[11px]">{url}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Request Payload JSON */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                      OAuth Protocol Request Payload
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(selectedFlow.samplePayload, null, 2));
                        showToast('Payload copied to clipboard!', 'success');
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy JSON</span>
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-amber-300 overflow-x-auto leading-relaxed max-h-56">
                    {JSON.stringify(selectedFlow.samplePayload, null, 2)}
                  </pre>
                </div>

                {/* Live Protocol Simulation & Telemetry */}
                <div className="pt-4 border-t border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-white">Live Protocol Simulation & Signature Verification</h4>
                      <p className="text-xs text-slate-400">Emulate end-to-end token acquisition and cryptographically signed JWT issuance</p>
                    </div>
                    <button
                      onClick={handleRunSimulation}
                      disabled={isSimulating}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 shrink-0 disabled:opacity-50"
                    >
                      {isSimulating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Executing Handshake...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-white" />
                          <span>Simulate {selectedFlow.name}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {simulationLogs.length > 0 && (
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase text-slate-500 font-bold block">Execution Telemetry Stream</span>
                        <button
                          onClick={() => {
                            setSimulationLogs([]);
                            setSimulationStepIndex(-1);
                          }}
                          className="text-[10px] text-slate-500 hover:text-slate-300"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {simulationLogs.map((log, idx) => (
                          <div 
                            key={idx} 
                            className={`flex items-start gap-2 ${
                              log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : 
                              log.includes('COMPLETE') ? 'text-blue-400 font-bold' : 
                              log.includes('CRYPTO') ? 'text-purple-400' :
                              log.includes('RATE_LIMIT') ? 'text-amber-400' :
                              log.includes('INIT') ? 'text-indigo-400' : 'text-slate-300'
                            }`}
                          >
                            <span className="shrink-0 text-slate-600">›</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* View Tab 2: Multi-Language Code Generator */}
            {activeViewTab === 'code' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-bold text-white">Client Code Implementations</h4>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                    <button
                      onClick={() => setActiveCodeTab('typescript')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        activeCodeTab === 'typescript' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Next.js / TS
                    </button>
                    <button
                      onClick={() => setActiveCodeTab('fetch')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        activeCodeTab === 'fetch' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      JS Fetch
                    </button>
                    <button
                      onClick={() => setActiveCodeTab('curl')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        activeCodeTab === 'curl' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      cURL
                    </button>
                    <button
                      onClick={() => setActiveCodeTab('python')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        activeCodeTab === 'python' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Python
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedFlow.codeSnippets[activeCodeTab]);
                      showToast(`${activeCodeTab.toUpperCase()} code copied!`, 'success');
                    }}
                    className="absolute right-4 top-4 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 shadow-md z-10"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </button>

                  <pre className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-96">
                    {selectedFlow.codeSnippets[activeCodeTab]}
                  </pre>
                </div>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 font-mono font-bold text-[11px] uppercase">
                    <Info className="w-4 h-4" />
                    <span>Environment Requirements</span>
                  </div>
                  <p className="leading-relaxed">
                    Set <code className="text-white font-mono">AUTH0_SECRET</code>, <code className="text-white font-mono">AUTH0_BASE_URL</code>, <code className="text-white font-mono">AUTH0_ISSUER_BASE_URL</code>, and <code className="text-white font-mono">AUTH0_CLIENT_ID</code> in your <code className="text-white font-mono">.env.local</code>.
                  </p>
                </div>
              </div>
            )}

            {/* View Tab 3: API & Error Tester */}
            {activeViewTab === 'debugger' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Auth0 Authentication API Debugger & Error Emulation</h4>
                    <p className="text-xs text-slate-400">Simulate exact HTTP responses, rate limit headers, and RFC error codes</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Response Code:</span>
                    <select
                      value={debugStatusCode}
                      onChange={(e) => setDebugStatusCode(Number(e.target.value))}
                      className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs font-mono focus:border-blue-500 focus:outline-none"
                    >
                      <option value={200}>200 OK (Success)</option>
                      <option value={400}>400 Bad Request (invalid_request)</option>
                      <option value={401}>401 Unauthorized (invalid_client)</option>
                      <option value={403}>403 Forbidden (access_denied)</option>
                      <option value={429}>429 Too Many Requests (Rate Limit)</option>
                      <option value={500}>500 Internal Server Error</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400 uppercase font-bold">Tenant Domain</label>
                    <input
                      type="text"
                      value={debugTenantDomain}
                      onChange={(e) => setDebugTenantDomain(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
                      placeholder="tenant.us.auth0.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400 uppercase font-bold">Client ID</label>
                    <input
                      type="text"
                      value={debugCustomClientId}
                      onChange={(e) => setDebugCustomClientId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
                      placeholder="client_id"
                    />
                  </div>
                </div>

                {/* HTTP Response Box */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className={`px-2.5 py-1 rounded-md font-bold ${
                        debugStatusCode === 200 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        debugStatusCode === 429 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        HTTP {debugResponse.status} {debugResponse.statusText}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">POST https://{debugTenantDomain}/oauth/token</span>
                  </div>

                  {/* Headers */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Response Headers</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      {Object.entries(debugResponse.headers).map(([k, v]) => (
                        <div key={k} className="p-2 bg-slate-900/80 rounded-lg border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-400">{k}:</span>
                          <span className="text-blue-300 truncate ml-2">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Response JSON Payload</span>
                    <pre className={`p-4 rounded-xl border text-xs font-mono overflow-x-auto leading-relaxed ${
                      debugStatusCode === 200 ? 'bg-slate-900 border-emerald-500/30 text-emerald-300' :
                      debugStatusCode === 429 ? 'bg-slate-900 border-amber-500/30 text-amber-300' :
                      'bg-slate-900 border-rose-500/30 text-rose-300'
                    }`}>
                      {JSON.stringify(debugResponse.body, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* View Tab 4: Rate Limits & Documentation Links */}
            {activeViewTab === 'rates' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white">Auth0 Rate Limiting & Operational Policies</h4>
                  <p className="text-xs text-slate-400">
                    The Authentication API employs per-endpoint rate limits and brute-force protection to prevent credential stuffing.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="text-[10px] uppercase font-mono text-blue-400 font-bold">X-RateLimit-Limit</div>
                    <div className="text-lg font-bold text-white">300 req / min</div>
                    <p className="text-[11px] text-slate-400">Maximum allowed requests in a sliding 1-minute window.</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="text-[10px] uppercase font-mono text-emerald-400 font-bold">X-RateLimit-Remaining</div>
                    <div className="text-lg font-bold text-white">Dynamic Quota</div>
                    <p className="text-[11px] text-slate-400">Remaining request credits until the window resets.</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="text-[10px] uppercase font-mono text-amber-400 font-bold">X-RateLimit-Reset</div>
                    <div className="text-lg font-bold text-white">Unix Epoch Timestamp</div>
                    <p className="text-[11px] text-slate-400">Time in seconds when the rate limit window resets.</p>
                  </div>
                </div>

                {/* Brute Force Protection Note */}
                <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-2xl space-y-1 text-xs text-amber-200">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Database Connection Brute Force Protection</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Auth0 limits repeat failed login attempts from a given IP or targeting a specific user account. Exceeding thresholds triggers CAPTCHAs, IP blocking, or email security alerts.
                  </p>
                </div>

                {/* Official Auth0 Documentation Links */}
                <div className="pt-2 space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Official Auth0 Documentation References
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedFlow.documentationUrls.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-slate-950 hover:bg-slate-850 rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-bold text-blue-400 flex items-center justify-between transition-all group"
                      >
                        <span className="truncate group-hover:text-blue-300">{doc.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 ml-2" />
                      </a>
                    ))}
                    <a
                      href="https://auth0.com/docs/troubleshoot/customer-support/operational-policies/rate-limit-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-950 hover:bg-slate-850 rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-bold text-blue-400 flex items-center justify-between transition-all group"
                    >
                      <span className="truncate group-hover:text-blue-300">Rate Limit Policy</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 ml-2" />
                    </a>
                    <a
                      href="https://auth0.com/docs/customize/extensions/authentication-api-debugger-extension"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-950 hover:bg-slate-850 rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-bold text-blue-400 flex items-center justify-between transition-all group"
                    >
                      <span className="truncate group-hover:text-blue-300">Authentication API Debugger Extension</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 shrink-0 ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
