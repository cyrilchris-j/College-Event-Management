# ✉️ CampusConnect Email Integration Setup Guide

This guide provides step-by-step instructions to configure transactional emails for:
1. **New Organizer Account Welcome Email** (Sending login credentials to newly created organizers).
2. **Student Registration Confirmation & Digital Ticket Email** (Sending QR ticket pass upon event booking).
3. **Event Day Attendance Reminder Email** (Sending reminder notice with direct Hall QR check-in link).

---

## 🛠️ Step 1: Environment Variables Setup

Add your email provider credentials (SMTP / Nodemailer or Resend / SendGrid) to your `.env` file in the `backend/` directory:

```env
# Email Service Configuration (Nodemailer SMTP Example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=campusconnect.ksrce@gmail.com
SMTP_PASS=your_app_password_here
EMAIL_FROM="CampusConnect <no-reply@ksrce.ac.in>"

# Alternatively (Resend API Example)
RESEND_API_KEY=re_123456789_abcdef
```

---

## 💻 Step 2: Backend Mailer Service Implementation

Create or update `backend/services/emailService.js`:

```javascript
import nodemailer from 'nodemailer';

// 1. Create Transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * 📧 Mail 1: New Organizer Welcome Email
 */
export async function sendOrganizerWelcomeEmail({ email, password, clubName }) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"CampusConnect Admin" <no-reply@ksrce.ac.in>',
    to: email,
    subject: `🎓 Welcome to CampusConnect — Organizer Portal Access for ${clubName}`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #0B1329; color: #ffffff; padding: 24px; border-radius: 16px;">
        <h2 style="color: #3B82F6;">Welcome to CampusConnect!</h2>
        <p>Hello <strong>${clubName}</strong> Team,</p>
        <p>An official Organizer account has been created for your club by the Administrator.</p>
        
        <div style="background: #111C3A; padding: 16px; border-radius: 12px; margin: 16px 0; border: 1px solid #1E2D52;">
          <p><strong>Portal URL:</strong> <a href="https://campusconnect.ksrce.ac.in/login" style="color: #60A5FA;">https://campusconnect.ksrce.ac.in/login</a></p>
          <p><strong>Login Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> <code>${password || 'Campus@123'}</code></p>
        </div>
        
        <p style="font-size: 12px; color: #94A3B8;">Please log in and update your password immediately upon first sign-in.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}

/**
 * 🎫 Mail 2: Student Registration Confirmation & Ticket
 */
export async function sendRegistrationConfirmationEmail({ studentEmail, studentName, eventTitle, ticketCode, venue, eventDate }) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"CampusConnect Tickets" <tickets@ksrce.ac.in>',
    to: studentEmail,
    subject: `✅ Registration Confirmed: ${eventTitle} (${ticketCode})`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #0B1329; color: #ffffff; padding: 24px; border-radius: 16px;">
        <h2 style="color: #22C55E;">Event Registration Confirmed!</h2>
        <p>Hi <strong>${studentName}</strong>,</p>
        <p>Your registration for <strong>${eventTitle}</strong> is successful.</p>
        
        <div style="background: #111C3A; padding: 20px; border-radius: 12px; border: 1px solid #1E2D52; text-align: center;">
          <h3 style="color: #3B82F6; margin: 0;">Digital Ticket Pass</h3>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #F59E0B; margin: 10px 0;">${ticketCode}</p>
          <p style="font-size: 13px; color: #94A3B8;">Venue: <strong>${venue}</strong> | Date: <strong>${eventDate}</strong></p>
        </div>
        
        <p style="font-size: 12px; color: #94A3B8; margin-top: 16px;">Please present this Ticket Code or scan the Hall QR code on event day to mark attendance.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}

/**
 * 🔔 Mail 3: Event Day Attendance Reminder & Scan Link
 */
export async function sendAttendanceReminderEmail({ studentEmail, studentName, eventTitle, ticketCode, venue, ticketId }) {
  const scanLink = `https://campusconnect.ksrce.ac.in/ticket/${ticketId}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"CampusConnect Alerts" <alerts@ksrce.ac.in>',
    to: studentEmail,
    subject: `⏰ Reminder: ${eventTitle} is Today! Check-in Open`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #0B1329; color: #ffffff; padding: 24px; border-radius: 16px;">
        <h2 style="color: #3B82F6;">Today is Event Day!</h2>
        <p>Hi <strong>${studentName}</strong>,</p>
        <p>This is a reminder that <strong>${eventTitle}</strong> is taking place today at <strong>${venue}</strong>.</p>
        
        <div style="text-align: center; margin: 24px 0;">
          <a href="${scanLink}" style="background: #3B82F6; color: #ffffff; padding: 12px 24px; border-radius: 12px; font-weight: bold; text-decoration: none; display: inline-block;">
            📱 Open Digital Ticket & Scan Hall QR
          </a>
        </div>
        
        <p style="font-size: 12px; color: #94A3B8;">Ticket Reference: <code>${ticketCode}</code></p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}
```

---

## 🚀 Step 3: Triggering Emails in Controllers

### A. When Admin Creates Organizer:
In `backend/controllers/adminController.js`:
```javascript
import { sendOrganizerWelcomeEmail } from '../services/emailService.js';

// Inside createOrganizer controller:
await sendOrganizerWelcomeEmail({
  email: req.body.email,
  password: req.body.password,
  clubName: req.body.clubName,
});
```

### B. When Student Registers for Event:
In `backend/controllers/registrationController.js`:
```javascript
import { sendRegistrationConfirmationEmail } from '../services/emailService.js';

// Inside registerEvent controller:
await sendRegistrationConfirmationEmail({
  studentEmail: req.user.email,
  studentName: req.profile.full_name,
  eventTitle: event.title,
  ticketCode: newRegistration.ticket_code,
  venue: event.venue,
  eventDate: new Date(event.event_start).toLocaleDateString(),
});
```

---

## 🔍 Step 4: Verification & Testing

1. Set your `SMTP_USER` and `SMTP_PASS` in `backend/.env`.
2. Trigger an organizer creation from Admin Dashboard or a student registration.
3. Check inbox / spam folder for transactional confirmation emails.
