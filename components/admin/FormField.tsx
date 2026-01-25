"use client";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "number" | "textarea" | "select" | "checkbox";
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  help?: string;
  options?: { value: string | number; label: string }[];
  className?: string;
}

export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  help,
  options = [],
  className = "",
}: FormFieldProps) {
  const baseClasses = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent";

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClasses}
          rows={4}
        />
      ) : type === "select" ? (
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          className={baseClasses}
        >
          <option value="">Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "checkbox" ? (
        <input
          type="checkbox"
          name={name}
          checked={Boolean(value)}
          onChange={(e) => onChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
          className="h-4 w-4 rounded border-gray-300"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {help && <p className="text-gray-500 text-xs mt-1">{help}</p>}
    </div>
  );
}
