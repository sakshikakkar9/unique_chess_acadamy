'use client';
import { Clock as ClockIcon, AlertCircle as ExclamationCircleIcon }
  from 'lucide-react';

// Format "HH:MM" → "hh:MM AM/PM"
const fmt = (t: string): string => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${String(h12).padStart(2,'0')}:${String(m).padStart(2,'0')} ${ampm}`;
};

interface Props {
  label: string;
  value: string;       // "HH:MM"
  onChange: (v: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
}

export default function TimePickerField({
  label, value, onChange,
  required, disabled, error, helperText,
}: Props) {
  return (
    <div className="flex flex-col gap-1">

      <label className="text-[10px] font-bold text-slate-500
                        uppercase tracking-widest">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {/* Formatted time display */}
      <div className="relative">
        {value && (
          <div className="absolute -top-5 right-0
                          text-[10px] font-semibold text-blue-600">
            {fmt(value)}
          </div>
        )}

        <input
          type="time"
          value={value}
          disabled={disabled}
          required={required}
          step={900}   // 15-min steps
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border rounded-xl px-3 py-2.5
                      text-sm bg-white cursor-pointer
                      [color-scheme:light]
                      focus:outline-none focus:ring-2
                      focus:ring-blue-500/20 focus:border-blue-500
                      disabled:bg-slate-50
                      ${error
                        ? 'border-red-400 ring-2 ring-red-100'
                        : 'border-slate-300 hover:border-slate-400'
                      }`}
        />
        <ClockIcon
          className="absolute right-3 top-1/2 -translate-y-1/2
                     size-4 text-slate-400 pointer-events-none"
        />
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap gap-1 mt-1">
        {['09:00','10:00','11:00','14:00','16:00','18:00'].map(t => (
          <button
            key={t} type="button"
            onClick={() => onChange(t)}
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md
                        transition-colors duration-100
                        ${value === t
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
          >
            {fmt(t)}
          </button>
        ))}
      </div>

      {error ? (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
          <ExclamationCircleIcon className="size-3.5" />
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}
