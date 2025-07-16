# Study Tracker by TheusHen

A modern, interactive dashboard for tracking and visualizing study and progress. This application helps users maintain consistency in their studies by providing visual feedback on study patterns, streaks, and subject distribution.

## Features

- **Study Calendar**: Visual representation of study days with color-coded indicators
- **Study Statistics**: Track study rate, monthly goals, current streak, and best streak
- **Subject Distribution**: Analyze which subjects you study most frequently
- **Discord Integration**: [workflows](.github/workflows) save study sessions directly from Discord using a bot

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS
- **Data Visualization**: Recharts
- **Backend**: Supabase (PostgreSQL)
- **Discord Bot**: Discord.js
- **Testing**: Vitest, Testing Library

## Project Structure

```
study-dashboard/
├── .github/workflows/    # GitHub Actions workflows
├── scripts/              # Discord bot and utility scripts
├── src/                  # Source code
│   ├── components/       # React components
│   │   ├── ui/           # UI components
│   │   ├── StudyCalendar.tsx
│   │   ├── StudyStats.tsx
│   │   └── SubjectChart.tsx
│   ├── lib/              # Utility functions and services
│   │   └── supabaseClient.ts
│   ├── pages/            # Page components
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── test/             # Test setup and utilities
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
└── ...                   # Configuration files
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Discord bot token (for Discord integration)

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# Set this at the vercel deployment environment variables
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key

# For Discord bot and Supabase at .env
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_GUILD_ID=your_discord_server_id
ANNOUNCE_CHANNEL_ID=your_announcement_channel_id
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
```

### Database Setup

The application requires the following tables in your Supabase database:

1. `study_sessions` - Records of study sessions
   - `id` (auto-generated)
   - `user_id` (string)
   - `subject` (string)
   - `duration` (integer, minutes)
   - `notes` (text, optional)
   - `timestamp` (timestamp)

2. `study_streaks` - Tracks the best study streak
   - `id` (integer, primary key)
   - `best_streak` (integer)

3. `study_current_streak` - Tracks the current study streak
   - `id` (integer, primary key)
   - `current_streak` (integer)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/TheusHen/study-dashboard.git
   cd study-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Running Tests

The project uses Vitest for testing. To run the tests:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Discord Bot Setup

The Discord bot allows users to log study sessions directly from Discord.

1. Create a Discord application and bot at the [Discord Developer Portal](https://discord.com/developers/applications)
2. Add the bot to your server with appropriate permissions
3. Set up the environment variables as described above
4. Run the bot:
   ```bash
   node scripts/studyFormBot.js
   ```

The bot provides a `/study` command that opens a form for logging study sessions.

## GitHub Workflows

The project includes two GitHub workflows:

1. **Discord Bot Scheduler** (`ci.yml`): Runs the Discord bot daily at 18:00 UTC to remind users to log their study sessions
2. **Tests** (`tests.yml`): Runs the test suite on push to main, pull requests, and manual triggers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

# Created by:
## Frontend Initial Idea:
<img width="1200" height="629" alt="image" src="https://lovable.dev/opengraph-image-p98pqg.png" />

## Backend + Idea + Review and tests:
<img width="1200" height="629" alt="image" src="https://www.theushen.me/banner.jpg" />
