@component('mail::message')
# ✅ Pembayaran Berhasil!

Halo {{ $transaction->customer_name }},

Terima kasih! Pembayaran kamu telah berhasil diterima dan sedang kami proses.

---

## 📋 Detail Transaksi

| Field | Nilai |
|-------|-------|
| **Order ID** | {{ $transaction->merchant_ref }} |
| **Reference** | {{ $transaction->reference }} |
| **Status Pembayaran** | <span style="color: #27ae60; font-weight: bold;">{{ $transaction->status }}</span> |
| **Tanggal** | {{ $transaction->created_at->format('d/m/Y H:i') }} |

---

## 💳 Metode Pembayaran

- **Metode:** {{ $transaction->payment_method_name ?? 'N/A' }}
- **Channel:** {{ $transaction->payment_channel_name ?? 'N/A' }}
- **Total Pembayaran:** **Rp {{ number_format($transaction->amount, 0, ',', '.') }}**

@if($transaction->fee_customer)
  - Fee Customer: Rp {{ number_format($transaction->fee_customer, 0, ',', '.') }}
@endif

---

## 📦 Produk Dipesan

@if($transaction->product && $transaction->productPrice)
| Produk | Qty | Harga | Subtotal |
|--------|-----|-------|----------|
| {{ $transaction->product->name }} | {{ $transaction->quantity }} | Rp {{ number_format($transaction->productPrice->price, 0, ',', '.') }} | Rp {{ number_format($transaction->amount, 0, ',', '.') }} |
@endif

---

## 🎮 Status Pengiriman

@if($transaction->digiflazz_status)
<strong>Status Produk:</strong> {{ $transaction->digiflazz_status }}
@endif

@if($transaction->digiflazz_sn)
<strong>Serial Number:</strong> {{ $transaction->digiflazz_sn }}
@endif

@if(!$transaction->digiflazz_status)
<em style="color: #7f8c8d;">Status produk akan diupdate segera setelah sistem kami memproses pesanan.</em>
@endif

---

## 📞 Informasi Kontak

**Nama Pelanggan:** {{ $transaction->customer_name }}
**Email:** {{ $transaction->customer_email }}
**No. WhatsApp/Telepon:** {{ $transaction->customer_phone }}

---

@component('mail::button', ['url' => route('checkout.show', ['reference' => $transaction->merchant_ref])])
👉 Lihat Detail Order
@endcomponent

---

**Jika ada pertanyaan, silakan hubungi customer support kami.**

Terima kasih telah berbelanja di {{ config('app.name') }}!

Best regards,<br>
<strong>{{ config('app.name') }}</strong>
@endcomponent