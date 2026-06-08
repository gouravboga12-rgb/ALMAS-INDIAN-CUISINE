import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM || `"ALMAS Indian Cuisine" <${user || 'noreply@almas.ca'}>`;

  if (!host || !user || !pass) {
    console.warn("\n======================================================================");
    console.warn("[SMTP] EMAIL NOT SENT: SMTP credentials are not configured in your .env file.");
    console.warn(`[SMTP] To: ${to}`);
    console.warn(`[SMTP] Subject: ${subject}`);
    console.warn(`[SMTP] Code / Details can be verified in console logs below.`);
    console.warn("======================================================================\n");
    return { mock: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: { user, pass }
  });

  return transporter.sendMail({
    from,
    to,
    subject,
    html
  });
}

export async function sendVerificationEmail(email, name, code) {
  const subject = `${code} is your ALMAS verification code`;
  const html = `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 3rem 1.5rem; color: #202124;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
        <div style="background-color: #1a0a00; padding: 2rem; text-align: center; border-bottom: 2px solid #CC5500;">
          <h1 style="color: #ffffff; margin: 0; font-size: 1.6rem; font-weight: 800; letter-spacing: 0.05em;">ALMAS</h1>
          <p style="color: #D4AF37; margin: 0.25rem 0 0 0; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em;">Indian Cuisine</p>
        </div>
        <div style="padding: 2.5rem 2rem;">
          <h2 style="margin-top: 0; color: #1a0a00; font-size: 1.3rem; font-weight: 700;">Verify your email address</h2>
          <p style="color: #5f6368; font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem;">
            Hello ${name || 'there'},<br><br>
            Thank you for registering at ALMAS Indian Cuisine! Please use the following 6-digit verification code to complete your signup:
          </p>
          <div style="background-color: #fff8f3; border: 1px dashed #CC5500; border-radius: 8px; padding: 1.25rem; text-align: center; margin-bottom: 2rem;">
            <span style="font-size: 2.2rem; font-weight: 800; letter-spacing: 0.25em; color: #CC5500; font-family: monospace;">${code}</span>
          </div>
          <p style="color: #9aa0a6; font-size: 0.8rem; line-height: 1.5; margin-bottom: 0;">
            This verification code is valid for <strong>10 minutes</strong>.<br>
            If you did not request this verification, you can safely ignore this email.
          </p>
        </div>
        <div style="background-color: #f8f9fa; padding: 1.25rem; text-align: center; border-top: 1px solid #e8eaed; font-size: 0.75rem; color: #70757a;">
          &copy; 2026 ALMAS Indian Cuisine. All rights reserved.<br>
          209 Ellesmere Rd, Unit 6, Scarborough, ON, M1R 4E2
        </div>
      </div>
    </div>
  `;

  console.log(`[SMTP Verification Code] Email: ${email} | Name: ${name} | OTP: ${code}`);
  return sendEmail({ to: email, subject, html });
}

export async function sendPasswordResetEmail(email, name, code) {
  const subject = `${code} is your ALMAS password reset code`;
  const html = `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 3rem 1.5rem; color: #202124;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
        <div style="background-color: #1a0a00; padding: 2rem; text-align: center; border-bottom: 2px solid #CC5500;">
          <h1 style="color: #ffffff; margin: 0; font-size: 1.6rem; font-weight: 800; letter-spacing: 0.05em;">ALMAS</h1>
          <p style="color: #D4AF37; margin: 0.25rem 0 0 0; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em;">Indian Cuisine</p>
        </div>
        <div style="padding: 2.5rem 2rem;">
          <h2 style="margin-top: 0; color: #1a0a00; font-size: 1.3rem; font-weight: 700;">Reset your password</h2>
          <p style="color: #5f6368; font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem;">
            Hello ${name || 'there'},<br><br>
            We received a request to reset the password for your ALMAS Indian Cuisine account. Use the following code to proceed:
          </p>
          <div style="background-color: #fff8f3; border: 1px dashed #CC5500; border-radius: 8px; padding: 1.25rem; text-align: center; margin-bottom: 2rem;">
            <span style="font-size: 2.2rem; font-weight: 800; letter-spacing: 0.25em; color: #CC5500; font-family: monospace;">${code}</span>
          </div>
          <p style="color: #9aa0a6; font-size: 0.8rem; line-height: 1.5; margin-bottom: 0;">
            This recovery code is valid for <strong>10 minutes</strong>.<br>
            If you did not request a password reset, please secure your account or disregard this notice.
          </p>
        </div>
        <div style="background-color: #f8f9fa; padding: 1.25rem; text-align: center; border-top: 1px solid #e8eaed; font-size: 0.75rem; color: #70757a;">
          &copy; 2026 ALMAS Indian Cuisine. All rights reserved.<br>
          209 Ellesmere Rd, Unit 6, Scarborough, ON, M1R 4E2
        </div>
      </div>
    </div>
  `;

  console.log(`[SMTP Reset Password Code] Email: ${email} | Name: ${name} | OTP: ${code}`);
  return sendEmail({ to: email, subject, html });
}
