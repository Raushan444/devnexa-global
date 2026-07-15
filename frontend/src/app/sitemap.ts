import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://devnexa.global';
  const services = ["web-development", "mobile-apps", "ai-solutions", "saas", "crm", "erp", "cloud", "ui-ux", "ecommerce", "api"];
  const industries = ["healthcare", "education", "real-estate", "fintech", "logistics", "restaurants", "manufacturing", "retail"];
  const locations = ["noida", "delhi", "gurugram", "bangalore", "india"];
  const portfolioSlugs = ["fintrack-pro", "mediconnect", "shopnova", "neuralassist", "deliverflow", "databridge-api"];

  const routes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.7 },
    { url: `${baseUrl}/estimator`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/auditor`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
  ];

  services.forEach(slug => {
    routes.push({ url: `${baseUrl}/services/${slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.85 });
  });

  industries.forEach(slug => {
    routes.push({ url: `${baseUrl}/industries/${slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 });
  });

  locations.forEach(slug => {
    routes.push({ url: `${baseUrl}/locations/${slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.75 });
  });

  portfolioSlugs.forEach(slug => {
    routes.push({ url: `${baseUrl}/portfolio/${slug}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 });
  });

  return routes;
}
