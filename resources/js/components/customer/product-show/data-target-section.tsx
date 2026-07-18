type InputFieldOption = {
    label: string;
    value: string;
};

type InputField = {
    name: string;
    label: string;
    type?: 'text' | 'number' | 'select';
    required?: boolean;
    placeholder?: string;
    default?: string;
    options?: InputFieldOption[];
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
    const defaultFields: InputField[] = [
        {
            name: 'customer_no',
            label: 'Nomor Tujuan',
            type: 'text',
            required: true,
            placeholder: 'Masukkan nomor tujuan',
        },
    ];

    const inputFields: InputField[] =
        fields && fields.length > 0 ? fields : defaultFields;

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex gap-2 text-sm font-semibold">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-foreground text-accent">
                    1
                </div>
                <span className="dark:text-slate-100">
                    Masukkan Data Tujuan
                </span>
            </div>

            <div className="space-y-3">
                {inputFields.map((field) => {
                    const value =
                        customerInputs[field.name] ?? field.default ?? '';

                    return (
                        <div key={field.name} className="grid gap-1.5">
                            <label
                                htmlFor={field.name}
                                className="text-xs font-medium text-slate-700 dark:text-slate-300"
                            >
                                {field.label}
                                {field.required ? (
                                    <span className="ml-1 text-red-500">*</span>
                                ) : null}
                            </label>

                            {field.type === 'select' ? (
                                <select
                                    id={field.name}
                                    value={value}
                                    onChange={(event) =>
                                        onChange(field.name, event.target.value)
                                    }
                                    required={field.required}
                                    className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm transition outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/50"
                                >
                                    <option value="">
                                        Pilih {field.label}
                                    </option>

                                    {field.options?.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    id={field.name}
                                    type={field.type ?? 'text'}
                                    value={value}
                                    onChange={(event) =>
                                        onChange(field.name, event.target.value)
                                    }
                                    required={field.required}
                                    placeholder={
                                        field.placeholder ?? field.label
                                    }
                                    className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm transition outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/50"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
