"use client";

import { Layout } from "@/components/layout";
import { Section, Typography, Button, SectionDivider } from "@/components/ui";
import { HeroSection, ProjectsSection, AboutSection, ContactSection } from "@/components/sections";

export default function Home() {
  return (
    <Layout>
      {/* Cinematic Hero Section */}
      <HeroSection />

      {/* Section Divider */}
      <SectionDivider type="layered-wave" />

      {/* Personal Story About Section */}
      <AboutSection />

      {/* Section Divider */}
      <SectionDivider type="wave" flip />

      {/* Projects Section with Stage-like Presentation */}
      <ProjectsSection />

      {/* Section Divider */}
      <SectionDivider type="layered-wave" />

      {/* Warm and Approachable Contact Section */}
      <ContactSection />
    </Layout>
  );
}
