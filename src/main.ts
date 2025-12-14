/**
 * PR Notifier - Entry Point
 */

import { config } from 'dotenv';
import { RunCommand } from './adaptor/cmd/index.js';
import {
  loadGitHubConfig,
  loadSlackConfig,
} from './adaptor/infra/config/index.js';

// Load environment variables
config();

async function main(): Promise<void> {
  // Load configurations
  const githubConfig = loadGitHubConfig();
  const slackConfig = loadSlackConfig();

  // Execute command
  const command = new RunCommand(githubConfig, slackConfig);
  await command.execute();
}

main().catch((error: unknown) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
