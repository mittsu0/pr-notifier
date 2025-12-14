import {
  PullRequest,
  Repository,
} from '../../../../domain/model/pullrequest/index.js';

/**
 * GitHub GraphQL API response DTO for PullRequest
 */
export interface GitHubPullRequestDto {
  title: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  isDraft: boolean;
  repository: {
    name: string;
    url: string;
  };
}

/**
 * Converts a GitHub API response DTO to a domain PullRequest entity
 */
export function toPullRequest(dto: GitHubPullRequestDto): PullRequest {
  const repository = new Repository(dto.repository.name, dto.repository.url);

  return new PullRequest(
    dto.title,
    dto.url,
    repository,
    new Date(dto.createdAt),
    new Date(dto.updatedAt),
    dto.isDraft
  );
}

/**
 * Converts an array of GitHub API response DTOs to domain PullRequest entities
 */
export function toPullRequests(dtos: GitHubPullRequestDto[]): PullRequest[] {
  return dtos
    .filter(
      (dto): dto is GitHubPullRequestDto => dto !== null && 'title' in dto
    )
    .map(toPullRequest);
}
