import * as core from '@actions/core';
import * as github from '@actions/github';
import { GitHubClientWrapper } from './github_client_wrapper';
import { FastForwardAction } from './fast_forward_action';
async function run() {
    const github_token = core.getInput('GITHUB_TOKEN');
    const success_message = core.getInput('success_message') || "Fast-forward Succeeded!";
    const failure_message = core.getInput('failure_message') || "Fast-forward Failed!";
    const failure_message_same_stage_and_prod = core.getInput('failure_message_same_stage_and_prod') || failure_message;
    const failure_message_diff_stage_and_prod = core.getInput('failure_message_diff_stage_and_prod') || failure_message;
    const comment_messages = {
        success_message: success_message,
        failure_message: failure_message,
        failure_message_same_stage_and_prod: failure_message_same_stage_and_prod,
        failure_message_diff_stage_and_prod: failure_message_diff_stage_and_prod
    };
    const update_status = core.getInput('update_status');
    const set_status = update_status === 'true' ? true : false;
    const prod_branch = core.getInput('production_branch') || 'master';
    const stage_branch = core.getInput('staging_branch') || 'staging';
    const client = new GitHubClientWrapper(github.context, github_token);
    const fastForward = new FastForwardAction(client);
    const ff_status = await fastForward.async_merge_fast_forward(client, set_status);
    await fastForward.async_comment_on_pr(client, comment_messages, ff_status, prod_branch, stage_branch);
}
run();
