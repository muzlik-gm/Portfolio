export const siteConfig = {
  name: "Hamza",
  title: "Hamza - Developer Portfolio",
  description: "Full-stack developer specializing in web and game development. Check out my projects and get in touch.",
  url: process.env.NEXTAUTH_URL || "https://muzlik.vercel.app",
  ogImage: "/og-image.jpg",
  links: {
    github: "https://github.com/muzlik-gm",
    linkedin: "https://linkedin.com/in/muzlik",
    twitter: "https://x.com/muzlik-gm",
  },
}

export function generatePageMetadata(
  title: string,
  description: string,
  path: string = ""
) {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}${path}`,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}
