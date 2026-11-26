// Grafik kanvas polos (tanpa pustaka luar): donat pengeluaran per kategori dan
// batang perbandingan bulanan. Semua gambar digambar langsung di <canvas>.

export function drawDonut(canvas, slices, centerLabel) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);
  const total = slices.reduce((s, x) => s + x.value, 0);
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) / 2 - 8;
  const inner = r * 0.62;
  if (total <= 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = '#e2e8f0';
    ctx.fill();
  } else {
    let a = -Math.PI / 2;
    for (const s of slices) {
      const sweep = (s.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, a, a + sweep);
      ctx.closePath();
      ctx.fillStyle = s.color;
      ctx.fill();
      a += sweep;
    }
  }
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.font = '700 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(centerLabel, cx, cy - 8);
  ctx.fillStyle = '#64748b';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText('total belanja', cx, cy + 12);
}

export function drawBars(canvas, groups, labels) {
  // groups: [{ label, color, values: [..] }] — satu batang per grup per label.
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);
  const padL = 52;
  const padB = 26;
  const padT = 12;
  const plotW = w - padL - 12;
  const plotH = h - padT - padB;
  const max = Math.max(1, ...groups.flatMap((g) => g.values));
  const nice = Math.ceil(max / 1000000) * 1000000;
  ctx.strokeStyle = '#e2e8f0';
  ctx.fillStyle = '#64748b';
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= 4; i++) {
    const y = padT + (plotH * i) / 4;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(w - 12, y);
    ctx.stroke();
    const v = nice * (1 - i / 4);
    ctx.fillText(v >= 1000000 ? `Rp ${(v / 1000000).toLocaleString('id-ID')} jt` : `Rp ${v.toLocaleString('id-ID')}`, padL - 6, y);
  }
  const slot = plotW / labels.length;
  const barW = Math.min(26, (slot - 16) / groups.length);
  labels.forEach((lab, li) => {
    const x0 = padL + li * slot + (slot - barW * groups.length) / 2;
    groups.forEach((g, gi) => {
      const v = g.values[li] || 0;
      const bh = (v / nice) * plotH;
      const x = x0 + gi * barW;
      const y = padT + plotH - bh;
      ctx.fillStyle = g.color;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, bh, [3, 3, 0, 0]);
      ctx.fill();
    });
    ctx.fillStyle = '#334155';
    ctx.textAlign = 'center';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText(lab, padL + li * slot + slot / 2, h - 10);
  });
}

export function drawLine(canvas, points, color) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);
  const padL = 52;
  const padB = 24;
  const padT = 12;
  const plotW = w - padL - 12;
  const plotH = h - padT - padB;
  const max = Math.max(1, ...points.map((p) => p.value));
  const nice = Math.ceil(max / 1000000) * 1000000;
  ctx.strokeStyle = '#e2e8f0';
  ctx.fillStyle = '#64748b';
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= 4; i++) {
    const y = padT + (plotH * i) / 4;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(w - 12, y);
    ctx.stroke();
    ctx.fillText(`Rp ${((nice * (1 - i / 4)) / 1000000).toLocaleString('id-ID')} jt`, padL - 6, y);
  }
  const step = points.length > 1 ? plotW / (points.length - 1) : plotW;
  ctx.beginPath();
  points.forEach((p, i) => {
    const x = padL + i * step;
    const y = padT + plotH - (p.value / nice) * plotH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  points.forEach((p, i) => {
    const x = padL + i * step;
    const y = padT + plotH - (p.value / nice) * plotH;
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    // Label sumbu-x: rata kiri di titik pertama, rata kanan di titik terakhir,
    // supaya teks tidak terpotong di tepi kanvas.
    ctx.fillStyle = '#334155';
    ctx.textAlign = i === 0 ? 'left' : i === points.length - 1 ? 'right' : 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText(p.label, x, h - 8);
  });
}
