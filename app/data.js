// Data awal DompetKeluarga: satu rumah tangga di Jakarta, bulan Oktober dan
// November 2026. Semua angka dalam Rupiah. Data ini menjadi isi awal aplikasi;
// perubahan yang dibuat pengguna disimpan di localStorage oleh app.js.

export const HOUSEHOLD = {
  name: 'Keluarga Mahendra',
  members: 'Budi & Sari Mahendra, Jakarta',
  month: '2026-11',
};

export const CATEGORIES = [
  { id: 'belanja', name: 'Belanja Harian', color: '#0e7490', icon: '🛒', budget: 4000000 },
  { id: 'transport', name: 'Transport', color: '#b45309', icon: '🚌', budget: 1200000 },
  { id: 'tagihan', name: 'Tagihan & Utilitas', color: '#4d7c0f', icon: '💡', budget: 2500000 },
  { id: 'pendidikan', name: 'Pendidikan', color: '#6d28d9', icon: '📚', budget: 1800000 },
  { id: 'kesehatan', name: 'Kesehatan', color: '#be123c', icon: '🩺', budget: 800000 },
  { id: 'hiburan', name: 'Hiburan', color: '#db2777', icon: '🎬', budget: 700000 },
  { id: 'lainnya', name: 'Lainnya', color: '#64748b', icon: '📦', budget: 400000 },
];

