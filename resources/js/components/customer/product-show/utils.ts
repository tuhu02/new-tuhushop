export const formatRupiah = (value: number) =>
    `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;

export const paymentLogos = {
    ewallet: ['GoPay', 'DANA', 'OVO', 'ShopeePay', 'LinkAja'],
    va: ['Mandiri', 'Permata', 'BNI', 'BRI', 'BCA'],
    store: ['Alfamart', 'Indomaret'],
};
