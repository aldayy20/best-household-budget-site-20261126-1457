// Tampilan tiap halaman DompetKeluarga. Setiap fungsi menerima state dan
// mengembalikan HTML; app.js yang memasang tombol dan menggambar grafik.

import { CATEGORIES } from './data.js';

export const rupiah = (n) => `Rp ${Math.round(n).toLocaleString('id-ID')}`;
export const shortRp = (n) =>
  n >= 1000000 ? `Rp ${(n / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt` : rupiah(n);

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export const catOf = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

export function monthTotals(state, key) {
  const m = state.months[key];
  const income = m.income.reduce((s, x) => s + x.amount, 0);
  const spent = m.expenses.reduce((s, x) => s + x.amount, 0);
  const byCat = {};
  for (const c of CATEGORIES) byCat[c.id] = 0;
  for (const e of m.expenses) byCat[e.category] = (byCat[e.category] || 0) + e.amount;
  return { income, spent, left: income - spent, byCat, count: m.expenses.length };
}

export function monthOptions(state) {
  return Object.keys(state.months)
    .sort()
    .map((k) => `<option value="${k}" ${k === state.month ? 'selected' : ''}>${esc(state.months[k].label)}</option>`)
    .join('');
}

function progressBar(spent, budget) {
  const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const cls = spent > budget ? 'over' : pct > 85 ? 'warn' : '';
  return `<div class="bar"><span class="${cls}" style="width:${pct}%"></span></div>
    <p class="bar-note">${rupiah(spent)} dari ${rupiah(budget)} · ${pct}%</p>`;
}

export function dashboard(state) {
  const t = monthTotals(state, state.month);
  const prevKey = Object.keys(state.months).sort().find((k) => k < state.month);
  const prev = prevKey ? monthTotals(state, prevKey) : null;
  const saved = state.goals.reduce((s, g) => s + g.saved, 0);
  const savePct = t.income > 0 ? Math.round(((t.income - t.spent) / t.income) * 100) : 0;
  const delta = prev ? Math.round(((t.spent - prev.spent) / prev.spent) * 100) : 0;
  const topCats = [...CATEGORIES]
    .map((c) => ({ ...c, spent: t.byCat[c.id] || 0 }))
    .sort((a, b) => b.spent - a.spent);
  const recent = [...state.months[state.month].expenses]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);
  return `
  <section class="hero">
    <div>
      <p class="eyebrow">${esc(state.months[state.month].label)}</p>
      <h1>Selamat pagi, ${esc('Keluarga Mahendra')}</h1>
      <p class="lede">Pengeluaran bulan ini ${delta >= 0 ? 'naik' : 'turun'} ${Math.abs(delta)}% dibanding bulan lalu.
      Sisa ${rupiah(t.left)} masih bisa dipakai sampai akhir bulan.</p>
    </div>
    <label class="month-pick">Bulan
      <select id="month-select">${monthOptions(state)}</select>
    </label>
  </section>

  <section class="stats">
    <article class="stat"><span>Pemasukan</span><strong>${rupiah(t.income)}</strong><em>3 sumber · gaji + freelance</em></article>
    <article class="stat"><span>Pengeluaran</span><strong>${rupiah(t.spent)}</strong><em>${t.count} transaksi bulan ini</em></article>
    <article class="stat good"><span>Sisa Uang</span><strong>${rupiah(t.left)}</strong><em>${savePct}% dari pemasukan tersisa</em></article>
    <article class="stat"><span>Total Tabungan Tujuan</span><strong>${rupiah(saved)}</strong><em>${state.goals.length} tujuan aktif</em></article>
  </section>

  <section class="grid-2">
    <article class="card">
      <h2>Pengeluaran per Kategori</h2>
      <div class="donut-wrap">
        <canvas id="donut" width="220" height="220" aria-label="Diagram donat pengeluaran per kategori"></canvas>
        <ul class="legend">
          ${topCats
            .map(
              (c) => `<li><i style="background:${c.color}"></i>${esc(c.name)}<b>${shortRp(c.spent)}</b></li>`,
            )
            .join('')}
        </ul>
      </div>
    </article>
    <article class="card">
      <h2>Anggaran Bulan Ini</h2>
      ${topCats
        .slice(0, 4)
        .map(
          (c) => `<div class="budget-row"><div class="budget-head"><span>${c.icon} ${esc(c.name)}</span><b>${rupiah(state.budgets[c.id] - c.spent >= 0 ? state.budgets[c.id] - c.spent : 0)} tersisa</b></div>${progressBar(c.spent, state.budgets[c.id])}</div>`,
        )
        .join('')}
      <p><a class="btn" href="#/anggaran">Lihat semua anggaran →</a></p>
    </article>
  </section>

  <section class="grid-2">
    <article class="card">
      <h2>Tujuan Tabungan</h2>
      ${state.goals
        .slice(0, 3)
        .map((g) => {
          const pct = Math.round((g.saved / g.target) * 100);
          return `<div class="goal-mini"><div class="budget-head"><span>${esc(g.name)}</span><b>${pct}%</b></div>
          <div class="bar"><span style="width:${pct}%;background:${g.color}"></span></div>
          <p class="bar-note">${rupiah(g.saved)} dari ${rupiah(g.target)}</p></div>`;
        })
        .join('')}
      <p><a class="btn" href="#/tujuan">Kelola tujuan tabungan →</a></p>
    </article>
    <article class="card">
      <h2>Transaksi Terakhir</h2>
      <ul class="tx-list">
        ${recent
          .map((e) => {
            const c = catOf(e.category);
            return `<li><span class="tx-ic" style="background:${c.color}22;color:${c.color}">${c.icon}</span>
            <span class="tx-desc">${esc(e.desc)}<small>${esc(e.date)} · ${esc(c.name)}</small></span>
            <b class="tx-amt">−${rupiah(e.amount)}</b></li>`;
          })
          .join('')}
      </ul>
      <p><a class="btn" href="#/transaksi">Semua transaksi →</a></p>
    </article>
  </section>`;
}

