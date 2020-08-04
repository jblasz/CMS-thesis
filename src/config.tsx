if (!process.env.AUTH_CONFIG_DOMAIN || !process.env.AUTH_CONFIG_CLIENT_ID) {
  throw new Error('AUTH_CONFIG_DOMAIN not set');
}

export const AUTH_CONFIG = {
  domain: process.env.AUTH_CONFIG_DOMAIN,
  roleUrl: 'https://rbac-tutorial-app/role',
  clientId: process.env.AUTH_CONFIG_CLIENT_ID,
  callbackUrl: 'http://localhost:3000/callback',
};
