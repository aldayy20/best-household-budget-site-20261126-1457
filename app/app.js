// DompetKeluarga — router hash, state, dan semua interaksi.
// Rute: #/ (Dashboard), #/transaksi, #/anggaran, #/tujuan, #/laporan.
// window.__shotReady false selama halaman dirender, true setelah tampil,
// supaya skrip screenshot tahu kapan memotret.

import { seedState, CATEGORIES } from './data.js';
import { dashboard, transactions, budgets, goals, reports, missing, monthTotals, rupiah } from './views.js';
import { drawDonut, drawBars, drawLine } from './charts.js';

const KEY = 'dompetkeluarga-v1';
const app = document.getElementById('app');

function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s.months && s.budgets && s.goals) return s;
    }
  } catch {
    // localStorage tidak tersedia: pakai data awal.
  }
  return seedState();
}

let state = loadState();
let txFilter = { cat: '', q: '' };

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Penyimpanan penuh atau diblokir: perubahan tetap tampil di sesi ini.
  }
}

function currentRoute() {
  const h = location.hash.replace(/^#\/?/, '');
  return h.split('/')[0] || '';
}

function drawCharts(route) {
  if (route === '') {
    const donut = document.getElementById('donut');
    if (donut) {
      const t = monthTotals(state, state.month);
      const slices = CATEGORIES.map((c) => ({ value: t.byCat[c.id] || 0, color: c.color }));
      drawDonut(donut, slices, 'Rp ' + (t.spent / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' jt');
    }
  }
  if (route === 'laporan') {
    const keys = Object.keys(state.months).sort();
    const totals = keys.map((k) => monthTotals(state, k));
    const income = document.getElementById('income-chart');
    if (income) {
      drawLine(
        income,
        keys.map((k, i) => ({ label: state.months[k].label.split(' ')[0], value: totals[i].income })),
        '#15803d',
      );
      // Garis kedua (pengeluaran) digambar di atas kanvas yang sama dengan warna lain:
      const ctx = income.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const w = income.clientWidth;
      const h = income.clientHeight;
      const padL = 52;
      const padB = 24;
      const padT = 12;
      const plotW = w - padL - 12;
      const plotH = h - padT - padB;
      const max = Math.max(1, ...totals.map((t) => t.income));
      const nice = Math.ceil(max / 1000000) * 1000000;
      const step = totals.length > 1 ? plotW / (totals.length - 1) : plotW;
      ctx.beginPath();
      totals.forEach((t, i) => {
        const x = padL + i * step;
        const y = padT + plotH - (t.spent / nice) * plotH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#be123c';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      totals.forEach((t, i) => {
        const x = padL + i * step;
        const y = padT + plotH - (t.spent / nice) * plotH;
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#be123c';
        ctx.fill();
      });
      void dpr;
    }
    const cmp = document.getElementById('compare-chart');
    if (cmp) {
      const cur = totals[totals.length - 1];
      const prev = totals[0];
      const top = [...CATEGORIES]
        .map((c) => ({ name: c.name, now: cur.byCat[c.id] || 0, then: prev.byCat[c.id] || 0 }))
        .sort((a, b) => b.now - a.now)
        .slice(0, 5);
      drawBars(
        cmp,
        [
          { label: 'Oktober', color: '#94a3b8', values: top.map((x) => x.then) },
          { label: 'November', color: '#0e7490', values: top.map((x) => x.now) },
        ],
        top.map((x) => x.name.split(' ')[0]),
      );
    }
  }
}

function bindCommon() {
  const sel = document.getElementById('month-select');
  if (sel) {
    sel.addEventListener('change', () => {
      state.month = sel.value;
      save();
      render();
    });
  }
  document.querySelectorAll('[data-cat]').forEach((b) => {
    if (b.tagName === 'BUTTON') {
      b.addEventListener('click', () => {
        txFilter.cat = b.dataset.cat;
        render();
      });
    }
  });
}

function bindTransactions() {
  const show = document.getElementById('show-add');
  const form = document.getElementById('add-form');
  const hide = document.getElementById('hide-add');
  if (show && form) {
    show.addEventListener('click', () => {
      form.hidden = false;
      show.hidden = true;
      form.querySelector('input[name="desc"]').focus();
    });
  }
  if (hide && form && show) {
    hide.addEventListener('click', () => {
      form.hidden = true;
      show.hidden = false;
    });
  }
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      const amount = Number(fd.get('amount'));
      if (!fd.get('desc') || !(amount > 0)) return;
      state.months[state.month].expenses.push({
        id: `e-${Date.now()}`,
        date: String(fd.get('date') || '2026-11-26'),
        desc: String(fd.get('desc')),
        category: String(fd.get('category')),
        amount,
      });
      save();
      render();
    });
  }
  const search = document.getElementById('tx-search');
  if (search) {
    search.addEventListener('input', () => {
      txFilter.q = search.value;
      const pos = search.selectionStart;
      render();
      const again = document.getElementById('tx-search');
      if (again) {
        again.focus();
        again.setSelectionRange(pos, pos);
      }
    });
  }
  document.querySelectorAll('[data-del]').forEach((b) => {
    b.addEventListener('click', () => {
      const m = state.months[state.month];
      m.expenses = m.expenses.filter((e) => e.id !== b.dataset.del);
      save();
      render();
    });
  });
  document.querySelectorAll('[data-edit]').forEach((b) => {
    b.addEventListener('click', () => {
      const e = state.months[state.month].expenses.find((x) => x.id === b.dataset.edit);
      if (!e) return;
      const amount = window.prompt(`Ubah jumlah untuk "${e.desc}" (Rp):`, String(e.amount));
      if (amount === null) return;
      const n = Number(String(amount).replace(/[^0-9]/g, ''));
      if (n > 0) {
        e.amount = n;
        save();
        render();
      }
    });
  });
}

