import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import SubjectChart from '../SubjectChart';
import { supabase } from '@/lib/supabaseClient';

// Mock the recharts components to avoid rendering issues in tests
vi.mock('recharts', () => {
  const OriginalModule = vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
    Bar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    XAxis: () => <div>XAxis</div>,
    YAxis: () => <div>YAxis</div>,
    CartesianGrid: () => <div>CartesianGrid</div>,
    Tooltip: () => <div>Tooltip</div>,
    Cell: () => <div>Cell</div>,
  };
});

// Mock the Supabase client
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    then: vi.fn(),
  },
}));

describe('SubjectChart Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the Supabase response for study_sessions
    vi.mocked(supabase.from).mockImplementation((table) => {
      if (table === 'study_sessions') {
        return {
          ...supabase,
          select: vi.fn().mockResolvedValue({
            data: [
              { subject: 'Mathematics' },
              { subject: 'Mathematics' },
              { subject: 'Physics' },
              { subject: 'Chemistry' },
              { subject: 'Mathematics' },
            ],
            error: null,
          }),
        };
      }
      
      return supabase;
    });
  });

  it('renders the component', async () => {
    render(<SubjectChart />);
    
    // Check if the component renders the title
    expect(screen.getByText('Subject Frequency')).toBeInTheDocument();
    
    // Wait for the data to load
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('study_sessions');
    });
  });

  it('displays the chart and statistics', async () => {
    render(<SubjectChart />);
    
    // Check if the chart is rendered
    await waitFor(() => {
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
    
    // Check if the statistics sections are rendered
    await waitFor(() => {
      expect(screen.getByText('Total Days')).toBeInTheDocument();
      expect(screen.getByText('Most Studied')).toBeInTheDocument();
      expect(screen.getByText('Subjects')).toBeInTheDocument();
      expect(screen.getByText('Avg/Subject')).toBeInTheDocument();
    });
  });

  it('displays the subject legend', async () => {
    render(<SubjectChart />);
    
    // Check if the legend title is rendered
    await waitFor(() => {
      expect(screen.getByText('Subject Legend')).toBeInTheDocument();
    });
  });
});