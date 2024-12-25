import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth = new Auth0Client({
  appBaseUrl: process.env.AUTH0_BASE_URL,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH0_SECRET,
  domain: process.env.AUTH0_DOMAIN,
  routes: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    callback: "/api/auth/callback",
    backChannelLogout: "/api/auth/logout",
  },
});
