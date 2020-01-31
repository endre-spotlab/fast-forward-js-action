import { GitHub } from '@actions/github';
import { Context } from '@actions/github/lib/context';
import { GitHubClient } from './github_client_interface';
import { default as Octokit } from '@octokit/rest';

export class GitHubClientWrapper implements GitHubClient{

  restClient: GitHub;
  owner: string;
  repo: string;

  constructor(public context: Context, githubToken: string){
    this.restClient = new GitHub(githubToken);
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
    await this.restClient.issues.createComment({
      owner: this.owner,
      repo: this.repo,
      issue_number: pr_number,
      body: comment
    });
  };
  
  async fast_forward_target_to_source_async(pr_number: number): Promise<void> {
    const pullRequestData =  await this.get_pull_request(pr_number);
    
    await this.restClient.git.updateRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${pullRequestData.base.ref}`,
      sha: `${pullRequestData.head.sha}`,
      force: false
    });

  };

  async close_pull_request_async(pr_number: number): Promise<void> {
    await this.restClient.pulls.update({
      owner: this.owner,
      repo: this.repo,
      pull_number: pr_number,
      state: "closed"
    });
  };

  async get_pull_request(pr_number: number): Promise<Octokit.PullsGetResponse> {
    const getPrResponse = await this.restClient.pulls.get({
      owner: this.owner,
      repo: this.repo,
      pull_number: pr_number
    });

    return getPrResponse.data;
  };

};

