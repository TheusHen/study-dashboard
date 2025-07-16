import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../supabaseClient';

// Mock the Supabase client
vi.mock('@supabase/supabase-js', () => {
  const mockClient = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    then: vi.fn().mockImplementation(callback => Promise.resolve(callback({ data: [], error: null }))),
  };

  return {
    createClient: vi.fn().mockReturnValue(mockClient),
  };
});

describe('Supabase Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(supabase).toBeDefined();
  });

  it('should have the correct methods', () => {
    expect(supabase.from).toBeDefined();
    expect(typeof supabase.from).toBe('function');
  });

  it('should be able to query data', async () => {
    const result = await supabase.from('test_table').select('*');
    expect(supabase.from).toHaveBeenCalledWith('test_table');
    expect(supabase.from().select).toHaveBeenCalledWith('*');
    expect(result).toEqual({ data: [], error: null });
  });
});