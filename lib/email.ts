import nodemailer from "nodemailer"

type BankTransferAlertData = {
  reference: string
  bookingId: string
  hotelName: string
  hotelArea?: string | null
  nights: number
  totalNGN: number
  customerName: string
  customerEmail: string
  customerPhone?: string | null
  tripId?: string | null
}

export async function sendBankTransferAdminAlert(data: BankTransferAlertData) {
  const adminEmail =
    process.env.ADMIN_ALERT_EMAIL || "godspowerojini8@gmail.com"

  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(data.totalNGN)

  const cleanPhone = data.customerPhone?.replace(/\D/g, "")
  const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : null
  const tripUrl = data.tripId
    ? `${process.env.NEXT_PUBLIC_APP_URL || "https://travel-wine-three.vercel.app"}/trips/${data.tripId}`
    : null

  const subject = `🚨 [Payment Alert] Bank Transfer Sent: ${formattedAmount} for ${data.hotelName} (${data.reference})`

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
          .card { max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { background: #0f172a; color: #ffffff; padding: 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 700; }
          .header p { margin: 6px 0 0 0; font-size: 13px; color: #94a3b8; }
          .content { padding: 24px; }
          .badge { display: inline-block; background: #fef3c7; color: #d97706; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 600; margin-bottom: 8px; }
          .data-table { width: 100%; border-collapse: collapse; }
          .data-table td { padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
          .data-table td:first-child { color: #64748b; width: 40%; }
          .data-table td:last-child { font-weight: 600; color: #0f172a; }
          .total-box { background: #f1f5f9; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center; }
          .total-amount { font-size: 26px; font-weight: 800; color: #0f172a; }
          .actions { text-align: center; margin-top: 24px; }
          .btn-whatsapp { display: inline-block; background: #25d366; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; margin-right: 8px; }
          .btn-trip { display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 14px; }
          .footer { padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; background: #fafafa; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>New Bank Transfer Submitted</h1>
            <p>Action Required: Verify transfer & follow up with traveler</p>
          </div>
          <div class="content">
            <div style="text-align: center;">
              <span class="badge">Awaiting Payment Verification</span>
            </div>

            <div class="total-box">
              <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Total Transferred</div>
              <div class="total-amount">${formattedAmount}</div>
              <div style="font-size: 11px; color: #64748b; margin-top: 4px; font-family: monospace;">Ref: ${data.reference}</div>
            </div>

            <div class="section">
              <div class="section-title">Customer Information</div>
              <table class="data-table">
                <tr>
                  <td>Name</td>
                  <td>${data.customerName}</td>
                </tr>
                <tr>
                  <td>WhatsApp Phone</td>
                  <td>${data.customerPhone || "Not provided"}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></td>
                </tr>
              </table>
            </div>

            <div class="section">
              <div class="section-title">Booking Details</div>
              <table class="data-table">
                <tr>
                  <td>Hotel</td>
                  <td>${data.hotelName}${data.hotelArea ? ` (${data.hotelArea})` : ""}</td>
                </tr>
                <tr>
                  <td>Nights</td>
                  <td>${data.nights} night(s)</td>
                </tr>
                <tr>
                  <td>Payment Method</td>
                  <td>Bank Transfer (UBA: 2373387052)</td>
                </tr>
              </table>
            </div>

            <div class="actions">
              ${
                whatsappUrl
                  ? `<a href="${whatsappUrl}" class="btn-whatsapp" target="_blank">Chat on WhatsApp</a>`
                  : ""
              }
              ${
                tripUrl
                  ? `<a href="${tripUrl}" class="btn-trip" target="_blank">View Trip</a>`
                  : ""
              }
            </div>
          </div>
          <div class="footer">
            Trails Enugu Concierge Platform · Automated Alert
          </div>
        </div>
      </body>
    </html>
  `

  // Send via configured SMTP / Gmail App Password if available
  const smtpHost = process.env.SMTP_HOST
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER
  const smtpPass = process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: (process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) === 465 : true),
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })

      await transporter.sendMail({
        from: `"Trails Concierge Alert" <${smtpUser}>`,
        to: adminEmail,
        subject,
        html: htmlContent,
      })

      console.log(`✅ [EMAIL SENT] Bank transfer alert delivered to ${adminEmail}`)
      return { success: true }
    } catch (err) {
      console.error("❌ [EMAIL ERROR] Failed to send email alert via transporter:", err)
    }
  } else if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Trails Alerts <onboarding@resend.dev>",
          to: [adminEmail],
          subject,
          html: htmlContent,
        }),
      })
      if (res.ok) {
        console.log(`✅ [RESEND EMAIL SENT] Bank transfer alert delivered to ${adminEmail}`)
        return { success: true }
      }
    } catch (err) {
      console.error("❌ [RESEND ERROR] Failed to send via Resend API:", err)
    }
  }

  console.log(`ℹ️ [EMAIL ALERT READY] To deliver to ${adminEmail}, configure SMTP_USER & SMTP_PASSWORD or RESEND_API_KEY in .env`)
  return { success: false, reason: "SMTP not configured" }
}
