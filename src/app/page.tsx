"use client";

import { Layout } from "@/components/layout";
import { Section, Typography, Button, SectionDivider } from "@/components/ui";
import { HeroSection, ProjectsSection, AboutSection, ContactSection } from "@/components/sections";

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <SectionDivider type="layered-wave" />
      
      <AboutSection />
      <SectionDivider type="wave" flip />
      
      <ProjectsSection />
      <SectionDivider type="layered-wave" />
      
      <ContactSection />
    </Layout>
  );
}