export function transactions(state, filter) {
  const m = state.months[state.month];
  const all = [...m.expenses].sort((a, b) => (a.date < b.date ? 1 : -1));
  const q = (filter.q || '').toLowerCase();
  const list = all.filter(
    (e) =>
      (!filter.cat || e.category === filter.cat) &&
      (!q || e.desc.toLowerCase().includes(q) || catOf(e.category).name.toLowerCase().includes(q)),
  );
  const total = list.reduce((s, e) => s + e.amount, 0);
  return `
  <section class="page-head">
    <div><p class="eyebrow">${esc(m.label)}</p><h1>Transaksi</h1>
    <p class="lede">${list.length} transaksi · total ${rupiah(total)}</p></div>
    <button class="btn primary" id="show-add">+ Tambah Transaksi</button>
  </section>

  <form id="add-form" class="card form-card" hidden>
    <h2>Transaksi Baru</h2>
    <div class="form-grid">
      <label>Tanggal<input type="date" name="date" value="2026-11-26" required></label>
      <label>Deskripsi<input type="text" name="desc" placeholder="cth. Belanja mingguan — Pasar" required></label>
      <label>Kategori<select name="category">${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></label>
      <label>Jumlah (Rp)<input type="number" name="amount" min="1000" step="1000" placeholder="500000" required></label>
    </div>
    <div class="form-actions"><button class="btn primary" type="submit">Simpan transaksi</button>
    <button class="btn" type="button" id="hide-add">Batal</button></div>
  </form>

  <section class="card filters">
    <div class="chips" id="cat-chips">
      <button data-cat="" class="${!filter.cat ? 'on' : ''}">Semua</button>
      ${CATEGORIES.map((c) => `<button data-cat="${c.id}" class="${filter.cat === c.id ? 'on' : ''}">${c.icon} ${esc(c.name)}</button>`).join('')}
    </div>
    <input type="search" id="tx-search" placeholder="Cari transaksi…" value="${esc(filter.q || '')}">
  </section>

  <section class="card">
    ${list.length === 0
      ? '<p class="empty">Tidak ada transaksi yang cocok. Ubah filter atau tambah transaksi baru.</p>'
      : `<ul class="tx-list full">
        ${list
          .map((e) => {
            const c = catOf(e.category);
            return `<li><span class="tx-ic" style="background:${c.color}22;color:${c.color}">${c.icon}</span>
            <span class="tx-desc">${esc(e.desc)}<small>${esc(e.date)} · ${esc(c.name)}</small></span>
            <b class="tx-amt">−${rupiah(e.amount)}</b>
            <span class="tx-actions"><button class="mini" data-edit="${e.id}">Ubah</button><button class="mini danger" data-del="${e.id}">Hapus</button></span></li>`;
          })
          .join('')}
      </ul>`}
  </section>`;
}

