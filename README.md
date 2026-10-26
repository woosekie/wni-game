# 🇮🇩 Bertahan Hidup Sebagai WNI (Board Game Satir Indonesia)

Game web berbasis *turn-based board game* dengan tema satir kehidupan masyarakat Indonesia: *"Bertahan Hidup Sebagai WNI"*.

![Game Style](https://img.shields.io/badge/Style-Satir%20%2F%20Pop%20Comic%20Modern-FFE600?style=for-the-badge&logoColor=000)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.x-EA4C89?style=for-the-badge&logo=framer&logoColor=white)

---

## 🎮 Tahap 1: Character Selection Screen

Fokus tahap awal ini adalah **Halaman Pilih Karakter (Character Selection Screen)** sebelum pemain melangkah ke lintasan papan permainan (*Board Game*).

### Fitur Utama
1. **Mode Permainan:**
   - **Singleplayer (Lawan Bot)**: Atur jumlah bot lawan (1-3 bot), pilih karakter untuk tiap bot, atau klik tombol **Acak Bot**.
   - **Multiplayer Lobby**: Kode ruangan instan (Room Code), salin kode, dan daftar slot hingga 4 pemain.
2. **Daftar 5 Karakter Unik & Satir:**
   - **Pejabat / Pemerintah**: Uang Awal Rp 10.000.000 | HP 80 | Mental 90 | Luck: Tinggi
     - *Buff*: Kebal Pajak & Ormas, bisa sewa Influencer.
     - *Debuff*: Petak KPK/OTT menghilangkan 80% total harta.
   - **Pegawai Swasta**: Uang Awal Rp 4.000.000 | HP 70 | Mental 50 | Luck: Sedang
     - *Buff*: Gaji tetap tiap petak START & asuransi kesehatan BPJS.
     - *Debuff*: Mental cepat turun (burnout) & potongan pajak otomatis.
   - **Pedagang Sayur**: Uang Awal Rp 2.500.000 | HP 85 | Mental 75 | Luck: Sedang
     - *Buff*: Pemasukan uang harian tiap giliran & diskon biaya hidup 50%.
     - *Debuff*: Rawan gusuran Satpol PP & pungli liar.
   - **Influencer**: Uang Awal Rp 5.000.000 | HP 75 | Mental 60 | Luck: Sangat Tinggi
     - *Buff*: Jackpot endorse besar & dapat disewa Pejabat.
     - *Debuff*: Rawan Cancel Culture (mental & uang anjlok drastis).
   - **Mahasiswa**: Uang Awal Rp 1.000.000 | HP 90 | Mental 65 | Luck: Rendah
     - *Buff*: Energi berlipat (dadu dikali 2) & biaya hidup/kos paling murah.
     - *Debuff*: Tidak punya gaji tetap, mengandalkan beasiswa.
3. **Detail Preview Interaktif:**
   - Animasi idle *floating* halus pada ilustrasi karakter.
   - Progress bar animasi untuk Uang Awal, Darah/Kesehatan, dan Kesehatan Mental.
   - Kotak Buff (Hijau) dan Debuff (Merah).
   - Efek suara sintetis (Web Audio API) untuk setiap klik, seleksi, dan start game.
   - Modal persiapan papan permainan dengan semburan konfeti (*canvas-confetti*) dan *sneak-peek* lintasan petak board game.

---

## 🖼️ Penggantian Aset Gambar Karakter (PNG)

Aset ilustrasi karakter tersimpan di folder:
```text
public/assets/characters/
├── pejabat.png
├── pegawai.png
├── pedagang.png
├── influencer.png
└── mahasiswa.png
```
Cukup gantikan file di folder tersebut dengan file ilustrasi PNG Anda. Tag `<img>` sudah dikonfigurasi dengan `object-contain`, animasi idle, dan `drop-shadow` agar gambar PNG tampak menonjol dan hidup.

---

## 🚀 Menjalankan Proyek Secara Lokal

1. **Kloning Repositori:**
   ```bash
   git clone https://github.com/woosekie/wni-game.git
   cd wni-game
   ```

2. **Instal Dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan Server Development:**
   ```bash
   npm run dev
   ```
   Buka browser Anda di `http://localhost:5173/`.

4. **Build untuk Produksi:**
   ```bash
   npm run build
   ```

---

## 🛠️ Tech Stack
- **Framework:** React 19 + TypeScript (Vite)
- **Styling:** Tailwind CSS (Custom Comic Theme & Neo-brutalism Shadows)
- **Animasi:** Framer Motion
- **Ikon:** Lucide React
- **Audio:** Custom Web Audio API Synthesizer
- **Efek Partikel:** Canvas Confetti
