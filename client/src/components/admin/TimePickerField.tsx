'use client';
import { Clock, AlertCircle } from 'lucide-react';
import { formatTimeDisplay } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';

interface TimePickerFieldProps {
  label: string;
  value: string;         // "HH:MM" 24hr format in state
  onChange: (value: string) => void;
  minTime?: string;      // "HH:MM" — blocks earlier times
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  step?: number;         // minutes step, default 15
}

export default function TimePickerField({
  label, value, onChange,
  minTime, required, disabled,
  error, helperText,
  step = 15,
}: TimePickerFieldProps) {

  return (
    <div className="flex flex-col gap-1.5 w-full">

      {/* Label */}
      <label className="text-[10px] font-bold text-uca-text-muted
                        uppercase tracking-widest">
        {label}
        {required && (
          <span className="text-uca-accent-red ml-0.5">*</span>
        )}
      </label>

      {/* Formatted time display */}
      {value && (
        <span className="text-xs font-semibold text-uca-accent-blue -mb-1">
          {formatTimeDisplay(value)}
        </span>
      )}

      <div className="relative">
        <input
          type="time"
          value={value}
          min={minTime}
          step={step * 60}   // step in seconds
          disabled={disabled}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full border rounded-xl px-4 py-2.5 text-sm bg-uca-bg-elevated cursor-pointer transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-uca-navy/20 focus:border-uca-navy disabled:bg-uca-bg-base disabled:cursor-not-allowed [color-scheme:light]",
            error
                ? 'border-uca-accent-red ring-2 ring-red-100'
                : 'border-uca-border hover:border-uca-text-muted'
          )}
        />
        <Clock
          className="absolute right-3 top-1/2 -translate-y-1/2
                     size-4 text-uca-text-muted pointer-events-none"
        />
      </div>

      {/* Quick time presets */}
      <div className="flex flex-wrap gap-1.5 mt-0.5">
        {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(t => (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={cn(
                "text-[10px] font-bold px-2 py-1 rounded-lg transition-all duration-100 uppercase tracking-tight",
                value === t
                  ? 'bg-uca-navy text-white shadow-sm shadow-uca-navy/20'
                  : 'bg-uca-bg-elevated text-uca-text-muted hover:text-uca-text-primary hover:bg-uca-bg-base border border-uca-border'
            )}
          >
            {formatTimeDisplay(t)}
          </button>
        ))}
      </div>

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
