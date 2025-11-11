import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dbConnect, Message } from '@/lib/models';

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be less than 2000 characters'),
  // Honeypot field for spam protection
  website: z.string().optional(),
});

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 3;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userData = rateLimitStore.get(ip);

  if (!userData || now > userData.resetTime) {
    // Reset or create new entry
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userData.count++;
  return true;
}

async function sendEmail(formData: z.infer<typeof contactSchema>) {
  // In production, integrate with your email service (SendGrid, Resend, etc.)
  // For now, we'll log the message and simulate sending
  console.log('📧 Contact form submission:', {
    to: process.env.CONTACT_EMAIL || 'hamza@example.com',
    subject: `[Portfolio Contact] ${formData.subject}`,
    from: formData.email,
    name: formData.name,
    message: formData.message,
    timestamp: new Date().toISOString(),
  });

  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In production, you would send the actual email here
  // Example with a service like Resend:
  /*
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'Portfolio Contact <contact@yourdomain.com>',
    to: process.env.CONTACT_EMAIL,
    subject: `[Portfolio Contact] ${formData.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Subject:</strong> ${formData.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${formData.message.replace(/\n/g, '<br>')}</p>
    `,
  });
  */
}

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate form data
    const body = await request.json();
    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: 'Validation failed',
          errors: validationResult.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          }))
        },
        { status: 400 }
      );
    }

    const formData = validationResult.data;

    // Check honeypot field (should be empty for legitimate submissions)
    if (formData.website && formData.website.trim() !== '') {
      // Silent rejection for spam
      return NextResponse.json(
        { message: 'Message sent successfully!' },
        { status: 200 }
      );
    }

    // Save message to database
    const message = new Message({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      status: 'unread',
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    await message.save();

    // Send email
    await sendEmail(formData);

    // Log successful submission (for analytics)
    console.log(`✅ Contact form submission saved and emailed from ${formData.email} (${ip})`);

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { message: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}