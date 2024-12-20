import { InputProps } from "./interfaces";

export default function Input ({
    id,
    type = "text",
    value,
    onChange,
    placeholder,
    label,
    error,
    name,
  }: InputProps) {
    return (
      <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 font-semibold">
          {label}
        </label>
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${
            error ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-300"
          }`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  };