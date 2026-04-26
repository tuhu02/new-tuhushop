type InputField = {
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
};

type DataTargetSectionProps = {
    fields?: InputField[];
    customerInputs: Record<string, string>;
    onChange: (name: string, value: string) => void;
};

export default function DataTargetSection({
    fields,
    customerInputs,
    onChange,
}: DataTargetSectionProps) {
    const inputFields =
        fields && fields.length > 0
            ? fields
            : [
                  {
                      name: 'customer_no',
                      label: 'Nomor Tujuan',
                      type: 'text',
                      required: true,
                      placeholder: 'Masukkan nomor tujuan',
                  },
              ];

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <div className="mb-3 flex gap-2 text-sm font-semibold">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-foreground text-accent">
                    1
                </div>
                <span>Masukkan Data Tujuan</span>
            </div>

            <div className="space-y-3">
                {inputFields.map((field) => (
                    <div key={field.name} className="grid gap-1.5">
                        <label
                            htmlFor={field.name}
                            className="text-xs font-medium text-slate-700"
                        >
                            {field.label}
                            {field.required ? (
                                <span className="ml-1 text-red-500">*</span>
                            ) : null}
                        </label>

                        <input
                            id={field.name}
                            type={field.type ?? 'text'}
                            value={customerInputs[field.name] ?? ''}
                            onChange={(event) =>
                                onChange(field.name, event.target.value)
                            }
                            placeholder={field.placeholder ?? field.label}
                            className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm transition outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