export function budgets(state) {
  const t = monthTotals(state, state.month);
  const totalBudget = Object.values(state.budgets).reduce((s, v) => s + v, 0);
  return `
  <section class="page-head">
    <div><p class="eyebrow">${esc(state.months[state.month].label)}</p><h1>Anggaran</h1>
    <p class="lede">Total anggaran ${rupiah(totalBudget)} · terpakai ${rupiah(t.spent)} (${Math.round((t.spent / totalBudget) * 100)}%) · sisa ${rupiah(totalBudget - t.spent)}</p></div>
    <label class="month-pick">Bulan
      <select id="month-select">${monthOptions(state)}</select>
    </label>
  </section>
  <section class="budget-grid">
    ${CATEGORIES.map((c) => {
      const spent = t.byCat[c.id] || 0;
      const budget = state.budgets[c.id];
      const left = budget - spent;
      return `<article class="card budget-card">
        <div class="budget-head"><span class="cat-name"><i style="background:${c.color}"></i>${c.icon} ${esc(c.name)}</span>
        <b class="${left < 0 ? 'neg' : 'pos'}">${left < 0 ? 'Lebih ' + rupiah(-left) : rupiah(left) + ' tersisa'}</b></div>
        ${progressBar(spent, budget)}
        <form class="budget-edit" data-cat="${c.id}">
          <label>Ubah anggaran <input type="number" name="budget" min="0" step="50000" value="${budget}"> </label>
          <button class="btn" type="submit">Simpan</button>
        </form>
      </article>`;
    }).join('')}
  </section>
  <section class="card tip">
    <h2>Tips bulan ini</h2>
    <p>Belanja Harian sudah 98% dari anggaran dan Tagihan &amp; Utilitas 97% karena cicilan KPR jatuh tempo tanggal 11 —
    empat hari terakhir bulan ini sebaiknya masak di rumah saja.
    Sisihkan ${rupiah(state.savingsRate)} untuk tabungan di awal bulan berikutnya agar target Dana Darurat tercapai pada Maret 2027.</p>
  </section>`;
}

export function goals(state) {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  return `
  <section class="page-head">
    <div><p class="eyebrow">Menabung bersama</p><h1>Tujuan Tabungan</h1>
    <p class="lede">${rupiah(totalSaved)} dari ${rupiah(totalTarget)} terkumpul (${Math.round((totalSaved / totalTarget) * 100)}%) di ${state.goals.length} tujuan.</p></div>
    <button class="btn primary" id="show-goal">+ Tujuan Baru</button>
  </section>

  <form id="goal-form" class="card form-card" hidden>
    <h2>Tujuan Baru</h2>
    <div class="form-grid">
      <label>Nama tujuan<input type="text" name="name" placeholder="cth. Umroh 2027" required></label>
      <label>Catatan<input type="text" name="note" placeholder="cth. Berangkat Desember 2027"></label>
      <label>Target (Rp)<input type="number" name="target" min="100000" step="100000" placeholder="10000000" required></label>
      <label>Sudah terkumpul (Rp)<input type="number" name="saved" min="0" step="100000" value="0"></label>
    </div>
    <div class="form-actions"><button class="btn primary" type="submit">Simpan tujuan</button>
    <button class="btn" type="button" id="hide-goal">Batal</button></div>
  </form>

  <section class="goal-grid">
    ${state.goals
      .map((g) => {
        const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
        const eta = g.target > g.saved ? Math.ceil((g.target - g.saved) / Math.max(1, state.savingsRate / state.goals.length)) : 0;
        return `<article class="card goal-card">
        <h2>${esc(g.name)}</h2>
        <p class="muted">${esc(g.note)}</p>
        <div class="goal-big"><strong>${pct}%</strong><span>${rupiah(g.saved)} dari ${rupiah(g.target)}</span></div>
        <div class="bar tall"><span style="width:${pct}%;background:${g.color}"></span></div>
        <p class="bar-note">${eta > 0 ? `Kurang ${rupiah(g.target - g.saved)} · tercapai sekitar ${eta} bulan lagi` : 'Tujuan tercapai — selamat!'}</p>
        <form class="goal-add" data-goal="${g.id}">
          <label>Tambah dana <input type="number" name="amount" min="10000" step="10000" placeholder="250000"> </label>
          <button class="btn" type="submit">Tambah</button>
        </form>
      </article>`;
      })
      .join('')}
  </section>`;
}

