import { getOctokit } from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import { Context } from '@actions/github/lib/context';
import { GitHubClient } from './github_client_interface';
// https://github.com/octokit/types.ts/issues/25#issuecomment-785296380
import { components } from '@octokit/openapi-types';
type PullsListResponseData = components["schemas"]["pull-request-simple"]

export class GitHubClientWrapper implements GitHubClient{

  restClient: InstanceType<typeof GitHub>;
  owner: string;
  repo: string;

  constructor(public context: Context, githubToken: string){
    this.restClient = getOctokit(githubToken);
    this.owner = context.repo.owner;
    this.repo = context.repo.repo;
  };

  get_current_pull_request_number(): number {
    if (!this.context.payload.issue || !this.context.payload.issue.pull_request){
      throw new Error('Issue is not a pull request! No pull request found in context');
    }

    return this.context.payload.issue.number;
  };

  async comment_on_pull_request_async(pr_number: number, comment: string): Promise<void> {
    await this.restClient.rest.issues.createComment({
      owner: this.owner,
      repo: this.repo,
      issue_number: pr_number,
      body: comment
    });
  };

  async fast_forward_target_to_source_async(pr_number: number): Promise<void> {
    const pullRequestData =  await this.get_pull_request(pr_number);

    await this.restClient.rest.git.updateRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${pullRequestData.base.ref}`,
      sha: pullRequestData.head.sha,
      force: false
    });

  };

  async close_pull_request_async(pr_number: number): Promise<void> {
    await this.restClient.rest.pulls.update({
      owner: this.owner,
      repo: this.repo,
      pull_number: pr_number,
      state: "closed"
    });
  };

  async get_pull_request_source_head_async(pr_number: number): Promise<string> {
    const pullRequestData =  await this.get_pull_request(pr_number);
    return pullRequestData.head.ref;
  }

  async get_pull_request_target_base_async(pr_number: number): Promise<string> {
    const pullRequestData =  await this.get_pull_request(pr_number);
    return pullRequestData.base.ref;
  }

  async get_pull_request(pr_number: number): Promise<PullsListResponseData> {
    const getPrResponse = await this.restClient.rest.pulls.get({
      owner: this.owner,
      repo: this.repo,
      pull_number: pr_number
    });

    return <PullsListResponseData>(getPrResponse.data);
  };

  async set_pull_request_status(pr_number: number, new_status: "error" | "failure" | "pending" | "success"): Promise<void> {
    const pullRequestData =  await this.get_pull_request(pr_number);

    const statusResponse = await this.restClient.rest.repos.createCommitStatus({
      owner: this.owner,
      repo: this.repo,
      sha: pullRequestData.head.sha,
      state: new_status,
      context: "Fast Forward"
    });
  }

  async compate_branch_head(branch_one: string, branch_two: string): Promise<boolean> {
    const branchOneData = await this.restClient.rest.repos.getBranch({
      owner: this.owner,
      repo: this.repo,
      branch: branch_one
    });

    const branchTwoData = await this.restClient.rest.repos.getBranch({
      owner: this.owner,
      repo: this.repo,
      branch: branch_two
    });

    return branchOneData.data.commit.sha === branchTwoData.data.commit.sha;
  }

};
