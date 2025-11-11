export function PersonStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Hamza",
    "jobTitle": "Full-stack Developer",
    "url": process.env.NEXTAUTH_URL || "https://muzlik.vercel.app",
    "sameAs": [
      "https://github.com/muzlik-gm",
      "https://linkedin.com/in/muzlik"
    ],
    "knowsAbout": [
      "Web Development",
      "Game Development",
      "React",
      "Next.js",
      "TypeScript",
      "Node.js"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

export function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Hamza Portfolio",
    "url": process.env.NEXTAUTH_URL || "https://muzlik.vercel.app",
    "description": "Developer portfolio showcasing web and game development projects",
    "author": {
      "@type": "Person",
      "name": "Hamza"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