export const MONTHS = {
  '2026-10': {
    label: 'Oktober 2026',
    income: [
      { id: 'i-okt-1', date: '2026-10-01', desc: 'Gaji Budi — PT Nusantara Digital', amount: 12500000 },
      { id: 'i-okt-2', date: '2026-10-01', desc: 'Gaji Sari — SDN 04 Cakung', amount: 6000000 },
      { id: 'i-okt-3', date: '2026-10-18', desc: 'Freelance desain Sari', amount: 750000 },
    ],
    expenses: [
      { id: 'e-okt-01', date: '2026-10-02', desc: 'Belanja mingguan — Pasar Cakung', category: 'belanja', amount: 486000 },
      { id: 'e-okt-02', date: '2026-10-03', desc: 'Token listrik PLN', category: 'tagihan', amount: 425000 },
      { id: 'e-okt-03', date: '2026-10-04', desc: 'Bensin motor — Pertamina', category: 'transport', amount: 120000 },
      { id: 'e-okt-04', date: '2026-10-05', desc: 'SPP sekolah Nara', category: 'pendidikan', amount: 950000 },
      { id: 'e-okt-05', date: '2026-10-06', desc: 'Belanja mingguan — Super Indo', category: 'belanja', amount: 612000 },
      { id: 'e-okt-06', date: '2026-10-08', desc: 'Internet IndiHome', category: 'tagihan', amount: 389000 },
      { id: 'e-okt-07', date: '2026-10-09', desc: 'Ojek online ke kantor', category: 'transport', amount: 86000 },
      { id: 'e-okt-08', date: '2026-10-11', desc: 'Buku & alat tulis Nara', category: 'pendidikan', amount: 238000 },
      { id: 'e-okt-09', date: '2026-10-12', desc: 'Belanja mingguan — Pasar Cakung', category: 'belanja', amount: 523000 },
      { id: 'e-okt-10', date: '2026-10-14', desc: 'Air PDAM', category: 'tagihan', amount: 186000 },
      { id: 'e-okt-11', date: '2026-10-15', desc: 'Periksa gigi Sari', category: 'kesehatan', amount: 350000 },
      { id: 'e-okt-12', date: '2026-10-17', desc: 'Nonton bioskop keluarga', category: 'hiburan', amount: 245000 },
      { id: 'e-okt-13', date: '2026-10-19', desc: 'Belanja mingguan — Super Indo', category: 'belanja', amount: 589000 },
      { id: 'e-okt-14', date: '2026-10-21', desc: 'Bensin mobil — Shell', category: 'transport', amount: 300000 },
      { id: 'e-okt-15', date: '2026-10-23', desc: 'Les piano Nara', category: 'pendidikan', amount: 400000 },
      { id: 'e-okt-16', date: '2026-10-25', desc: 'Belanja mingguan — Pasar Cakung', category: 'belanja', amount: 471000 },
      { id: 'e-okt-17', date: '2026-10-27', desc: 'Obat & vitamin', category: 'kesehatan', amount: 128000 },
      { id: 'e-okt-18', date: '2026-10-28', desc: 'Langganan streaming', category: 'hiburan', amount: 149000 },
      { id: 'e-okt-19', date: '2026-10-29', desc: 'Iuran RT & kebersihan', category: 'tagihan', amount: 150000 },
      { id: 'e-okt-20', date: '2026-10-30', desc: 'Servis motor', category: 'transport', amount: 275000 },
    ],
  },
  '2026-11': {
    label: 'November 2026',
    income: [
      { id: 'i-nov-1', date: '2026-11-01', desc: 'Gaji Budi — PT Nusantara Digital', amount: 12500000 },
      { id: 'i-nov-2', date: '2026-11-01', desc: 'Gaji Sari — SDN 04 Cakung', amount: 6000000 },
      { id: 'i-nov-3', date: '2026-11-14', desc: 'Freelance desain Sari', amount: 900000 },
    ],
    expenses: [
      { id: 'e-nov-01', date: '2026-11-01', desc: 'Belanja mingguan — Pasar Cakung', category: 'belanja', amount: 512000 },
      { id: 'e-nov-02', date: '2026-11-02', desc: 'Token listrik PLN', category: 'tagihan', amount: 438000 },
      { id: 'e-nov-03', date: '2026-11-03', desc: 'SPP sekolah Nara', category: 'pendidikan', amount: 950000 },
      { id: 'e-nov-04', date: '2026-11-04', desc: 'Bensin motor — Pertamina', category: 'transport', amount: 110000 },
      { id: 'e-nov-05', date: '2026-11-05', desc: 'Belanja mingguan — Super Indo', category: 'belanja', amount: 648000 },
      { id: 'e-nov-06', date: '2026-11-06', desc: 'Internet IndiHome', category: 'tagihan', amount: 389000 },
      { id: 'e-nov-07', date: '2026-11-08', desc: 'Ojek online ke kantor', category: 'transport', amount: 94000 },
      { id: 'e-nov-08', date: '2026-11-09', desc: 'Buku paket semester Nara', category: 'pendidikan', amount: 315000 },
      { id: 'e-nov-09', date: '2026-11-10', desc: 'Belanja mingguan — Pasar Cakung', category: 'belanja', amount: 534000 },
      { id: 'e-nov-10', date: '2026-11-11', desc: 'Cicilan KPR', category: 'tagihan', amount: 1250000 },
      { id: 'e-nov-11', date: '2026-11-12', desc: 'Periksa dokter anak — Nara demam', category: 'kesehatan', amount: 425000 },
      { id: 'e-nov-12', date: '2026-11-13', desc: 'Belanja mingguan — Super Indo', category: 'belanja', amount: 597000 },
      { id: 'e-nov-13', date: '2026-11-15', desc: 'Bensin mobil — Shell', category: 'transport', amount: 320000 },
      { id: 'e-nov-14', date: '2026-11-16', desc: 'Les piano Nara', category: 'pendidikan', amount: 400000 },
      { id: 'e-nov-15', date: '2026-11-17', desc: 'Makan malam keluarga — resto', category: 'hiburan', amount: 328000 },
      { id: 'e-nov-16', date: '2026-11-18', desc: 'Belanja mingguan — Pasar Cakung', category: 'belanja', amount: 489000 },
      { id: 'e-nov-17', date: '2026-11-19', desc: 'Air PDAM', category: 'tagihan', amount: 192000 },
      { id: 'e-nov-18', date: '2026-11-20', desc: 'Obat & vitamin', category: 'kesehatan', amount: 156000 },
      { id: 'e-nov-19', date: '2026-11-21', desc: 'Langganan streaming', category: 'hiburan', amount: 149000 },
      { id: 'e-nov-20', date: '2026-11-22', desc: 'Belanja mingguan — Super Indo', category: 'belanja', amount: 621000 },
      { id: 'e-nov-21', date: '2026-11-23', desc: 'Ojek online & parkir', category: 'transport', amount: 78000 },
      { id: 'e-nov-22', date: '2026-11-24', desc: 'Iuran RT & kebersihan', category: 'tagihan', amount: 150000 },
      { id: 'e-nov-23', date: '2026-11-25', desc: 'Kado ulang tahun Ibu', category: 'lainnya', amount: 275000 },
      { id: 'e-nov-24', date: '2026-11-26', desc: 'Belanja mingguan — Pasar Cakung', category: 'belanja', amount: 502000 },
    ],
  },
};

export const GOALS = [
  { id: 'g-darurat', name: 'Dana Darurat', note: '6 bulan pengeluaran pokok', target: 30000000, saved: 18750000, color: '#0e7490' },
  { id: 'g-liburan', name: 'Liburan Keluarga ke Bali', note: 'Berangkat Juni 2027', target: 12000000, saved: 7200000, color: '#b45309' },
  { id: 'g-rumah', name: 'DP Rumah Kedua', note: 'Untuk rumah orang tua', target: 150000000, saved: 42000000, color: '#4d7c0f' },
  { id: 'g-pendidikan', name: 'Pendidikan Nara', note: 'Biaya masuk SMP 2028', target: 25000000, saved: 9500000, color: '#6d28d9' },
];

// Anggaran bulanan per kategori (dapat diubah di halaman Anggaran).
export const BUDGETS = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget]));

export function seedState() {
  return {
    month: HOUSEHOLD.month,
    months: JSON.parse(JSON.stringify(MONTHS)),
    budgets: { ...BUDGETS },
    goals: JSON.parse(JSON.stringify(GOALS)),
    savingsRate: 3000000,
  };
}
