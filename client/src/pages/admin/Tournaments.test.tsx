import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminTournaments from './Tournaments';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock dependencies
vi.mock('@/features/tournaments/hooks/useAdminTournaments', () => ({
  useAdminTournaments: () => ({
    tournaments: [],
    isLoading: false,
    addTournament: vi.fn(),
    updateTournament: vi.fn(),
    deleteTournament: vi.fn(),
  }),
}));

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

// Mock RichTextEditor as it might be complex to render in JSDOM
vi.mock('@/components/shared/admin/RichTextEditor', () => ({
  default: ({ value, onChange }: any) => (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} data-testid="rich-text-editor" />
  ),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AdminTournaments />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('AdminTournaments Date Order', () => {
  it('should allow invalid date order currently (repro)', async () => {
    renderComponent();

    // Open the "Add Tournament" modal
    const addButton = screen.getByRole('button', { name: /Add Tournament/i });
    fireEvent.click(addButton);

    // Find date inputs
    // DatePickerField renders an input with type="date"
    const startDateInput = screen.getByLabelText(/Starts On/i) as HTMLInputElement;
    const regStartDateInput = screen.getByLabelText(/Reg Starts/i) as HTMLInputElement;

    // Set startDate to 2026-05-14
    fireEvent.change(startDateInput, { target: { value: '2026-05-14' } });

    // Set regStartDate to 2026-05-16 (invalid: registration starts after tournament starts)
    fireEvent.change(regStartDateInput, { target: { value: '2026-05-16' } });

    expect(regStartDateInput.value).toBe('2026-05-16');
    expect(startDateInput.value).toBe('2026-05-14');

    // Currently, there is no validation against this in validateForm
    // If we try to save, it should (currently) not show an error for this specific issue
    const saveButton = screen.getByRole('button', { name: /Create Arena/i });
    fireEvent.click(saveButton);

    // Since title, location, category are required, we need to fill them to see if it proceeds
    fireEvent.change(screen.getByLabelText(/Arena Title/i), { target: { value: 'Test Tournament' } });
    fireEvent.change(screen.getByLabelText(/Venue/i), { target: { value: 'Test Venue' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Open' } });

    fireEvent.click(saveButton);

    // Now it SHOULD show an error for the date sequence
    const dateError = screen.getByText(/Registration must start before tournament starts/i);
    expect(dateError).toBeInTheDocument();
  });
});