function bindBudgets() {
  document.querySelectorAll('.budget-edit').forEach((f) => {
    f.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const v = Number(new FormData(f).get('budget'));
      if (v >= 0) {
        state.budgets[f.dataset.cat] = v;
        save();
        render();
      }
    });
  });
}

function bindGoals() {
  const show = document.getElementById('show-goal');
  const form = document.getElementById('goal-form');
  const hide = document.getElementById('hide-goal');
  if (show && form) {
    show.addEventListener('click', () => {
      form.hidden = false;
      show.hidden = true;
    });
  }
  if (hide && form && show) {
    hide.addEventListener('click', () => {
      form.hidden = true;
      show.hidden = false;
    });
  }
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      const target = Number(fd.get('target'));
      if (!fd.get('name') || !(target > 0)) return;
      const colors = ['#0e7490', '#b45309', '#4d7c0f', '#6d28d9', '#be123c'];
      state.goals.push({
        id: `g-${Date.now()}`,
        name: String(fd.get('name')),
        note: String(fd.get('note') || ''),
        target,
        saved: Number(fd.get('saved') || 0),
        color: colors[state.goals.length % colors.length],
      });
      save();
      render();
    });
  }
  document.querySelectorAll('.goal-add').forEach((f) => {
    f.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const v = Number(new FormData(f).get('amount'));
      const g = state.goals.find((x) => x.id === f.dataset.goal);
      if (g && v > 0) {
        g.saved += v;
        save();
        render();
      }
    });
  });
}

function render() {
  window.__shotReady = false;
  const route = currentRoute();
  const titles = {
    '': 'DompetKeluarga — Anggaran Keluarga Mahendra',
    transaksi: 'Transaksi | DompetKeluarga',
    anggaran: 'Anggaran | DompetKeluarga',
    tujuan: 'Tujuan Tabungan | DompetKeluarga',
    laporan: 'Laporan & Wawasan | DompetKeluarga',
  };
  document.title = titles[route] ?? 'DompetKeluarga';
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === route);
  });
  if (route === '') app.innerHTML = dashboard(state);
  else if (route === 'transaksi') app.innerHTML = transactions(state, txFilter);
  else if (route === 'anggaran') app.innerHTML = budgets(state);
  else if (route === 'tujuan') app.innerHTML = goals(state);
  else if (route === 'laporan') app.innerHTML = reports(state);
  else app.innerHTML = missing();
  bindCommon();
  if (route === 'transaksi') bindTransactions();
  if (route === 'anggaran') bindBudgets();
  if (route === 'tujuan') bindGoals();
  drawCharts(route);
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

document.getElementById('reset-data').addEventListener('click', () => {
  if (window.confirm('Kembalikan semua data ke contoh awal Keluarga Mahendra?')) {
    state = seedState();
    txFilter = { cat: '', q: '' };
    save();
    render();
  }
});

window.addEventListener('hashchange', render);
render();
