import { useState, useRef, useCallback } from 'react';
import {
  Upload,
  Download,
  CheckCircle,
  AlertTriangle,
  XCircle,
  X,
  Table as TableIcon,
  Loader2,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import {
  parseStudentFile,
  validateRow,
  generateTemplate,
  ParsedStudent,
  ParseResult,
} from '@/lib/studentImportParser';
import { STUDENT_IMPORT_COLUMNS } from '@/lib/studentImportMap';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ImportStep = 'upload' | 'preview' | 'importing' | 'done';

interface StudentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (count: number) => void;
}

export default function StudentImportModal({
  isOpen,
  onClose,
  onImportComplete,
}: StudentImportModalProps) {
  const [step, setStep] = useState<ImportStep>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [importProgress, setImportProgress] = useState(0);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importedCount, setImportedCount] = useState(0);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setStep('upload');
    setIsDragging(false);
    setParseResult(null);
    setSelectedRows(new Set());
    setImportProgress(0);
    setImportErrors([]);
    setImportedCount(0);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // ── File handling ───────────────────────────────────────────
  const processFile = useCallback(async (file: File) => {
    const validExts = ['.xlsx', '.xls', '.csv', '.ods'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validExts.includes(ext)) {
      alert(
        `Invalid file type. Please upload:\n` +
        `• Excel (.xlsx, .xls)\n• CSV (.csv)\n• ODS (.ods)`
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }

    setFileName(file.name);
    const result = await parseStudentFile(file);
    setParseResult(result);
    setStep('preview');

    // Pre-select all valid rows:
    const validIndices = new Set(
      result.rows
        .map((row, i) => ({ row, i }))
        .filter(({ row }) => validateRow(row).valid)
        .map(({ i }) => i)
    );
    setSelectedRows(validIndices);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  // ── Template download ───────────────────────────────────────
  const downloadTemplate = async () => {
    const blob = await generateTemplate();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'UCA_Students_Import_Template.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Import selected rows ────────────────────────────────────
  const handleImport = async () => {
    if (!parseResult) return;

    const rowsToImport = parseResult.rows.filter(
      (_, i) => selectedRows.has(i)
    );
    if (rowsToImport.length === 0) return;

    setStep('importing');
    setImportProgress(0);
    setImportErrors([]);

    let successCount = 0;
    const errors: string[] = [];
    const BATCH_SIZE = 50; // Match limit in suggested API but maybe smaller for safety? Prompt says 50 max.

    // Import in batches:
    for (let i = 0; i < rowsToImport.length; i += BATCH_SIZE) {
      const batch = rowsToImport.slice(i, i + BATCH_SIZE);

      try {
        const res = await api.post('/students/bulk', { students: batch });
        successCount += res.data.created;
        if (res.data.errors?.length > 0) {
          errors.push(...res.data.errors);
        }
      } catch (err: any) {
        errors.push(
          `Batch ${Math.floor(i / BATCH_SIZE) + 1}: `
          + (err.response?.data?.error || err.message || 'Unknown error')
        );
      }

      setImportProgress(
        Math.min(100, Math.round(((i + BATCH_SIZE) / rowsToImport.length) * 100))
      );
    }

    setImportedCount(successCount);
    setImportErrors(errors);
    setStep('done');

    if (successCount > 0) {
      onImportComplete(successCount);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative z-50 bg-uca-bg-surface border border-uca-border shadow-2xl flex flex-col w-full max-w-4xl max-h-[95vh] sm:rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-uca-border bg-uca-navy flex-shrink-0">
          <div className="flex items-center gap-3">
            <TableIcon className="size-5 text-uca-accent-blue" />
            <div>
              <p className="text-sm font-bold text-white">
                Bulk Student Import
              </p>
              <p className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">
                {step === 'upload' && 'Upload Excel, CSV or ODS'}
                {step === 'preview' && `Reviewing: ${fileName}`}
                {step === 'importing' && 'Writing to database...'}
                {step === 'done' && 'Process finished'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Steps Bar */}
        <div className="flex border-b border-uca-border bg-uca-bg-surface flex-shrink-0">
          {[
            { key: 'upload', label: '1. Upload' },
            { key: 'preview', label: '2. Preview' },
            { key: 'importing', label: '3. Import' },
            { key: 'done', label: '4. Done' },
          ].map((s, i) => {
            const steps = ['upload', 'preview', 'importing', 'done'];
            const currentIdx = steps.indexOf(step);
            const stepIdx = steps.indexOf(s.key);
            return (
              <div
                key={s.key}
                className={cn(
                  "flex-1 py-3 text-center text-[10px] font-black uppercase tracking-[0.15em] border-b-2 transition-all",
                  stepIdx === currentIdx
                    ? "border-uca-accent-blue text-uca-accent-blue bg-uca-accent-blue/5"
                    : stepIdx < currentIdx
                      ? "border-emerald-500 text-emerald-500"
                      : "border-transparent text-uca-text-muted"
                )}
              >
                {s.label}
              </div>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-uca-bg-base">

          {/* ── STEP 1: UPLOAD ── */}
          {step === 'upload' && (
            <div className="p-8 space-y-8">
              {/* Template Section */}
              <div className="flex items-center justify-between p-5 bg-uca-accent-blue/10 border border-uca-accent-blue/20 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-full bg-uca-accent-blue/20 flex items-center justify-center">
                    <Download className="size-5 text-uca-accent-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-uca-text-primary">Download Template</p>
                    <p className="text-xs text-uca-text-muted">Use our formatted Excel sheet for best results</p>
                  </div>
                </div>
                <Button
                  onClick={downloadTemplate}
                  className="bg-uca-accent-blue hover:bg-uca-accent-blue/90 text-white font-bold text-xs uppercase tracking-widest h-10 px-6 rounded-xl"
                >
                  Download .xlsx
                </Button>
              </div>

              {/* Upload Zone */}
              <div
                onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-300 group",
                  isDragging
                    ? "border-uca-accent-blue bg-uca-accent-blue/5 scale-[1.01]"
                    : "border-uca-border hover:border-uca-accent-blue/40 hover:bg-uca-bg-surface"
                )}
              >
                <div className="size-16 bg-uca-bg-elevated rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-uca-border">
                  <Upload className={cn("size-8", isDragging ? "text-uca-accent-blue" : "text-uca-text-muted")} />
                </div>
                <p className="text-lg font-black text-uca-text-primary mb-2">
                  {isDragging ? 'Drop it here!' : 'Click or drag file to upload'}
                </p>
                <p className="text-sm text-uca-text-muted mb-6">Excel (.xlsx, .xls), CSV (.csv), or ODS (.ods)</p>

                <div className="flex items-center justify-center gap-2 flex-wrap max-w-md mx-auto">
                  {STUDENT_IMPORT_COLUMNS.slice(0, 6).map(col => (
                    <span key={col.field} className="px-2 py-1 bg-uca-bg-elevated border border-uca-border rounded text-[9px] font-bold text-uca-text-muted uppercase tracking-wider">
                      {col.label}
                    </span>
                  ))}
                  <span className="text-[9px] font-bold text-uca-text-muted">... +{STUDENT_IMPORT_COLUMNS.length - 6} more</span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv,.ods"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              <p className="text-center text-[10px] font-bold text-uca-text-muted uppercase tracking-[0.2em]">
                Max File Size: 5MB • Max Rows: 500
              </p>
            </div>
          )}

          {/* ── STEP 2: PREVIEW ── */}
          {step === 'preview' && parseResult && (
            <div className="flex flex-col h-full">
              {/* Summary Bar */}
              <div className="px-6 py-4 bg-uca-bg-surface border-b border-uca-border flex items-center gap-6 sticky top-0 z-20">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black text-uca-text-primary uppercase tracking-widest">
                    {parseResult.validRows} Valid
                  </span>
                </div>
                {parseResult.skippedRows > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-uca-text-muted" />
                    <span className="text-[10px] font-black text-uca-text-muted uppercase tracking-widest">
                      {parseResult.skippedRows} Skipped
                    </span>
                  </div>
                )}
                {parseResult.warnings.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-amber-500" />
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                      {parseResult.warnings.length} Warnings
                    </span>
                  </div>
                )}
                {parseResult.errors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-uca-accent-red" />
                    <span className="text-[10px] font-black text-uca-accent-red uppercase tracking-widest">
                      {parseResult.errors.length} Errors
                    </span>
                  </div>
                )}

                <div className="ml-auto flex items-center gap-4">
                  <button
                    onClick={() => {
                      const next = new Set<number>();
                      parseResult.rows.forEach((r, i) => {
                        if (validateRow(r).valid) next.add(i);
                      });
                      setSelectedRows(next);
                    }}
                    className="text-[10px] font-black text-uca-accent-blue uppercase tracking-widest hover:underline"
                  >
                    Select All Valid
                  </button>
                  <div className="w-px h-4 bg-uca-border" />
                  <button
                    onClick={() => setSelectedRows(new Set())}
                    className="text-[10px] font-black text-uca-text-muted uppercase tracking-widest hover:underline"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Warning/Error Logs */}
              {(parseResult.warnings.length > 0 || parseResult.errors.length > 0) && (
                <div className="mx-6 mt-4 p-4 rounded-xl bg-uca-bg-elevated border border-uca-border space-y-2">
                  {parseResult.errors.slice(0, 3).map((err, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-uca-accent-red uppercase tracking-tight">
                      <XCircle className="size-3" /> {err}
                    </div>
                  ))}
                  {parseResult.warnings.slice(0, 3).map((warn, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase tracking-tight">
                      <AlertTriangle className="size-3" /> {warn}
                    </div>
                  ))}
                  {(parseResult.errors.length > 3 || parseResult.warnings.length > 3) && (
                    <p className="text-[9px] text-uca-text-muted italic ml-5">And {parseResult.errors.length + parseResult.warnings.length - 6} more issues...</p>
                  )}
                </div>
              )}

              {/* Table */}
              <div className="flex-1 overflow-x-auto p-6">
                <div className="border border-uca-border rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-uca-bg-surface border-b border-uca-border">
                      <tr>
                        <th className="px-4 py-4 w-10">
                          <input
                            type="checkbox"
                            checked={selectedRows.size > 0 && selectedRows.size === parseResult.rows.filter(r => validateRow(r).valid).length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                const next = new Set<number>();
                                parseResult.rows.forEach((r, i) => {
                                  if (validateRow(r).valid) next.add(i);
                                });
                                setSelectedRows(next);
                              } else {
                                setSelectedRows(new Set());
                              }
                            }}
                            className="rounded border-uca-border text-uca-accent-blue focus:ring-uca-accent-blue"
                          />
                        </th>
                        <th className="px-4 py-4 text-[10px] font-black text-uca-text-muted uppercase tracking-widest w-10 text-center">#</th>
                        {STUDENT_IMPORT_COLUMNS.map(col => (
                          <th key={col.field} className="px-4 py-4 text-[10px] font-black text-uca-text-muted uppercase tracking-widest whitespace-nowrap">
                            {col.label} {col.required && <span className="text-uca-accent-red">*</span>}
                          </th>
                        ))}
                        <th className="px-4 py-4 text-[10px] font-black text-uca-text-muted uppercase tracking-widest sticky right-0 bg-uca-bg-surface border-l border-uca-border shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-uca-border bg-uca-bg-base">
                      {parseResult.rows.map((row, i) => {
                        const validation = validateRow(row);
                        const isSelected = selectedRows.has(i);
                        return (
                          <tr
                            key={i}
                            className={cn(
                              "hover:bg-uca-bg-surface/50 transition-colors",
                              isSelected ? "bg-uca-accent-blue/[0.02]" : "",
                              !validation.valid ? "opacity-60" : ""
                            )}
                          >
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                disabled={!validation.valid}
                                onChange={(e) => {
                                  const next = new Set(selectedRows);
                                  if (e.target.checked) next.add(i);
                                  else next.delete(i);
                                  setSelectedRows(next);
                                }}
                                className="rounded border-uca-border text-uca-accent-blue focus:ring-uca-accent-blue disabled:opacity-20"
                              />
                            </td>
                            <td className="px-4 py-3 text-[10px] font-bold text-uca-text-muted text-center">{i + 1}</td>
                            {STUDENT_IMPORT_COLUMNS.map(col => (
                              <td key={col.field} className="px-4 py-3 text-uca-text-primary truncate max-w-[150px]">
                                {String(row[col.field] ?? '—')}
                              </td>
                            ))}
                            <td className="px-4 py-3 sticky right-0 bg-inherit border-l border-uca-border shadow-[-4px_0_12px_rgba(0,0,0,0.05)]">
                              {validation.valid ? (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 w-fit">
                                  <CheckCircle className="size-2.5" />
                                  <span className="text-[9px] font-black uppercase tracking-wider">Valid</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-uca-accent-red/10 text-uca-accent-red rounded-full border border-uca-accent-red/20 w-fit cursor-help" title={validation.errors.join(', ')}>
                                  <AlertTriangle className="size-2.5" />
                                  <span className="text-[9px] font-black uppercase tracking-wider">Error</span>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: IMPORTING ── */}
          {step === 'importing' && (
            <div className="p-20 flex flex-col items-center justify-center text-center space-y-10">
              <div className="relative">
                <div className="size-32 rounded-full border-4 border-uca-border" />
                <div
                  className="absolute inset-0 size-32 rounded-full border-4 border-uca-accent-blue border-t-transparent animate-spin"
                  style={{ animationDuration: '0.8s' }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-uca-text-primary">{importProgress}%</span>
                  <span className="text-[8px] font-black text-uca-text-muted uppercase tracking-[0.2em]">Importing</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-black text-uca-text-primary tracking-tight">Syncing Data...</h3>
                <p className="text-sm text-uca-text-muted max-w-sm">Please keep this window open while we update the student records in the secure vault.</p>
              </div>

              <div className="w-full max-w-md h-1.5 bg-uca-border rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-uca-accent-blue to-blue-400 transition-all duration-500 ease-out"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* ── STEP 4: DONE ── */}
          {step === 'done' && (
            <div className="p-20 flex flex-col items-center justify-center text-center space-y-8">
              <div className={cn(
                "size-24 rounded-full flex items-center justify-center shadow-xl border-4 animate-in zoom-in-75 duration-500",
                importedCount > 0
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                  : "bg-uca-accent-red/10 border-uca-accent-red/20 text-uca-accent-red"
              )}>
                {importedCount > 0 ? <CheckCircle className="size-12" /> : <XCircle className="size-12" />}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-uca-text-primary tracking-tight">
                  {importedCount > 0 ? 'Import Complete!' : 'Import Failed'}
                </h3>
                <p className="text-sm text-uca-text-muted">
                  {importedCount > 0
                    ? `Successfully integrated ${importedCount} student profile${importedCount === 1 ? '' : 's'} into the system.`
                    : 'No student profiles were imported due to unexpected errors.'
                  }
                </p>
              </div>

              {importErrors.length > 0 && (
                <div className="w-full max-w-lg bg-uca-bg-surface border border-uca-border rounded-2xl p-5 text-left space-y-3 shadow-sm">
                  <p className="text-[10px] font-black text-uca-accent-red uppercase tracking-widest">Exception Log ({importErrors.length})</p>
                  <div className="max-h-32 overflow-y-auto space-y-1.5 pr-2">
                    {importErrors.map((err, i) => (
                      <p key={i} className="text-[11px] font-medium text-uca-text-primary leading-tight flex gap-2">
                        <span className="text-uca-accent-red">•</span> {err}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={resetState}
                  className="h-12 px-8 rounded-xl border-uca-border text-uca-text-muted font-bold hover:text-uca-text-primary hover:bg-uca-bg-surface transition-all gap-2"
                >
                  Import More
                </Button>
                <Button
                  onClick={handleClose}
                  className="h-12 px-10 rounded-xl bg-uca-navy hover:bg-uca-navy/90 text-white font-black uppercase tracking-widest shadow-lg shadow-black/10 transition-all gap-2"
                >
                  Finish Process <CheckCircle className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {(step === 'upload' || step === 'preview') && (
          <div className="px-6 py-4 border-t border-uca-border bg-uca-bg-surface flex items-center justify-between flex-shrink-0">
            <Button
              variant="ghost"
              onClick={step === 'upload' ? handleClose : resetState}
              className="text-uca-text-muted hover:text-uca-text-primary font-bold gap-2"
            >
              <ChevronLeft className="size-4" />
              {step === 'upload' ? 'Cancel Import' : 'Upload Different File'}
            </Button>

            {step === 'preview' && (
              <Button
                onClick={handleImport}
                disabled={selectedRows.size === 0}
                className="bg-uca-navy hover:bg-uca-navy/90 text-white font-black uppercase tracking-widest h-12 px-10 rounded-xl shadow-lg shadow-black/10 transition-all gap-3 disabled:opacity-50 disabled:grayscale"
              >
                Sync {selectedRows.size} Profile{selectedRows.size === 1 ? '' : 's'}
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
