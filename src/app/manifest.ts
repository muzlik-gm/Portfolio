import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hamza - Developer Portfolio',
    short_name: 'Hamza',
    description: 'Full-stack developer portfolio',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafaf9',
    theme_color: '#8b635c',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon.svg',
        sizes: '180x180',
        type: 'image/svg+xml',
      },
    ],
  }
}
