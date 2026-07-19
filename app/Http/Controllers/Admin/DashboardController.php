<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        // 1. Total Revenue
        $currentRevenue = Transaction::where('status', 'PAID')
            ->where('created_at', '>=', $startOfMonth)
            ->sum('amount');
        
        $lastMonthRevenue = Transaction::where('status', 'PAID')
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->sum('amount');

        $revenueGrowth = 0;
        if ($lastMonthRevenue > 0) {
            $revenueGrowth = (($currentRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100;
        } elseif ($currentRevenue > 0) {
            $revenueGrowth = 100;
        }

        // 2. New Customers
        $currentCustomers = User::where('is_admin', false)
            ->where('created_at', '>=', $startOfMonth)
            ->count();
        
        $lastMonthCustomers = User::where('is_admin', false)
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->count();
            
        $customersGrowth = 0;
        if ($lastMonthCustomers > 0) {
            $customersGrowth = (($currentCustomers - $lastMonthCustomers) / $lastMonthCustomers) * 100;
        } elseif ($currentCustomers > 0) {
            $customersGrowth = 100;
        }

        // 3. Total Transactions
        $currentTransactions = Transaction::where('created_at', '>=', $startOfMonth)->count();
        $lastMonthTransactions = Transaction::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();
        
        $transactionsGrowth = 0;
        if ($lastMonthTransactions > 0) {
            $transactionsGrowth = (($currentTransactions - $lastMonthTransactions) / $lastMonthTransactions) * 100;
        } elseif ($currentTransactions > 0) {
            $transactionsGrowth = 100;
        }

        // 4. Success Rate
        $currentSuccessTransactions = Transaction::where('status', 'PAID')->where('created_at', '>=', $startOfMonth)->count();
        $currentSuccessRate = $currentTransactions > 0 ? ($currentSuccessTransactions / $currentTransactions) * 100 : 0;

        $lastMonthSuccessTransactions = Transaction::where('status', 'PAID')->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();
        $lastMonthSuccessRate = $lastMonthTransactions > 0 ? ($lastMonthSuccessTransactions / $lastMonthTransactions) * 100 : 0;
        
        $successRateGrowth = $currentSuccessRate - $lastMonthSuccessRate; // Absolute point difference

        $metrics = [
            'revenue' => [
                'value' => $currentRevenue,
                'growth' => round($revenueGrowth, 1)
            ],
            'customers' => [
                'value' => $currentCustomers,
                'growth' => round($customersGrowth, 1)
            ],
            'transactions' => [
                'value' => $currentTransactions,
                'growth' => round($transactionsGrowth, 1)
            ],
            'success_rate' => [
                'value' => round($currentSuccessRate, 1),
                'growth' => round($successRateGrowth, 1)
            ],
        ];

        // Chart Data (Last 90 days Revenue)
        $ninetyDaysAgo = $now->copy()->subDays(90)->startOfDay();
        
        // Group by date
        $transactionsByDate = Transaction::where('status', 'PAID')
            ->where('created_at', '>=', $ninetyDaysAgo)
            ->selectRaw('DATE(created_at) as date, SUM(amount) as total_revenue, COUNT(id) as total_transactions')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();
            
        $chartData = $transactionsByDate->map(function ($item) {
            return [
                'date' => $item->date,
                'revenue' => (int) $item->total_revenue,
                'transactions' => (int) $item->total_transactions,
            ];
        })->toArray();

        // Fill in missing dates with zero
        $filledChartData = [];
        $currentDate = $ninetyDaysAgo->copy();
        
        while ($currentDate <= $now) {
            $dateString = $currentDate->format('Y-m-d');
            $found = collect($chartData)->firstWhere('date', $dateString);
            
            if ($found) {
                $filledChartData[] = $found;
            } else {
                $filledChartData[] = [
                    'date' => $dateString,
                    'revenue' => 0,
                    'transactions' => 0,
                ];
            }
            $currentDate->addDay();
        }

        return Inertia::render('admin/dashboard', [
            'metrics' => $metrics,
            'chartData' => $filledChartData,
        ]);
    }
}
