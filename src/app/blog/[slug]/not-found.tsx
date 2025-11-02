import { Layout } from "@/components/layout";
import { Section, Typography, Button } from "@/components/ui";
import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <Layout>
      <Section className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="text-6xl mb-4">📝</div>
          <Typography variant="heading">Post Not Found</Typography>
          <Typography variant="body" className="text-foreground/70">
            The blog post you're looking for doesn't exist or has been removed.
          </Typography>
          <div className="flex gap-4 justify-center">
            <Link href="/blog">
              <Button>Back to Blog</Button>
            </Link>
            <Link href="/">
              <Button variant="secondary">Home</Button>
            </Link>
          </div>
        </div>
      </Section>
    </Layout>
  );
}