## 🗄️ Integrasi Supabase

Project ini menggunakan **Supabase** sebagai database untuk:

1. **Riwayat akun premium** → tabel `premium_history` (bisa dilihat semua user)
2. **Uptime global** → tabel `system_uptime` (konsisten antar device)

### 🚀 Setup Supabase (5 Langkah)

1. **Daftar/Login** di [supabase.com](https://supabase.com)
2. **Create New Project** → isi nama `ayaka-sync`, pilih region terdekat
3. Buka **SQL Editor** → **New Query** → paste seluruh isi `sql/schema.sql` → **Run**
4. Buka **Settings → API** → copy:
   - `Project URL` → masukkan ke `CONFIG.SUPABASE_URL`
   - `anon public key` → masukkan ke `CONFIG.SUPABASE_ANON_KEY`
5. Refresh website → cek menu **Riwayat** & jam **uptime** di header

### 📊 Tabel Database

#### `premium_history`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | BIGSERIAL | Primary key |
| `email_masked` | TEXT | Email tersensor (contoh: `us***@gmail.com`) |
| `email_raw` | TEXT | Email asli (nullable) |
| `order_id` | TEXT | Order ID (GPA-xxxxx) |
| `plan` | TEXT | `free` / `pro` / `vip` |
| `source` | TEXT | `aktivasi` / `bulk` |
| `created_at` | TIMESTAMPTZ | Waktu insert (auto) |

#### `system_uptime`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | INT | Selalu `1` (single row) |
| `started_at` | TIMESTAMPTZ | Waktu sistem mulai hidup |
| `last_heartbeat` | TIMESTAMPTZ | Heartbeat terakhir dari client |

### 🔧 RPC Functions

| Function | Keterangan |
|----------|------------|
| `heartbeat_uptime()` | Update `last_heartbeat`. Kalau gap > 5 menit → reset `started_at` |
| `reset_uptime()` | Manual reset (admin only) |

### 🔄 Mekanisme Uptime

- **Heartbeat** dipanggil tiap **60 detik** dari client aktif manapun
- Kalau tidak ada client yang aktif selama **> 5 menit**, sistem dianggap mati → `started_at` di-reset
- Semua device menghitung uptime dari `started_at` yang sama → **angka konsisten**
- Re-fetch berkala tiap **5 menit** untuk antisipasi clock drift

### ⚠️ Keamanan

- **RLS enabled** pada kedua tabel
- `premium_history` → public `SELECT` + `INSERT`, tanpa `UPDATE`/`DELETE`
- `system_uptime` → public `SELECT`, modifikasi hanya via RPC `SECURITY DEFINER`
- `anon key` aman dipublish selama RLS policy sudah benar
- Jangan share **service_role key** ke client-side

### 🧪 Test Manual

Buka menu **Riwayat** di web → data harus muncul dari Supabase (bukan local).  
Buka dari **device lain** → data harus **sama** (karena shared database).  
Cek uptime di header → harus **sama di semua device**.