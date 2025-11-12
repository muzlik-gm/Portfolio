"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Typography } from "@/components/ui";
import { scrollReveal } from "@/lib/animations";
import { APP_CONFIG } from "@/lib/constants";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  // Honeypot field for spam protection
  website?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  // General error message for rate limiting, etc.
  general?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: "", email: "", subject: "", message: "" });
        setErrors({});
      } else if (response.status === 429) {
        setErrors({ message: data.message });
        setSubmitStatus('idle');
      } else if (data.errors) {
        // Handle validation errors
        const fieldErrors: FormErrors = {};
        data.errors.forEach((error: any) => {
          fieldErrors[error.field as keyof FormErrors] = error.message;
        });
        setErrors(fieldErrors);
        setSubmitStatus('idle');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field-specific error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      variants={scrollReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Name and Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Name"
          type="text"
          value={formData.name}
          onChange={(value) => handleChange('name', value)}
          error={errors.name}
          placeholder="Your full name"
          required
        />
        
        <FormField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value) => handleChange('email', value)}
          error={errors.email}
          placeholder="your.email@example.com"
          required
        />
      </div>

      {/* Subject */}
      <FormField
        label="Subject"
        type="text"
        value={formData.subject}
        onChange={(value) => handleChange('subject', value)}
        error={errors.subject}
        placeholder="What's this about?"
        required
      />

      {/* Message */}
      <FormField
        label="Message"
        type="textarea"
        value={formData.message}
        onChange={(value) => handleChange('message', value)}
        error={errors.message}
        placeholder="Tell me about your project, ideas, or just say hello..."
        rows={6}
        required
      />

      {/* Hidden honeypot field for spam protection */}
      <div style={{ display: 'none' }}>
        <label htmlFor="website">Website (leave blank)</label>
        <input
          id="website"
          name="website"
          type="text"
          value={formData.website || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
          autoComplete="off"
        />
      </div>

      {/* Submit Button */}
      <div className="flex flex-col items-center space-y-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[200px] px-8 py-4 text-lg rounded-2xl bg-[#8b635c] text-[#fafaf9] font-semibold hover:bg-[#8b635c]/80 shadow-medium hover:shadow-strong border-[3px] border-[#8b635c] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-describedby={errors.general ? "general-error" : undefined}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2 justify-center">
              <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              Sending...
            </div>
          ) : (
            "Send Message"
          )}
        </button>

        {/* General error message */}
        {errors.general && (
          <div
            id="general-error"
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
            role="alert"
          >
            <Typography variant="body" className="text-red-600 font-medium text-center">
              {errors.general}
            </Typography>
          </div>
        )}

        {/* Status Messages */}
        <AnimatePresence>
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
              role="status"
              aria-live="polite"
            >
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <Typography variant="body" className="text-green-600 font-medium">
                  ✨ Message sent successfully! I'll get back to you soon.
                </Typography>
              </div>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
              role="alert"
              aria-live="assertive"
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <Typography variant="body" className="text-red-600 font-medium">
                  ❌ Something went wrong. Please try again or email me directly.
                </Typography>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.form>
  );
}

interface FormFieldProps {
  label: string;
  type: 'text' | 'email' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

function FormField({
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
  rows = 4,
  required = false
}: FormFieldProps) {
  const baseClasses = "w-full px-4 py-3 bg-surface/30 border-[3px] border-[#8b635c]/60 rounded-xl text-foreground placeholder-foreground/50 focus:outline-none focus:border-[#8b635c] focus:bg-surface/50 transition-all duration-300";
  const errorClasses = error ? "border-red-500/50 focus:border-red-500" : "";
  const inputId = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-foreground/80"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
      </label>

      {type === 'textarea' ? (
        <motion.textarea
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`${baseClasses} ${errorClasses} resize-none`}
          whileFocus={{
            boxShadow: "0 0 0 3px rgba(139, 99, 92, 0.1)",
            scale: 1.01
          }}
          transition={{ duration: 0.2 }}
        />
      ) : (
        <motion.input
          id={inputId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`${baseClasses} ${errorClasses}`}
          whileFocus={{
            boxShadow: "0 0 0 3px rgba(139, 99, 92, 0.1)",
            scale: 1.01
          }}
          transition={{ duration: 0.2 }}
        />
      )}

      <AnimatePresence>
        {error && (
          <motion.div
            id={`${inputId}-error`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-sm"
            role="alert"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}