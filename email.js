import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';

export async function sendEmail({ to, subject, html, attachments = [] }) {
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
    html,
    attachments
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

function getItemNameAndPrice(itemStr) {
  const parts = String(itemStr).split(' - $');
  if (parts.length > 1) {
    return {
      name: parts[0],
      price: `$${parts[1]}`
    };
  }
  return {
    name: itemStr,
    price: ''
  };
}

export function generateInvoicePdfBuffer(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', err => reject(err));

      const total = parseFloat(order.total || 0);
      const tax = parseFloat(order.tax || 0);
      const subtotal = total - tax;
      const taxRate = subtotal > 0 ? Math.round((tax / subtotal) * 100) : 14;
      const dateStr = order.created_at ? new Date(order.created_at).toLocaleString() : new Date().toLocaleString();

      // 1. BRAND HEADER
      doc.fillColor('#CC5500')
         .font('Helvetica-Bold')
         .fontSize(26)
         .text('ALMAS', { align: 'center' });
      
      doc.fillColor('#D4AF37')
         .font('Helvetica')
         .fontSize(9)
         .text('INDIAN CUISINE', { align: 'center', letterSpacing: 2 });
      
      doc.moveDown(1);
      
      // 2. INVOICE META
      doc.fillColor('#1a0800')
         .font('Helvetica-Bold')
         .fontSize(16)
         .text('INVOICE', { align: 'left' });
      
      doc.font('Helvetica')
         .fontSize(9)
         .fillColor('#555555')
         .text(`Order ID: #${order.id}`)
         .text(`Date: ${dateStr}`);
      
      doc.moveDown(1);
      
      // Draw horizontal line
      doc.strokeColor('#CC5500')
         .lineWidth(2)
         .moveTo(40, doc.y)
         .lineTo(570, doc.y)
         .stroke();
      
      doc.moveDown(1);

      // 3. CUSTOMER & FULFILLMENT BOX
      const startY = doc.y;
      doc.rect(40, startY, 530, 80)
         .fill('#fdf5ef');
      
      doc.fillColor('#CC5500')
         .font('Helvetica-Bold')
         .fontSize(10)
         .text('FULFILLMENT DETAILS', 55, startY + 10);
      
      doc.fillColor('#1a0800')
         .font('Helvetica')
         .fontSize(9)
         .text(`Name: ${order.name}`, 55, startY + 24)
         .text(`Phone: ${order.phone}`, 55, startY + 36)
         .text(`Fulfillment: ${order.type}`, 55, startY + 48)
         .text(`Pickup Time: ${order.time || 'ASAP'}`, 55, startY + 60);
      
      doc.y = startY + 95;

      // 4. ITEMS TABLE HEADER
      const tableHeaderY = doc.y;
      doc.font('Helvetica-Bold')
         .fontSize(9)
         .fillColor('#555555');
      
      doc.text('Item Description', 40, tableHeaderY, { width: 380 });
      doc.text('Price', 480, tableHeaderY, { width: 90, align: 'right' });

      doc.y = tableHeaderY + 14;
      
      doc.strokeColor('#e0e0e0')
         .lineWidth(1)
         .moveTo(40, doc.y)
         .lineTo(570, doc.y)
         .stroke();
      
      doc.y += 6;

      // 5. LOOP ITEMS
      const items = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items) : []);
      doc.font('Helvetica')
         .fontSize(9)
         .fillColor('#202124');

      items.forEach((item, idx) => {
        const detail = getItemNameAndPrice(item);
        const rowY = doc.y;
        
        doc.text(`${idx + 1}. ${detail.name}`, 40, rowY, { width: 380 });
        doc.text(detail.price || '', 480, rowY, { width: 90, align: 'right' });
        
        doc.y = rowY + 16;
        doc.strokeColor('#f0e8e0')
           .lineWidth(0.5)
           .moveTo(40, doc.y)
           .lineTo(570, doc.y)
           .stroke();
        doc.y += 6;
      });

      doc.y += 6;

      // 6. TOTALS TABLE (right aligned)
      const totalY = doc.y;
      doc.font('Helvetica')
         .fontSize(9)
         .fillColor('#555555');
      
      doc.text('Subtotal:', 350, totalY);
      doc.text(`$${subtotal.toFixed(2)}`, 480, totalY, { width: 90, align: 'right' });
      
      doc.text(`Tax (HST ${taxRate}%):`, 350, totalY + 14);
      doc.text(`$${tax.toFixed(2)}`, 480, totalY + 14, { width: 90, align: 'right' });
      
      doc.strokeColor('#CC5500')
         .lineWidth(1.5)
         .moveTo(350, totalY + 28)
         .lineTo(570, totalY + 28)
         .stroke();
      
      doc.font('Helvetica-Bold')
         .fontSize(10)
         .fillColor('#CC5500');
      
      doc.text('Total Paid:', 350, totalY + 34);
      doc.text(`$${total.toFixed(2)} CAD`, 480, totalY + 34, { width: 90, align: 'right' });

      doc.y = totalY + 55;

      // 7. PAYMENT INFO
      const payY = doc.y;
      doc.rect(40, payY, 530, 40)
         .fill('#fafafa');
      
      doc.font('Helvetica')
         .fontSize(8)
         .fillColor('#555555')
         .text(`Payment Method: ${order.payment}`, 55, payY + 10)
         .text(`Status: ${order.status}`, 55, payY + 22);
      
      doc.y = payY + 55;

      // 8. FOOTER
      doc.fillColor('#CC5500')
         .font('Helvetica-Bold')
         .fontSize(9)
         .text('Thank you for dining with ALMAS!', { align: 'center' });
      
      doc.fillColor('#888888')
         .font('Helvetica')
         .fontSize(7.5)
         .text('209 Ellesmere Rd, Unit 6, Scarborough, ON, M1R 4E2 | almasindiancuisine@gmail.com', { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

export async function sendInvoiceEmail(email, name, order) {
  const subject = `Your Receipt/Invoice for Order #${order.id} - ALMAS Indian Cuisine`;
  const items = Array.isArray(order.items) ? order.items : (typeof order.items === 'string' ? JSON.parse(order.items) : []);
  
  const total = parseFloat(order.total || 0);
  const tax = parseFloat(order.tax || 0);
  const subtotal = total - tax;
  const taxRate = subtotal > 0 ? Math.round((tax / subtotal) * 100) : 14;
  
  const dateStr = order.created_at ? new Date(order.created_at).toLocaleString() : new Date().toLocaleString();

  const itemsListHtml = items.map((item, idx) => {
    const detail = getItemNameAndPrice(item);
    return `
      <tr style="border-bottom: 1px solid #f0e8e0;">
        <td style="padding: 10px 0; font-size: 0.85rem; color: #202124; text-align: left;">${idx + 1}. ${detail.name}</td>
        <td style="padding: 10px 0; text-align: right; font-size: 0.85rem; color: #202124;">${detail.price}</td>
      </tr>
    `;
  }).join('');

  const html = `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 3rem 1.5rem; color: #202124;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
        <!-- Brand Header -->
        <div style="background-color: #1a0a00; padding: 2.5rem 2rem; text-align: center; border-bottom: 3px solid #CC5500;">
          <h1 style="color: #ffffff; margin: 0; font-size: 2rem; font-weight: 800; letter-spacing: 0.05em; font-family: Georgia, serif;">ALMAS</h1>
          <p style="color: #D4AF37; margin: 0.25rem 0 0 0; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em;">Indian Cuisine</p>
        </div>
        
        <!-- Body Content -->
        <div style="padding: 2.5rem 2rem;">
          <!-- Metadata block table (compatible with email clients) -->
          <table style="width: 100%; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; margin-bottom: 20px; border-collapse: collapse;">
            <tr>
              <td style="text-align: left; vertical-align: top;">
                <h2 style="margin: 0; font-size: 1.25rem; font-weight: 700; color: #1a0a00;">INVOICE</h2>
                <p style="margin: 3px 0 0 0; font-size: 0.8rem; color: #5f6368;">Order ID: <strong>${order.id}</strong></p>
              </td>
              <td style="text-align: right; vertical-align: top;">
                <p style="margin: 0; font-size: 0.8rem; color: #5f6368;">Date: ${dateStr}</p>
              </td>
            </tr>
          </table>

          <p style="font-size: 0.95rem; line-height: 1.5; color: #202124; margin-bottom: 1.5rem;">
            Hi ${name || 'Valued Customer'},<br><br>
            Thank you for your order at ALMAS Indian Cuisine! Here is your purchase invoice receipt.
          </p>

          <!-- Customer details box -->
          <div style="background-color: #fdf5ef; border-left: 4px solid #CC5500; border-radius: 4px; padding: 1rem; margin-bottom: 1.5rem; text-align: left;">
            <h4 style="margin: 0 0 0.5rem 0; font-size: 0.85rem; text-transform: uppercase; color: #CC5500; letter-spacing: 0.05em;">Fulfillment Details</h4>
            <p style="margin: 0; font-size: 0.85rem; color: #1a0a00; line-height: 1.4;">
              <strong>Fulfillment Type:</strong> ${order.type}<br>
              <strong>Pickup Time:</strong> ${order.time || 'ASAP'}<br>
              <strong>Name:</strong> ${order.name}<br>
              <strong>Phone:</strong> ${order.phone}
            </p>
          </div>

          <!-- Items Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
            <thead>
              <tr style="border-bottom: 2px solid #e0e0e0;">
                <th style="text-align: left; padding: 8px 0; font-size: 0.8rem; text-transform: uppercase; color: #5f6368; font-weight: 700;">Item</th>
                <th style="text-align: right; padding: 8px 0; font-size: 0.8rem; text-transform: uppercase; color: #5f6368; font-weight: 700;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsListHtml}
            </tbody>
          </table>

          <!-- Totals Section Table -->
          <table style="width: 100%; border-top: 1px solid #e0e0e0; padding-top: 10px; margin-bottom: 20px; border-collapse: collapse;">
            <tr>
              <td style="width: 50%;"></td>
              <td style="width: 50%;">
                <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 4px 0; color: #5f6368; text-align: left;">Subtotal</td>
                    <td style="padding: 4px 0; text-align: right; color: #202124;">$${subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #5f6368; text-align: left;">Tax (HST ${taxRate}%)</td>
                    <td style="padding: 4px 0; text-align: right; color: #202124;">$${tax.toFixed(2)}</td>
                  </tr>
                  <tr style="font-weight: 700; font-size: 1rem; color: #CC5500;">
                    <td style="padding: 8px 0; border-top: 2px solid #CC5500; text-align: left;">Total Paid</td>
                    <td style="padding: 8px 0; text-align: right; border-top: 2px solid #CC5500;">$${total.toFixed(2)} CAD</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <div style="background-color: #fafafa; border-radius: 8px; padding: 1rem; font-size: 0.8rem; color: #5f6368; text-align: left; margin-bottom: 1.5rem;">
            <strong>Payment Method:</strong> ${order.payment}<br>
            <strong>Status:</strong> ${order.status}
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 1.5rem; text-align: center; border-top: 1px solid #e8eaed; font-size: 0.75rem; color: #70757a; line-height: 1.4;">
          <strong style="color: #CC5500; font-size: 0.85rem;">Thank you for dining with ALMAS!</strong><br>
          &copy; 2026 ALMAS Indian Cuisine. All rights reserved.<br>
          209 Ellesmere Rd, Unit 6, Scarborough, ON, M1R 4E2
        </div>
      </div>
    </div>
  `;

  console.log(`[SMTP Invoice Email] Sending to: ${email} | Order ID: ${order.id} | Total: $${total}`);

  let pdfBuffer = null;
  try {
    pdfBuffer = await generateInvoicePdfBuffer(order);
  } catch (pdfErr) {
    console.error('[PDF] Failed to generate invoice PDF:', pdfErr.message);
  }

  const attachments = [];
  if (pdfBuffer) {
    attachments.push({
      filename: `Invoice-${order.id}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf'
    });
  }

  return sendEmail({ to: email, subject, html, attachments });
}