export function reports(state) {
  const keys = Object.keys(state.months).sort();
  const totals = keys.map((k) => monthTotals(state, k));
  const cur = totals[totals.length - 1];
  const prev = totals[0];
  const rows = CATEGORIES.map((c) => ({
    name: c.name,
    color: c.color,
    now: cur.byCat[c.id] || 0,
    then: prev.byCat[c.id] || 0,
  })).sort((a, b) => b.now - a.now);
  const biggest = [...state.months[state.month].expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
  const change = (now, then) => (then > 0 ? Math.round(((now - then) / then) * 100) : 0);
  const insights = [];
  const belanja = rows.find((r) => r.name === 'Belanja Harian');
  insights.push(
    `Belanja Harian ${change(belanja.now, belanja.then) >= 0 ? 'naik' : 'turun'} ${Math.abs(change(belanja.now, belanja.then))}% dibanding ${esc(prev ? state.months[keys[0]].label : '')} (${rupiah(belanja.then)} → ${rupiah(belanja.now)}).`,
  );
  const transport = rows.find((r) => r.name === 'Transport');
  insights.push(
    `Transport ${change(transport.now, transport.then) >= 0 ? 'naik' : 'turun'} ${Math.abs(change(transport.now, transport.then))}% — ojek online lebih sering dipakai minggu kedua.`,
  );
  insights.push(
    `Keluarga Mahendra menabung ${rupiah(cur.income - cur.spent)} pada ${esc(state.months[state.month].label)}, setara ${Math.round(((cur.income - cur.spent) / cur.income) * 100)}% pemasukan.`,
  );
  insights.push(
    `Pengeluaran terbesar bulan ini adalah ${esc(biggest[0].desc)} sebesar ${rupiah(biggest[0].amount)} pada ${esc(biggest[0].date)}.`,
  );
  return `
  <section class="page-head">
    <div><p class="eyebrow">Oktober vs November 2026</p><h1>Laporan &amp; Wawasan</h1>
    <p class="lede">Bandingkan dua bulan terakhir, lihat ke mana uang pergi, dan baca ringkasannya.</p></div>
    <label class="month-pick">Bulan
      <select id="month-select">${monthOptions(state)}</select>
    </label>
  </section>

  <section class="grid-2">
    <article class="card">
      <h2>Pemasukan vs Pengeluaran</h2>
      <canvas id="income-chart" width="520" height="240" aria-label="Grafik garis pemasukan dan pengeluaran"></canvas>
      <ul class="legend inline">
        <li><i style="background:#15803d"></i>Pemasukan</li>
        <li><i style="background:#be123c"></i>Pengeluaran</li>
      </ul>
      <p class="muted">Pemasukan ${rupiah(cur.income)} · pengeluaran ${rupiah(cur.spent)} · selisih ${rupiah(cur.left)}.</p>
    </article>
    <article class="card">
      <h2>Perbandingan per Kategori</h2>
      <canvas id="compare-chart" width="520" height="240" aria-label="Grafik batang perbandingan kategori Oktober dan November"></canvas>
      <ul class="legend inline">
        <li><i style="background:#94a3b8"></i>Oktober</li>
        <li><i style="background:#0e7490"></i>November</li>
      </ul>
    </article>
  </section>

  <section class="grid-2">
    <article class="card">
      <h2>Wawasan Otomatis</h2>
      <ul class="insights">${insights.map((s) => `<li>${s}</li>`).join('')}</ul>
    </article>
    <article class="card">
      <h2>5 Pengeluaran Terbesar — ${esc(state.months[state.month].label)}</h2>
      <ol class="ranked">
        ${biggest
          .map(
            (e) => `<li><span>${esc(e.desc)}</span><b>${rupiah(e.amount)}</b><small>${esc(e.date)} · ${esc(catOf(e.category).name)}</small></li>`,
          )
          .join('')}
      </ol>
    </article>
  </section>

  <section class="card">
    <h2>Ringkasan per Kategori</h2>
    <table class="sum-table">
      <thead><tr><th>Kategori</th><th>Oktober</th><th>November</th><th>Perubahan</th></tr></thead>
      <tbody>
        ${rows
          .map((r) => {
            const d = change(r.now, r.then);
            return `<tr><td><i style="background:${r.color}"></i>${esc(r.name)}</td><td>${rupiah(r.then)}</td><td>${rupiah(r.now)}</td><td class="${d > 0 ? 'neg' : 'pos'}">${d > 0 ? '+' : ''}${d}%</td></tr>`;
          })
          .join('')}
      </tbody>
    </table>
  </section>`;
}

export function missing() {
  return `<section class="card"><h1>Halaman tidak ditemukan</h1>
  <p>Tidak ada halaman di alamat ini. <a href="#/">Kembali ke Dashboard</a>.</p></section>`;
}
