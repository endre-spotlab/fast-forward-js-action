import * as core from '@actions/core';
import * as github from '@actions/github';
import { GitHubClientWrapper } from './github_client_wrapper';
import { FastForwardAction } from './fast_forward_action';

async function run(): Promise<void>{
  const github_token = core.getInput('GITHUB_TOKEN');
  const success_message = core.getInput('success_message');
  const failure_message = core.getInput('failure_message');
  const prod_branch = core.getInput('production_branch');
  const stage_branch = core.getInput('staging_branch');


  const client = new GitHubClientWrapper(github.context , github_token);
  const fastForward = new FastForwardAction(client);

  await fastForward.execute_async(client, success_message, failure_message, prod_branch, stage_branch);

}

run();
