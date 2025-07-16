import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StudyCalendar from '../StudyCalendar';
import { supabase } from '@/lib/supabaseClient';

// Mock the Supabase client
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    then: vi.fn(),
  },
}));

describe('StudyCalendar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the Supabase response for study_sessions
    vi.mocked(supabase.from).mockImplementation((table) => {
      if (table === 'study_sessions') {
        return {
          ...supabase,
          select: vi.fn().mockResolvedValue({
            data: [
              { timestamp: '2025-07-15T10:00:00Z', subject: 'Mathematics' },
              { timestamp: '2025-07-16T10:00:00Z', subject: 'Physics' },
              { timestamp: '2025-07-17T10:00:00Z', subject: 'Chemistry' },
            ],
            error: null,
          }),
        };
      }
      
      // Mock the Supabase response for study_current_streak
      if (table === 'study_current_streak') {
        return {
          ...supabase,
          upsert: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        };
      }
      
      return supabase;
    });
  });

  it('renders the component', async () => {
    render(<StudyCalendar />);
    
    // Check if the component renders the title
    expect(screen.getByText('Study Calendar')).toBeInTheDocument();
    
    // Wait for the data to load
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('study_sessions');
    });
  });

  it('allows navigation between months', async () => {
    render(<StudyCalendar />);
    
    // Get the current month and year
    const monthYearText = screen.getByText(/\w+ \d{4}/);
    const initialMonthYear = monthYearText.textContent;
    
    // Click the next month button
    const nextButton = screen.getByLabelText('Next month');
    fireEvent.click(nextButton);
    
    // Check if the month has changed
    expect(monthYearText.textContent).not.toBe(initialMonthYear);
    
    // Click the previous month button
    const prevButton = screen.getByLabelText('Previous month');
    fireEvent.click(prevButton);
    
    // Check if we're back to the initial month
    expect(monthYearText.textContent).toBe(initialMonthYear);
  });

  it('displays the legend', () => {
    render(<StudyCalendar />);
    
    expect(screen.getByText('Studied')).toBeInTheDocument();
    expect(screen.getByText('Didn\'t study')).toBeInTheDocument();
  });
});