import * as XLSX from 'xlsx';
import { STUDENT_IMPORT_COLUMNS, StudentImportColumn } from './studentImportMap';

export interface ParsedStudent {
  // Raw parsed row — indexed by field name
  [key: string]: string | number | null;
}

export interface ParseResult {
  success: boolean;
  rows: ParsedStudent[];
  errors: string[];
  warnings: string[];
  totalRows: number;
  validRows: number;
  skippedRows: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];    // blocking errors
  warnings: string[];  // non-blocking issues
}

/**
 * Parse uploaded file (xlsx, csv, ods) into student rows
 */
export async function parseStudentFile(
  file: File
): Promise<ParseResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Read file as ArrayBuffer:
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });

    // Use first sheet:
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return {
        success: false,
        rows: [],
        errors: ['File contains no sheets'],
        warnings: [],
        totalRows: 0,
        validRows: 0,
        skippedRows: 0,
      };
    }

    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON — first row as headers:
    const rawRows = XLSX.utils.sheet_to_json(sheet, {
      raw: false,      // convert all to strings first
      defval: '',      // empty cells = empty string
    }) as Record<string, string>[];

    if (rawRows.length === 0) {
      return {
        success: false,
        rows: [],
        errors: ['File is empty or has no data rows'],
        warnings: [],
        totalRows: 0,
        validRows: 0,
        skippedRows: 0,
      };
    }

    if (rawRows.length > 500) {
      warnings.push(
        `File has ${rawRows.length} rows. ` +
        `Only first 500 will be imported.`
      );
    }

    const limitedRows = rawRows.slice(0, 500);

    // Get actual headers from file:
    const fileHeaders = Object.keys(limitedRows[0] ?? {});

    // Map file headers to schema fields:
    const headerMap = buildHeaderMap(fileHeaders);

    // Parse each row:
    const parsedRows: ParsedStudent[] = [];
    let skippedRows = 0;

    limitedRows.forEach((raw, index) => {
      const rowNum = index + 2; // 1-indexed + header row
      const parsed: ParsedStudent = {};

      STUDENT_IMPORT_COLUMNS.forEach(col => {
        const fileHeader = headerMap[col.field];
        const rawValue = fileHeader
          ? raw[fileHeader]?.trim() ?? ''
          : '';

        const processed = processValue(
          rawValue, col.type, col.field, rowNum, warnings
        );
        parsed[col.field] = processed;
      });

      // Skip completely empty rows:
      const hasAnyData = Object.values(parsed)
        .some(v => v !== null && v !== '');

      if (!hasAnyData) {
        skippedRows++;
        return;
      }

      parsedRows.push(parsed);
    });

    const validRows = parsedRows.filter(
      row => validateRow(row).valid
    ).length;

    return {
      success: true,
      rows: parsedRows,
      errors,
      warnings,
      totalRows: limitedRows.length,
      validRows,
      skippedRows,
    };

  } catch (err) {
    return {
      success: false,
      rows: [],
      errors: [
        `Failed to parse file: ${(err as Error).message}`
      ],
      warnings: [],
      totalRows: 0,
      validRows: 0,
      skippedRows: 0,
    };
  }
}

/**
 * Map file headers to schema field names using aliases
 */
function buildHeaderMap(
  fileHeaders: string[]
): Record<string, string> {
  const map: Record<string, string> = {};

  STUDENT_IMPORT_COLUMNS.forEach(col => {
    const match = fileHeaders.find(h =>
      col.aliases.some(alias =>
        alias.toLowerCase() === h.toLowerCase().trim()
      )
    );
    if (match) map[col.field] = match;
  });

  return map;
}

/**
 * Process a raw cell value to the correct type
 */
function processValue(
  raw: string,
  type: StudentImportColumn['type'],
  field: string,
  rowNum: number,
  warnings: string[]
): string | number | null {
  if (!raw || raw.trim() === '') return null;

  const val = raw.trim();

  switch (type) {
    case 'phone':
      // Clean phone: remove spaces, dashes, +91 prefix
      const cleaned = val.replace(/[\s\-\+]/g, '')
        .replace(/^91/, '');
      if (!/^\d{10}$/.test(cleaned)) {
        warnings.push(
          `Row ${rowNum}: "${val}" may not be a valid phone number`
        );
      }
      return cleaned;

    case 'email':
      if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        warnings.push(
          `Row ${rowNum}: "${val}" may not be a valid email`
        );
      }
      return val.toLowerCase();

    case 'date':
      // Handle multiple date formats:
      // DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, DD-MM-YYYY
      const parsed = parseDateString(val);
      if (!parsed) {
        warnings.push(
          `Row ${rowNum}: "${val}" is not a recognized date format`
        );
        return val;
      }
      return parsed; // ISO "YYYY-MM-DD"

    case 'number':
      const num = parseFloat(val.replace(/,/g, ''));
      if (isNaN(num)) {
        warnings.push(`Row ${rowNum}: "${val}" is not a number`);
        return null;
      }
      return num;

    default:
      return val;
  }
}

/**
 * Parse various date string formats to ISO YYYY-MM-DD
 */
function parseDateString(val: string): string | null {
  // Try DD/MM/YYYY or DD-MM-YYYY:
  const ddmm = val.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (ddmm) {
    const [, d, m, y] = ddmm;
    // We assume DD/MM/YYYY for Indian context usually, but if d > 12 it's definitely day.
    // To be safe, we'll try to be smart or just stick to one.
    // The prompt suggested DD/MM/YYYY as example.
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  }

  // Try YYYY-MM-DD:
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;

  // Try Excel serial date number:
  if (/^\d+$/.test(val)) {
    const serial = parseInt(val);
    if (serial > 20000 && serial < 60000) {
      const date = XLSX.SSF.parse_date_code(serial);
      if (date) {
        return `${date.y}-${String(date.m).padStart(2,'0')}-${String(date.d).padStart(2,'0')}`;
      }
    }
  }

  return null;
}

/**
 * Validate a single parsed row
 */
export function validateRow(
  row: ParsedStudent
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  STUDENT_IMPORT_COLUMNS.forEach(col => {
    if (col.required && !row[col.field]) {
      errors.push(`${col.label} is required`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Generate a downloadable template file
 */
export function generateTemplate(): Blob {
  const ws = XLSX.utils.aoa_to_sheet([
    // Header row:
    STUDENT_IMPORT_COLUMNS.map(c => c.label),
    // Example data row:
    STUDENT_IMPORT_COLUMNS.map(c => c.example),
  ]);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Students');

  const buf = XLSX.write(wb, {
    type: 'array',
    bookType: 'xlsx',
  });
  return new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument'
           + '.spreadsheetml.sheet',
  });
}
