"use client";

import { motion } from "framer-motion";
import { Typography } from "@/components/ui";
import { APP_CONFIG } from "@/lib/constants";
import { scrollReveal } from "@/lib/animations";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className="relative bg-surface/20 border-t-2 border-accent/30 py-12"
      variants={scrollReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Typography variant="subheading" className="text-accent mb-2">
              Hamza
            </Typography>
            <Typography variant="body" className="text-foreground/60 text-sm">
              Web & Game Developer
            </Typography>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <div className="flex justify-center gap-6">
              {[
                { label: "About", href: "#about" },
                { label: "Projects", href: "#projects" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="text-foreground/60 hover:text-accent transition-colors text-sm"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <Typography variant="body" className="text-foreground/50 text-sm">
              © {currentYear} {APP_CONFIG.author}
            </Typography>
            <Typography variant="body" className="text-foreground/40 text-xs mt-1">
              Built with Next.js & Framer Motion
            </Typography>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t-2 border-accent/30 text-center">
          <Typography variant="body" className="text-foreground/50 text-sm">
            Designed and developed with passion in Pakistan
          </Typography>
        </div>
      </div>
    </motion.footer>
  );
}