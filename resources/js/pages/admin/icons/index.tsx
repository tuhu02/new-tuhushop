import { useState, useRef } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Upload, ImageIcon } from 'lucide-react';

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
        if (!data.image) return;

        setIsUploading(true);
        post('/admin/icons', {
            onSuccess: () => {
                reset();
                if (fileInputRef.current) fileInputRef.current.value = '';
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
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3">
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="mb-4 font-semibold">Upload Icon Baru</h3>
                                <form onSubmit={handleUpload} className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">File Gambar</label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                            required
                                        />
                                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Nama Icon (Opsional)</label>
                                        <Input
                                            type="text"
                                            placeholder="Kosongkan untuk pakai nama file"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isUploading || !data.image}>
                                        <Upload className="w-4 h-4 mr-2" />
                                        {isUploading ? 'Mengupload...' : 'Upload Icon'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="w-full md:w-2/3">
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="mb-4 font-semibold">Daftar Icon ({icons.length})</h3>
                                {icons.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                        <p>Belum ada icon yang diupload</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {icons.map((icon) => (
                                            <div key={icon.id} className="group relative border rounded-lg overflow-hidden bg-muted/20 flex flex-col items-center p-3">
                                                <div className="w-16 h-16 flex items-center justify-center mb-2">
                                                    <img
                                                        src={icon.file_path}
                                                        alt={icon.name}
                                                        className="max-w-full max-h-full object-contain"
                                                    />
                                                </div>
                                                <p className="text-xs text-center font-medium truncate w-full" title={icon.name}>
                                                    {icon.name}
                                                </p>
                                                
                                                <button
                                                    onClick={() => handleDelete(icon.id)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Hapus Icon"
                                                >
                                                    <Trash2 className="w-3 h-3" />
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
