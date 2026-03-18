import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

type Customer = {
    id: number;
    user_id: number;
    name: string;
    phone: string | null;
    address: string | null;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
};

export default function CustomerIndex({
    customers,
}: {
    customers: Customer[];
}) {
    const handleDelete = (customerId: number) => {
        if (!window.confirm('Hapus customer ini?')) {
            return;
        }

        router.delete(`/admin/customers/${customerId}`);
    };

    return (
        <AdminLayout title="Admin Customers" headerTitle="Customers">
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Customers</h1>
                    <Link
                        href="/admin/customers/create"
                        className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                    >
                        Tambah Customer
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70">
                    <table className="w-full min-w-180 text-left text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-4 py-3 font-medium">Nama</th>
                                <th className="px-4 py-3 font-medium">User</th>
                                <th className="px-4 py-3 font-medium">Phone</th>
                                <th className="px-4 py-3 font-medium">
                                    Address
                                </th>
                                <th className="px-4 py-3 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length === 0 && (
                                <tr>
                                    <td
                                        className="px-4 py-6 text-muted-foreground"
                                        colSpan={5}
                                    >
                                        Belum ada customer.
                                    </td>
                                </tr>
                            )}
                            {customers.map((customer) => (
                                <tr
                                    key={customer.id}
                                    className="border-t border-sidebar-border/50"
                                >
                                    <td className="px-4 py-3">
                                        {customer.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium">
                                            {customer.user.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {customer.user.email}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {customer.phone ?? '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {customer.address ?? '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/customers/${customer.id}/edit`}
                                                className="inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(customer.id)
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
