"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubClientWrapper = void 0;
const github_1 = require("@actions/github");
class GitHubClientWrapper {
    context;
    restClient;
    owner;
    repo;
    constructor(context, githubToken) {
        this.context = context;
        this.restClient = (0, github_1.getOctokit)(githubToken).rest;
        this.owner = context.repo.owner;
        this.repo = context.repo.repo;
    }
    ;
    get_current_pull_request_number() {
        if (!this.context.payload.issue || !this.context.payload.issue.pull_request) {
            throw new Error('Issue is not a pull request! No pull request found in context');
        }
        return this.context.payload.issue.number;
    }
    ;
    async comment_on_pull_request_async(pr_number, comment) {
        await this.restClient.issues.createComment({
            owner: this.owner,
            repo: this.repo,
            issue_number: pr_number,
            body: comment
        });
    }
    ;
    // TODO: make this strongly typed
    async fast_forward_target_to_source_async(pr_number) {
        const pullRequestData = await this.get_pull_request(pr_number);
        await this.restClient.git.updateRef({
            owner: this.owner,
            repo: this.repo,
            ref: `heads/${pullRequestData.base.ref}`,
            sha: pullRequestData.head.sha,
            force: false
        });
    }
    ;
    async close_pull_request_async(pr_number) {
        await this.restClient.pulls.update({
            owner: this.owner,
            repo: this.repo,
            pull_number: pr_number,
            state: "closed"
        });
    }
    ;
    async get_pull_request_source_head_async(pr_number) {
        const pullRequestData = await this.get_pull_request(pr_number);
        return pullRequestData.head.ref;
    }
    async get_pull_request_target_base_async(pr_number) {
        const pullRequestData = await this.get_pull_request(pr_number);
        return pullRequestData.base.ref;
    }
    async get_pull_request(pr_number) {
        const getPrResponse = await this.restClient.pulls.get({
            owner: this.owner,
            repo: this.repo,
            pull_number: pr_number
        });
        return getPrResponse.data;
    }
    ;
    async set_pull_request_status(pr_number, new_status) {
        const pullRequestData = await this.get_pull_request(pr_number);
        const statusResponse = await this.restClient.repos.createCommitStatus({
            owner: this.owner,
            repo: this.repo,
            sha: pullRequestData.head.sha,
            state: new_status,
            context: "Fast Forward"
        });
    }
    async compate_branch_head(branch_one, branch_two) {
        const branchOneData = await this.restClient.repos.getBranch({
            owner: this.owner,
            repo: this.repo,
            branch: branch_one
        });
        const branchTwoData = await this.restClient.repos.getBranch({
            owner: this.owner,
            repo: this.repo,
            branch: branch_two
        });
        return branchOneData.data.commit.sha === branchTwoData.data.commit.sha;
    }
}
exports.GitHubClientWrapper = GitHubClientWrapper;
;
