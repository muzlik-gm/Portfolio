import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Hamza - Developer Portfolio'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ddd78d 0%, #8b635c 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 40,
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              background: '#fafaf9',
              borderRadius: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 140,
              fontWeight: 'bold',
              color: '#8b635c',
            }}
          >
            H
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                fontSize: 80,
                fontWeight: 'bold',
                color: '#fafaf9',
              }}
            >
              Hamza
            </div>
            <div
              style={{
                fontSize: 36,
                color: '#fafaf9',
                opacity: 0.9,
              }}
            >
              Developer Portfolio
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
