import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { Client, REST, Routes } from 'discord.js';

// Mock the environment variables
vi.mock('dotenv', () => ({
  default: {
    config: vi.fn(),
  },
}));

// Mock process.env
vi.stubEnv('DISCORD_TOKEN', 'mock-token');
vi.stubEnv('DISCORD_CLIENT_ID', 'mock-client-id');
vi.stubEnv('DISCORD_GUILD_ID', 'mock-guild-id');
vi.stubEnv('SUPABASE_URL', 'mock-supabase-url');
vi.stubEnv('SUPABASE_KEY', 'mock-supabase-key');

// Mock discord.js
vi.mock('discord.js', () => {
  const mockClient = {
    once: vi.fn(),
    on: vi.fn(),
    login: vi.fn().mockResolvedValue(true),
    channels: {
      fetch: vi.fn().mockResolvedValue({
        send: vi.fn().mockResolvedValue(true),
      }),
    },
    user: {
      tag: 'MockBot#0000',
    },
  };

  return {
    Client: vi.fn(() => mockClient),
    GatewayIntentBits: {
      Guilds: 1,
    },
    ModalBuilder: vi.fn().mockImplementation(() => ({
      setCustomId: vi.fn().mockReturnThis(),
      setTitle: vi.fn().mockReturnThis(),
      addComponents: vi.fn().mockReturnThis(),
    })),
    ActionRowBuilder: vi.fn().mockImplementation(() => ({
      addComponents: vi.fn().mockReturnThis(),
    })),
    TextInputBuilder: vi.fn().mockImplementation(() => ({
      setCustomId: vi.fn().mockReturnThis(),
      setLabel: vi.fn().mockReturnThis(),
      setStyle: vi.fn().mockReturnThis(),
      setRequired: vi.fn().mockReturnThis(),
    })),
    TextInputStyle: {
      Short: 1,
      Paragraph: 2,
    },
    SlashCommandBuilder: vi.fn().mockImplementation(() => ({
      setName: vi.fn().mockReturnThis(),
      setDescription: vi.fn().mockReturnThis(),
      toJSON: vi.fn().mockReturnValue({}),
    })),
    REST: vi.fn().mockImplementation(() => ({
      setToken: vi.fn().mockReturnThis(),
      put: vi.fn().mockResolvedValue(true),
    })),
    Routes: {
      applicationGuildCommands: vi.fn().mockReturnValue('mock-route'),
    },
    Events: {
      ClientReady: 'ready',
      InteractionCreate: 'interactionCreate',
    },
  };
});

// Mock @supabase/supabase-js
vi.mock('@supabase/supabase-js', () => {
  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ data: [], error: null }),
  };

  return {
    createClient: vi.fn().mockReturnValue(mockSupabase),
  };
});

// Mock console.log and console.error to avoid cluttering test output
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock process.exit to prevent tests from exiting
vi.spyOn(process, 'exit').mockImplementation(() => {});

describe('Discord Bot Script', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('initializes the bot with correct configuration', async () => {
    // Import the script (this will execute it)
    await import('../studyFormBot.js');
    
    // Check if the Supabase client was created with the correct parameters
    expect(createClient).toHaveBeenCalledWith('mock-supabase-url', 'mock-supabase-key');
    
    // Check if the Discord client was created
    expect(Client).toHaveBeenCalled();
    
    // Check if the bot attempted to login
    const mockClient = Client.mock.results[0].value;
    expect(mockClient.login).toHaveBeenCalledWith('mock-token');
  });

  it('registers slash commands', async () => {
    await import('../studyFormBot.js');
    
    // Check if REST was initialized with the correct token
    expect(REST).toHaveBeenCalled();
    const mockRest = REST.mock.results[0].value;
    expect(mockRest.setToken).toHaveBeenCalledWith('mock-token');
    
    // Check if the commands were registered
    expect(mockRest.put).toHaveBeenCalled();
    expect(Routes.applicationGuildCommands).toHaveBeenCalledWith('mock-client-id', 'mock-guild-id');
  });

  it('sets up event handlers', async () => {
    await import('../studyFormBot.js');
    
    const mockClient = Client.mock.results[0].value;
    
    // Check if the ready event handler was registered
    expect(mockClient.once).toHaveBeenCalledWith('ready', expect.any(Function));
    
    // Check if the interaction event handler was registered
    expect(mockClient.on).toHaveBeenCalledWith('interactionCreate', expect.any(Function));
  });
});