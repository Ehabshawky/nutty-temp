import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://nuttyscientists-egypt.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/_next/',
        '/public/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
