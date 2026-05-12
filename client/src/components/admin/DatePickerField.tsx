'use client';
import { Calendar, AlertCircle } from 'lucide-react';
import { formatDateDisplay, todayISO } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';

interface DatePickerFieldProps {
  label: string;
  value: string;          // stored as ISO "YYYY-MM-DD" in state
  onChange: (isoValue: string) => void;
  minDate?: string;       // ISO "YYYY-MM-DD"
  maxDate?: string;       // ISO "YYYY-MM-DD"
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
}: DatePickerFieldProps) {
  const effectiveMin = minDate ?? todayISO();

  return (
    <div className="flex flex-col gap-1.5 w-full">

      {/* Label */}
      <label className="text-[10px] font-black text-uca-text-muted
                        uppercase tracking-widest">
        {label}
        {required && (
          <span className="text-uca-accent-red ml-0.5">*</span>
        )}
      </label>

      {/* Display value in DD/MM/YYYY above input */}
      {value && (
        <span className="text-xs font-bold text-uca-accent-blue -mb-1">
          {formatDateDisplay(value)}
        </span>
      )}

      {/* Native date input — hidden visually but functional */}
      <div className="relative">
        <input
          type="date"
          value={value}           // ISO format for input[type=date]
          min={effectiveMin}
          max={maxDate}
          disabled={disabled}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.preventDefault()} // block manual typing
          className={cn(
            "w-full border rounded-xl px-4 py-2.5 text-sm bg-uca-bg-elevated cursor-pointer transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-uca-navy/20 focus:border-uca-navy disabled:bg-uca-bg-base disabled:cursor-not-allowed disabled:text-uca-text-muted [color-scheme:light]",
            error
              ? 'border-uca-accent-red ring-2 ring-red-100'
              : 'border-uca-border hover:border-uca-text-muted'
          )}
        />
        <Calendar
          className="absolute right-3 top-1/2 -translate-y-1/2
                     size-4 text-uca-text-muted pointer-events-none"
        />
      </div>

      {/* Error or helper */}
      {error ? (
        <p className="text-[10px] text-uca-accent-red font-bold flex items-center gap-1">
          <AlertCircle className="size-3.5 flex-shrink-0" />
          {error}
        </p>
      ) : helperText ? (
        <p className="text-[10px] text-uca-text-muted font-medium">{helperText}</p>
      ) : null}
    </div>
  );
}
