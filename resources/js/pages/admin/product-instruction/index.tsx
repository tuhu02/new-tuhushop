import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import type { ProductInstruction } from '@/types';

type ProductInstructionIndexProps = {
    instructions: ProductInstruction[];
};

export default function ProductInstructionIndex({
    instructions,
}: ProductInstructionIndexProps) {
    const handleDelete = (instructionId: number) => {
        if (!window.confirm('Hapus instruksi produk ini?')) {
            return;
        }

        router.delete(`/admin/product-instructions/${instructionId}`);
    };

    return (
        <AdminLayout
            title="Admin Product Instructions"
            headerTitle="Product Instructions"
        >
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        Product Instructions
                    </h1>
                    <Link
                        href="/admin/product-instructions/create"
                        className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                    >
                        Tambah Instruksi
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70">
                    <table className="w-full min-w-180 text-left text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-4 py-3 font-medium">
                                    Produk
                                </th>
                                <th className="px-4 py-3 font-medium">Judul</th>
                                <th className="px-4 py-3 font-medium">
                                    Konten
                                </th>
                                <th className="px-4 py-3 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {instructions.length === 0 && (
                                <tr>
                                    <td
                                        className="px-4 py-6 text-muted-foreground"
                                        colSpan={4}
                                    >
                                        Belum ada instruksi produk.
                                    </td>
                                </tr>
                            )}

                            {instructions.map((instruction) => (
                                <tr
                                    key={instruction.id}
                                    className="border-t border-sidebar-border/50"
                                >
                                    <td className="px-4 py-3">
                                        {instruction.product?.name ?? '-'}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {instruction.title}
                                    </td>
                                    <td className="max-w-96 truncate px-4 py-3 text-muted-foreground">
                                        {instruction.content}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/product-instructions/${instruction.id}/edit`}
                                                className="inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(instruction.id)
                                                }
                                                className="inline-flex h-8 items-center rounded-md border border-red-300 px-3 text-xs font-medium text-red-600"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
