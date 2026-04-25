<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\DigiflazzService;
use App\Services\SyncDigiflazzService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DigiflazzSyncController extends Controller
{
    /**
     * Show Digiflazz sync page
     */
    public function index(): Response
    {
        return Inertia::render('admin/digiflazz-sync');
    }

    /**
     * Sync price list from Digiflazz
     */
    public function sync(Request $request): JsonResponse
    {
        try {
            $digiflazzService = new DigiflazzService();
            $syncService = new SyncDigiflazzService($digiflazzService);

            $result = $syncService->sync();

            return response()->json([
                'success' => $result['success'],
                'message' => $result['message'],
                'synced' => $result['synced'],
                'errors' => $result['errors'],
                'stats' => $syncService->getStats(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Sync failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Validate Digiflazz API credentials
     */
    public function validateCredentials(Request $request): JsonResponse
    {
        try {
            $digiflazzService = new DigiflazzService();

            if ($digiflazzService->validateCredentials()) {
                return response()->json([
                    'success' => true,
                    'message' => 'API credentials are valid',
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'API credentials are invalid',
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get sync statistics
     */
    public function getStats(Request $request): JsonResponse
    {
        try {
            $digiflazzService = new DigiflazzService();
            $syncService = new SyncDigiflazzService($digiflazzService);

            return response()->json([
                'success' => true,
                'stats' => $syncService->getStats(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get stats: ' . $e->getMessage(),
            ], 500);
        }
    }
}
