# SEO Setup

## Files Added

- `src/app/sitemap.ts` - Dynamic sitemap generation
- `src/app/manifest.ts` - PWA manifest
- `public/robots.txt` - Search engine instructions
- `src/components/seo/StructuredData.tsx` - Schema.org markup
- `src/lib/seo.ts` - SEO utilities

## After Deployment

1. Update `public/robots.txt` with your actual domain
2. Update `NEXTAUTH_URL` in environment variables
3. Add Google Search Console verification code in `src/app/layout.tsx`
4. Submit sitemap to Google: `https://your-domain.com/sitemap.xml`

## Verify SEO

- Sitemap: `/sitemap.xml`
- Robots: `/robots.txt`
- Manifest: `/manifest.json`

## Google Search Console

1. Go to https://search.google.com/search-console
2. Add your property
3. Verify ownership
4. Submit sitemap
5. Monitor indexing

## Testing

```bash
# Check sitemap locally
curl http://localhost:3000/sitemap.xml

# Check robots
curl http://localhost:3000/robots.txt
```
