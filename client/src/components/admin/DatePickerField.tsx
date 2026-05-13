'use client';
import { Calendar as CalendarIcon, AlertCircle as ExclamationCircleIcon }
  from 'lucide-react';
import { toDisplayDate, todayISO } from '@/lib/dateUtils';

interface Props {
  label: string;
  value: string;          // ISO "YYYY-MM-DD" in state
  onChange: (iso: string) => void;
  minDate?: string;       // ISO
  maxDate?: string;       // ISO
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
}

export default function DatePickerField({
  label, value, onChange,
  minDate, maxDate,
  required, disabled,
  error, helperText,
}: Props) {
  const min = minDate ?? todayISO();

  return (
    <div className="flex flex-col gap-1">

      <label className="text-[10px] font-bold text-slate-500
                        uppercase tracking-widest">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {/* DD/MM/YYYY display — always visible above input */}
      <div className="relative">
        {value && (
          <div className="absolute -top-5 right-0
                          text-[10px] font-semibold text-blue-600">
            {toDisplayDate(value)}
          </div>
        )}

        <input
          type="date"
          value={value}
          min={min}
          max={maxDate}
          disabled={disabled}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.preventDefault()}
          className={`w-full border rounded-xl px-3 py-2.5
                      text-sm bg-white cursor-pointer
                      [color-scheme:light]
                      transition-colors duration-150
                      focus:outline-none focus:ring-2
                      focus:ring-blue-500/20 focus:border-blue-500
                      disabled:bg-slate-50 disabled:cursor-not-allowed
                      ${error
                        ? 'border-red-400 ring-2 ring-red-100'
                        : 'border-slate-300 hover:border-slate-400'
                      }`}
        />
        <CalendarIcon
          className="absolute right-3 top-1/2 -translate-y-1/2
                     size-4 text-slate-400 pointer-events-none"
        />
      </div>

      {error ? (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
          <ExclamationCircleIcon className="size-3.5 flex-shrink-0" />
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}
