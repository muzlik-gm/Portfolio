"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Typography, Button, Card } from "@/components/ui";
import { scrollReveal, staggerContainer } from "@/lib/animations";
import { base64UrlDecode } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Setting {
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  category: string;
  description?: string;
  isPublic: boolean;
  updatedAt: string;
  createdAt: string;
}

interface SettingsData {
  [category: string]: Setting[];
}

export default function AdminSettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SettingsData>({});
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const router = useRouter();

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUrl = (url: string) => {
    if (!url) return true; // Empty URLs are allowed
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Theme settings
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  // SEO settings
  const [siteTitle, setSiteTitle] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [siteKeywords, setSiteKeywords] = useState('');

  // Site config settings
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    twitter: '',
    linkedin: '',
    github: '',
    instagram: ''
  });

  const loadSettingsFromStorage = () => {
    try {
      const stored = localStorage.getItem('admin_settings');
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        if (parsedSettings.theme) {
          setThemeMode(parsedSettings.theme.mode || 'light');
        }
        if (parsedSettings.seo) {
          setSiteTitle(parsedSettings.seo.title || '');
          setSiteDescription(parsedSettings.seo.description || '');
          setSiteKeywords(parsedSettings.seo.keywords || '');
        }
        if (parsedSettings.site_config) {
          setContactEmail(parsedSettings.site_config.contact_email || '');
          setContactPhone(parsedSettings.site_config.contact_phone || '');
          setSocialLinks(parsedSettings.site_config.social_links || {
            twitter: '', linkedin: '', github: '', instagram: ''
          });
        }
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
  };

  const saveSettingsToStorage = (category: string, key: string, value: any) => {
    try {
      const stored = localStorage.getItem('admin_settings');
      const parsedSettings = stored ? JSON.parse(stored) : {};

      if (!parsedSettings[category]) {
        parsedSettings[category] = {};
      }
      parsedSettings[category][key] = value;

      localStorage.setItem('admin_settings', JSON.stringify(parsedSettings));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);

        // Update local state from API data if available
        const themeSettings = data.settings.theme || [];
        const seoSettings = data.settings.seo || [];
        const siteConfigSettings = data.settings.site_config || [];

        themeSettings.forEach((setting: Setting) => {
          if (setting.key === 'mode') {
            setThemeMode(setting.value);
            saveSettingsToStorage('theme', 'mode', setting.value);
          }
        });

        seoSettings.forEach((setting: Setting) => {
          if (setting.key === 'title') setSiteTitle(setting.value);
          if (setting.key === 'description') setSiteDescription(setting.value);
          if (setting.key === 'keywords') setSiteKeywords(setting.value);
        });

        siteConfigSettings.forEach((setting: Setting) => {
          if (setting.key === 'contact_email') setContactEmail(setting.value);
          if (setting.key === 'contact_phone') setContactPhone(setting.value);
          if (setting.key === 'social_links') setSocialLinks(setting.value);
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const saveSettings = async (settingsToSave: any[]) => {
    setIsSaving(true);
    setErrors({});
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: settingsToSave }),
      });

      if (response.ok) {
        const data = await response.json();
        await fetchSettings(); // Refresh settings
        return { success: true, data };
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || { general: 'Failed to save settings' });
        return { success: false, error: errorData.message || 'Failed to save settings' };
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setErrors({ general: 'Network error occurred' });
      return { success: false, error: 'Network error' };
    } finally {
      setIsSaving(false);
    }
  };

  // Individual save functions for each category
  const saveThemeSettings = async () => {
    const settingsToSave = [{
      key: 'mode',
      value: themeMode,
      type: 'string',
      category: 'theme',
      description: 'Theme mode for the application'
    }];

    const result = await saveSettings(settingsToSave);
    if (result.success) {
      saveSettingsToStorage('theme', 'mode', themeMode);
    }
    return result;
  };

  const saveSEOSettings = async () => {
    // Validate inputs
    const validationErrors: {[key: string]: string} = {};

    if (siteTitle && siteTitle.length > 60) {
      validationErrors.title = 'Site title should be less than 60 characters for optimal SEO';
    }

    if (siteDescription && siteDescription.length > 160) {
      validationErrors.description = 'Site description should be less than 160 characters for optimal SEO';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return { success: false, error: 'Validation failed' };
    }

    const settingsToSave = [
      {
        key: 'title',
        value: siteTitle.trim(),
        type: 'string',
        category: 'seo',
        description: 'Site title for SEO'
      },
      {
        key: 'description',
        value: siteDescription.trim(),
        type: 'string',
        category: 'seo',
        description: 'Site description for SEO'
      },
      {
        key: 'keywords',
        value: siteKeywords.trim(),
        type: 'string',
        category: 'seo',
        description: 'Site keywords for SEO'
      }
    ];

    const result = await saveSettings(settingsToSave);
    if (result.success) {
      saveSettingsToStorage('seo', 'title', siteTitle.trim());
      saveSettingsToStorage('seo', 'description', siteDescription.trim());
      saveSettingsToStorage('seo', 'keywords', siteKeywords.trim());
    }
    return result;
  };

  const saveSiteConfigSettings = async () => {
    // Validate inputs
    const validationErrors: {[key: string]: string} = {};

    if (contactEmail && !validateEmail(contactEmail)) {
      validationErrors.contact_email = 'Please enter a valid email address';
    }

    // Validate social media URLs
    Object.entries(socialLinks).forEach(([platform, url]) => {
      if (url && !validateUrl(url)) {
        validationErrors[`social_${platform}`] = `Please enter a valid ${platform} URL`;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return { success: false, error: 'Validation failed' };
    }

    const settingsToSave = [
      {
        key: 'contact_email',
        value: contactEmail.trim(),
        type: 'string',
        category: 'site_config',
        description: 'Contact email address'
      },
      {
        key: 'contact_phone',
        value: contactPhone.trim(),
        type: 'string',
        category: 'site_config',
        description: 'Contact phone number'
      },
      {
        key: 'social_links',
        value: socialLinks,
        type: 'json',
        category: 'site_config',
        description: 'Social media links'
      }
    ];

    const result = await saveSettings(settingsToSave);
    if (result.success) {
      saveSettingsToStorage('site_config', 'contact_email', contactEmail.trim());
      saveSettingsToStorage('site_config', 'contact_phone', contactPhone.trim());
      saveSettingsToStorage('site_config', 'social_links', socialLinks);
    }
    return result;
  };

  useEffect(() => {
    const verifyAuthentication = async () => {
      console.log('[SETTINGS] Starting authentication verification');
      // Force solid background on body
    document.body.style.background = '#fafaf9';
    document.body.style.backgroundImage = 'none';
    document.documentElement.style.background = '#fafaf9';
    document.documentElement.style.backgroundImage = 'none';

    console.log('[SETTINGS] Checking authentication with cookies');
    // Verify authentication with server using cookies
    try {
      console.log('[SETTINGS] Verifying authentication with server');
      const verifyResponse = await fetch('/api/admin/verify', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('[SETTINGS] Verify response status:', verifyResponse.status);
      if (!verifyResponse.ok) {
        console.log('[SETTINGS] Server token verification failed, redirecting to login');
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
        return;
      }

      const verifyData = await verifyResponse.json();
      console.log('[SETTINGS] Server verification successful for user:', verifyData.user?.email);
      setIsAuthenticated(true);

      // Load settings from localStorage first for immediate feedback
      loadSettingsFromStorage();

      // Then fetch from API to sync
      fetchSettings();
    } catch (error) {
      console.error('[SETTINGS] Token verification error:', error);
      localStorage.removeItem("adminToken");
      router.push("/admin/login");
    } finally {
      setIsLoading(false);
    }
    };

    verifyAuthentication();

    // Cleanup
    return () => {
      document.body.style.background = '';
      document.body.style.backgroundImage = '';
      document.documentElement.style.background = '';
      document.documentElement.style.backgroundImage = '';
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      // Call logout API to clear server-side cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('[SETTINGS] Logout API error:', error);
    }
    router.push("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <Typography variant="body" className="text-foreground/60">
            Loading settings...
          </Typography>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const settingsSections = [
    {
      title: "Profile Settings",
      description: "Update your personal information and bio",
      icon: "👤",
      items: [
        "Personal Information",
        "Bio and Description", 
        "Social Media Links",
        "Profile Picture"
      ]
    },
    {
      title: "Site Configuration",
      description: "Configure portfolio appearance and behavior",
      icon: "⚙️",
      items: [
        "Theme Settings",
        "Navigation Menu",
        "Footer Content",
        "SEO Settings"
      ]
    },
    {
      title: "Content Management",
      description: "Manage blog and project content settings",
      icon: "📝",
      items: [
        "Blog Settings",
        "Project Categories",
        "Featured Content",
        "Content Moderation"
      ]
    },
    {
      title: "Security",
      description: "Security and authentication settings",
      icon: "🔒",
      items: [
        "Change Password",
        "Two-Factor Authentication",
        "Login Sessions",
        "Security Logs"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9]" style={{ background: '#fafaf9' }}>
      {/* Solid background overlay to prevent any background images from showing */}
      <div className="fixed inset-0 bg-[#fafaf9] z-0" style={{ background: '#fafaf9', backgroundImage: 'none' }} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-background border-b border-accent/10 sticky top-0 z-20 shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin/dashboard")}
              >
                ← Dashboard
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Page Title */}
            <motion.div variants={scrollReveal}>
              <Typography variant="heading" className="text-foreground text-3xl">
                Settings
              </Typography>
              <Typography variant="body" className="text-foreground/60 mt-2">
                Configure your portfolio settings
              </Typography>
            </motion.div>

            {/* Settings Forms */}
            <motion.div variants={scrollReveal}>
              <div className="space-y-8">
                {/* Theme Settings */}
                <Card className="p-6 bg-background/50 border-accent/20">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🎨</span>
                      </div>
                      <div>
                        <Typography variant="subheading" className="text-foreground">
                          Theme Settings
                        </Typography>
                        <Typography variant="body" className="text-foreground/70 text-sm">
                          Customize the appearance of your portfolio
                        </Typography>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Typography variant="body" className="text-foreground font-medium">
                            Theme Mode
                          </Typography>
                          <Typography variant="body" className="text-foreground/60 text-sm">
                            Choose between light and dark theme
                          </Typography>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-sm ${themeMode === 'light' ? 'text-accent font-medium' : 'text-foreground/60'}`}>
                            Light
                          </span>
                          <button
                            onClick={() => {
                              const newMode = themeMode === 'light' ? 'dark' : 'light';
                              setThemeMode(newMode);
                              saveThemeSettings();
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              themeMode === 'dark' ? 'bg-accent' : 'bg-accent/30'
                            }`}
                            aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                themeMode === 'dark' ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className={`text-sm ${themeMode === 'dark' ? 'text-accent font-medium' : 'text-foreground/60'}`}>
                            Dark
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* SEO Settings */}
                <Card className="p-6 bg-background/50 border-accent/20">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🔍</span>
                      </div>
                      <div>
                        <Typography variant="subheading" className="text-foreground">
                          SEO Settings
                        </Typography>
                        <Typography variant="body" className="text-foreground/70 text-sm">
                          Optimize your site for search engines
                        </Typography>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-2">
                          Site Title
                        </label>
                        <input
                          type="text"
                          value={siteTitle}
                          onChange={(e) => setSiteTitle(e.target.value)}
                          onBlur={saveSEOSettings}
                          className={`w-full px-3 py-2 border rounded-lg bg-background/50 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 ${
                            errors.title ? 'border-red-300 focus:ring-red-500' : 'border-accent/20 focus:ring-accent/50'
                          }`}
                          placeholder="Enter your site title"
                          aria-label="Site title"
                          maxLength={60}
                        />
                        {errors.title && (
                          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                        )}
                        <p className="mt-1 text-xs text-foreground/50">
                          {siteTitle.length}/60 characters
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-2">
                          Site Description
                        </label>
                        <textarea
                          value={siteDescription}
                          onChange={(e) => setSiteDescription(e.target.value)}
                          onBlur={saveSEOSettings}
                          rows={3}
                          className={`w-full px-3 py-2 border rounded-lg bg-background/50 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 ${
                            errors.description ? 'border-red-300 focus:ring-red-500' : 'border-accent/20 focus:ring-accent/50'
                          }`}
                          placeholder="Enter your site description"
                          aria-label="Site description"
                          maxLength={160}
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                        )}
                        <p className="mt-1 text-xs text-foreground/50">
                          {siteDescription.length}/160 characters
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-2">
                          Keywords
                        </label>
                        <input
                          type="text"
                          value={siteKeywords}
                          onChange={(e) => setSiteKeywords(e.target.value)}
                          onBlur={saveSEOSettings}
                          className="w-full px-3 py-2 border border-accent/20 rounded-lg bg-background/50 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50"
                          placeholder="Enter keywords separated by commas"
                          aria-label="SEO keywords"
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Site Configuration Settings */}
                <Card className="p-6 bg-background/50 border-accent/20">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">⚙️</span>
                      </div>
                      <div>
                        <Typography variant="subheading" className="text-foreground">
                          Site Configuration
                        </Typography>
                        <Typography variant="body" className="text-foreground/70 text-sm">
                          Configure contact information and social links
                        </Typography>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground/80 mb-2">
                            Contact Email
                          </label>
                          <input
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            onBlur={saveSiteConfigSettings}
                            className={`w-full px-3 py-2 border rounded-lg bg-background/50 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 ${
                              errors.contact_email ? 'border-red-300 focus:ring-red-500' : 'border-accent/20 focus:ring-accent/50'
                            }`}
                            placeholder="your@email.com"
                            aria-label="Contact email"
                          />
                          {errors.contact_email && (
                            <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground/80 mb-2">
                            Contact Phone
                          </label>
                          <input
                            type="tel"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            onBlur={saveSiteConfigSettings}
                            className="w-full px-3 py-2 border border-accent/20 rounded-lg bg-background/50 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50"
                            placeholder="+1 (555) 123-4567"
                            aria-label="Contact phone"
                          />
                        </div>
                      </div>

                      <div>
                        <Typography variant="body" className="text-foreground font-medium mb-3">
                          Social Media Links
                        </Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground/80 mb-2">
                              Twitter
                            </label>
                            <input
                              type="url"
                              value={socialLinks.twitter}
                              onChange={(e) => {
                                const updated = { ...socialLinks, twitter: e.target.value };
                                setSocialLinks(updated);
                              }}
                              onBlur={saveSiteConfigSettings}
                              className={`w-full px-3 py-2 border rounded-lg bg-background/50 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 ${
                                errors.social_twitter ? 'border-red-300 focus:ring-red-500' : 'border-accent/20 focus:ring-accent/50'
                              }`}
                              placeholder="https://twitter.com/username"
                              aria-label="Twitter profile URL"
                            />
                            {errors.social_twitter && (
                              <p className="mt-1 text-sm text-red-600">{errors.social_twitter}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground/80 mb-2">
                              LinkedIn
                            </label>
                            <input
                              type="url"
                              value={socialLinks.linkedin}
                              onChange={(e) => {
                                const updated = { ...socialLinks, linkedin: e.target.value };
                                setSocialLinks(updated);
                              }}
                              onBlur={saveSiteConfigSettings}
                              className={`w-full px-3 py-2 border rounded-lg bg-background/50 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 ${
                                errors.social_linkedin ? 'border-red-300 focus:ring-red-500' : 'border-accent/20 focus:ring-accent/50'
                              }`}
                              placeholder="https://linkedin.com/in/username"
                              aria-label="LinkedIn profile URL"
                            />
                            {errors.social_linkedin && (
                              <p className="mt-1 text-sm text-red-600">{errors.social_linkedin}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground/80 mb-2">
                              GitHub
                            </label>
                            <input
                              type="url"
                              value={socialLinks.github}
                              onChange={(e) => {
                                const updated = { ...socialLinks, github: e.target.value };
                                setSocialLinks(updated);
                              }}
                              onBlur={saveSiteConfigSettings}
                              className={`w-full px-3 py-2 border rounded-lg bg-background/50 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 ${
                                errors.social_github ? 'border-red-300 focus:ring-red-500' : 'border-accent/20 focus:ring-accent/50'
                              }`}
                              placeholder="https://github.com/username"
                              aria-label="GitHub profile URL"
                            />
                            {errors.social_github && (
                              <p className="mt-1 text-sm text-red-600">{errors.social_github}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-foreground/80 mb-2">
                              Instagram
                            </label>
                            <input
                              type="url"
                              value={socialLinks.instagram}
                              onChange={(e) => {
                                const updated = { ...socialLinks, instagram: e.target.value };
                                setSocialLinks(updated);
                              }}
                              onBlur={saveSiteConfigSettings}
                              className={`w-full px-3 py-2 border rounded-lg bg-background/50 text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 ${
                                errors.social_instagram ? 'border-red-300 focus:ring-red-500' : 'border-accent/20 focus:ring-accent/50'
                              }`}
                              placeholder="https://instagram.com/username"
                              aria-label="Instagram profile URL"
                            />
                            {errors.social_instagram && (
                              <p className="mt-1 text-sm text-red-600">{errors.social_instagram}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>

            {/* Error Display */}
            {Object.keys(errors).length > 0 && (
              <motion.div variants={scrollReveal}>
                <Card className="p-4 bg-red-50 border-red-200">
                  <div className="space-y-2">
                    <Typography variant="body" className="text-red-800 font-medium">
                      Errors occurred while saving settings:
                    </Typography>
                    {Object.entries(errors).map(([key, message]) => (
                      <div key={key} className="text-sm text-red-700">
                        <strong>{key}:</strong> {message}
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Legacy Settings Display */}
            <motion.div variants={scrollReveal}>
              <div className="space-y-6">
                <Typography variant="subheading" className="text-foreground">
                  All Settings (Database View)
                </Typography>

                {Object.entries(settings).map(([category, categorySettings]) => (
                  <Card key={category} className="p-6 bg-background/50 border-accent/20">
                    <div className="space-y-4">
                      <Typography variant="subheading" className="text-foreground capitalize">
                        {category.replace('_', ' ')} Settings
                      </Typography>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(categorySettings as any[]).map((setting) => (
                          <div key={setting.key} className="space-y-2">
                            <label className="block text-sm font-medium text-foreground/80">
                              {setting.key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </label>
                            <div className="text-sm text-foreground/60">
                              Value: {typeof setting.value === 'object' ? JSON.stringify(setting.value) : setting.value}
                            </div>
                            <div className="text-sm text-foreground/60">
                              {setting.description || 'No description available'}
                            </div>
                            <div className="text-xs text-foreground/50">
                              Type: {setting.type} | Last updated: {new Date(setting.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}

                {Object.keys(settings).length === 0 && (
                  <Card className="p-8 bg-background/50 border-accent/20 text-center">
                    <div className="space-y-4">
                      <div className="text-3xl mb-2">⚙️</div>
                      <Typography variant="subheading" className="text-foreground">
                        No Settings Found
                      </Typography>
                      <Typography variant="body" className="text-foreground/70 max-w-md mx-auto">
                        No settings have been configured yet. Settings will appear here once they are added to the database.
                      </Typography>
                    </div>
                  </Card>
                )}
              </div>
            </motion.div>

            {/* Development Notice */}
            <motion.div variants={scrollReveal}>
              <Card className="p-8 bg-background/50 border-accent/20 text-center">
                <div className="space-y-4">
                  <div className="text-3xl mb-2">🚧</div>
                  <Typography variant="subheading" className="text-foreground">
                    Settings Management In Development
                  </Typography>
                  <Typography variant="body" className="text-foreground/70 max-w-md mx-auto">
                    Full CRUD operations for settings management are being developed.
                    Currently displaying existing settings from the database.
                  </Typography>
                  <div className="pt-4">
                    <Typography variant="body" className="text-foreground/60 text-sm">
                      API endpoints are ready for settings management
                    </Typography>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}