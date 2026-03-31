import { Link, useForm } from '@inertiajs/react';
import InputError from '@/components/ui/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import type { ProductOption } from '@/types';

type ProductInstructionCreateProps = {
    products: ProductOption[];
};

export default function ProductInstructionCreate({
    products,
}: ProductInstructionCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: '',
        title: '',
        content: '',
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/admin/product-instructions');
    };

    return (
        <AdminLayout
            title="Tambah Product Instruction"
            headerTitle="Product Instructions"
        >
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        Tambah Instruksi Produk
                    </h1>
                    <Link
                        href="/admin/product-instructions"
                        className="text-sm text-muted-foreground underline"
                    >
                        Kembali
                    </Link>
                </div>

                <form
                    onSubmit={submit}
                    className="max-w-2xl space-y-4 rounded-xl border p-4"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="product_id">Produk</Label>
                        <select
                            id="product_id"
                            value={data.product_id}
                            onChange={(event) =>
                                setData('product_id', event.target.value)
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                            <option value="">Pilih produk</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.product_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="title">Judul</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(event) =>
                                setData('title', event.target.value)
                            }
                            placeholder="Contoh: Cara top up"
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="content">Konten Instruksi</Label>
                        <Textarea
                            id="content"
                            value={data.content}
                            onChange={(event) =>
                                setData('content', event.target.value)
                            }
                            rows={7}
                            placeholder="Tulis langkah instruksi produk di sini"
                        />
                        <InputError message={errors.content} />
                    </div>

                    <Button disabled={processing} type="submit">
                        Simpan
                    </Button>
                </form>
            </div>
        </AdminLayout>
    );
}
