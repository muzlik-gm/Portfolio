"use client";

import { Layout } from "@/components/layout";
import { Section, Typography, Button, SectionDivider } from "@/components/ui";
import { HeroSection, ProjectsSection, AboutSection, ContactSection } from "@/components/sections";

export default function Home() {
  return (
    <Layout>
      {/* First impressions matter - let's make it count! */}
      <HeroSection />

      {/* A little visual break to keep things interesting */}
      <SectionDivider type="layered-wave" />

      {/* Here's my story - who I am and what drives me */}
      <AboutSection />

      {/* Another smooth transition */}
      <SectionDivider type="wave" flip />

      {/* The fun part - showing off what I've built! */}
      <ProjectsSection />

      {/* One more elegant divider */}
      <SectionDivider type="layered-wave" />

      {/* Let's connect! I'd love to hear from you */}
      <ContactSection />
    </Layout>
  );
}
