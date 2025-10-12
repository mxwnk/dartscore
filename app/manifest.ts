import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dartscore',
    short_name: 'DS',
    description: 'A simple app to count dart scores.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/dart192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/dart512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}