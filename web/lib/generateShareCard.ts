import type { DonationType } from "@shared/types";

interface ShareCardData {
  donationType: DonationType;
  typeLabel: string;
  livesThisDon: number;
  totalLives: number;
  donorName: string;
  badgeLabel?: string;
}

const TYPE_COLORS: Record<DonationType, string> = {
  whole_blood: "#f87171",
  platelets: "#fb923c",
  plasma: "#60a5fa",
};

export async function generateShareCard(data: ShareCardData): Promise<Blob> {
  const W = 1080;
  const H = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // -- Background --
  ctx.fillStyle = "#0f0f12";
  ctx.fillRect(0, 0, W, H);

  // Subtle gradient overlay
  const bgGrad = ctx.createRadialGradient(W / 2, H * 0.35, 0, W / 2, H * 0.35, W * 0.7);
  bgGrad.addColorStop(0, "rgba(248,113,113,0.08)");
  bgGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // -- Decorative circles --
  ctx.strokeStyle = "rgba(248,113,113,0.08)";
  ctx.lineWidth = 1.5;
  [200, 340, 480].forEach((r) => {
    ctx.beginPath();
    ctx.arc(W / 2, H * 0.38, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // -- Drop shape (logo) --
  const dropX = W / 2;
  const dropY = 200;
  const dropScale = 1.8;

  const grad = ctx.createLinearGradient(dropX, dropY - 40 * dropScale, dropX, dropY + 35 * dropScale);
  grad.addColorStop(0, "#f87171");
  grad.addColorStop(1, "#fb923c");

  ctx.save();
  ctx.translate(dropX, dropY);
  ctx.scale(dropScale, dropScale);
  ctx.beginPath();
  ctx.moveTo(0, -38);
  ctx.bezierCurveTo(0, -38, -26, -6, -26, 10);
  ctx.bezierCurveTo(-26, 24, -14, 35, 0, 35);
  ctx.bezierCurveTo(14, 35, 26, 24, 26, 10);
  ctx.bezierCurveTo(26, -6, 0, -38, 0, -38);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  // Dashed ring around drop
  ctx.save();
  ctx.strokeStyle = "rgba(248,113,113,0.3)";
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 7]);
  ctx.beginPath();
  ctx.arc(dropX, dropY, 75, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // -- "lifedrop" brand --
  ctx.textAlign = "center";
  ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillText("life", dropX - 36, dropY + 110);
  ctx.fillStyle = "#f87171";
  ctx.fillText("drop", dropX + 32, dropY + 110);

  // -- Donor name --
  ctx.font = "600 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillText(data.donorName, W / 2, 365);

  // -- Donation type pill --
  const typeColor = TYPE_COLORS[data.donationType];
  const pillText = `Don de ${data.typeLabel}`;
  ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const pillWidth = ctx.measureText(pillText).width + 48;
  const pillX = (W - pillWidth) / 2;
  const pillY = 395;

  roundRect(ctx, pillX, pillY, pillWidth, 48, 24);
  ctx.fillStyle = typeColor + "20";
  ctx.fill();
  ctx.strokeStyle = typeColor + "60";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = typeColor;
  ctx.textAlign = "center";
  ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText(pillText, W / 2, pillY + 32);

  // -- Big impact number --
  ctx.font = "800 140px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const numGrad = ctx.createLinearGradient(W / 2 - 100, 500, W / 2 + 100, 680);
  numGrad.addColorStop(0, "#f87171");
  numGrad.addColorStop(1, "#fb923c");
  ctx.fillStyle = numGrad;
  ctx.textAlign = "center";
  ctx.fillText(String(data.totalLives), W / 2, 600);

  // -- "vies potentiellement sauvees" --
  ctx.font = "600 30px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillText("vies potentiellement sauvees", W / 2, 650);

  // -- This donation stat --
  ctx.font = "500 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillText(`+${data.livesThisDon} vie${data.livesThisDon > 1 ? "s" : ""} avec ce don`, W / 2, 695);

  // -- Badge section (if any) --
  let badgeBottom = 720;
  if (data.badgeLabel) {
    badgeBottom = 790;
    const badgeW = 320;
    const badgeH = 56;
    const bx = (W - badgeW) / 2;
    const by = 740;

    roundRect(ctx, bx, by, badgeW, badgeH, 16);
    ctx.fillStyle = "rgba(251,191,36,0.08)";
    ctx.fill();
    ctx.strokeStyle = "rgba(251,191,36,0.3)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Badge : ${data.badgeLabel}`, W / 2, by + 36);
  }

  // -- CTA bar at bottom --
  const ctaY = H - 110;
  ctx.fillStyle = "rgba(248,113,113,0.06)";
  ctx.fillRect(0, ctaY - 20, W, 130);

  ctx.strokeStyle = "rgba(248,113,113,0.15)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, ctaY - 20);
  ctx.lineTo(W, ctaY - 20);
  ctx.stroke();

  ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillStyle = "#f87171";
  ctx.textAlign = "center";
  ctx.fillText("Rejoins le mouvement sur LifeDrop", W / 2, ctaY + 20);

  ctx.font = "500 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillText("lifedrop.fr", W / 2, ctaY + 55);

  // Convert to blob
  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
