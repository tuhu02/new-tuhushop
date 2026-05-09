<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ManualTransactionController extends Controller
{
    /**
     * Tampilkan semua transaksi yang perlu diproses manual.
     * Yaitu transaksi yang:
     * - status PAID
     * - produknya memiliki fulfillment_type = 'manual'
     * - belum diproses (digiflazz_status != 'Sukses')
     */
    public function index(Request $request)
    {
        $status = $request->get('status', 'pending'); // pending | done | all

        $query = Transaction::with(['product', 'productPrice', 'paymentChannel'])
            ->whereHas('product', fn($q) => $q->where('fulfillment_type', 'manual'));

        if ($status === 'pending') {
            $query->where('status', 'PAID')
                  ->where(fn($q) => $q->whereNull('digiflazz_status')
                      ->orWhereNotIn('digiflazz_status', ['Sukses', 'sukses']));
        } elseif ($status === 'done') {
            $query->whereIn('digiflazz_status', ['Sukses', 'sukses']);
        }
        // 'all' => no additional filter

        $transactions = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/transactions/manual', [
            'transactions' => $transactions,
            'filters' => ['status' => $status],
        ]);
    }

    /**
     * Proses transaksi manual: isi SN / serial number dan tandai sebagai selesai.
     */
    public function process(Request $request, int $id)
    {
        $request->validate([
            'serial_number' => 'required|string|max:500',
            'notes'         => 'nullable|string|max:1000',
        ]);

        $transaction = Transaction::with('product')->findOrFail($id);

        // Validasi: hanya bisa diproses jika sudah PAID
        if ($transaction->status !== 'PAID') {
            return back()->withErrors([
                'message' => 'Transaksi ini belum berstatus PAID dan tidak bisa diproses.',
            ]);
        }

        $transaction->update([
            'digiflazz_status'       => 'Sukses',
            'digiflazz_sn'           => $request->serial_number,
            'digiflazz_processed_at' => now(),
            'digiflazz_response'     => [
                'manual'        => true,
                'serial_number' => $request->serial_number,
                'notes'         => $request->notes,
                'processed_by'  => 'admin',
                'processed_at'  => now()->toIso8601String(),
            ],
        ]);

        Log::info('Manual transaction processed', [
            'transaction_id' => $transaction->id,
            'reference'      => $transaction->reference,
            'serial_number'  => $request->serial_number,
        ]);

        return back()->with('success', 'Transaksi berhasil diproses! SN: ' . $request->serial_number);
    }
}
