/**
 * Client-side screenshot generator for Kim's Game.
 * Renders an attractive, high-resolution notebook report card
 * directly to a PNG Blob / File using an HTML5 Canvas.
 * No external dependencies required.
 */
export async function createReportScreenshotBlob({
  playerName = "Observer",
  _level = 1,
  tier = "Beginner",
  levelName = "",
  score = 0,
  accuracy = 0,
  correctAnswers = 0,
  totalAnswers = 0,
  roundsCount = 1,
  ratingTitle = "Sharp-Eyed Observer",
  ratingBadge = "🔍",
}) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // High resolution for retina / crisp mobile display
  const width = 800;
  const height = 940;
  canvas.width = width;
  canvas.height = height;

  // 1. Paper Cream Background
  ctx.fillStyle = "#FFF9EF";
  ctx.fillRect(0, 0, width, height);

  // Subtle notebook dot grid pattern
  ctx.fillStyle = "#ded8cb";
  for (let x = 24; x < width; x += 24) {
    for (let y = 24; y < height; y += 24) {
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Notebook Sheet Border & Drop Shadow
  const pad = 36;
  const sheetW = width - pad * 2;
  const sheetH = height - pad * 2;

  // Shadow
  ctx.fillStyle = "#252525";
  ctx.beginPath();
  ctx.roundRect(pad + 8, pad + 8, sheetW, sheetH, 20);
  ctx.fill();

  // White Card Surface
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.roundRect(pad, pad, sheetW, sheetH, 20);
  ctx.fill();

  // Ink Border
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#252525";
  ctx.stroke();

  // 3. Spiral Binding Header
  const holeY = pad + 18;
  ctx.fillStyle = "#FFE28A";
  ctx.beginPath();
  ctx.roundRect(pad + 20, pad + 4, sheetW - 40, 24, 6);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#252525";
  ctx.stroke();

  // Spiral Holes
  ctx.fillStyle = "#252525";
  for (let hx = pad + 40; hx < pad + sheetW - 40; hx += 48) {
    ctx.beginPath();
    ctx.arc(hx, holeY, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Header & Branding
  ctx.fillStyle = "#252525";
  ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("KIM'S GAME • OFFICIAL OBSERVER REPORT CARD", pad + 40, pad + 65);

  ctx.fillStyle = "#77BCE8";
  ctx.beginPath();
  ctx.roundRect(pad + sheetW - 140, pad + 48, 100, 26, 13);
  ctx.fill();
  ctx.strokeStyle = "#252525";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#252525";
  ctx.font = "bold 11px 'Plus Jakarta Sans', sans-serif";
  const badgeLabel = levelName ? `${levelName}` : `${tier}`;
  // Measure and center the badge text
  ctx.font = "bold 10px 'Plus Jakarta Sans', sans-serif";
  const badgeMetrics = ctx.measureText(badgeLabel);
  const badgePillW = Math.max(100, badgeMetrics.width + 28);
  // Re-draw the pill at the correct width
  ctx.fillStyle = "#77BCE8";
  ctx.clearRect(pad + sheetW - 140, pad + 48, 140, 26);
  // Redraw background in cleared area
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(pad + sheetW - 140, pad + 48, 140, 26);
  ctx.fillStyle = "#77BCE8";
  ctx.beginPath();
  ctx.roundRect(pad + sheetW - badgePillW - 20, pad + 48, badgePillW, 26, 13);
  ctx.fill();
  ctx.strokeStyle = "#252525";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#252525";
  ctx.font = "bold 10px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(badgeLabel, pad + sheetW - badgePillW - 6, pad + 65);

  // Red margin line
  ctx.beginPath();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = "#FF8D80";
  ctx.lineWidth = 2;
  ctx.moveTo(pad + 30, pad + 85);
  ctx.lineTo(pad + sheetW - 30, pad + 85);
  ctx.stroke();
  ctx.setLineDash([]);

  // 5. Title & Player
  ctx.fillStyle = "#252525";
  ctx.font = "bold 34px 'Space Grotesk', sans-serif";
  ctx.fillText("Observer: " + playerName, pad + 40, pad + 130);

  ctx.fillStyle = "#64675f";
  ctx.font = "600 15px 'Plus Jakarta Sans', sans-serif";
  const desc = `Completed ${levelName || tier} • ${roundsCount} Round${roundsCount > 1 ? "s" : ""}`;
  ctx.fillText(desc, pad + 40, pad + 158);

  // 6. Rating Stamp
  const stampX = pad + 40;
  const stampY = pad + 185;
  ctx.save();
  ctx.translate(stampX, stampY);
  ctx.rotate(-0.03);
  ctx.fillStyle = "#eef6fc";
  ctx.beginPath();
  ctx.roundRect(0, 0, 290, 42, 21);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#0b69a3";
  ctx.setLineDash([3, 3]);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = "bold 18px 'Patrick Hand', sans-serif";
  ctx.fillStyle = "#0b69a3";
  ctx.fillText(`${ratingBadge}  ${ratingTitle}`, 16, 27);
  ctx.restore();

  // 7. Main Score Box
  const scoreBoxY = pad + 250;
  ctx.fillStyle = "#FFF9EF";
  ctx.beginPath();
  ctx.roundRect(pad + 40, scoreBoxY, sheetW - 80, 140, 18);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#252525";
  ctx.stroke();

  // Score shadow
  ctx.fillStyle = "#252525";
  ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("TOTAL SCORE EARNED", pad + 65, scoreBoxY + 36);

  ctx.fillStyle = "#252525";
  ctx.font = "bold 76px 'Space Grotesk', sans-serif";
  ctx.fillText(String(score), pad + 65, scoreBoxY + 110);

  ctx.fillStyle = "#64675f";
  ctx.font = "bold 18px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("POINTS", pad + 250, scoreBoxY + 105);

  // 8. Stats Triplet
  const statY = pad + 420;
  const statW = (sheetW - 100) / 3;

  const stats = [
    { label: "ACCURACY", val: `${Math.round(accuracy)}%`, color: "#A9DCC3" },
    { label: "WORDS RECALLED", val: `${correctAnswers} / ${totalAnswers}`, color: "#FFE28A" },
    { label: "DIFFICULTY", val: levelName || tier, color: "#C8B8F0" },
  ];

  stats.forEach((st, idx) => {
    const sx = pad + 40 + idx * (statW + 10);
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.roundRect(sx, statY, statW, 100, 14);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#252525";
    ctx.stroke();

    // Top color strip
    ctx.fillStyle = st.color;
    ctx.beginPath();
    ctx.roundRect(sx + 2, statY + 2, statW - 4, 8, [12, 12, 0, 0]);
    ctx.fill();

    ctx.fillStyle = "#64675f";
    ctx.font = "bold 11px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(st.label, sx + 14, statY + 35);

    ctx.fillStyle = "#252525";
    ctx.font = "bold 26px 'Space Grotesk', sans-serif";
    ctx.fillText(st.val, sx + 14, statY + 75);
  });

  // 9. Method Note Box
  const noteY = pad + 545;
  ctx.fillStyle = "#FFFDF8";
  ctx.beginPath();
  ctx.roundRect(pad + 40, noteY, sheetW - 80, 130, 14);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#ded8cb";
  ctx.stroke();

  ctx.fillStyle = "#252525";
  ctx.font = "bold 14px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("📌 OBSERVER PERFORMANCE ASSESSMENT", pad + 60, noteY + 34);

  ctx.fillStyle = "#64675f";
  ctx.font = "500 13px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(
    "Grounded in active recall and working memory limits (Miller, 1956; Roediger & Karpicke, 2006).",
    pad + 60,
    noteY + 62
  );
  ctx.fillText(
    "Observation speed and chunking strategies sharpen with deliberate, daily practice.",
    pad + 60,
    noteY + 86
  );

  // 10. Watermark & Date Footer
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  ctx.fillStyle = "#8c887e";
  ctx.font = "bold 12px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(`VERIFIED ON ${dateStr.toUpperCase()} • KIM’S GAME`, pad + 40, pad + sheetH - 45);

  ctx.font = "italic 14px 'Patrick Hand', sans-serif";
  ctx.fillText("“Look closely. Remember more.”", pad + sheetW - 240, pad + sheetH - 45);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/png");
  });
}
