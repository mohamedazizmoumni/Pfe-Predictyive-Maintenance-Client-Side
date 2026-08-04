export const environment = {
  production: true,
  // The main authenticated app (ggg) — separately deployed project.
  // Placeholder domain — swap for the real one once registered/hosted.
  appUrl: 'https://app.sentinel-maintenance.io',
  // Backend API — same one the authenticated app talks to. Only the
  // unauthenticated /public/** endpoints (contact/demo-request) are used
  // from this project.
  apiUrl: 'https://api.sentinel-maintenance.io/api/v1',
};
