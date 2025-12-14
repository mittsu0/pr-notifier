/**
 * GitHub Configuration
 */
export interface GitHubConfig {
  readonly token: string;
  readonly owner: string;
  readonly count: number;
  readonly includeDraft: boolean;
  readonly ignoreAfterDays: number | undefined;
}

/**
 * Loads GitHub configuration from environment variables
 */
export function loadGitHubConfig(): GitHubConfig {
  const token = process.env['GITHUB_TOKEN'];
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is required');
  }

  const owner = process.env['OWNER'];
  if (!owner) {
    throw new Error('OWNER environment variable is required');
  }

  const count = parseInt(process.env['COUNT'] ?? '10', 10);
  if (isNaN(count) || count < 1 || count > 100) {
    throw new Error('COUNT must be a number between 1 and 100');
  }

  const includeDraft = process.env['INCLUDE_DRAFT']?.toLowerCase() === 'true';

  const ignoreAfterDaysStr = process.env['IGNORE_AFTER_DAYS'];
  let ignoreAfterDays: number | undefined;
  if (ignoreAfterDaysStr) {
    ignoreAfterDays = parseInt(ignoreAfterDaysStr, 10);
    if (isNaN(ignoreAfterDays) || ignoreAfterDays < 1) {
      throw new Error('IGNORE_AFTER_DAYS must be a positive number');
    }
  }

  return {
    token,
    owner,
    count,
    includeDraft,
    ignoreAfterDays,
  };
}
