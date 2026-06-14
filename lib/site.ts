const localhostUrl = "http://localhost:3000";

export function getSiteUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const deploymentUrl = process.env.VERCEL_URL;

  if (explicitUrl) {
    return explicitUrl.startsWith("http") ? explicitUrl : `https://${explicitUrl}`;
  }

  if (productionUrl) {
    return `https://${productionUrl}`;
  }

  if (deploymentUrl) {
    return `https://${deploymentUrl}`;
  }

  return localhostUrl;
}
