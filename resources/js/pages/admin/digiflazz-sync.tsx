import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    AlertCircle,
    CheckCircle2,
    Loader2,
    RefreshCw,
    AlertTriangle,
} from 'lucide-react';

interface SyncStats {
    total_products: number;
    synced_products: number;
    total_prices: number;
    synced_prices: number;
}

interface SyncResult {
    success: boolean;
    message: string;
    synced?: number;
    errors?: number;
    stats?: SyncStats;
}

export default function DigiflazzSyncPage() {
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(false);
    const [stats, setStats] = useState<SyncStats | null>(null);
    const [result, setResult] = useState<SyncResult | null>(null);
    const [showResult, setShowResult] = useState(false);

    const handleSync = async () => {
        setLoading(true);
        setShowResult(false);

        try {
            const response = await fetch('/admin/digiflazz/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
            });

            const data = await response.json();
            setResult(data);
            setShowResult(true);

            if (data.stats) {
                setStats(data.stats);
            }
        } catch (error) {
            setResult({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : 'Terjadi kesalahan saat sync',
            });
            setShowResult(true);
        } finally {
            setLoading(false);
        }
    };

    const handleValidate = async () => {
        setValidating(true);

        try {
            const response = await fetch('/admin/digiflazz/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
            });

            const data = await response.json();
            setResult(data);
            setShowResult(true);
        } catch (error) {
            setResult({
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : 'Terjadi kesalahan saat validasi',
            });
            setShowResult(true);
        } finally {
            setValidating(false);
        }
    };

    const handleGetStats = async () => {
        try {
            const response = await fetch('/admin/digiflazz/stats', {
                headers: {
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
            });

            const data = await response.json();
            if (data.success && data.stats) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    return (
        <AdminLayout
            title="Sync Digiflazz"
            headerTitle="Sinkronisasi Digiflazz"
        >
            <div className="space-y-6 p-4 lg:p-6">
                {/* Info Section */}
                <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                        Fitur ini memungkinkan Anda untuk sinkronisasi price
                        list dari Digiflazz secara otomatis ke sistem. Data yang
                        di-sync akan membuat/mengupdate produk dan harga di
                        database.
                    </AlertDescription>
                </Alert>

                {/* Actions Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Kontrol Sinkronisasi</CardTitle>
                        <CardDescription>
                            Kelola proses sinkronisasi data dari API Digiflazz
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button
                                onClick={handleSync}
                                disabled={loading || validating}
                                className="flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Syncing...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="h-4 w-4" />
                                        Mulai Sync
                                    </>
                                )}
                            </Button>

                            <Button
                                onClick={handleValidate}
                                disabled={loading || validating}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                {validating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Validating...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4" />
                                        Validasi API
                                    </>
                                )}
                            </Button>

                            <Button
                                onClick={handleGetStats}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Refresh Stats
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Result Section */}
                {showResult && result && (
                    <Alert
                        className={
                            result.success
                                ? 'border-green-200 bg-green-50'
                                : 'border-red-200 bg-red-50'
                        }
                    >
                        {result.success ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <AlertDescription
                            className={
                                result.success
                                    ? 'text-green-800'
                                    : 'text-red-800'
                            }
                        >
                            <div className="font-semibold">
                                {result.message}
                            </div>
                            {result.synced !== undefined && (
                                <div className="mt-1 text-sm">
                                    Produk di-sync: {result.synced} | Error:{' '}
                                    {result.errors}
                                </div>
                            )}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Statistics Section */}
                {stats && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Produk
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.total_products}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Produk Tersync
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.synced_products}
                                </div>
                                {stats.total_products > 0 && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {Math.round(
                                            (stats.synced_products /
                                                stats.total_products) *
                                                100,
                                        )}
                                        % dari total
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Price List
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.total_prices}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Price List Tersync
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.synced_prices}
                                </div>
                                {stats.total_prices > 0 && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {Math.round(
                                            (stats.synced_prices /
                                                stats.total_prices) *
                                                100,
                                        )}
                                        % dari total
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Info Cards */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Bagaimana Cara Kerjanya?
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <ol className="list-inside list-decimal space-y-1">
                                <li>Fetch data dari API Digiflazz</li>
                                <li>Parse dan validasi data produk</li>
                                <li>
                                    Auto-create kategori harga jika belum ada
                                </li>
                                <li>Create/update produk di database</li>
                                <li>Create/update price list produk</li>
                                <li>Catat waktu sync untuk tracking</li>
                            </ol>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Catatan Penting
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <ul className="list-inside list-disc space-y-1">
                                <li>Sync non-destructive (tidak hapus data)</li>
                                <li>Produk duplicate auto-detect</li>
                                <li>API memiliki rate limit</li>
                                <li>Semua aktivitas tercatat di log</li>
                                <li>
                                    Jika error, sync tetap lanjut untuk produk
                                    lain
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Monitor Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Monitoring</CardTitle>
                        <CardDescription>
                            Untuk detail log lengkap, cek file:{' '}
                            <code className="rounded bg-muted px-1">
                                storage/logs/laravel.log
                            </code>
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </AdminLayout>
    );
}
