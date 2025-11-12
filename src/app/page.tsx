"use client";

import { Layout } from "@/components/layout";
import { Section, Typography, Button, SectionDivider } from "@/components/ui";
import { HeroSection, TechnologiesSection, ProjectsSection, AboutSection, ContactSection } from "@/components/sections";
import TargetCursor from "@/components/ui/TargetCursor";

export default function Home() {
  return (
    <Layout>
      {/* TargetCursor disabled for performance - uncomment to enable */}
      {/* <TargetCursor 
        spinDuration={2}
        hideDefaultCursor={true}
        parallaxOn={true}
      /> */}
      
      <HeroSection />
      <SectionDivider type="layered-wave" />
      
      <TechnologiesSection />
      <SectionDivider type="wave" flip />
      
      <AboutSection />
      <SectionDivider type="wave" flip />
      
      <ProjectsSection />
      <SectionDivider type="layered-wave" />
      
      <ContactSection />
    </Layout>
  );
}
