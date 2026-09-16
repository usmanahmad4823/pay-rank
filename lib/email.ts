/**
 * Transactional Email Dispatcher for Outbid Notifications & Receipts.
 * Uses Resend API if process.env.RESEND_API_KEY is present, or logs outbid alert.
 */
export async function sendOutbidNotificationEmail({
  recipientEmail,
  restaurantName,
  previousRank,
  newRank,
  currentTopBidCents,
}: {
  recipientEmail: string;
  restaurantName: string;
  previousRank: number;
  newRank: number;
  currentTopBidCents: number;
}): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;

  const subject = `⚠️ Outbid Alert: ${restaurantName} moved from #${previousRank} to #${newRank}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded-radius: 12px;">
      <h2 style="color: #ef4444;">Your listing on Pay-Rank has been outbid!</h2>
      <p>Hi team at <strong>${restaurantName}</strong>,</p>
      <p>Another restaurant just placed a bid on Pay-Rank, shifting your position from <strong>#${previousRank}</strong> to <strong>#${newRank}</strong>.</p>
      <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold; color: #991b1b;">Current #1 Bid Volume: $${(currentTopBidCents / 100).toLocaleString()}</p>
      </div>
      <p>You can reclaim your top spot immediately by submitting a top-up bid:</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="display: inline-block; background-color: #f97316; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: bold;">Reclaim #1 Position</a>
    </div>
  `;

  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Pay-Rank Alerts <outbid@pay-rank.com>',
          to: [recipientEmail],
          subject,
          html: htmlContent,
        }),
      });

      return response.ok;
    } catch (err) {
      console.error('Failed to send outbid notification via Resend API:', err);
      return false;
    }
  }

  console.log(`[Outbid Email Triggered Log] To: ${recipientEmail} | Subject: ${subject}`);
  return true;
}
