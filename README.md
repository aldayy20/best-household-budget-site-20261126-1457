[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/aldayy20/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/aldayy20/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

# DompetKeluarga — Anggaran Keluarga Mahendra

Entry for the [make.fun bounty "Make the best household budget site"](https://make.fun/bounty/best-household-budget-site-20261126-1457) ($50 in USDC).

DompetKeluarga adalah situs anggaran rumah tangga yang berjalan sepenuhnya
luring dari berkas statis. Dibuat untuk Keluarga Mahendra di Jakarta: Budi dan
Sari mencatat pemasukan dan pengeluaran, menjaga anggaran tiap kategori,
menabung untuk empat tujuan, dan membandingkan bulan berjalan dengan bulan lalu
— semuanya dalam Rupiah, tanpa akun dan tanpa data yang keluar dari perangkat.

## Halaman

- **Dashboard** — ringkasan bulan: pemasukan, pengeluaran, sisa uang, dan
  total tabungan; donat pengeluaran per kategori; progres anggaran; tiga tujuan
  tabungan teratas; lima transaksi terakhir. Pemilih bulan beralih antara
  Oktober dan November 2026.
- **Transaksi** — seluruh transaksi bulan berjalan, dengan saringan per
  kategori dan pencarian teks. Tambah transaksi baru lewat formulir, ubah
  jumlahnya, atau hapus — total dan dashboard ikut berubah.
- **Anggaran** — anggaran bulanan tiap kategori (Belanja Harian, Transport,
  Tagihan & Utilitas, Pendidikan, Kesehatan, Hiburan, Lainnya) dengan batang
  progres, sisa anggaran, dan formulir untuk mengubah nominal anggaran.
- **Tujuan Tabungan** — Dana Darurat, Liburan Keluarga ke Bali, DP Rumah
  Kedua, dan Pendidikan Nara, masing-masing dengan progres, perkiraan waktu
  tercapai, formulir tambah dana, dan formulir tujuan baru.
- **Laporan** — grafik garis pemasukan vs pengeluaran, grafik batang
  perbandingan per kategori Oktober vs November, wawasan otomatis yang dihitung
  dari data, lima pengeluaran terbesar, dan tabel ringkasan per kategori.

## Cara menjalankan

```sh
node serve.ts
```

Lalu buka http://localhost:8080. Tidak ada langkah build dan tidak ada
permintaan jaringan: semua data, gaya, dan grafik berasal dari berkas di
`app/` sendiri. Perubahan tersimpan di `localStorage` peramban; tombol
"Kembalikan data contoh" di kaki halaman mengembalikan data awal.

## Berkas

- `app/index.html` — kerangka halaman, navigasi, dan kaki halaman
- `app/app.js` — router hash, state, dan semua interaksi
- `app/data.js` — data awal: rumah tangga, kategori, transaksi dua bulan, tujuan
- `app/views.js` — tampilan tiap halaman dan perhitungan ringkasan
- `app/charts.js` — grafik kanvas polos (donat, batang, garis)
- `app/style.css` — seluruh gaya, termasuk tata letak ponsel
- `main.ts` — menyalin `app/` dan `screenshots/` ke `/output` dan menulis `dossier.json`
- `serve.ts` — server statis kecil untuk pengembangan lokal

---

<sub>Entered on [make.fun](https://make.fun/?ref=axs8j3b9&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
