import { router, useForm } from '@inertiajs/react';
import { Trash2, Upload, ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/admin-layout';

interface IconData {
    id: number;
    name: string;
    file_path: string;
}

export default function IconGallery({ icons }: { icons: IconData[] }) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, reset, errors } = useForm({
        name: '',
        image: null as File | null,
    });

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.image) {
            return;
        }

        setIsUploading(true);
        post('/admin/icons', {
            onSuccess: () => {
                reset();

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            onFinish: () => setIsUploading(false),
            forceFormData: true,
        });
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Hapus icon ini?')) {
            router.delete(`/admin/icons/${id}`);
        }
    };

    return (
        <AdminLayout title="Galeri Icon" headerTitle="Manajemen Icon">
            <div className="space-y-6 p-4">
                <div className="flex flex-col gap-6 md:flex-row">
                    <div className="w-full md:w-1/3">
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="mb-4 font-semibold">
                                    Upload Icon Baru
                                </h3>
                                <form
                                    onSubmit={handleUpload}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            File Gambar
                                        </label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={(e) =>
                                                setData(
                                                    'image',
                                                    e.target.files?.[0] || null,
                                                )
                                            }
                                            required
                                        />
                                        {errors.image && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.image}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Nama Icon (Opsional)
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Kosongkan untuk pakai nama file"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isUploading || !data.image}
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        {isUploading
                                            ? 'Mengupload...'
                                            : 'Upload Icon'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="w-full md:w-2/3">
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="mb-4 font-semibold">
                                    Daftar Icon ({icons.length})
                                </h3>
                                {icons.length === 0 ? (
                                    <div className="rounded-lg border-2 border-dashed py-8 text-center text-muted-foreground">
                                        <ImageIcon className="mx-auto mb-2 h-12 w-12 opacity-20" />
                                        <p>Belum ada icon yang diupload</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                        {icons.map((icon) => (
                                            <div
                                                key={icon.id}
                                                className="group relative flex flex-col items-center overflow-hidden rounded-lg border bg-muted/20 p-3"
                                            >
                                                <div className="mb-2 flex h-16 w-16 items-center justify-center">
                                                    <img
                                                        src={icon.file_path}
                                                        alt={icon.name}
                                                        className="max-h-full max-w-full object-contain"
                                                    />
                                                </div>
                                                <p
                                                    className="w-full truncate text-center text-xs font-medium"
                                                    title={icon.name}
                                                >
                                                    {icon.name}
                                                </p>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(icon.id)
                                                    }
                                                    className="absolute top-2 right-2 rounded-md bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                                    title="Hapus Icon"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
