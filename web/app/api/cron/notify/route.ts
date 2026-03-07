import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
import { Resend } from "resend";

// Cooldowns in days per donation type
const COOLDOWNS: Record<string, number> = {
  whole_blood: 56,
  platelets: 28,
  plasma: 14,
};

const TYPE_LABELS: Record<string, string> = {
  whole_blood: "sang total",
  platelets: "plaquettes",
  plasma: "plasma",
};

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Setup web-push
  webpush.setVapidDetails(
    "mailto:contact@lifedrop.app",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );

  // Setup Resend (optional — skip emails if not configured)
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  const supabase = getSupabase();

  // Fetch all profiles with their latest donation per type
  const { data: profiles, error: profErr } = await supabase
    .from("profiles")
    .select("id, name, notifications_enabled");

  if (profErr || !profiles) {
    console.error("Failed to fetch profiles:", profErr);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let pushSent = 0;
  let emailSent = 0;

  for (const profile of profiles) {
    if (!profile.notifications_enabled) continue;

    // Get the user's latest donation for each type
    const { data: donations } = await supabase
      .from("donations")
      .select("type, date")
      .eq("user_id", profile.id)
      .order("date", { ascending: false });

    if (!donations || donations.length === 0) continue;

    // Find the most recent donation per type
    const latestByType: Record<string, string> = {};
    for (const d of donations) {
      if (!latestByType[d.type]) {
        latestByType[d.type] = d.date;
      }
    }

    // Check each type for J-7 and Jour J
    for (const [type, lastDate] of Object.entries(latestByType)) {
      const cooldown = COOLDOWNS[type];
      if (!cooldown) continue;

      const donationDate = new Date(lastDate);
      donationDate.setHours(0, 0, 0, 0);
      const eligibleDate = new Date(donationDate);
      eligibleDate.setDate(eligibleDate.getDate() + cooldown);

      const daysUntilEligible = Math.round(
        (eligibleDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      const typeLabel = TYPE_LABELS[type] || type;
      let notification: { title: string; body: string; tag: string } | null = null;

      if (daysUntilEligible === 7) {
        // J-7 reminder
        notification = {
          title: "Bientot eligible !",
          body: `Dans 7 jours, tu pourras refaire un don de ${typeLabel}. Prepare-toi !`,
          tag: `j7-${type}-${lastDate}`,
        };
      } else if (daysUntilEligible === 0) {
        // Jour J
        notification = {
          title: "Tu peux donner aujourd'hui !",
          body: `Le delai pour le don de ${typeLabel} est ecoule. C'est le moment de sauver des vies !`,
          tag: `j0-${type}-${lastDate}`,
        };
      }

      if (!notification) continue;

      // Send push notifications
      const { data: subs } = await supabase
        .from("push_subscriptions")
        .select("endpoint, p256dh, auth")
        .eq("user_id", profile.id);

      if (subs) {
        for (const sub of subs) {
          try {
            await webpush.sendNotification(
              {
                endpoint: sub.endpoint,
                keys: { p256dh: sub.p256dh, auth: sub.auth },
              },
              JSON.stringify({
                title: notification.title,
                body: notification.body,
                tag: notification.tag,
                url: "/app",
              }),
            );
            pushSent++;
          } catch (err: unknown) {
            // Remove expired subscriptions
            if (err && typeof err === "object" && "statusCode" in err) {
              const statusCode = (err as { statusCode: number }).statusCode;
              if (statusCode === 404 || statusCode === 410) {
                await supabase
                  .from("push_subscriptions")
                  .delete()
                  .eq("endpoint", sub.endpoint);
              }
            }
          }
        }
      }

      // Send email
      if (resend) {
        // Get user email from auth
        const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
        const email = authUser?.user?.email;

        if (email) {
          try {
            const isJourJ = daysUntilEligible === 0;
            await resend.emails.send({
              from: "LifeDrop <notifications@lifedrop.app>",
              to: email,
              subject: notification.title,
              html: generateEmailHTML({
                name: profile.name || "Donneur",
                title: notification.title,
                body: notification.body,
                isJourJ,
                typeLabel,
              }),
            });
            emailSent++;
          } catch (emailErr) {
            console.error("Email error:", emailErr);
          }
        }
      }
    }
  }

  return NextResponse.json({
    ok: true,
    pushSent,
    emailSent,
    checkedProfiles: profiles.length,
  });
}

function generateEmailHTML(data: {
  name: string;
  title: string;
  body: string;
  isJourJ: boolean;
  typeLabel: string;
}) {
  const accentColor = data.isJourJ ? "#f87171" : "#fb923c";

  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f0f12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px">
      <div style="display:inline-block;width:56px;height:56px;border-radius:16px;background:rgba(248,113,113,0.15);line-height:56px;font-size:28px;color:#f87171">
        &#x1F4A7;
      </div>
      <div style="margin-top:12px">
        <span style="font-size:20px;font-weight:800;color:#fff">life</span>
        <span style="font-size:20px;font-weight:800;color:#f87171">drop</span>
      </div>
    </div>

    <!-- Card -->
    <div style="background:#1a1a22;border:1px solid ${accentColor}33;border-radius:16px;padding:32px;text-align:center">
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#fff">
        ${data.title}
      </h1>
      <p style="margin:0 0 24px;font-size:15px;color:#a1a1aa;line-height:1.6">
        Bonjour ${data.name},<br><br>
        ${data.body}
      </p>
      <a href="https://life-drop-gamma.vercel.app/app"
         style="display:inline-block;background:${accentColor};color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none">
        ${data.isJourJ ? "Enregistrer mon don" : "Voir mon tableau de bord"}
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:32px;font-size:12px;color:#52525b">
      <p style="margin:0 0 4px">LifeDrop - Suivi de don du sang</p>
      <p style="margin:0">Tu recois cet email car tu as active les notifications sur LifeDrop.</p>
    </div>
  </div>
</body>
</html>`;
}
