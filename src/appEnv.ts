export function appEnv() {
  const conf = {
    useMocks: Object.keys(process.env).includes('REACT_APP_USE_MOCKS')
      ? !!process.env.REACT_APP_USE_MOCKS : true,
    backendAddress: process.env.REACT_APP_BACKEND_ADDRESS || 'http://localhost:3002',
    clientID: process.env.REACT_APP_CLIENT_ID || '271995591219-ngothre2m7jhc3k2r2bih41j2kuf3mfs.apps.googleusercontent.com',
  };
  return conf;
}
