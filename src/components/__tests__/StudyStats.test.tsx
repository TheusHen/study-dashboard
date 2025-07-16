import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import StudyStats from '../StudyStats';
import { supabase } from '@/lib/supabaseClient';

// Mock the Supabase client
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    then: vi.fn(),
  },
}));

describe('StudyStats Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock the Supabase response for study_streaks
    vi.mocked(supabase.from).mockImplementation((table) => {
      if (table === 'study_streaks') {
        return {
          ...supabase,
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: { best_streak: 10 },
            error: null,
          }),
        };
      }
      
      // Mock the Supabase response for study_sessions
      if (table === 'study_sessions') {
        return {
          ...supabase,
          select: vi.fn().mockResolvedValue({
            data: [
              { timestamp: '2025-07-01T10:00:00Z' },
              { timestamp: '2025-07-02T10:00:00Z' },
              { timestamp: '2025-07-03T10:00:00Z' },
            ],
            error: null,
          }),
        };
      }
      
      return supabase;
    });
  });

  it('renders the component', async () => {
    render(<StudyStats />);
    
    // Check if the component renders the main sections
    expect(screen.getByText('Study Rate')).toBeInTheDocument();
    expect(screen.getByText('Monthly Goal')).toBeInTheDocument();
    expect(screen.getByText('Current Streak')).toBeInTheDocument();
    expect(screen.getByText('Best Streak')).toBeInTheDocument();
    
    // Wait for the data to load
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('study_streaks');
      expect(supabase.from).toHaveBeenCalledWith('study_sessions');
    });
  });
});